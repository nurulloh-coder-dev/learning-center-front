/**
 * Summa maydonini yozish paytida formatlash: `889000` → `889 000`.
 *
 * Nega: administrator kuniga ko'p to'lov yozadi va `889000` bilan `88900`
 * ni bir qarashda ajratib bo'lmaydi — nol tushib qolsa yoki ortib ketsa,
 * pul noto'g'ri yoziladi. Guruhlangan son xatoni darhol ko'rsatadi.
 *
 * Bo'luvchi — oddiy probel, jadvaldagi `formatAmount` bilan bir xil
 * ko'rinish (o'zbek yozuvida ham shunday).
 */
const SEPARATOR = ' '
/** 999 mlrd — undan katta summa kiritilishi xato bo'lishi aniq. */
const MAX_DIGITS = 12

export function formatAmountInput(raw: string): string {
    const digits = raw.replace(/\D/g, '').replace(/^0+(?=\d)/, '').slice(0, MAX_DIGITS)
    return digits.replace(/\B(?=(\d{3})+(?!\d))/g, SEPARATOR)
}

/** Bo'sh yoki raqamsiz qiymat uchun `NaN` — forma uni "noto'g'ri" deb biladi. */
export function parseAmountInput(value: string): number {
    const digits = value.replace(/\D/g, '')
    return digits === '' ? Number.NaN : Number(digits)
}

// Summa va telefon maydonlari bir xil kursor mantig'ini ishlatadi.
export { caretAfterDigits } from '@/shared/lib'
