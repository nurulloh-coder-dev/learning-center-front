import { useEffect, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { DraftConfirm, DraftRestoredNotice } from './DraftPrompts'
import { Eyebrow } from './Eyebrow'

/** `useDraft` qaytaradigan holatning modalga kerakli qismi. */
interface ModalDraft {
    isDirty: boolean
    restored: boolean
    discard: () => void
    reset: () => void
}

interface ModalProps {
    /** Sarlavha ustidagi kichik yozuv, masalan "NEW RECORD". */
    eyebrow?: string
    title: ReactNode
    onClose: () => void
    children: ReactNode
    /** Pastdagi tugmalar qatori. */
    footer?: ReactNode
    /** Modalning kenglik klassi (standart: `max-w-md`). */
    maxWidth?: string
    /** Forma qoralamasi (`useDraft`). Berilsa, yozilgan narsa tasodifan yo'qolmaydi. */
    draft?: ModalDraft
}

/**
 * Modal oyna.
 *
 * Uch xil yopilish yo'li bor va uchalasi ham kerak: Escape (klaviatura),
 * fon bosilishi (sichqoncha) va tugma. Ichki bosishlar `stopPropagation`
 * bilan to'xtatiladi, aks holda formaning har bosilishi oynani yopib yuboradi.
 *
 * Qoralama bo'lsa, Escape va fon bosilishi darhol yopmaydi — so'raydi:
 * bular ko'pincha tasodifan bo'ladi. "Bekor qilish" tugmasi esa ongli
 * tanlov, u so'ramasdan o'chiradi (buni forma o'zi qiladi).
 *
 * `document.body` ga portal bilan chiqariladi: `Panel` dagi `backdrop-blur`
 * (`backdrop-filter`) `fixed` elementni butun ekranga emas, panelning o'ziga
 * bog'lab qo'yadi. Portalsiz panel ichida ochilgan oyna panel o'lchamida
 * qolib, tepasi yuqori panel ostida qirqilardi (o'lchangan: 1280×900 ekranda
 * fon 982×308 chiqqan).
 */
export function Modal({ eyebrow, title, onClose, children, footer, maxWidth = 'max-w-md', draft }: ModalProps) {
    const [confirming, setConfirming] = useState(false)

    function dismiss() {
        // So'rov ochiq turganda yana Escape/fon — "fikrimdan qaytdim", formaga qaytamiz.
        if (confirming) setConfirming(false)
        else if (draft?.isDirty) setConfirming(true)
        else onClose()
    }

    // Bog'liqliklar ro'yxatisiz: `dismiss` har renderda yangi (holatga qaraydi),
    // tinglovchini qayta ulash arzon.
    useEffect(() => {
        function handleKey(event: KeyboardEvent) {
            if (event.key === 'Escape') dismiss()
        }
        document.addEventListener('keydown', handleKey)
        return () => document.removeEventListener('keydown', handleKey)
    })

    return createPortal(
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 sm:p-5 backdrop-blur-sm"
            onClick={dismiss}
        >
            <div
                role="dialog"
                aria-modal="true"
                className={`max-h-[88vh] w-full ${maxWidth} overflow-y-auto rounded-xl border border-border-base bg-surface-card/88 p-5 sm:p-7 shadow-[var(--shadow-pop)] backdrop-blur-xl`}
                onClick={(event) => event.stopPropagation()}
            >
                {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
                <h2 className="mt-1 mb-4 font-display text-xl font-semibold text-fg">{title}</h2>
                {draft?.restored && <DraftRestoredNotice onReset={draft.reset} />}
                {children}
                {footer && <div className="mt-4 flex flex-wrap justify-end gap-2.5">{footer}</div>}
                {confirming && (
                    <DraftConfirm
                        onDiscard={() => {
                            draft?.discard()
                            onClose()
                        }}
                        // Qoralama allaqachon yozib borilgan — faqat yopamiz
                        onKeep={onClose}
                    />
                )}
            </div>
        </div>,
        document.body
    )
}
