import { useNavigate } from 'react-router-dom'
import { useT } from '@/shared/i18n'
import { cn, formatAmount, formatDayMonth } from '@/shared/lib'
import type { TransactionDto } from '@/shared/types'
import { Badge, WalletIcon } from '@/shared/ui'
import { DashboardCard } from './DashboardCard'

interface RecentPaymentsCardProps {
    className?: string
    rows: TransactionDto[]
    isLoading: boolean
    hasError: boolean
}

/** Namunadagi "So'nggi hujjatlar" — bizda oxirgi to'lov harakatlari. */
export function RecentPaymentsCard({ className, rows, isLoading, hasError }: RecentPaymentsCardProps) {
    const { t, locale } = useT()
    const navigate = useNavigate()

    return (
        <DashboardCard
            title={t('analytics.recentPayments')}
            className={className}
            action={
                <button type="button" onClick={() => navigate('/payments')} className="cursor-pointer text-xs font-semibold text-accent hover:underline">
                    {t('analytics.viewAll')}
                </button>
            }
        >
            {hasError ? (
                <p className="text-sm text-danger-fg">{t('analytics.error')}</p>
            ) : isLoading ? (
                <p className="text-sm text-fg-muted">···</p>
            ) : rows.length === 0 ? (
                <p className="text-sm text-fg-muted">{t('analytics.noPayments')}</p>
            ) : (
                <ul className="divide-y divide-border-base">
                    {rows.map((row) => {
                        const isRefund = row.type === 'REFUND' || (row.amount ?? 0) < 0
                        return (
                            <li key={row.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-surface-muted text-fg-muted">
                                    <WalletIcon />
                                </span>
                                <div className="min-w-0 flex-1">
                                    {/* Ism backenddan — tarjima qilinmaydi */}
                                    <p className="truncate text-sm font-semibold text-fg">
                                        {row.user?.userDto?.fullName || t('analytics.unknownStudent')}
                                    </p>
                                    <p className="truncate text-xs text-fg-muted">
                                        {row.invoice?.invoiceNumber ?? ''}
                                        {row.createdAt ? ` · ${formatDayMonth(row.createdAt.slice(0, 10), locale)}` : ''}
                                    </p>
                                </div>
                                <div className="flex shrink-0 flex-col items-end gap-1">
                                    <span className={cn('text-sm font-semibold tabular-nums', isRefund ? 'text-danger-fg' : 'text-fg')}>
                                        {isRefund ? '−' : ''}
                                        {formatAmount(Math.abs(row.amount ?? 0))}
                                    </span>
                                    {row.type && (
                                        <Badge tone={isRefund ? 'danger' : 'success'}>{t(`transaction.type.${row.type}`)}</Badge>
                                    )}
                                </div>
                            </li>
                        )
                    })}
                </ul>
            )}
        </DashboardCard>
    )
}
