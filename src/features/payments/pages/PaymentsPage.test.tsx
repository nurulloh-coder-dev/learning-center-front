import { fireEvent, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '@/test/renderWithProviders'
import { PaymentsPage } from './PaymentsPage'
import * as csvLib from '@/shared/lib/csv'

vi.mock('@/app/providers/useAuth', () => ({
    useSession: () => ({
        token: 'test-token',
        role: 'ADMINISTRATOR',
        claims: {},
        permissions: [],
    }),
    useAuth: () => ({ session: null, signIn: vi.fn(), signOut: vi.fn(), isRestoring: false }),
}))

vi.mock('../hooks/useInvoices', () => ({
    useInvoices: () => ({
        isLoading: false,
        error: null,
        invoices: [
            {
                id: 'inv-1',
                invoiceNumber: 'INV-001',
                amount: 500000,
                issuedAt: '2026-03-01T12:00:00',
                status: 'PAID',
                type: 'MONTHLY',
                student: { userDto: { fullName: 'Ali Valiyev' } },
            },
        ],
        totalPages: 1,
        totalElements: 1,
    }),
}))

vi.mock('../hooks/useStudentOptions', () => ({
    useStudentOptions: () => [],
}))

vi.mock('../hooks/useInvoiceMutations', () => ({
    useInvoiceMutations: () => ({
        create: { isPending: false, error: null, mutate: vi.fn() },
        changeStatus: { isPending: false, error: null, mutate: vi.fn() },
        remove: { isPending: false, error: null, mutate: vi.fn() },
        refund: { isPending: false, isSuccess: false, data: null, error: null, mutate: vi.fn() },
    }),
}))

afterEach(() => {
    vi.restoreAllMocks()
})

describe('PaymentsPage CSV Export', () => {
    it('triggers CSV download when Download button is clicked', () => {
        const downloadCsvSpy = vi.spyOn(csvLib, 'downloadCsv').mockImplementation(() => {})

        renderWithProviders(<PaymentsPage />, {
            route: '/payments',
        })

        const downloadButton = screen.getByRole('button', { name: 'Yuklab olish' })
        expect(downloadButton).not.toBeDisabled()

        fireEvent.click(downloadButton)

        expect(downloadCsvSpy).toHaveBeenCalledTimes(1)
        const [filename, content] = downloadCsvSpy.mock.calls[0]
        expect(filename).toContain('payments_')
        expect(filename).toContain('.csv')
        expect(content).toContain('Hisob raqami')
        expect(content).toContain('O‘quvchi')
        expect(content).toContain('INV-001')
        expect(content).toContain('Ali Valiyev')
        expect(content).toContain('To‘langan')

        downloadCsvSpy.mockRestore()
    })
})
