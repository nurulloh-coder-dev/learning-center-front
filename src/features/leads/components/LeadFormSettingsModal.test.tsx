import { afterEach, describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/renderWithProviders'
import { LeadFormSettingsModal } from './LeadFormSettingsModal'

const FORM = { key: 'k1', enabled: true, title: null, description: null, courseRequired: false, hiddenLevelIds: [] }
const LEVELS = [{ id: 'lvl-1', name: 'Elementary' }, { id: 'lvl-2', name: 'IELTS' }]

function response(status: number, body?: unknown) {
    return { ok: status < 400, status, text: () => Promise.resolve(body === undefined ? '' : JSON.stringify(body)) }
}

/** `/lead-form` holati testning o'zida — POST/PUT uni o'zgartiradi. */
function mockBackend(initial: typeof FORM | null) {
    let form = initial
    const fetchMock = vi.fn((url: string, init?: RequestInit) => {
        const method = init?.method ?? 'GET'
        if (url.includes('/group-level/names')) return Promise.resolve(response(200, LEVELS))
        if (url.endsWith('/lead-form') && method === 'GET') return Promise.resolve(form ? response(200, form) : response(404, {}))
        if (url.endsWith('/lead-form') && method === 'POST') return Promise.resolve(response(200, (form = FORM)))
        if (url.endsWith('/lead-form') && method === 'PUT') {
            form = { ...FORM, ...JSON.parse(String(init?.body)) }
            return Promise.resolve(response(200, form))
        }
        return Promise.resolve(response(404, {}))
    })
    vi.stubGlobal('fetch', fetchMock)
    return fetchMock
}

afterEach(() => vi.unstubAllGlobals())

describe('LeadFormSettingsModal', () => {
    it('creates the link when the center has none yet', async () => {
        const fetchMock = mockBackend(null)
        renderWithProviders(<LeadFormSettingsModal token="tok" onClose={vi.fn()} />)

        await userEvent.click(await screen.findByRole('button', { name: 'Havola yaratish' }))
        expect(fetchMock.mock.calls.some(([url, init]) => String(url).endsWith('/lead-form') && init?.method === 'POST')).toBe(true)
        expect(await screen.findByRole('textbox', { name: 'Forma havolasi' })).toHaveValue(
            `${window.location.origin}/f/k1?src=instagram`
        )
        expect(screen.getByRole('img', { name: /QR-kodi/ })).toBeInTheDocument()
    })

    it('saves hidden courses and an empty title as null', async () => {
        const fetchMock = mockBackend(FORM)
        renderWithProviders(<LeadFormSettingsModal token="tok" onClose={vi.fn()} />)

        await userEvent.click(await screen.findByRole('checkbox', { name: 'IELTS' }))
        await userEvent.click(screen.getByRole('button', { name: 'Saqlash' }))

        const put = fetchMock.mock.calls.find(([, init]) => init?.method === 'PUT')
        expect(JSON.parse(String(put?.[1]?.body))).toEqual({
            enabled: true,
            title: null,
            description: null,
            courseRequired: false,
            hiddenLevelIds: ['lvl-2'],
        })
    })

    it('puts the placement into the link', async () => {
        mockBackend(FORM)
        renderWithProviders(<LeadFormSettingsModal token="tok" onClose={vi.fn()} />)
        await userEvent.selectOptions(await screen.findByLabelText('Havola qayerga qo‘yiladi'), 'telegram')
        expect(screen.getByRole('textbox', { name: 'Forma havolasi' })).toHaveValue(`${window.location.origin}/f/k1?src=telegram`)
    })
})
