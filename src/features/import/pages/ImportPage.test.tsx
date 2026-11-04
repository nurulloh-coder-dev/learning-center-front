import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/renderWithProviders'
import { ImportPage } from './ImportPage'

vi.mock('@/app/providers/useAuth', () => ({
    useSession: () => ({ token: 'test-token', role: 'SUPER_ADMIN', claims: {}, permissions: [] }),
    useAuth: () => ({ session: null, signIn: vi.fn(), signOut: vi.fn(), isRestoring: false }),
}))

const jsonResponse = (body: unknown, status = 200) =>
    Promise.resolve({ ok: status < 300, status, text: () => Promise.resolve(JSON.stringify(body)) })

let sentBody: unknown = null

beforeEach(() => {
    sentBody = null
    localStorage.clear()
    vi.stubGlobal(
        'fetch',
        vi.fn((url: string, init?: RequestInit) => {
            if (url.includes('/branch')) return jsonResponse({ content: [{ id: 'b1', name: 'Markaz' }] })
            if (url.includes('/student/list')) {
                sentBody = JSON.parse(String(init?.body))
                return jsonResponse(
                    {
                        succeeded: [
                            {
                                id: 's1',
                                userDto: { id: 'u1', fullName: 'Ali Valiyev', phone: '+998901112233', temporaryPassword: 'pass123' },
                                parentPhone: null,
                                balance: null,
                            },
                        ],
                        failed: [{ index: 1, input: {}, errorType: 'PHONE_NUMBER_ALREADY_EXISTS', message: 'Telefon band' }],
                    },
                    207
                )
            }
            return jsonResponse(null)
        })
    )
})

afterEach(() => vi.unstubAllGlobals())

describe('ImportPage', () => {
    it('reads a CSV, matches columns, skips bad rows and shows new logins', async () => {
        const user = userEvent.setup()
        renderWithProviders(<ImportPage kind="students" />)

        const csv = 'FIO;Tel;Izoh\nAli Valiyev;90 111 22 33;\n;901234567;ismsiz\nVali Aliyev;+998 93 444 55 66;\n'
        const input = document.querySelector('input[type="file"]') as HTMLInputElement
        await user.upload(input, new File([csv], 'oquvchilar.csv', { type: 'text/csv' }))

        // Ustunlar avtomatik moslandi
        expect(await screen.findByRole('combobox', { name: /liq ism/ })).toHaveDisplayValue('FIO')
        expect(screen.getByRole('combobox', { name: /Telefon/ })).toHaveDisplayValue('Tel')

        // Ismsiz qator yuborilmaydi; filial bitta — o'zi tanlandi
        const submit = await screen.findByRole('button', { name: '2 ta o‘quvchini qo‘shish' })
        await waitFor(() => expect(submit).toBeEnabled())
        await user.click(submit)

        expect(await screen.findByText('pass123')).toBeInTheDocument()
        expect(screen.getByText('Telefon band')).toBeInTheDocument()
        // Server 1-indeksdagi qatorni rad etdi — fayldagi 4-qator (Vali)
        expect(screen.getByText('Vali Aliyev')).toBeInTheDocument()
        expect(sentBody).toEqual([
            {
                userCreateDto: { fullName: 'Ali Valiyev', phone: '+998901112233', birthDate: null, role: 'STUDENT', branchId: 'b1' },
                parentPhone: null,
            },
            {
                userCreateDto: { fullName: 'Vali Aliyev', phone: '+998934445566', birthDate: null, role: 'STUDENT', branchId: 'b1' },
                parentPhone: null,
            },
        ])
    })

    it('explains an unsupported file type', async () => {
        const user = userEvent.setup({ applyAccept: false })
        renderWithProviders(<ImportPage kind="teachers" />)
        const input = document.querySelector('input[type="file"]') as HTMLInputElement
        await user.upload(input, new File(['x'], 'old.xls'))
        expect(await screen.findByRole('alert')).toHaveTextContent('.xlsx yoki .csv')
    })
})
