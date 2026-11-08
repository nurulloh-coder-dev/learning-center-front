import type { PlanDto } from '@/shared/types'

export const MIN_MONTHS = 1
export const MAX_MONTHS = 12
/** Har bir oy uchun chegirma (Nurulloh, 2026-11-07): 1 oyga yo'q, 12 oyga 15%. */
const DISCOUNT_PER_MONTH_PERCENT = 1.25

/** 1 oyga 0%, 2 oydan boshlab oylar soni × 1,25%. */
export function monthsDiscountPercent(months: number): number {
    return months < 2 ? 0 : months * DISCOUNT_PER_MONTH_PERCENT
}

function toIsoDate(date: Date): string {
    return date.toISOString().slice(0, 10)
}

/**
 * Yangi tugash sanasi. Backend (`SubscriptionCreateDto.expiryDate`) sanani
 * tayyor holda kutadi, shuning uchun uni shu yerda hisoblaymiz.
 *
 * Amaldagi obuna hali tugamagan bo'lsa — muddat uning TUGASHIDAN davom
 * etadi (mijoz oldindan to'lasa, qolgan kunlari yo'qolmasin); aks holda
 * bugundan. Oy qo'shilganda kun o'sha oyda yo'q bo'lsa (31-yanvar + 1 oy),
 * oyning oxirgi kuni olinadi — Java `plusMonths` ham shunday qiladi.
 */
export function computeExpiryDate(currentExpiresAt: string | undefined, months: number, today: Date): string {
    const todayIso = toIsoDate(today)
    const baseIso = currentExpiresAt && currentExpiresAt > todayIso ? currentExpiresAt.slice(0, 10) : todayIso
    const [year, month, day] = baseIso.split('-').map(Number)
    const targetMonthIndex = month - 1 + months
    const lastDay = new Date(Date.UTC(year, targetMonthIndex + 1, 0)).getUTCDate()
    return toIsoDate(new Date(Date.UTC(year, targetMonthIndex, Math.min(day, lastDay))))
}

/**
 * Taklif qilinadigan summa: oylik narx × oylar × (1 − chegirma).
 * Oylik narx — plan narxi uning muddatiga bo'lingani (yangi oylik planlarda
 * muddat 1). Dasturchi uni o'zgartira oladi: haqiqiy to'lov boshqacha bo'lishi mumkin.
 */
export function suggestedPaidAmount(plan: Pick<PlanDto, 'price' | 'durationMonths'>, months: number): number {
    const monthly = plan.price / Math.max(1, plan.durationMonths || 1)
    return Math.round(monthly * months * (1 - monthsDiscountPercent(months) / 100))
}
