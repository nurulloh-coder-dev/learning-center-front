import type { ReactNode } from 'react'
import { cn } from '@/shared/lib'

interface StatCardProps {
    label: string
    value: ReactNode
    /** Kichik xira belgi, rangli doirasiz. */
    icon?: ReactNode
    /** Eskirgan: rangli doira olib tashlandi, qiymat e'tiborga olinmaydi. */
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
export function StatCard({ label, value, icon, hint, muted = false, compact = false }: StatCardProps) {
    return (
        <div
            className={cn(
                'flex items-start justify-between gap-3 rounded-xl border border-border-base bg-surface-card',
                compact ? 'p-3.5' : 'p-4 sm:p-5'
            )}
        >
            <div className="min-w-0">
                <div className="truncate text-sm text-fg-muted">{label}</div>
                <div
                    className={cn(
                        'mt-1 font-display font-semibold tracking-tight tabular-nums',
                        compact ? 'text-xl' : 'text-2xl',
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
                // Rangli doira ichidagi ikonka "shablon" ko'rinish berardi —
                // endi faqat kichik, xira belgi; `tone` ataylab ishlatilmaydi.
                <span className="hidden shrink-0 text-fg-faint sm:block [&_svg]:size-5">{icon}</span>
            )}
        </div>
    )
}
