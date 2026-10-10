import type { ReactNode } from 'react'
import { cn } from '@/shared/lib'

interface DashboardCardProps {
    title: string
    subtitle?: string
    action?: ReactNode
    className?: string
    children: ReactNode
}

/** Dashboard bloklari uchun bir xil karta: sarlavha, ixtiyoriy tugma, kontent. */
export function DashboardCard({ title, subtitle, action, className, children }: DashboardCardProps) {
    return (
        <section className={cn('flex flex-col rounded-2xl border border-border-base bg-surface-card p-5 shadow-[var(--shadow-card)]', className)}>
            <header className="mb-4 flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <h3 className="font-display text-lg font-semibold text-fg">{title}</h3>
                    {subtitle && <p className="mt-0.5 text-xs text-fg-muted">{subtitle}</p>}
                </div>
                {action}
            </header>
            {children}
        </section>
    )
}
