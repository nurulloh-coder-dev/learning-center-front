import { cn } from '@/shared/lib'

/** "ALIA · …" logotipi. `subtitle` — sahifa nomi. */
export function Brand({ subtitle, className }: { subtitle?: string; className?: string }) {
    return (
        <div className={cn('flex items-center gap-2', className)}>
            <img src="/app-logo.png" alt="" className="size-7 shrink-0" />
            <span className="font-display text-sm font-bold tracking-tight text-fg">A.L.I.A</span>
            {subtitle && <span className="font-mono text-[0.78rem] text-fg-muted">{subtitle}</span>}
        </div>
    )
}
