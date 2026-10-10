import { useQueries } from '@tanstack/react-query'
import { queryKeys } from '@/shared/api'
import { useT } from '@/shared/i18n'
import { formatMonthShort } from '@/shared/lib'
import { fetchInvoiceAnalyticsRange } from '../api/superAdminApi'

export interface MonthRevenueData {
    monthLabel: string
    from: string
    to: string
    amount: number
    isLoading: boolean
}

/**
 * Berilgan oy va yil uchun ISO "YYYY-MM-DD" sana oralig'ini va formatlangan nomini qaytaradi.
 */
export function getMonthDateRange(year: number, monthIndex: number, locale = 'uz') {
    const start = new Date(Date.UTC(year, monthIndex, 1))
    const end = new Date(Date.UTC(year, monthIndex + 1, 0))

    const pad = (n: number) => String(n).padStart(2, '0')
    const from = `${start.getUTCFullYear()}-${pad(start.getUTCMonth() + 1)}-01`
    const to = `${end.getUTCFullYear()}-${pad(end.getUTCMonth() + 1)}-${pad(end.getUTCDate())}`

    const monthLabel = formatMonthShort(start.getUTCMonth(), locale)

    return { year, monthIndex, monthLabel, from, to }
}

/**
 * Oxirgi 6 oy parametrlarini hisoblaydi (eski oydan joriy oyga qarab).
 */
export function getLast6MonthsRanges(baseDate = new Date(), locale = 'uz') {
    const currentYear = baseDate.getFullYear()
    const currentMonth = baseDate.getMonth()

    const months = []
    for (let i = 5; i >= 0; i--) {
        const d = new Date(currentYear, currentMonth - i, 1)
        months.push(getMonthDateRange(d.getFullYear(), d.getMonth(), locale))
    }
    return months
}

export function useMonthlyInvoiceRevenue(token: string) {
    const { locale } = useT()
    const monthRanges = getLast6MonthsRanges(new Date(), locale)

    const results = useQueries({
        queries: monthRanges.map((m) => ({
            queryKey: queryKeys.analyticsInvoiceRange(m.from, m.to),
            queryFn: () => fetchInvoiceAnalyticsRange(token, m.from, m.to),
            enabled: Boolean(token),
        })),
    })

    const chartData: MonthRevenueData[] = monthRanges.map((m, index) => {
        const query = results[index]
        const data = query?.data as Record<string, number | undefined> | null | undefined
        const amount = data?.invoiceAmountInAMonth ?? 0

        return {
            monthLabel: m.monthLabel,
            from: m.from,
            to: m.to,
            amount,
            isLoading: query?.isLoading ?? true,
        }
    })

    const isLoading = results.some((q) => q.isLoading)
    const isError = results.some((q) => q.isError)
    const error = results.find((q) => q.error)?.error ?? null

    return {
        chartData,
        isLoading,
        isError,
        error,
    }
}
