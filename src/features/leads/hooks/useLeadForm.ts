import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ApiError, queryKeys } from '@/shared/api'
import type { LeadFormUpdateDto, PublicLeadSubmitDto } from '@/shared/types'
import {
    createLeadForm,
    fetchLeadForm,
    fetchPublicLeadForm,
    regenerateLeadFormKey,
    submitPublicLead,
    updateLeadForm,
} from '../api/leadFormApi'

/**
 * Ochiq forma. Darajalar har ochilganda serverdan olinadi — administrator
 * hech narsani "yangilashi" shart emas, o'chirilgan kurs formada qolmaydi.
 * 404 qayta so'ralmaydi: havola yaroqsiz, takrorlash foyda bermaydi.
 */
export function usePublicLeadForm(key: string) {
    return useQuery({
        queryKey: queryKeys.publicLeadForm(key),
        queryFn: () => fetchPublicLeadForm(key),
        retry: (count, error) => !(error instanceof ApiError && error.status === 404) && count < 2,
        // Mijoz yozib turganda forma qayta chizilib, tanlovi yo'qolmasin.
        refetchOnWindowFocus: false,
    })
}

export function useSubmitPublicLead(key: string) {
    return useMutation({
        mutationFn: (body: PublicLeadSubmitDto) => submitPublicLead(key, body),
        // Xato formaning o'zida ko'rsatiladi — mijozga umumiy qizil xabar tushunarsiz.
        meta: { toast: false },
    })
}

export function useMyLeadForm(token: string) {
    return useQuery({ queryKey: queryKeys.leadForm(), queryFn: () => fetchLeadForm(token) })
}

export function useLeadFormMutations(token: string) {
    const client = useQueryClient()
    const invalidate = () => void client.invalidateQueries({ queryKey: queryKeys.leadForm() })
    return {
        create: useMutation({ mutationFn: () => createLeadForm(token), onSuccess: invalidate }),
        update: useMutation({ mutationFn: (body: LeadFormUpdateDto) => updateLeadForm(token, body), onSuccess: invalidate }),
        regenerate: useMutation({ mutationFn: () => regenerateLeadFormKey(token), onSuccess: invalidate }),
    }
}
