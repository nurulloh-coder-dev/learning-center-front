/**
 * Ko'rsatish uchun formatlash yordamchilari.
 *
 * Bular ilgari uchta sahifada nusxalanib yotardi — endi bitta joyda va
 * testlar bilan qoplangan.
 */

/** `LocalTime` "HH:mm:ss" dan soniyalarni olib tashlaydi. */
export function formatTime(value?: string | null): string {
    return value ? value.slice(0, 5) : ''
}

/** ISO datetime'dan faqat sanani ("yyyy-MM-dd") qoldiradi. */
export function formatDate(value?: string | null): string {
    return value ? value.slice(0, 10) : ''
}

/** Avatar uchun ism-familiyaning bosh harflari. */
export function initials(name?: string | null): string {
    if (!name) return '?'
    return name
        .split(' ')
        .filter(Boolean)
        .map((part) => part[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
}

/** `parentPhone` → `Parent phone` — avtomatik jadval sarlavhalari uchun. */
export function formatHeader(key: string): string {
    return key.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, (c) => c.toUpperCase())
}

/** Ixtiyoriy qiymatni jadval katagiga tushadigan matnga aylantiradi. */
export function formatCell(value: unknown): string {
    if (value === null || value === undefined) return '—'
    if (typeof value === 'object') return JSON.stringify(value)
    if (typeof value === 'boolean') return value ? 'Yes' : 'No'
    return String(value)
}

/** `PRESENT` → `Present`, `STARTING` → `Starting`. */
export function titleCase(value: string): string {
    return value.charAt(0) + value.slice(1).toLowerCase()
}

/** `Students` → `Student` — tugma va modal sarlavhalari uchun. */
export function singular(label: string): string {
    return label.endsWith('s') ? label.slice(0, -1) : label
}

/**
 * Summani ko'rsatish uchun formatlash.
 *
 * `Intl` ishlatilyapti, lekin valyuta belgisi bilan emas: backend valyutani
 * aytmaydi (`amount`/`monthlyFee` — oddiy son), shuning uchun "so'm" deb
 * yozib qo'yish taxmin bo'lardi. Faqat razryadlarga ajratamiz.
 */
export function formatAmount(amount?: number | null): string {
    if (amount === undefined || amount === null || Number.isNaN(amount)) return '—'
    return new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2 }).format(amount)
}

/** Qisqartirilgan oy nomlari — jadval sarlavhalari uchun. */
const SHORT_MONTHS: Record<string, string[]> = {
    uz: ['yan', 'fev', 'mar', 'apr', 'may', 'iyn', 'iyl', 'avg', 'sen', 'okt', 'noy', 'dek'],
    ru: ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'],
    en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
}

/**
 * Oyning qisqa nomi bosh harf bilan: "Yan", "Okt" (grafik o'qi uchun).
 *
 * `toLocaleString('uz', { month: 'short' })` emas: Chrome'da o'zbekcha oy
 * nomlari yo'q va u "M10" qaytaradi (Node'da esa ishlaydi — testda sezilmaydi).
 */
export function formatMonthShort(monthIndex: number, locale = 'uz'): string {
    const name = (SHORT_MONTHS[locale] ?? SHORT_MONTHS.uz)[monthIndex] ?? ''
    return name.charAt(0).toUpperCase() + name.slice(1)
}

/**
 * Jadval sarlavhasidagi sana: "16 sen" (uz/ru) yoki "Sep 16" (en).
 *
 * Yil ataylab yo'q — jadval bir necha oylik oraliqni ko'rsatadi, yil esa
 * baribir joriy yil bo'ladi va har ustunda takrorlanib joy egallaydi.
 * Boshidagi nol ham olib tashlanadi: "09-03" o'qishga qiyin, "3 sen" esa
 * darrov tushunarli.
 *
 * `Date` ataylab ishlatilmaydi: kelgan qiymat "2026-09-16" ko'rinishidagi
 * MAHALLIY sana, uni `Date` ga bersak brauzer UTC deb o'qib, vaqt mintaqasi
 * manfiy bo'lgan joyda bir kun oldinga surib yuboradi.
 */
export function formatDayMonth(value?: string | null, locale = 'uz'): string {
    if (!value) return ''
    const [year, month, day] = value.slice(0, 10).split('-')
    if (!year || !month || !day) return formatDate(value)

    const months = SHORT_MONTHS[locale] ?? SHORT_MONTHS.uz
    const name = months[Number(month) - 1]
    if (!name) return formatDate(value)

    const dayNumber = Number(day)
    return locale === 'en' ? `${name} ${dayNumber}` : `${dayNumber} ${name}`
}
