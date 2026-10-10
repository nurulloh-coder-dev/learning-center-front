import { cn } from '@/shared/lib'
import type { ButtonSize, ButtonVariant } from './Button'

/** Variant klasslari komponentdan tashqarida turadi, Fast Refresh barqaror qoladi. */
export const buttonVariantClasses: Record<ButtonVariant, string> = {
    // Asosiy harakat — `brand` → `brand-2`: light'da bir tekis ko'k (ikkala
    // token bir xil), dark'da moviydan binafshaga. Soya — yengil, "nur" emas.
    primary: cn(
        'rounded-full bg-linear-to-r from-brand to-brand-2 text-brand-fg font-medium shadow-[0_6px_16px_-8px_var(--brand)]',
        'hover:brightness-110'
    ),
    brand: cn(
        'rounded-full bg-linear-to-r from-brand to-brand-2 text-brand-fg font-semibold shadow-[0_6px_16px_-8px_var(--brand)]',
        'hover:brightness-110'
    ),
    success: 'rounded-lg border border-success/20 bg-success text-white font-semibold hover:brightness-105',
    purple: cn(
        'rounded-full bg-linear-to-r from-purple to-brand-2 text-white shadow-[0_6px_16px_-8px_var(--brand)]',
        'hover:brightness-110'
    ),
    secondary: 'rounded-lg border border-border-base bg-surface-card text-fg shadow-[0_1px_2px_rgb(15_23_42/0.04)] hover:border-border-strong hover:bg-surface-hover',
    ghost: 'rounded-lg border border-transparent text-fg-muted hover:bg-surface-hover hover:text-fg',
    danger: 'rounded-lg border border-danger-soft bg-danger-soft text-danger-fg hover:bg-danger hover:text-white',
}

export const buttonSizeClasses: Record<ButtonSize, string> = {
    sm: 'min-h-9 max-sm:min-h-11 px-3.5 text-xs',
    md: 'min-h-11 px-5 text-sm',
}
