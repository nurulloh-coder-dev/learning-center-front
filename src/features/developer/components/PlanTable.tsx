import { useT } from '@/shared/i18n'
import { formatAmount } from '@/shared/lib'
import { Badge, DataTable, EditIcon, IconButton, TrashIcon } from '@/shared/ui'
import type { DataTableColumn } from '@/shared/ui'
import { FEATURE_KEYS, type PlanDto } from '@/shared/types'

interface PlanTableProps {
    plans: PlanDto[]
    isLoading: boolean
    onEdit: (plan: PlanDto) => void
    onDelete: (plan: PlanDto) => void
}

export function PlanTable({ plans, isLoading, onEdit, onDelete }: PlanTableProps) {
    const { t } = useT()

    const columns: DataTableColumn<PlanDto>[] = [
        { key: 'code', header: t('plan.code'), render: (plan) => <span className="font-mono">{plan.code}</span> },
        { key: 'name', header: t('plan.name'), render: (plan) => plan.name },
        {
            key: 'price',
            header: t('plan.price'),
            align: 'right',
            render: (plan) => <span className="tabular-nums">{formatAmount(plan.price)}</span>,
        },
        {
            key: 'duration',
            header: t('plan.duration'),
            render: (plan) => t('plan.months', { count: plan.durationMonths }),
        },
        {
            key: 'limits',
            header: t('plan.limits'),
            render: (plan) => (
                <div className="flex flex-wrap gap-1">
                    {FEATURE_KEYS.filter((key) => plan.limits?.[key] != null).map((key) => (
                        <Badge key={key} tone="neutral">
                            {t(`feature.${key}`)}: {plan.limits?.[key]}
                        </Badge>
                    ))}
                </div>
            ),
        },
        {
            key: 'active',
            header: t('plan.active'),
            render: (plan) =>
                // `active` kelmasa ham faol: backendda ustun `true` bilan yaratiladi.
                plan.active === false ? (
                    <Badge tone="neutral">{t('plan.inactive')}</Badge>
                ) : (
                    <Badge tone="success">{t('plan.activeBadge')}</Badge>
                ),
        },
    ]

    return (
        <DataTable
            rows={plans}
            columns={columns}
            isLoading={isLoading}
            loadingText={t('common.loading')}
            emptyText={t('plan.empty')}
            getRowKey={(plan) => plan.id}
            actionsHeader={t('admin.actions')}
            renderActions={(plan) => (
                <div className="flex justify-end gap-1">
                    <IconButton label={t('common.edit')} onClick={() => onEdit(plan)}>
                        <EditIcon />
                    </IconButton>
                    <IconButton label={t('common.delete')} onClick={() => onDelete(plan)}>
                        <TrashIcon />
                    </IconButton>
                </div>
            )}
        />
    )
}
