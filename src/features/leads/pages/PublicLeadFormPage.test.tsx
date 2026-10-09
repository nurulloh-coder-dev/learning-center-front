import { afterEach, describe, expect, it, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Route, Routes } from 'react-router-dom'
import { renderWithProviders } from '@/test/renderWithProviders'
import { PublicLeadFormPage } from './PublicLeadFormPage'

const FORM = {
    organizationName: 'Cornerstone Education',
    title: null,
    description: null,
    courseRequired: true,
    levels: [{ id: 'lvl-1', name: 'Elementary' }],
}

function response(status: number, body?: unknown) {
    return { ok: status < 400, status, text: () => Promise.resolve(body === undefined ? '' : JSON.stringify(body)) }
}

function renderAt(route: string) {
    return renderWithProviders(
        <Routes>
            <Route path="/f/:key" element={<PublicLeadFormPage />} />
        </Routes>,
        { route }
    )
}

afterEach(() => vi.unstubAllGlobals())

describe('PublicLeadFormPage', () => {
    it('sends the lead with the source from the link and shows thanks', async () => {
        const fetchMock = vi.fn((url: string) =>
            Promise.resolve(String(url).endsWith('/leads') ? response(200) : response(200, FORM))
        )
        vi.stubGlobal('fetch', fetchMock)
        renderAt('/f/abc?src=instagram')

        expect(await screen.findByText('Cornerstone Education')).toBeInTheDocument()
        await userEvent.click(screen.getByRole('button', { name: 'Yuborish' }))
        // Bo'sh forma yuborilmaydi
        expect(screen.getByText('Ismingizni yozing')).toBeInTheDocument()
        expect(screen.getByText('Kursni tanlang')).toBeInTheDocument()
        expect(fetchMock).toHaveBeenCalledTimes(1)

        await userEvent.type(screen.getByLabelText(/^Ism va familiya/), 'Jasur Bek')
        await userEvent.type(screen.getByLabelText(/^Telefon raqami/), '901234567')
        await userEvent.click(screen.getByRole('radio', { name: 'Elementary' }))
        await userEvent.click(screen.getByRole('button', { name: 'Yuborish' }))

        expect(await screen.findByText('Rahmat!')).toBeInTheDocument()
        const [url, init] = fetchMock.mock.calls[1] as unknown as [string, RequestInit]
        expect(url).toBe('/api/v1/public/lead-forms/abc/leads')
        expect(JSON.parse(String(init.body))).toEqual({
            fullName: 'Jasur Bek',
            phone: '+998901234567',
            preferredCourseId: 'lvl-1',
            source: 'INSTAGRAM',
            website: '',
        })
        // Tokensiz — mijoz tizimga kirmagan
        expect(new Headers(init.headers).has('Authorization')).toBe(false)
    })

    it('explains an outdated link', async () => {
        vi.stubGlobal('fetch', vi.fn(() => Promise.resolve(response(404, { message: 'not found' }))))
        renderAt('/f/old-key')
        expect(await screen.findByText('Forma topilmadi')).toBeInTheDocument()
    })

    it('marks the course optional when the center allows it', async () => {
        vi.stubGlobal('fetch', vi.fn(() => Promise.resolve(response(200, { ...FORM, courseRequired: false }))))
        renderAt('/f/abc')
        await waitFor(() => expect(screen.getByRole('group', { name: /ixtiyoriy/ })).toBeInTheDocument())
    })
})

describe('PublicFormShell language switch', () => {
    it('switches language with the short codes at the top', async () => {
        vi.stubGlobal('fetch', vi.fn(() => Promise.resolve(response(200, FORM))))
        renderAt('/f/abc')
        await userEvent.click(await screen.findByRole('button', { name: 'RU' }))
        expect(await screen.findByRole('button', { name: 'Отправить' })).toBeInTheDocument()
    })
})
