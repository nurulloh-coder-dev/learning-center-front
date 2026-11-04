import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/shared/api'
import { importPeople, type ImportPayload } from '../api/importApi'
import type { ImportKind } from '../lib/importFields'

/**
 * Import so'rovi. Muvaffaqiyatdan KEYIN ham, xatodan keyin ham ro'yxatlar
 * eskirgan deb belgilanadi: `500` bo'lsa ham ba'zi qatorlar saqlangan
 * bo'lishi mumkin (backend har qatorni alohida yozadi).
 */
export function useImportSubmit(token: string, kind: ImportKind) {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (items: ImportPayload[]) => importPeople(token, kind, items),
        onSettled: () => {
            // Admin paneli (`entity`) va super-admin paneli (`people`) ro'yxatlari.
            void queryClient.invalidateQueries({ queryKey: queryKeys.entityKind(kind) })
            void queryClient.invalidateQueries({ queryKey: queryKeys.peopleKind(kind) })
        },
    })
}
