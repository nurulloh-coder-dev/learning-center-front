import type { LeadDto, LeadStatus } from '@/shared/types'
import { useT } from '@/shared/i18n'
import { Badge } from '@/shared/ui'
import { LeadCard } from './LeadCard'

const STATUS_TONE: Record<LeadStatus, 'accent' | 'success' | 'warning' | 'danger'> = {
    NEW: 'accent',
    ENROLLED: 'success',
    CALL_LATER: 'warning',
    REJECTED: 'danger',
}

// Ustun foni neytral, holat rangi faqat sarlavhadagi nuqtada — to'rtta yorqin
// rangli maydon yonma-yon ko'zni charchatardi.
const COLUMN_DOT: Record<LeadStatus, string> = {
    NEW: 'bg-accent',
    ENROLLED: 'bg-success',
    CALL_LATER: 'bg-warning',
    REJECTED: 'bg-danger',
}

interface LeadColumnProps {
    status: LeadStatus
    leads: LeadDto[]
    isLoading: boolean
    hasNextPage: boolean
    isFetchingNextPage: boolean
    loadMoreRef: (element: HTMLDivElement | null) => void
    onEdit: (lead: LeadDto) => void
    onStatusChange: (lead: LeadDto, status: LeadStatus) => void
    onDelete: (lead: LeadDto) => void
    onDragStart: (id: string) => void
    onDragEnd: () => void
    onDrop: (status: LeadStatus) => void
}

export function LeadColumn({
    status,
    leads,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    loadMoreRef,
    onEdit,
    onStatusChange,
    onDelete,
    onDragStart,
    onDragEnd,
    onDrop,
}: LeadColumnProps) {
    const { t } = useT()

    return (
        <section
            className="flex flex-col sm:min-h-110 rounded-2xl border border-border-base bg-surface-muted/70 p-3.5"
            onDragOver={(event) => event.preventDefault()}
            onDrop={() => onDrop(status)}
        >
            <header className="mb-3 flex items-start justify-between gap-2 px-1">
                <div className="min-w-0">
                    <h2 className="flex items-center gap-2 font-display text-base font-semibold text-fg">
                        <span aria-hidden="true" className={`size-2.5 rounded-full ${COLUMN_DOT[status]}`} />
                        {t(`lead.status.${status}`)}
                    </h2>
                    <p className="text-xs text-fg-muted">{t('lead.count', { count: leads.length })}</p>
                </div>
                <span className="shrink-0">
                    <Badge tone={STATUS_TONE[status]}>{leads.length}</Badge>
                </span>
            </header>
            <div className="flex flex-1 flex-col gap-3">
                {isLoading ? (
                    <div
                        className={
                            'rounded-xl border border-dashed border-border-base ' +
                            'bg-surface-card p-5 text-center text-sm text-fg-muted'
                        }
                    >
                        {t('common.loading')}
                    </div>
                ) : leads.length === 0 ? (
                    <div
                        className={
                            'flex min-h-32 flex-1 items-center justify-center ' +
                            'rounded-xl border border-dashed border-border-base ' +
                            'bg-surface-card/60 px-4 text-center text-xs text-fg-muted'
                        }
                    >
                        {t('lead.dropHere')}
                    </div>
                ) : (
                    leads.map((lead) => (
                        <LeadCard
                            key={lead.id}
                            lead={lead}
                            status={status}
                            onEdit={onEdit}
                            onStatusChange={onStatusChange}
                            onDelete={onDelete}
                            onDragStart={onDragStart}
                            onDragEnd={onDragEnd}
                        />
                    ))
                )}
                {hasNextPage && (
                    <div
                        ref={loadMoreRef}
                        data-status={status}
                        className="h-8 text-center text-xs text-fg-muted"
                    >
                        {isFetchingNextPage ? t('common.loading') : ''}
                    </div>
                )}
            </div>
        </section>
    )
}
