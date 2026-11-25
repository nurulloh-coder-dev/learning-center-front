import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useLeadStream } from './useLeadStream'

/** Berilgan matnni bitta parcha qilib beradigan, so'ng tugaydigan oqim. */
function streamResponse(text: string) {
    const encoded = new TextEncoder().encode(text)
    let sent = false
    return {
        ok: true,
        status: 200,
        body: {
            getReader: () => ({
                read: () =>
                    sent
                        ? new Promise<never>(() => undefined) // oqim ochiq qoladi
                        : ((sent = true), Promise.resolve({ done: false, value: encoded })),
            }),
        },
    }
}

function setup(responseText: string) {
    const fetchMock = vi.fn().mockResolvedValue(streamResponse(responseText))
    vi.stubGlobal('fetch', fetchMock)
    const client = new QueryClient()
    const invalidate = vi.spyOn(client, 'invalidateQueries')
    const wrapper = ({ children }: { children: ReactNode }) => (
        <QueryClientProvider client={client}>{children}</QueryClientProvider>
    )
    const hook = renderHook(() => useLeadStream('tok'), { wrapper })
    return { fetchMock, invalidate, hook }
}

afterEach(() => {
    vi.unstubAllGlobals()
})

describe('useLeadStream', () => {
    it('tokenni sarlavhada yuboradi va "connected" kelganda ulangan deb hisoblaydi', async () => {
        const { fetchMock, hook } = setup('event: connected\ndata: {"centerId":"c1"}\n\n')

        await waitFor(() => expect(hook.result.current).toBe(true))

        const [url, init] = fetchMock.mock.calls[0]
        expect(url).toBe('/api/v1/stream/leads/stream')
        expect(init.headers.Authorization).toBe('Bearer tok')
        expect(init.headers.Accept).toBe('text/event-stream')
        hook.unmount()
    })

    it('lid o’zgarganda lidlar ro’yxatini qayta yuklaydi', async () => {
        const { invalidate, hook } = setup('id: 3\nevent: lead-changed\ndata: {"leadId":"l1"}\n\n')

        await waitFor(() => expect(invalidate).toHaveBeenCalledWith({ queryKey: ['lead'] }))
        hook.unmount()
    })

    it('"resync" kelganda ham ro’yxatni yangilaydi (o’tkazib yuborilgan hodisalar bor)', async () => {
        const { invalidate, hook } = setup('event: resync\ndata: {"reason":"first connect"}\n\n')

        await waitFor(() => expect(invalidate).toHaveBeenCalled())
        hook.unmount()
    })

    it('backend oqimni bermasa ulanmagan holda qoladi', async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 404, json: () => Promise.resolve({}) }))
        const client = new QueryClient()
        const { result, unmount } = renderHook(() => useLeadStream('tok'), {
            wrapper: ({ children }: { children: ReactNode }) => (
                <QueryClientProvider client={client}>{children}</QueryClientProvider>
            ),
        })

        await new Promise((resolve) => setTimeout(resolve, 50))

        expect(result.current).toBe(false)
        unmount()
    })
})
