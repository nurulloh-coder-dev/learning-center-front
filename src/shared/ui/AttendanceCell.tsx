import { useState, type FormEvent } from 'react'
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
                    'size-10 sm:size-9 cursor-pointer rounded-md font-mono text-sm font-bold transition-colors',
                    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
                    STATUS_SQUARE[status]
                )}
            >
                {t(`attendance.${status}`).charAt(0)}
            </button>

            {/* Burchakdagi tugma — sababli qilish */}
            <button
                type="button"
                onClick={() => setIsNoteOpen((open) => !open)}
                aria-label={t('attendance.addExcuse', { name: studentName })}
                className={cn(
                    'absolute -top-1 -right-1 flex size-5 cursor-pointer items-center justify-center',
                    'after:absolute after:-inset-2 after:content-[""]',
                    'rounded-full border border-border-base bg-surface-card text-[0.65rem] font-bold leading-none text-fg-muted',
                    'hover:bg-surface-hover shadow-xs'
                )}
            >
                {reason ? '!' : '·'}
            </button>

            {isNoteOpen && (
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
                        className="absolute top-full right-0 z-50 mt-1.5 w-60 max-w-[calc(100vw-2rem)] rounded-lg border border-border-base bg-surface-card p-3 text-left shadow-[0_12px_30px_-8px_rgba(0,0,0,0.4)]"
                    >
                        <label className="mb-1.5 block font-mono text-[0.62rem] tracking-[0.06em] text-fg-faint uppercase">
                            {t('attendance.excuseReason')}
                        </label>
                        <textarea
                            autoFocus
                            rows={2}
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
                </>
            )}
        </div>
    )
}
