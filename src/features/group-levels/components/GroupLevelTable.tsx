import { useT } from '@/shared/i18n'
import { formatAmount } from '@/shared/lib'
import { ArrowDownIcon, ArrowUpIcon, DataTable, EditIcon, IconButton, TrashIcon } from '@/shared/ui'
import type { DataTableColumn } from '@/shared/ui'
import type { GroupLevelDto } from '@/shared/types'

interface GroupLevelTableProps {
    rows: GroupLevelDto[]
    isLoading: boolean
    onEdit: (row: GroupLevelDto) => void
    onDelete: (row: GroupLevelDto) => void
    onMove?: (row: GroupLevelDto, direction: -1 | 1) => void
    isReordering?: boolean
}

export function GroupLevelTable({
    rows,
    isLoading,
    onEdit,
    onDelete,
    onMove,
    isReordering = false,
}: GroupLevelTableProps) {
    const { t } = useT()

    const columns: DataTableColumn<GroupLevelDto>[] = [
        {
            key: 'name',
            header: t('groupLevel.name'),
            render: (row) => (
                <span className="inline-block max-w-48 truncate font-medium text-fg" title={row.name || '—'}>
                    {row.name || '—'}
                </span>
            ),
        },
        { key: 'lessonCount', header: t('groupLevel.lessonCount'), render: (row) => String(row.lessonCount ?? '—') },
        { key: 'orderNumber', header: t('groupLevel.orderNumber'), render: (row) => String(row.orderNumber ?? '—') },
        { key: 'durationInMonths', header: t('groupLevel.durationInMonths'), render: (row) => String(row.durationInMonths ?? '—') },
        {
            key: 'monthlyFee',
            header: t('groupLevel.monthlyFee'),
            // DIQQAT: backend hozircha bosh harf bilan `MonthlyFee` qaytaradi.
            render: (row) => formatAmount(row.monthlyFee ?? row.MonthlyFee),
        },
    ]

    return (
        <DataTable
            rows={rows}
            columns={columns}
            isLoading={isLoading}
            loadingText={t('common.loading')}
            emptyText={t('groupLevel.empty')}
            getRowKey={(row) => row.id}
            actionsHeader={t('admin.actions')}
            renderActions={(row, index) => (
                <>
                    {onMove && (
                        <>
                            <IconButton
                                label={t('groupLevel.moveUp')}
                                onClick={() => onMove(row, -1)}
                                disabled={isReordering || index === 0}
                            >
                                <ArrowUpIcon />
                            </IconButton>
                            <IconButton
                                label={t('groupLevel.moveDown')}
                                onClick={() => onMove(row, 1)}
                                disabled={isReordering || index === rows.length - 1}
                            >
                                <ArrowDownIcon />
                            </IconButton>
                        </>
                    )}
                    <IconButton label={t('common.edit')} onClick={() => onEdit(row)}>
                        <EditIcon />
                    </IconButton>
                    <IconButton label={t('common.delete')} tone="danger" onClick={() => onDelete(row)}>
                        <TrashIcon />
                    </IconButton>
                </>
            )}
        />
    )
}
