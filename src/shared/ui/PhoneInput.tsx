import { useLayoutEffect, useRef, type ChangeEvent, type InputHTMLAttributes } from 'react'
import { caretAfterDigits, cn, toUzLocalDigits, UZ_PHONE_PREFIX, uzLocalPart } from '@/shared/lib'
import { inputBaseClasses } from './inputClasses'

type PhoneInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'type'> & {
    value: string
    /** Formatlangan qiymat ("+998 90 123 45 67"); serverga `normalizePhone` bilan. */
    onChange: (value: string) => void
}

/**
 * Telefon maydoni — loyihadagi HAMMA telefon shu orqali.
 *
 * `+998` maydon ichida emas, chap tomonda yozuv bo'lib turadi: uni
 * o'chirib ham, ustiga yozib ham bo'lmaydi. Ilgari u matn ichida edi va
 * telefonda kursor prefiksga tushsa raqam buzilardi. Tashqariga beriladigan
 * qiymat avvalgidek to'liq: "+998 90 123 45 67".
 */
export function PhoneInput({ value, onChange, className, ...props }: PhoneInputProps) {
    const inputRef = useRef<HTMLInputElement>(null)
    const pendingCaret = useRef<number | null>(null)
    const shown = uzLocalPart(value)

    // Formatlangandan keyin kursor oxirga sakramasin (o'rtadagi raqamni tuzatish).
    useLayoutEffect(() => {
        if (pendingCaret.current == null || inputRef.current == null) return
        inputRef.current.setSelectionRange(pendingCaret.current, pendingCaret.current)
        pendingCaret.current = null
    }, [shown])

    function handleChange(event: ChangeEvent<HTMLInputElement>) {
        const raw = event.target.value
        const caret = event.target.selectionStart ?? raw.length
        let digitsBefore = raw.slice(0, caret).replace(/\D/g, '').length
        let local = toUzLocalDigits(raw)
        // Probel ustida Backspace: raqamlar o'zgarmadi, formatlash probelni
        // qaytarib qo'yadi va tugma "ishlamay" qoladi. Undan oldingi raqamni o'chiramiz.
        const isBackspace = (event.nativeEvent as InputEvent).inputType === 'deleteContentBackward'
        if (isBackspace && local === toUzLocalDigits(shown) && digitsBefore > 0) {
            local = local.slice(0, digitsBefore - 1) + local.slice(digitsBefore)
            digitsBefore -= 1
        }
        const next = uzLocalPart(UZ_PHONE_PREFIX + local)
        pendingCaret.current = caretAfterDigits(next, Math.min(digitsBefore, local.length))
        onChange(UZ_PHONE_PREFIX + next)
    }

    return (
        <div className={cn('relative', className)}>
            <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-sm text-fg-muted tabular-nums">
                +998
            </span>
            <input
                ref={inputRef}
                type="tel"
                inputMode="tel"
                autoComplete="tel-national"
                placeholder="90 123 45 67"
                {...props}
                value={shown}
                onChange={handleChange}
                className={cn(inputBaseClasses, 'rounded-lg pr-3.5 pl-14 tabular-nums')}
            />
        </div>
    )
}
