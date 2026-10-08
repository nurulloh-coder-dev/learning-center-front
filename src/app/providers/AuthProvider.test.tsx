import { afterEach, describe, expect, it, vi } from 'vitest'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './AuthProvider'
import { refreshAccessToken } from '@/shared/api/sessionRefresh'
import { useAuth } from './useAuth'

function SignOutButton() {
    const { signOut } = useAuth()
    return <button onClick={signOut}>chiqish</button>
}

afterEach(() => vi.unstubAllGlobals())

describe('AuthProvider signOut', () => {
    // Ilgari faqat holat tozalanardi: refresh cookie qolib, sahifa
    // yangilanganda odam qaytib kirardi, keshda esa oldingi ma'lumot qolardi.
    it('calls the logout endpoint and clears the query cache', async () => {
        const fetchMock = vi.fn().mockResolvedValue({ ok: false, status: 401, text: () => Promise.resolve('') })
        vi.stubGlobal('fetch', fetchMock)
        const queryClient = new QueryClient()
        queryClient.setQueryData(['student', 'me'], { id: 'secret-data' })

        render(
            <QueryClientProvider client={queryClient}>
                <AuthProvider>
                    <SignOutButton />
                </AuthProvider>
            </QueryClientProvider>
        )

        await act(async () => {
            await userEvent.click(screen.getByRole('button', { name: 'chiqish' }))
        })

        await waitFor(() =>
            expect(fetchMock.mock.calls.some(([url]) => String(url).endsWith('/auth/logout'))).toBe(true)
        )
        expect(queryClient.getQueryData(['student', 'me'])).toBeUndefined()
    })
})

describe('AuthProvider after signOut', () => {
    // Chiqqandan keyin kelgan 403 refresh cookie bilan yangi sessiya ochib,
    // odamni qaytadan kiritib yuborardi.
    it('does not refresh the token once signed out', async () => {
        const fetchMock = vi.fn().mockResolvedValue({ ok: false, status: 401, text: () => Promise.resolve('') })
        vi.stubGlobal('fetch', fetchMock)

        render(
            <QueryClientProvider client={new QueryClient()}>
                <AuthProvider>
                    <SignOutButton />
                </AuthProvider>
            </QueryClientProvider>
        )
        fireEvent.click(screen.getByRole('button', { name: 'chiqish' }))
        await waitFor(() =>
            expect(fetchMock.mock.calls.some(([url]) => String(url).endsWith('/auth/logout'))).toBe(true)
        )
        fetchMock.mockClear()

        expect(await refreshAccessToken()).toBeNull()
        expect(fetchMock.mock.calls.some(([url]) => String(url).endsWith('/auth/refresh-token'))).toBe(false)
    })
})
