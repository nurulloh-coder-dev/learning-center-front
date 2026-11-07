import type { PlanDto } from '@/shared/types'

/**
 * Tariflar tartibi: avval `sortOrder` (dasturchi qo'ygan tartib — tarif
 * ichida 2→4→6→12 oy), u yo'q bo'lsa narx bo'yicha.
 *
 * Ilgari faqat narx bo'yicha edi: 16 ta plan qo'shilgach "Start · 2 oy" dan
 * keyin "Standard · 2 oy" kelib, bir tarifning muddatlari aralashib ketdi.
 * `sortOrder` siz eski planlar oxirida, narx tartibida qoladi.
 */
export function sortPlans(plans: readonly PlanDto[]): PlanDto[] {
    return [...plans].sort((a, b) => {
        const orderA = a.sortOrder ?? Number.POSITIVE_INFINITY
        const orderB = b.sortOrder ?? Number.POSITIVE_INFINITY
        if (orderA !== orderB) return orderA - orderB
        return a.price - b.price
    })
}
