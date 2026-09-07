import type { BadgeTone } from '@/shared/ui'
import type { AttendanceStatus } from '@/shared/types'

/** Status → nishon rangi. Yangi status qo'shilsa, TS bu yerni majburan eslatadi. */
export const STATUS_TONE: Record<AttendanceStatus, BadgeTone> = {
    PRESENT: 'success',
    ABSENT: 'danger',
    EXCUSED: 'neutral',
}

/**
 * Bosiladigan kvadratning ranglari.
 *
 * Nishondan farqli o'laroq bu yerda to'yingan fon ishlatiladi — o'qituvchi
 * jadvalga bir qarab kim kelmaganini ko'rishi kerak.
 */
export const STATUS_SQUARE: Record<AttendanceStatus, string> = {
    PRESENT: 'bg-success text-white hover:opacity-90',
    ABSENT: 'bg-danger text-white hover:opacity-90',
    EXCUSED: 'bg-amber text-white hover:opacity-90',
}
