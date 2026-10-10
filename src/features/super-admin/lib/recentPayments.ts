import type { TransactionDto } from '@/shared/types'

/**
 * So'nggi to'lovlar uchun qaysi sahifalar olinadi.
 *
 * Backend `GET /transaction` ni hech narsa bo'yicha saralamaydi (yozilish
 * tartibida qaytaradi), shuning uchun eng yangilari OXIRGI sahifada.
 * Oxirgi sahifada bitta yozuv qolishi mumkin — undan oldingisi ham olinadi.
 */
export function lastPages(count: number, size: number): number[] {
    if (count <= 0) return []
    const last = Math.floor((count - 1) / size)
    return last > 0 ? [last - 1, last] : [0]
}

/** Sanasi bo'yicha yangidan eskiga, ko'pi bilan `limit` ta. */
export function newestFirst<T extends Pick<TransactionDto, 'createdAt'>>(rows: T[], limit: number): T[] {
    return [...rows].sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? '')).slice(0, limit)
}
