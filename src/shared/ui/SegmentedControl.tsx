import { cn } from '@/shared/lib'

interface SegmentedControlProps<T extends string> {
    /** Skrinriderlar uchun — vizual sarlavha alohida bo'lishi mumkin. */
    label: string
    value: T
    options: { value: T; label: string }[]
    onChange: (value: T) => void
    className?: string
}

/**
 * Ikki-uch variantli tanlagich (til, tema, kun filtri).
 *
 * `radiogroup` roli beriladi: `<select>` dan farqli o'laroq hamma variant
 * ko'rinib turadi, bu esa kam variantli tanlovda tezroq.
 */
export function SegmentedControl<T extends string>({
    label,
    value,
    options,
    onChange,
    className,
}: SegmentedControlProps<T>) {
    return (
        <div
            role="radiogroup"
            aria-label={label}
            className={cn(
                'inline-flex shrink-0 gap-0.5 rounded-full border border-border-base bg-surface p-0.5',
                className
            )}
        >
            {options.map((option) => {
                const isActive = option.value === value
                return (
                    <button
                        key={option.value}
                        type="button"
                        role="radio"
                        aria-checked={isActive}
                        onClick={() => onChange(option.value)}
                        className={cn(
                            'cursor-pointer rounded-full px-3 py-1.5 max-sm:py-2.5 max-sm:min-h-11 text-xs whitespace-nowrap transition-colors',
                            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
                            isActive
                                ? 'bg-brand font-semibold text-brand-fg'
                                : 'text-fg-muted hover:bg-surface-hover'
                        )}
                    >
                        {option.label}
                    </button>
                )
            })}
        </div>
    )
}
