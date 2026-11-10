import type { ReactNode } from 'react'
import { cn } from '@/shared/lib'

/** Label + input juftligi. `label` elementi ichida — bosilganda fokus ko'chadi. */
export function Field({
    label,
    children,
    className,
}: {
    label: ReactNode
    children: ReactNode
    className?: string
}) {
    return (
        <label className={cn('flex flex-col gap-1.5', className)}>
            <span className="text-sm font-medium text-fg">{label}</span>
            {children}
        </label>
    )
}
