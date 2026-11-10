import { useRef, useState, type CSSProperties, type FormEvent } from 'react'
import { createPortal } from 'react-dom'
import { useT } from '@/shared/i18n'
import { cn } from '@/shared/lib'
import { Button } from './Button'
import type { AttendanceStatus } from '@/shared/types'
import { STATUS_SQUARE } from '../lib/attendanceStatus'

interface AttendanceCellProps {
    studentName: string
    status: AttendanceStatus
    reason?: string
    onChange: (status: AttendanceStatus, reason?: string) => void
}

/**
 * Davomat katagi — bosiladigan kvadrat.
 *
 * Ochiladigan ro'yxat (dropdown) o'rniga shu tanlandi: o'qituvchi 20 ta
 * o'quvchini bir daqiqada belgilaydi, har biri uchun ro'yxat ochib yopish
 * juda sekin. Kvadratni bosish — kelgan/kelmagan o'rtasida almashtiradi,
 * ya'ni odatiy holat bitta bosishda hal bo'ladi.
 *
 * Burchakdagi kichik tugma — sababli qilish uchun: u izoh yozish oynasini
 * ochadi.
 */
export function AttendanceCell({ studentName, status, reason, onChange }: AttendanceCellProps) {
    const { t } = useT()
    const [isNoteOpen, setIsNoteOpen] = useState(false)
    const [draftReason, setDraftReason] = useState(reason ?? '')
    const noteButtonRef = useRef<HTMLButtonElement>(null)
    const [notePosition, setNotePosition] = useState<CSSProperties>({})

    const NOTE_WIDTH = 240
    const NOTE_HEIGHT = 160
    const EDGE = 8

    /**
     * Izoh oynasi jadval ichida emas, sahifa ustida chiziladi.
     *
     * Sabab: jadval `overflow-x-auto` ichida, ya'ni undan tashqariga chiqqan
     * har qanday narsa qirqiladi va ortiqcha aylantirish paydo bo'ladi.
     * Portal bu chegaradan chiqaradi, joyi esa tugmaga qarab hisoblanadi.
     *
     * Bu — loyihadagi yagona joy, o'rni piksel bilan beriladi: Tailwind
     * klasslari ish vaqtida hisoblangan koordinatani ifodalay olmaydi.
     */
    function openNote() {
        const rect = noteButtonRef.current?.getBoundingClientRect()
        if (rect) {
            // Pastda joy bo'lmasa tepaga ochiladi — aks holda oyna ekran
            // chetiga tiqilib, matn maydoni ko'rinmay qoladi.
            const opensUpward = rect.bottom + NOTE_HEIGHT > window.innerHeight - EDGE
            setNotePosition({
                position: 'fixed',
                top: opensUpward ? undefined : rect.bottom + 4,
                bottom: opensUpward ? window.innerHeight - rect.top + 4 : undefined,
                left: Math.min(
                    Math.max(rect.right - NOTE_WIDTH, EDGE),
                    window.innerWidth - NOTE_WIDTH - EDGE
                ),
                width: NOTE_WIDTH,
            })
        }
        setIsNoteOpen(true)
    }

    function toggle() {
        // Uchinchi holat (sababli) faqat burchak tugmasi orqali qo'yiladi,
        // aks holda tez belgilashda tasodifan tushib qolardi.
        onChange(status === 'PRESENT' ? 'ABSENT' : 'PRESENT')
    }

    function submitExcuse(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        onChange('EXCUSED', draftReason.trim() || undefined)
        setIsNoteOpen(false)
    }

    return (
        <div className="relative inline-flex">
            <button
                type="button"
                onClick={toggle}
                aria-label={`${studentName}: ${t(`attendance.${status}`)}`}
                className={cn(
                    'size-9 max-sm:size-11 cursor-pointer rounded-md font-mono text-sm font-bold transition-colors',
                    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
                    STATUS_SQUARE[status]
                )}
            >
                {t(`attendance.${status}`).charAt(0)}
            </button>

            {/* Burchakdagi tugma — sababli qilish */}
            <button
                type="button"
                ref={noteButtonRef}
                onClick={() => (isNoteOpen ? setIsNoteOpen(false) : openNote())}
                aria-label={t('attendance.addExcuse', { name: studentName })}
                className={cn(
                    'absolute -top-1 -right-1 flex size-4 max-sm:size-6 cursor-pointer items-center justify-center',
                    'rounded-full border border-border-base bg-surface-card text-[0.6rem] leading-none text-fg-muted',
                    'before:absolute before:-inset-2 max-sm:before:-inset-3 before:content-[""]',
                    'hover:bg-surface-hover'
                )}
            >
                {reason ? '!' : '·'}
            </button>

            {isNoteOpen &&
                createPortal(
                    <>
                        {/* Tashqariga bosilganda yopilishi uchun ko'rinmas qatlam */}
                        <button
                            type="button"
                            aria-hidden="true"
                            tabIndex={-1}
                            className="fixed inset-0 z-40 cursor-default"
                            onClick={() => setIsNoteOpen(false)}
                        />
                        <form
                            onSubmit={submitExcuse}
                            style={notePosition}
                            className="z-50 rounded-lg border border-border-base bg-surface-card p-3 text-left shadow-[0_12px_30px_-8px_rgba(0,0,0,0.4)]"
                        >
                            <label className="text-xs mb-1.5 block text-fg-faint">
                                {t('attendance.excuseReason')}
                            </label>
                            <textarea
                                autoFocus
                                rows={3}
                                value={draftReason}
                                onChange={(event) => setDraftReason(event.target.value)}
                                placeholder={t('attendance.excusePlaceholder')}
                                className="w-full resize-none rounded-md border border-border-base bg-surface px-2.5 py-1.5 text-sm text-fg focus:border-accent focus:ring-3 focus:ring-accent/20 focus:outline-none"
                            />
                            <div className="mt-2 flex justify-end gap-2">
                                <Button size="sm" onClick={() => setIsNoteOpen(false)}>
                                    {t('common.cancel')}
                                </Button>
                                <Button type="submit" size="sm" variant="primary">
                                    {t('attendance.EXCUSED')}
                                </Button>
                            </div>
                        </form>
                    </>,
                    document.body
                )}
        </div>
    )
}
