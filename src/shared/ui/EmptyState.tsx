/** "Hech narsa yo'q" holati — jadval/ro'yxat bo'sh bo'lganda. */
import { Button } from './Button'

export function EmptyState({
    title,
    description,
    onClear,
    clearLabel,
}: {
    title: string
    description?: string
    onClear?: () => void
    clearLabel?: string
}) {
    return (
        <div className="rounded-xl border border-dashed border-border-strong bg-surface-card/90 px-6 py-10 text-center shadow-[var(--shadow-pop)] backdrop-blur-xl dark:border-border-strong dark:bg-surface-card">
            <p className="font-display text-lg font-semibold text-fg">{title}</p>
            {description && <p className="mt-1.5 text-sm text-fg-muted">{description}</p>}
            {onClear && (
                <div className="mt-4">
                    <Button size="sm" onClick={onClear}>
                        {clearLabel ?? 'Filtrni tozalash'}
                    </Button>
                </div>
            )}
        </div>
    )
}
