import { useState } from 'react'
import { describeOutcome } from '../lib/importOutcome'
import type { ImportKind } from '../lib/importFields'
import { toPayload } from '../lib/payload'
import type { PreparedRow } from '../lib/prepareRows'
import { rememberHeaders } from '../lib/rememberedHeaders'
import { useImportBranches } from './useImportBranches'
import { useImportFile } from './useImportFile'
import { useImportSubmit } from './useImportSubmit'

/**
 * Import sahifasining butun holati: filial, fayl, moslik, yuborish va natija.
 * Sahifa faqat shu hook natijasini komponentlarga tarqatadi.
 */
export function useImportFlow(token: string, kind: ImportKind) {
    const file = useImportFile(kind)
    const branches = useImportBranches(token)
    const submit = useImportSubmit(token, kind)
    const [chosenBranch, setChosenBranch] = useState('')
    // Natijadagi `failed[].index` shu ro'yxatga ishora qiladi.
    const [sent, setSent] = useState<PreparedRow[]>([])

    // Filial bitta bo'lsa — tanlatib o'tirmaymiz.
    const branchId = chosenBranch || (branches.options.length === 1 ? branches.options[0].value : '')

    const canSubmit =
        Boolean(branchId) && file.missingRequired.length === 0 && file.readyRows.length > 0 && !file.tooMany

    function start() {
        if (!canSubmit || !file.file) return
        const rows = file.readyRows
        setSent(rows)
        rememberHeaders(kind, file.file.table.headers, file.mapping)
        submit.mutate(rows.map((row) => toPayload(kind, row.values, branchId)))
    }

    function again() {
        submit.reset()
        setSent([])
        file.reset()
    }

    return {
        file,
        branches,
        branchId,
        setBranchId: setChosenBranch,
        canSubmit,
        start,
        again,
        isSubmitting: submit.isPending,
        submitError: submit.error,
        outcome: submit.data ? describeOutcome(submit.data, sent) : null,
    }
}
