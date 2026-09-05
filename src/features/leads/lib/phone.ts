/**
 * Telefonni backend kutgan ko'rinishga keltiradi: faqat `+` va raqamlar.
 * Foydalanuvchi `+998 90 123-45-67` deb yozadi — ilgari bunday yozuv
 * validatsiyadan o'tmay, "Saqlash" tugmasi jimgina o'chib qolar edi.
 */
export function normalizePhone(raw: string): string {
    const digits = raw.replace(/[^\d]/g, '')
    return raw.trim().startsWith('+') ? `+${digits}` : digits
}

/** E.164: ixtiyoriy `+`, birinchi raqam 0 emas, jami 2..15 raqam. */
const PHONE_RE = /^\+?[1-9]\d{1,14}$/

export function isValidPhone(raw: string): boolean {
    return PHONE_RE.test(normalizePhone(raw))
}
