import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/shared/api'
import { createSubscription, fetchSubscriptions, updateSubscription } from '../api/developerApi'
import type { SubscriptionCreatePayload, SubscriptionUpdatePayload } from '@/shared/types'

export function useSubscriptions(token: string, page: number, search: string) {
    // `search` doim yuboriladi, bo'sh bo'lsa ham — `usePlans.ts` dagi
    // izohga qarang: null yuborilsa backend so'rovi yiqiladi.
    const params = { page, size: 10, search }

    const query = useQuery({
        queryKey: queryKeys.subscriptions(params),
        queryFn: () => fetchSubscriptions(token, params),
        // Sahifa almashganda jadval bo'shab ketmasin — eski ma'lumot
        // yangisi kelguncha turadi.
        placeholderData: (previous) => previous,
    })

    return {
        subscriptions: query.data?.content ?? [],
        totalPages: query.data?.totalPages ?? 0,
        totalElements: query.data?.totalElements ?? 0,
        isLoading: query.isLoading,
        error: query.error,
    }
}

const ALL_PARAMS = { page: 0, size: 200, search: '' }

/**
 * Tashkilot -> amaldagi obunaning tugash sanasi. Yangi obuna muddati shundan
 * davom etadi (`computeExpiryDate`). Jadval sahifalangani uchun alohida,
 * kattaroq so'rov: kerakli tashkilot boshqa sahifada bo'lsa ham topilsin.
 */
export function useCurrentExpiries(token: string) {
    const query = useQuery({
        queryKey: queryKeys.subscriptions(ALL_PARAMS),
        queryFn: () => fetchSubscriptions(token, ALL_PARAMS),
    })
    const expiries = new Map<string, string>()
    for (const subscription of query.data?.content ?? []) {
        const active = subscription.status === 'ACTIVE' || subscription.status === 'GRACE'
        if (active && subscription.organization?.id && subscription.expiresAt) {
            expiries.set(subscription.organization.id, subscription.expiresAt)
        }
    }
    return { expiries, isLoading: query.isLoading }
}

export function useSubscriptionMutations(token: string) {
    const queryClient = useQueryClient()
    // Obuna o'zgarsa tashkilotlar ro'yxati ham eskiradi: u yerda obuna
    // holati ko'rsatiladi.
    const invalidate = () => {
        queryClient.invalidateQueries({ queryKey: ['subscription'] })
        queryClient.invalidateQueries({ queryKey: ['organization'] })
    }

    const create = useMutation({
        mutationFn: (body: SubscriptionCreatePayload) => createSubscription(token, body),
        onSuccess: invalidate,
    })

    const changeStatus = useMutation({
        mutationFn: ({ id, body }: { id: string; body: SubscriptionUpdatePayload }) =>
            updateSubscription(token, id, body),
        onSuccess: invalidate,
    })

    return { create, changeStatus }
}
