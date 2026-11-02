import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/shared/api'
import type { UserCreatePayload, UserUpdatePayload } from '@/shared/types'
import {
    createAdmin,
    createBranch,
    createOrganization,
    deleteBranch,
    fetchAdminCount,
    fetchBranches,
    fetchOrganizations,
    regeneratePassword,
    updateAdmin,
    updateBranch,
    updateOrganization,
    type BranchPayload,
    type OrganizationPayload,
} from '../api/superAdminApi'

export const PAGE_SIZE = 10

function listParams(page: number, search: string) {
    return { page, size: PAGE_SIZE, search: search || undefined }
}

/** Ikkala ro'yxat ham bir xil shaklda — sahifa faqat ma'lumotni oladi. */
interface ListResult<T> {
    rows: T[]
    totalPages: number
    totalElements: number
    isLoading: boolean
    error: unknown
}

export function useOrganizations(token: string, page: number, search: string) {
    const params = listParams(page, search)
    const query = useQuery({
        queryKey: queryKeys.organizations(params),
        queryFn: () => fetchOrganizations(token, params),
        placeholderData: keepPreviousData,
    })
    return toResult(query)
}

export function useBranches(token: string, page: number, search: string) {
    const params = listParams(page, search)
    const query = useQuery({
        queryKey: queryKeys.branches(params),
        queryFn: () => fetchBranches(token, params),
        placeholderData: keepPreviousData,
    })
    return toResult(query)
}

function toResult<T>(query: {
    data?: { content?: T[]; totalPages?: number; totalElements?: number } | null
    isLoading: boolean
    error: unknown
}): ListResult<T> {
    return {
        rows: query.data?.content ?? [],
        totalPages: query.data?.totalPages ?? 0,
        totalElements: query.data?.totalElements ?? 0,
        isLoading: query.isLoading,
        error: query.error,
    }
}

export function useOrganizationMutations(token: string) {
    const queryClient = useQueryClient()
    const invalidate = () => queryClient.invalidateQueries({ queryKey: ['organization'] })

    return useMutation({
        mutationFn: ({ id, body }: { id: string | null; body: OrganizationPayload }) =>
            id === null ? createOrganization(token, body) : updateOrganization(token, id, body),
        onSuccess: invalidate,
    })
}

export function useBranchMutations(token: string) {
    const queryClient = useQueryClient()
    const invalidate = () => queryClient.invalidateQueries({ queryKey: ['branch'] })

    const save = useMutation({
        mutationFn: ({ id, body }: { id: string | null; body: BranchPayload }) => {
            if (id !== null) {
                // `BranchUpdateDto` da `organizationId` yo'q — filialni boshqa
                // tashkilotga ko'chirib bo'lmaydi, shuning uchun yubormaymiz.
                return updateBranch(token, id, {
                    name: body.name,
                    address: body.address,
                })
            }
            return createBranch(token, body)
        },
        onSuccess: invalidate,
    })

    const remove = useMutation({
        mutationFn: (id: string) => deleteBranch(token, id),
        onSuccess: invalidate,
    })

    return { save, remove }
}

export function useAdminCount(token: string) {
    const query = useQuery({
        queryKey: queryKeys.adminCount(),
        queryFn: () => fetchAdminCount(token),
        retry: false,
    })
    return query.data ?? 0
}

export function useCreateAdmin(token: string) {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (body: UserCreatePayload) => createAdmin(token, body),
        onSuccess: () => {
            // Sidebardagi qizil nuqta `adminCount` ga qaraydi, ro'yxat esa
            // `people('administrators', ...)` kaliti ostida — ikkalasi ham
            // eskirgan deb belgilanadi.
            queryClient.invalidateQueries({ queryKey: queryKeys.peopleKind('administrators') })
            queryClient.invalidateQueries({ queryKey: queryKeys.adminCount() })
        },
    })
}

/** Ro'yxat o'zgarmaydi — faqat parol, shuning uchun invalidatsiya kerak emas. */
export function useRegeneratePassword(token: string) {
    return useMutation({
        mutationFn: (userId: string) => regeneratePassword(token, userId),
    })
}

export function useUpdateAdmin(token: string) {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ userId, body }: { userId: string; body: UserUpdatePayload }) =>
            updateAdmin(token, userId, body),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.peopleKind('administrators') })
        },
    })
}
