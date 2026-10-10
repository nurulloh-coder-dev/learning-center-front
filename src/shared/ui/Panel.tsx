import type { ReactNode } from 'react'
import { cn } from '@/shared/lib'

/** Sahifadagi asosiy oq karta. */
export function Panel({ children, className }: { children: ReactNode; className?: string }) {
    return (
        <section
            className={cn(
                // To'liq rangli karta + ingichka qirra (2026-10 palitra): light'da och
                // fonda oq, dark'da navy fonda biroz ochroq — shishasiz, sokin.
                'rounded-2xl border border-border-base bg-surface-card p-6 shadow-[var(--shadow-card)]',
                className
            )}
        >
            {children}
        </section>
    )
}
