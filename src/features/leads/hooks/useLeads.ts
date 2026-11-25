import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ApiError, queryKeys } from '@/shared/api'
import { useT } from '@/shared/i18n'
import { showErrorToast } from '@/shared/ui'
import type { LeadCreateDto, LeadRejectDto, LeadUpdateDto } from '@/shared/types'
import { callLaterLead, createLead, deleteLead, enrollLead, fetchGroupOptions, fetchLeadCourseOptions, fetchLeads, rejectLead, updateLead, type LeadListParams } from '../api/leadsApi'

export function useLeadGroupOptions(token: string) {
    return useQuery({ queryKey: queryKeys.groupOptions(), queryFn: () => fetchGroupOptions(token), staleTime: 5 * 60_000 })
}

export function useLeadCourseOptions(token: string) {
    return useQuery({ queryKey: queryKeys.leadCourseOptions(), queryFn: () => fetchLeadCourseOptions(token), staleTime: 5 * 60_000 })
}

/**
 * `live` — jonli oqim (SSE) ulangan: o'zgarishlar o'zi keladi, 30 soniyalik
 * so'rov kerak emas. Oqim uzilsa yoki backend hali qo'llamasa, so'rov
 * zaxira sifatida ishlayveradi.
 */
export function useLeads(token: string, params: Pick<LeadListParams, 'size' | 'search' | 'status'>, live = false) {
    return useInfiniteQuery({
        queryKey: queryKeys.leads(params),
        queryFn: ({ pageParam }) => fetchLeads(token, { ...params, page: pageParam }),
        initialPageParam: 0,
        getNextPageParam: (lastPage, pages) => {
            const totalPages = lastPage?.totalPages ?? 0
            return pages.length < totalPages ? pages.length : undefined
        },
        // Ochiq formadan lid o'zi tushadi — administrator sahifani yangilamasdan ko'rsin.
        refetchInterval: live ? false : 30_000,
    })
}

export function useLeadMutations(token: string) {
    const client = useQueryClient()
    const invalidate = () => void client.invalidateQueries({ queryKey: ['lead'] })
    const { t } = useT()
    // Boshqa xodim lidni oldin o'zgartirgan (409): umumiy qizil xabar o'rniga
    // tushunarli matn ko'rsatamiz va ro'yxatni yangilaymiz — xodim yangi
    // holatni ko'rib, amalni qaytadan bajaradi.
    const conflict = {
        meta: { toast: false },
        onError: (error: unknown) => {
            if (error instanceof ApiError && error.status === 409) {
                showErrorToast(new Error(t('lead.versionConflict')))
                invalidate()
            } else {
                showErrorToast(error)
            }
        },
    }
    return {
        create: useMutation({ mutationFn: (body: LeadCreateDto) => createLead(token, body), onSuccess: invalidate }),
        update: useMutation({ mutationFn: ({ id, body }: { id: string; body: LeadUpdateDto }) => updateLead(token, id, body), onSuccess: invalidate, ...conflict }),
        enroll: useMutation({ mutationFn: ({ id, version, groupId }: { id: string; version: number; groupId: string }) => enrollLead(token, id, version, groupId), onSuccess: invalidate, ...conflict }),
        reject: useMutation({ mutationFn: ({ id, version, body }: { id: string; version: number; body: LeadRejectDto }) => rejectLead(token, id, version, body), onSuccess: invalidate, ...conflict }),
        callLater: useMutation({ mutationFn: ({ id, version, callAt }: { id: string; version: number; callAt: string }) => callLaterLead(token, id, version, callAt), onSuccess: invalidate, ...conflict }),
        remove: useMutation({ mutationFn: (id: string) => deleteLead(token, id), onSuccess: invalidate }),
    }
}
