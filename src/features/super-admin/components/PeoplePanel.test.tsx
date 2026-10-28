import { afterEach, describe, expect, it, vi } from 'vitest'
import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/renderWithProviders'
import { PeoplePanel } from './PeoplePanel'

const ME = { id: 'me', fullName: 'Men Superadmin', phone: '+998900000000', role: 'SUPER_ADMIN' }
const ADMIN = { id: 'u-1', fullName: 'Ali Valiyev', phone: '+998901112233', role: 'ADMINISTRATOR' }

function response(status: number, body?: unknown) {
    return { ok: status < 400, status, text: () => Promise.resolve(body === undefined ? '' : JSON.stringify(body)) }
}

function mockBackend() {
    const fetchMock = vi.fn((url: string, init?: RequestInit) => {
        const method = init?.method ?? 'GET'
        if (url.includes('/auth/me')) return Promise.resolve(response(200, ME))
        if (url.includes('/user/admins')) {
            return Promise.resolve(response(200, { content: [ME, ADMIN], totalPages: 1, totalElements: 2 }))
        }
        if (url.endsWith('/user/u-1/password-regenerate') && method === 'POST') {
            return Promise.resolve(response(200, { ...ADMIN, temporaryPassword: 'Xk92mPq7Lw' }))
        }
        if (url.endsWith('/user/u-1') && method === 'PUT') return Promise.resolve(response(200, ADMIN))
        if (url.includes('/branch')) return Promise.resolve(response(200, { content: [], totalPages: 0, totalElements: 0 }))
        return Promise.resolve(response(404, {}))
    })
    vi.stubGlobal('fetch', fetchMock)
    return fetchMock
}

function renderPanel() {
    renderWithProviders(
        <PeoplePanel token="tok" kind="administrators" page={0} search="" onPageChange={vi.fn()} onSearchChange={vi.fn()} />
    )
}

afterEach(() => vi.unstubAllGlobals())

describe('PeoplePanel', () => {
    it("hides the super-admin's own account from the list", async () => {
        mockBackend()
        renderPanel()
        expect(await screen.findByText('Ali Valiyev')).toBeInTheDocument()
        expect(screen.queryByText('Men Superadmin')).not.toBeInTheDocument()
    })

    it('regenerates a password after confirmation and shows the new one', async () => {
        const fetchMock = mockBackend()
        vi.stubGlobal('confirm', vi.fn(() => true))
        renderPanel()

        const row = (await screen.findByText('Ali Valiyev')).closest('tr') as HTMLElement
        await userEvent.click(within(row).getByRole('button', { name: 'Parolni yangilash' }))

        expect(await screen.findByText('Xk92mPq7Lw')).toBeInTheDocument()
        expect(
            fetchMock.mock.calls.some(([url, init]) => String(url).endsWith('/password-regenerate') && init?.method === 'POST')
        ).toBe(true)
    })

    it('does nothing when the confirmation is cancelled', async () => {
        const fetchMock = mockBackend()
        vi.stubGlobal('confirm', vi.fn(() => false))
        renderPanel()

        const row = (await screen.findByText('Ali Valiyev')).closest('tr') as HTMLElement
        await userEvent.click(within(row).getByRole('button', { name: 'Parolni yangilash' }))

        expect(fetchMock.mock.calls.some(([url]) => String(url).endsWith('/password-regenerate'))).toBe(false)
    })

    it('saves an edited administrator through PUT /user/{id}', async () => {
        const fetchMock = mockBackend()
        renderPanel()

        const row = (await screen.findByText('Ali Valiyev')).closest('tr') as HTMLElement
        await userEvent.click(within(row).getByRole('button', { name: 'Tahrirlash' }))
        const name = screen.getByDisplayValue('Ali Valiyev')
        await userEvent.clear(name)
        await userEvent.type(name, 'Ali Karimov')
        await userEvent.click(screen.getByRole('button', { name: 'Saqlash' }))

        const put = fetchMock.mock.calls.find(([, init]) => init?.method === 'PUT')
        expect(String(put?.[0])).toMatch(/\/user\/u-1$/)
        expect(JSON.parse(String(put?.[1]?.body))).toEqual({ fullName: 'Ali Karimov', phone: '+998901112233' })
    })
})
