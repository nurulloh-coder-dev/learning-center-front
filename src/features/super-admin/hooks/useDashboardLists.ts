import { useQueries, useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/shared/api'
import { LEAD_STATUSES } from '@/shared/types'
import { fetchLeadCount, fetchTransactionCount, fetchTransactionPage } from '../api/superAdminApi'
import { lastPages, newestFirst } from '../lib/recentPayments'

const PAGE_SIZE = 5

/** Lidlar holat bo'yicha — har holat uchun bitta yengil so'rov (`size=1`). */
export function useLeadStatusCounts(token: string) {
    const results = useQueries({
        queries: LEAD_STATUSES.map((status) => ({
            queryKey: queryKeys.leadStatusCount(status),
            queryFn: () => fetchLeadCount(token, status),
        })),
    })
    return {
        counts: LEAD_STATUSES.map((status, index) => ({ status, count: results[index]?.data })),
        isLoading: results.some((result) => result.isLoading),
        error: results.find((result) => result.error)?.error ?? null,
    }
}

export function useRecentPayments(token: string) {
    const count = useQuery({ queryKey: queryKeys.transactionCount(), queryFn: () => fetchTransactionCount(token) })
    const pages = lastPages(count.data ?? 0, PAGE_SIZE)
    const results = useQueries({
        queries: pages.map((page) => ({
            queryKey: queryKeys.transactionPage(page, PAGE_SIZE),
            queryFn: () => fetchTransactionPage(token, page, PAGE_SIZE),
        })),
    })
    return {
        rows: newestFirst(results.flatMap((result) => result.data ?? []), PAGE_SIZE),
        isLoading: count.isLoading || results.some((result) => result.isLoading),
        error: count.error ?? results.find((result) => result.error)?.error ?? null,
    }
}
