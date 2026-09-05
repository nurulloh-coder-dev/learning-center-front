import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/shared/lib'

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    /** `aria-label` va `title` uchun — ikonkali tugmada matn yo'q. */
    label: string
    tone?: 'default' | 'danger'
    children: ReactNode
}

export function IconButton({ label, tone = 'default', className, children, ...props }: IconButtonProps) {
    return (
        <button
            type="button"
            aria-label={label}
            title={label}
            className={cn(
                'inline-flex size-9 cursor-pointer items-center justify-center rounded-lg border shadow-[0_12px_28px_-24px_var(--fg)]',
                'transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
                'disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-surface disabled:hover:text-fg-muted',
                tone === 'danger'
                    ? 'border-danger-soft bg-danger-soft text-danger-fg hover:bg-danger hover:text-white'
                    : 'border-border-base bg-surface text-fg-muted hover:bg-fg hover:text-fg-inverted',
                className
            )}
            {...props}
        >
            {children}
        </button>
    )
}
