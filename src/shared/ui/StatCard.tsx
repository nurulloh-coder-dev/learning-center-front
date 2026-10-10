import type { ReactNode } from 'react'
import { cn } from '@/shared/lib'

interface StatCardProps {
    label: string
    value: ReactNode
    /** Ikonka foni va rangi, masalan `bg-accent-soft text-accent-fg`. */
    icon?: ReactNode
    tone?: string
    /** Raqam ostidagi kichik yozuv — faqat HAQIQIY ma'lumot (masalan "+3 bu oyda"). */
    hint?: ReactNode
    /** Qiymat yo'q/xato — raqam xiraroq ko'rinadi. */
    muted?: boolean
    compact?: boolean
}

/**
 * Statistika kartasi — admin, o'qituvchi va super-admin panellarida bir xil.
 *
 * Namunadagi (ERP) tartib: tepada kichik bosh harfli sarlavha, o'ng
 * burchakda dumaloq pastel ikonka, katta raqam, ostida yashil o'sish
 * yozuvi. Ikonka o'ngda — chapda bo'lsa raqamni o'ngga surib, tor
 * kartada pul summasi sig'masdi.
 */
export function StatCard({ label, value, icon, tone, hint, muted = false, compact = false }: StatCardProps) {
    return (
        <div
            className={cn(
                'flex items-start justify-between gap-3 rounded-2xl border border-border-base bg-surface-card shadow-[var(--shadow-card)]',
                compact ? 'p-3.5' : 'p-4 sm:p-5'
            )}
        >
            <div className="min-w-0">
                <div className="truncate text-[0.7rem] font-semibold tracking-[0.06em] text-fg-muted uppercase">{label}</div>
                <div
                    className={cn(
                        'mt-1.5 font-display font-bold tracking-tight tabular-nums',
                        compact ? 'text-xl' : 'text-2xl sm:text-[1.7rem]',
                        muted ? 'text-fg-faint' : 'text-fg'
                    )}
                >
                    {value}
                </div>
                {hint && (
                    <div className="mt-1.5 flex items-center gap-1 truncate text-xs font-medium text-success-fg">
                        <svg viewBox="0 0 24 24" className="size-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <polyline points="3 17 9 11 13 15 21 7" />
                            <polyline points="15 7 21 7 21 13" />
                        </svg>
                        <span className="truncate">{hint}</span>
                    </div>
                )}
            </div>
            {icon && (
                <span className={cn('hidden size-11 shrink-0 items-center justify-center rounded-full sm:flex', tone)}>
                    {icon}
                </span>
            )}
        </div>
    )
}
