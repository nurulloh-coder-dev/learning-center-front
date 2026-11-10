import type { ReactNode } from 'react'
import { cn } from '@/shared/lib'

/** Blok ustidagi kichik monospace yozuv ("RECORDS", "NEW LESSON"). */
export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
    return (
        <span className={cn('block text-xs font-medium text-fg-muted', className)}>
            {children}
        </span>
    )
}
