import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/shared/api'
import type { LeadCreateDto, LeadRejectDto, LeadUpdateDto } from '@/shared/types'
import { callLaterLead, createLead, deleteLead, enrollLead, fetchGroupOptions, fetchLeadCourseOptions, fetchLeads, rejectLead, updateLead, type LeadListParams } from '../api/leadsApi'

export function useLeadGroupOptions(token: string) {
    return useQuery({ queryKey: queryKeys.groupOptions(), queryFn: () => fetchGroupOptions(token), staleTime: 5 * 60_000 })
}

export function useLeadCourseOptions(token: string) {
    return useQuery({ queryKey: queryKeys.leadCourseOptions(), queryFn: () => fetchLeadCourseOptions(token), staleTime: 5 * 60_000 })
}

export function useLeads(token: string, params: Pick<LeadListParams, 'size' | 'search' | 'status'>) {
    return useInfiniteQuery({
        queryKey: queryKeys.leads(params),
        queryFn: ({ pageParam }) => fetchLeads(token, { ...params, page: pageParam }),
        initialPageParam: 0,
        getNextPageParam: (lastPage, pages) => {
            const totalPages = lastPage?.totalPages ?? 0
            return pages.length < totalPages ? pages.length : undefined
        },
        // Ochiq formadan lid o'zi tushadi — administrator sahifani yangilamasdan ko'rsin.
        refetchInterval: 30_000,
    })
}

export function useLeadMutations(token: string) {
    const client = useQueryClient()
    const invalidate = () => void client.invalidateQueries({ queryKey: ['lead'] })
    return {
        create: useMutation({ mutationFn: (body: LeadCreateDto) => createLead(token, body), onSuccess: invalidate }),
        update: useMutation({ mutationFn: ({ id, body }: { id: string; body: LeadUpdateDto }) => updateLead(token, id, body), onSuccess: invalidate }),
        enroll: useMutation({ mutationFn: ({ id, groupId }: { id: string; groupId: string }) => enrollLead(token, id, groupId), onSuccess: invalidate }),
        reject: useMutation({ mutationFn: ({ id, body }: { id: string; body: LeadRejectDto }) => rejectLead(token, id, body), onSuccess: invalidate }),
        callLater: useMutation({ mutationFn: ({ id, callAt }: { id: string; callAt: string }) => callLaterLead(token, id, callAt), onSuccess: invalidate }),
        remove: useMutation({ mutationFn: (id: string) => deleteLead(token, id), onSuccess: invalidate }),
    }
}
