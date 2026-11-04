import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/shared/api'
import { fetchBranchOptions } from '../api/importApi'

export function useImportBranches(token: string) {
    const query = useQuery({
        queryKey: queryKeys.branchOptions(),
        queryFn: () => fetchBranchOptions(token),
        staleTime: 5 * 60_000,
    })
    return { options: query.data ?? [], isLoading: query.isLoading, error: query.error }
}
