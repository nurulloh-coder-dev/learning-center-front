import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/shared/api'
import type { GroupLevelOrderPayload } from '../lib/groupLevelOrder'
import type { GroupLevelUpdatePayload } from '../lib/groupLevelPayload'
import {
    createGroupLevel,
    deleteGroupLevel,
    fetchGroupLevels,
    reorderGroupLevels,
    updateGroupLevel,
} from '../api/groupLevelsApi'

export function useGroupLevels(token: string) {
    return useQuery({
        queryKey: queryKeys.groupLevels(),
        queryFn: () => fetchGroupLevels(token),
        retry: false,
        staleTime: 30_000,
    })
}

export function useGroupLevelMutations(token: string) {
    const queryClient = useQueryClient()

    const invalidate = async () => {
        await queryClient.invalidateQueries({ queryKey: queryKeys.groupLevels() })
    }

    const create = useMutation({
        mutationFn: (body: unknown) => createGroupLevel(token, body),
        onSuccess: invalidate,
    })

    const update = useMutation({
        mutationFn: ({ id, body }: { id: string; body: GroupLevelUpdatePayload }) => updateGroupLevel(token, id, body),
        onSuccess: invalidate,
    })

    const remove = useMutation({
        mutationFn: (id: string) => deleteGroupLevel(token, id),
        onSuccess: invalidate,
    })

    const reorder = useMutation({
        mutationFn: (body: GroupLevelOrderPayload) => reorderGroupLevels(token, body),
        onSuccess: invalidate,
    })

    return { create, update, remove, reorder }
}
