import { useT } from '@/shared/i18n'
import type { LeadStatus } from '@/shared/types'
import { DashboardCard } from './DashboardCard'

/**
 * Chiziq rangi holatga qarab. `<progress>` — eni foizga qarab o'zgaradi,
 * lekin inline `style` kerak emas (9-qoida) va ekran o'quvchiga qiymatni aytadi.
 */
const BAR: Record<LeadStatus, string> = {
    NEW: '[&::-webkit-progress-value]:bg-accent [&::-moz-progress-bar]:bg-accent',
    CALL_LATER: '[&::-webkit-progress-value]:bg-warning [&::-moz-progress-bar]:bg-warning',
    ENROLLED: '[&::-webkit-progress-value]:bg-success [&::-moz-progress-bar]:bg-success',
    REJECTED: '[&::-webkit-progress-value]:bg-danger [&::-moz-progress-bar]:bg-danger',
}

interface LeadFunnelCardProps {
    counts: { status: LeadStatus; count: number | undefined }[]
    isLoading: boolean
    hasError: boolean
}

export function LeadFunnelCard({ counts, isLoading, hasError }: LeadFunnelCardProps) {
    const { t } = useT()
    const total = counts.reduce((sum, item) => sum + (item.count ?? 0), 0)

    return (
        <DashboardCard title={t('analytics.leadFunnel')} subtitle={isLoading ? '···' : t('analytics.leadTotal', { count: total })}>
            {hasError ? (
                <p className="text-sm text-danger-fg">{t('analytics.error')}</p>
            ) : (
                <ul className="flex flex-col gap-4">
                    {counts.map(({ status, count }) => (
                        <li key={status}>
                            <div className="mb-1.5 flex items-center justify-between text-sm">
                                <span className="font-medium text-fg">{t(`lead.status.${status}`)}</span>
                                <span className="font-semibold tabular-nums text-fg">{count ?? '···'}</span>
                            </div>
                            <progress
                                aria-label={t(`lead.status.${status}`)}
                                value={count ?? 0}
                                max={total || 1}
                                className={`block h-1.5 w-full appearance-none overflow-hidden rounded-full bg-surface-muted [&::-webkit-progress-bar]:bg-surface-muted [&::-webkit-progress-value]:rounded-full [&::-moz-progress-bar]:rounded-full ${BAR[status]}`}
                            />
                        </li>
                    ))}
                </ul>
            )}
        </DashboardCard>
    )
}
