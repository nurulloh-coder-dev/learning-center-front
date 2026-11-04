import { isValidPhone, normalizePhone } from '@/shared/lib'
import type { ColumnMapping } from './columnMatch'
import type { ImportField } from './importFields'
import type { SheetRow } from './readSpreadsheet'

export type RowProblem = 'missingFullName' | 'missingPhone' | 'invalidPhone' | 'invalidBirthDate' | 'invalidParentPhone'

export interface PreparedValues {
    fullName: string
    phone: string
    birthDate: string | null
    parentPhone: string | null
}

export interface PreparedRow {
    /** Fayldagi qator raqami — Excel'da administrator ko'radigani. */
    line: number
    values: PreparedValues
    /** Bo'lsa — qator YUBORILMAYDI. */
    errors: RowProblem[]
    /** Qator yuboriladi, lekin shu maydon bo'sh (`null`) ketadi. */
    warnings: RowProblem[]
}

/**
 * Telefonni backend kutgan `+998...` ko'rinishga keltiradi.
 *
 * Excel'da raqam ko'pincha `901234567` (kod yo'q) yoki `998901234567`
 * (`+` yo'q, chunki katakcha son sifatida saqlangan) bo'lib turadi.
 * Ikkalasi ham O'zbekiston raqami deb olinadi; boshqasi o'zgarishsiz.
 * Bo'sh qiymat — bo'sh satr.
 */
export function toImportPhone(raw: string): string {
    const trimmed = raw.trim()
    if (!trimmed) return ''
    const digits = trimmed.replace(/\D/g, '')
    if (!trimmed.startsWith('+')) {
        if (digits.length === 9) return `+998${digits}`
        if (digits.length === 12 && digits.startsWith('998')) return `+${digits}`
    }
    return normalizePhone(trimmed)
}

/**
 * Umumiy `isValidPhone` E.164 bo'yicha 2 raqamni ham o'tkazadi — qo'lda
 * yozilgan forma uchun yetarli, lekin Excel'dagi "12" yoki qator raqami
 * telefon bo'lib ketmasin. O'zbekiston raqami aniq 12 raqam bo'lishi shart.
 */
export function isImportPhoneValid(phone: string): boolean {
    if (!isValidPhone(phone)) return false
    const digits = phone.replace(/\D/g, '')
    if (digits.startsWith('998')) return digits.length === 12
    return digits.length >= 9
}

/** Excel sanasi son bo'lib kelsa (katakcha formatlanmagan) — 1899-12-30 dan beri kunlar. */
const EXCEL_EPOCH_MS = Date.UTC(1899, 11, 30)
const DAY_MS = 86_400_000

/**
 * Sanani `YYYY-MM-DD` ga keltiradi. Tushunilmasa `null`.
 * Qabul qilinadi: `2008-03-14`, `14.03.2008`, `14/03/2008`, `14-03-2008`, Excel soni.
 */
export function toIsoDate(raw: string): string | null {
    const value = raw.trim()
    if (!value) return null
    let year: number
    let month: number
    let day: number
    const iso = /^(\d{4})-(\d{1,2})-(\d{1,2})/.exec(value)
    const dotted = /^(\d{1,2})[./-](\d{1,2})[./-](\d{4})$/.exec(value)
    if (iso) {
        ;[year, month, day] = [Number(iso[1]), Number(iso[2]), Number(iso[3])]
    } else if (dotted) {
        ;[day, month, year] = [Number(dotted[1]), Number(dotted[2]), Number(dotted[3])]
    } else if (/^\d{4,5}$/.test(value)) {
        const date = new Date(EXCEL_EPOCH_MS + Number(value) * DAY_MS)
        ;[year, month, day] = [date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate()]
    } else {
        return null
    }
    const date = new Date(Date.UTC(year, month - 1, day))
    const valid =
        date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day
    if (!valid || year < 1900 || date.getTime() > Date.now()) return null
    return `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

/**
 * Fayl qatorlarini moslik bo'yicha yuborishga tayyorlaydi va tekshiradi.
 *
 * Majburiy maydon bo'sh yoki telefon noto'g'ri bo'lsa — qator yuborilmaydi
 * (backend uni baribir rad etardi). Ixtiyoriy maydon noto'g'ri bo'lsa —
 * ogohlantirish bilan `null` ketadi: backend `null` ni qabul qiladi va
 * butun qatorni bitta sana uchun yo'qotish mantiqsiz.
 */
export function prepareRows(
    rows: readonly SheetRow[],
    mapping: ColumnMapping,
    fields: readonly ImportField[]
): PreparedRow[] {
    const has = (key: string) => fields.some((field) => field.key === key)
    const cell = (row: readonly string[], key: keyof ColumnMapping) => {
        const column = mapping[key]
        return column == null ? '' : (row[column] ?? '').trim()
    }

    return rows.map(({ line, cells: row }) => {
        const errors: RowProblem[] = []
        const warnings: RowProblem[] = []

        const fullName = cell(row, 'fullName').replace(/\s+/g, ' ')
        if (!fullName) errors.push('missingFullName')

        const phone = toImportPhone(cell(row, 'phone'))
        if (!phone) errors.push('missingPhone')
        else if (!isImportPhoneValid(phone)) errors.push('invalidPhone')

        const rawBirthDate = cell(row, 'birthDate')
        const birthDate = toIsoDate(rawBirthDate)
        if (rawBirthDate && !birthDate) warnings.push('invalidBirthDate')

        let parentPhone: string | null = null
        if (has('parentPhone')) {
            const raw = cell(row, 'parentPhone')
            const normalized = toImportPhone(raw)
            if (normalized && isImportPhoneValid(normalized)) parentPhone = normalized
            else if (raw) warnings.push('invalidParentPhone')
        }

        return { line, values: { fullName, phone, birthDate, parentPhone }, errors, warnings }
    })
}
