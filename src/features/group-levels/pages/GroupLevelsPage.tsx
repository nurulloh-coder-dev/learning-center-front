import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth, useSession } from '@/app/providers/useAuth'
import { useT } from '@/shared/i18n'
import type { GroupLevelDto } from '@/shared/types'
import { AppShell, BackIcon, Button, ErrorBox, IconButton, Panel } from '@/shared/ui'
import { GroupLevelFormModal, type GroupLevelFormValues } from '../components/GroupLevelFormModal'
import { GroupLevelTable } from '../components/GroupLevelTable'
import { useGroupLevelMutations, useGroupLevels } from '../hooks/useGroupLevels'
import { moveLevel, sortByOrder, toOrderPayload } from '../lib/groupLevelOrder'
import { toCreateGroupLevelPayload, toUpdateGroupLevelPayload } from '../lib/groupLevelPayload'

const emptyForm = (): GroupLevelFormValues => ({
    name: '',
    lessonCount: '',
    orderNumber: '',
    durationInMonths: '',
    monthlyFee: '',
})

export function GroupLevelsPage() {
    const { t } = useT()
    const session = useSession()
    const { signOut } = useAuth()
    const navigate = useNavigate()

    const [modal, setModal] = useState<{ mode: 'create' | 'edit'; row: GroupLevelDto | null } | null>(null)
    const list = useGroupLevels(session.token)
    const mutations = useGroupLevelMutations(session.token)

    const rows = useMemo(() => sortByOrder(list.data ?? []), [list.data])

    const initialValues = useMemo(() => {
        if (!modal?.row) return emptyForm()
        return {
            id: modal.row.id,
            name: modal.row.name,
            lessonCount: String(modal.row.lessonCount ?? ''),
            orderNumber: String(modal.row.orderNumber ?? ''),
            durationInMonths: String(modal.row.durationInMonths ?? ''),
            // Backend hozircha `MonthlyFee` deb bosh harf bilan qaytaradi.
            monthlyFee: String(modal.row.monthlyFee ?? modal.row.MonthlyFee ?? ''),
        }
    }, [modal])

    function openCreate() {
        setModal({ mode: 'create', row: null })
    }

    function openEdit(row: GroupLevelDto) {
        setModal({ mode: 'edit', row })
    }

    function handleSubmit(values: GroupLevelFormValues) {
        if (!modal) return

        if (modal.mode === 'create') {
            mutations.create.mutate(toCreateGroupLevelPayload(values), { onSuccess: () => setModal(null) })
            return
        }

        if (!modal.row) return
        mutations.update.mutate(
            { id: modal.row.id, body: toUpdateGroupLevelPayload(values) },
            { onSuccess: () => setModal(null) }
        )
    }

    function handleDelete(row: GroupLevelDto) {
        if (!confirm(t('groupLevel.deleteConfirm', { name: row.name }))) return
        // O'chirilgandan keyin qolganlari 1..n qilib qayta raqamlanadi —
        // aks holda tartibda bo'shliq qoladi va yangi daraja o'sha bo'shliqqa emas,
        // oxirgi raqamdan keyin tushib, ro'yxat aralashib ketadi.
        const remaining = rows.filter((item) => item.id !== row.id)
        mutations.remove.mutate(row.id, {
            onSuccess: () => {
                if (remaining.length > 0) mutations.reorder.mutate(toOrderPayload(remaining))
            },
        })
    }

    function handleMove(row: GroupLevelDto, direction: -1 | 1) {
        const next = moveLevel(rows, row.id, direction)
        if (next === rows) return
        mutations.reorder.mutate(toOrderPayload(next))
    }

    const mutationError =
        mutations.create.error ?? mutations.update.error ?? mutations.remove.error ?? mutations.reorder.error

    return (
        <AppShell
            subtitle={t('groupLevel.title')}
            onSignOut={signOut}
            actions={
                <>
                    <IconButton label={t('common.back')} onClick={() => navigate('/')}>
                        <BackIcon />
                    </IconButton>
                    <Button variant="primary" size="sm" onClick={openCreate}>
                        {t('groupLevel.new')}
                    </Button>
                </>
            }
        >
            <Panel>
                <header className="mb-5 flex flex-wrap items-end justify-between gap-3">
                    <div className="min-w-0">
                        <h1 className="mt-1 font-display text-2xl font-semibold text-fg">{t('groupLevel.title')}</h1>
                    </div>
                </header>

                {list.error && (
                    <div className="mb-4">
                        <ErrorBox>
                            {t('groupLevel.loadFailed', {
                                message: (list.error as Error)?.message ?? 'Unknown error',
                            })}
                        </ErrorBox>
                    </div>
                )}

                {mutationError && (
                    <div className="mb-4">
                        <ErrorBox>{(mutationError as Error)?.message ?? 'Unknown error'}</ErrorBox>
                    </div>
                )}

                {!list.error && (
                    <GroupLevelTable
                        rows={rows}
                        isLoading={list.isLoading}
                        onEdit={openEdit}
                        onDelete={handleDelete}
                        onMove={handleMove}
                        isReordering={mutations.reorder.isPending}
                    />
                )}
            </Panel>

            {modal && (
                <GroupLevelFormModal
                    key={`${modal.mode}-${modal.row?.id ?? 'new'}`}
                    mode={modal.mode}
                    row={modal.row}
                    initialValues={initialValues}
                    isSaving={modal.mode === 'create' ? mutations.create.isPending : mutations.update.isPending}
                    error={mutationError}
                    onSubmit={handleSubmit}
                    onClose={() => setModal(null)}
                />
            )}
        </AppShell>
    )
}
