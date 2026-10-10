import { screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/renderWithProviders'
import { AnalyticsPanel } from './AnalyticsPanel'

vi.mock('../hooks/useAnalytics', async (importOriginal) => {
    const actual = await importOriginal<typeof import('../hooks/useAnalytics')>()
    return {
        ...actual,
        useAnalytics: () => ({
            items: {
                student: { category: 'student', total: 150, thisMonth: 15, isLoading: false, error: null },
                teacher: { category: 'teacher', total: 20, thisMonth: 2, isLoading: false, error: null },
                lead: { category: 'lead', total: 80, thisMonth: 10, isLoading: false, error: null },
                invoice: { category: 'invoice', total: 5000000, thisMonth: 1200000, isLoading: false, error: null },
                enrollment: { category: 'enrollment', total: 100, thisMonth: 12, isLoading: false, error: null },
                branch: { category: 'branch', total: 3, thisMonth: null, isLoading: false, error: null },
            },
            isLoading: false,
            error: null,
        }),
    }
})

const mockUseMonthlyInvoiceRevenue = vi.fn()

vi.mock('../hooks/useDashboardLists', () => ({
    useLeadStatusCounts: () => ({
        counts: [
            { status: 'NEW', count: 7 },
            { status: 'ENROLLED', count: 3 },
            { status: 'REJECTED', count: 1 },
            { status: 'CALL_LATER', count: 2 },
        ],
        isLoading: false,
        error: null,
    }),
    useRecentPayments: () => ({
        rows: [
            {
                id: 't1',
                type: 'PAID',
                amount: 450000,
                createdAt: '2026-10-09T10:00:00',
                user: { id: 's1', userDto: { id: 'u1', fullName: 'Aziza Karimova' } },
                invoice: { id: 'i1', invoiceNumber: 'INV-007' },
            },
        ],
        isLoading: false,
        error: null,
    }),
}))

vi.mock('../hooks/useMonthlyInvoiceRevenue', () => ({
    useMonthlyInvoiceRevenue: (...args: unknown[]) => mockUseMonthlyInvoiceRevenue(...args),
}))

// ResponsiveContainer size mock
vi.mock('recharts', async () => {
    const original = await vi.importActual<typeof import('recharts')>('recharts')
    return {
        ...original,
        ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
            <div style={{ width: 800, height: 300 }}>{children}</div>
        ),
    }
})

describe('AnalyticsPanel', () => {
    beforeEach(() => {
        mockUseMonthlyInvoiceRevenue.mockReturnValue({
            chartData: [
                { monthLabel: 'Nov', from: '2025-11-01', to: '2025-11-30', amount: 1000000, isLoading: false },
                { monthLabel: 'Dec', from: '2025-12-01', to: '2025-12-31', amount: 1500000, isLoading: false },
                { monthLabel: 'Jan', from: '2026-01-01', to: '2026-01-31', amount: 2000000, isLoading: false },
                { monthLabel: 'Feb', from: '2026-02-01', to: '2026-02-28', amount: 1800000, isLoading: false },
                { monthLabel: 'Mar', from: '2026-03-01', to: '2026-03-31', amount: 2500000, isLoading: false },
                { monthLabel: 'Apr', from: '2026-04-01', to: '2026-04-30', amount: 3000000, isLoading: false },
            ],
            isLoading: false,
            isError: false,
        })
    })

    it('renders stats row items and revenue chart title properly', () => {
        renderWithProviders(<AnalyticsPanel token="fake-token" />)

        expect(screen.getByText('150')).toBeInTheDocument()
        expect(screen.getByText('20')).toBeInTheDocument()
        expect(screen.getByText('Tushum dinamikasi (oxirgi 6 oy)')).toBeInTheDocument()
    })

    it('shows the lead funnel, recent payments and quick links', async () => {
        const onOpenSection = vi.fn()
        renderWithProviders(<AnalyticsPanel token="fake-token" onOpenSection={onOpenSection} />)

        expect(screen.getByText('Lidlar holati')).toBeInTheDocument()
        expect(screen.getByText('Jami 13 ta')).toBeInTheDocument()
        expect(screen.getByRole('progressbar', { name: 'Yangi' })).toHaveAttribute('value', '7')
        expect(screen.getByText('Aziza Karimova')).toBeInTheDocument()

        await userEvent.click(screen.getByRole('button', { name: /Filiallar/ }))
        expect(onOpenSection).toHaveBeenCalledWith('branches')
    })

    it('renders error message when chart data fails', () => {
        mockUseMonthlyInvoiceRevenue.mockReturnValue({
            chartData: [],
            isLoading: false,
            isError: true,
        })

        renderWithProviders(<AnalyticsPanel token="fake-token" />)

        expect(screen.getByText('Ma’lumotlarni yuklashda xatolik yuz berdi')).toBeInTheDocument()
    })
})
