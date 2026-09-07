import { useEffect, type ReactNode } from 'react'
import { Eyebrow } from './Eyebrow'

interface ModalProps {
    /** Sarlavha ustidagi kichik yozuv, masalan "NEW RECORD". */
    eyebrow?: string
    title: ReactNode
    onClose: () => void
    children: ReactNode
    /** Pastdagi tugmalar qatori. */
    footer?: ReactNode
}

/**
 * Modal oyna.
 *
 * Uch xil yopilish yo'li bor va uchalasi ham kerak: Escape (klaviatura),
 * fon bosilishi (sichqoncha) va tugma. Ichki bosishlar `stopPropagation`
 * bilan to'xtatiladi, aks holda formaning har bosilishi oynani yopib yuboradi.
 */
export function Modal({ eyebrow, title, onClose, children, footer }: ModalProps) {
    useEffect(() => {
        function handleKey(event: KeyboardEvent) {
            if (event.key === 'Escape') onClose()
        }
        document.addEventListener('keydown', handleKey)
        return () => document.removeEventListener('keydown', handleKey)
    }, [onClose])

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-3 sm:p-5 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                role="dialog"
                aria-modal="true"
                className="max-h-[90vh] sm:max-h-[85vh] w-full max-w-md overflow-y-auto rounded-xl border border-border-base bg-surface-card/95 p-5 sm:p-7 shadow-[0_28px_80px_-32px_var(--fg)] backdrop-blur-xl"
                onClick={(event) => event.stopPropagation()}
            >
                {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
                <h2 className="mt-1 mb-4 font-display text-xl font-semibold text-fg">{title}</h2>
                {children}
                {footer && <div className="mt-4 flex justify-end gap-2.5">{footer}</div>}
            </div>
        </div>
    )
}
