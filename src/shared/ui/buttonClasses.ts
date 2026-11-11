import type { ButtonSize, ButtonVariant } from './Button'

/** Variant klasslari komponentdan tashqarida turadi, Fast Refresh barqaror qoladi. */
export const buttonVariantClasses: Record<ButtonVariant, string> = {
    // Asosiy harakat — sky → indigo gradient (2026-11 "kompas" uslubi).
    primary: 'rounded-lg bg-linear-to-r from-brand to-brand-2 text-brand-fg font-semibold hover:brightness-110 active:scale-[0.98]',
    brand: 'rounded-lg bg-linear-to-r from-brand to-brand-2 text-brand-fg font-bold hover:brightness-110 active:scale-[0.98]',
    success: 'rounded-lg border border-success/20 bg-success text-white font-semibold hover:brightness-105',
    // Ikkinchi darajali rangli harakat — namunadagi ("Spiska", "Yuk keldi")
    // chegarali kapsula. Ilgari binafsha gradient edi va asosiy tugma bilan
    // yonma-yon turganda qaysi biri muhimligi bilinmasdi.
    purple: 'rounded-lg border border-accent/40 bg-surface-card text-accent-fg font-medium hover:bg-accent-soft',
    secondary: 'rounded-lg border border-border-base bg-surface-card text-fg font-medium hover:border-border-strong hover:bg-surface-hover',
    ghost: 'rounded-lg border border-transparent text-fg-muted hover:bg-surface-hover hover:text-fg',
    danger: 'rounded-lg border border-danger-soft bg-danger-soft text-danger-fg hover:bg-danger hover:text-white',
}

export const buttonSizeClasses: Record<ButtonSize, string> = {
    sm: 'min-h-9 max-sm:min-h-11 px-3.5 text-xs',
    md: 'min-h-11 px-5 text-sm',
}
