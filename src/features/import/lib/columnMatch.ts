import type { ImportField, ImportFieldKey } from './importFields'

/** Maydon → fayldagi ustun tartib raqami (`null` — moslanmagan). */
export type ColumnMapping = Partial<Record<ImportFieldKey, number | null>>

/** Ustun nomini solishtirishga tayyorlaydi: harf va raqamdan boshqasi tushib qoladi. */
export function normalizeHeader(value: string): string {
    return value
        .normalize('NFKC')
        .toLowerCase()
        .replace(/[^\p{L}\p{N}]/gu, '')
}

/** Juda qisqa sinonim ("tel", "ism") boshqa so'z ichida tasodifan uchrab qoladi. */
const MIN_CONTAINS_LENGTH = 3
const REMEMBERED_SCORE = 3000
const EXACT_SCORE = 1000

function score(header: string, field: ImportField, remembered: Record<string, ImportFieldKey>): number {
    if (!header) return 0
    if (remembered[header] === field.key) return REMEMBERED_SCORE
    let best = 0
    for (const synonym of field.synonyms) {
        const normalized = normalizeHeader(synonym)
        if (normalized === header) return EXACT_SCORE + normalized.length
        // Uzunroq sinonim aniqroq: "телефон родителя" "телефон" dan ustun turadi.
        if (normalized.length >= MIN_CONTAINS_LENGTH && header.includes(normalized)) {
            best = Math.max(best, normalized.length)
        }
    }
    return best
}

/**
 * Fayl ustunlarini bizning maydonlarga avtomatik moslaydi.
 *
 * Har maydon va har ustun faqat bir marta ishlatiladi: eng ishonchli juftlik
 * (aniq mos kelish, keyin eng uzun sinonim) birinchi olinadi. Aks holda
 * "Telefon" va "Telefon (ota-ona)" ikkalasi ham bitta maydonga tushardi.
 * `remembered` — administrator ilgari qo'lda tanlagan moslik, u hammadan ustun.
 */
export function autoMatchColumns(
    headers: readonly string[],
    fields: readonly ImportField[],
    remembered: Record<string, ImportFieldKey> = {}
): ColumnMapping {
    const normalized = headers.map(normalizeHeader)
    const pairs: { field: ImportFieldKey; column: number; score: number }[] = []
    fields.forEach((field) => {
        normalized.forEach((header, column) => {
            const value = score(header, field, remembered)
            if (value > 0) pairs.push({ field: field.key, column, score: value })
        })
    })
    pairs.sort((a, b) => b.score - a.score || a.column - b.column)

    const mapping: ColumnMapping = {}
    const usedColumns = new Set<number>()
    for (const pair of pairs) {
        if (mapping[pair.field] != null || usedColumns.has(pair.column)) continue
        mapping[pair.field] = pair.column
        usedColumns.add(pair.column)
    }
    for (const field of fields) mapping[field.key] ??= null
    return mapping
}

/** Hali hech bir maydonga berilmagan ustunlar (`except` — joriy maydonniki, u ham qoladi). */
export function freeColumns(headersCount: number, mapping: ColumnMapping, except?: number | null): number[] {
    const used = new Set(Object.values(mapping).filter((value): value is number => value != null))
    return Array.from({ length: headersCount }, (_, index) => index).filter(
        (index) => index === except || !used.has(index)
    )
}
