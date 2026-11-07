import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/shared/api'
import { createPlan, deletePlan, fetchPlans, updatePlan } from '../api/developerApi'
import type { PlanPayload } from '@/shared/types'
import { sortPlans } from '../lib/sortPlans'

/*
 * `search` ataylab bo'sh SATR, tashlab ketilmaydi.
 *
 * Backend so'rovida `lower(concat('%', :search, '%'))` turibdi. `:search`
 * null bo'lsa PostgreSQL parametr turini aniqlay olmaydi va uni `bytea`
 * deb oladi — natijada "function lower(bytea) does not exist" xatosi
 * chiqib, ro'yxat umuman yuklanmaydi. Bo'sh satr yuborilsa tur aniq
 * bo'ladi va `like '%%'` hammasini qaytaradi.
 *
 * Bu VAQTINCHALIK: to'g'ri yechim backendda (`docs/backend-notes.md`).
 */
const PAGE = { page: 0, size: 50, search: '' }

export function usePlans(token: string) {
    const query = useQuery({
        queryKey: queryKeys.plans(PAGE),
        queryFn: () => fetchPlans(token, PAGE),
        staleTime: 60_000,
    })

    return {
        plans: sortPlans(query.data?.content ?? []),
        isLoading: query.isLoading,
        error: query.error,
    }
}

export function usePlanMutations(token: string) {
    const queryClient = useQueryClient()
    const invalidate = () => queryClient.invalidateQueries({ queryKey: ['plan'] })

    const save = useMutation({
        mutationFn: ({ id, body }: { id?: string; body: PlanPayload }) =>
            id ? updatePlan(token, id, body) : createPlan(token, body),
        onSuccess: invalidate,
    })

    const remove = useMutation({
        mutationFn: (id: string) => deletePlan(token, id),
        onSuccess: invalidate,
    })

    return { save, remove }
}
