import type { ButtonSize, ButtonVariant } from './Button'

/** Variant klasslari komponentdan tashqarida turadi, Fast Refresh barqaror qoladi. */
export const buttonVariantClasses: Record<ButtonVariant, string> = {
    // Asosiy harakat — landing'dagi "Bepul demo" tugmasidek: bir tekis ko'k,
    // ixcham burchak, qalin yozuv, gradient va "nur" soyasiz.
    primary: 'rounded-md bg-brand text-brand-fg font-semibold hover:brightness-110 active:scale-[0.98]',
    brand: 'rounded-md bg-brand text-brand-fg font-bold hover:brightness-110 active:scale-[0.98]',
    success: 'rounded-md border border-success/20 bg-success text-white font-semibold hover:brightness-105',
    // Ikkinchi darajali rangli harakat — namunadagi ("Spiska", "Yuk keldi")
    // chegarali kapsula. Ilgari binafsha gradient edi va asosiy tugma bilan
    // yonma-yon turganda qaysi biri muhimligi bilinmasdi.
    purple: 'rounded-md border border-accent/40 bg-surface-card text-accent-fg font-medium hover:bg-accent-soft',
    secondary: 'rounded-md border border-border-base bg-surface-card text-fg font-medium hover:border-border-strong hover:bg-surface-hover',
    ghost: 'rounded-md border border-transparent text-fg-muted hover:bg-surface-hover hover:text-fg',
    danger: 'rounded-md border border-danger-soft bg-danger-soft text-danger-fg hover:bg-danger hover:text-white',
}

export const buttonSizeClasses: Record<ButtonSize, string> = {
    sm: 'min-h-9 max-sm:min-h-11 px-3.5 text-xs',
    md: 'min-h-11 px-5 text-sm',
}
