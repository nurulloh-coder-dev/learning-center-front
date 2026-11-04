import { normalizeHeader, type ColumnMapping } from './columnMatch'
import type { ImportFieldKey, ImportKind } from './importFields'

const STORAGE_PREFIX = 'clc-import-headers:'

/**
 * Administrator qo'lda tuzatgan moslik keyingi safar o'zi qo'yilsin
 * (bir markaz har oy bir xil shablondan yuklaydi).
 *
 * Bu faqat qulaylik — shu brauzerda saqlanadi, boshqa qurilmaga o'tmaydi.
 * `localStorage` yopiq bo'lsa (maxfiy oyna) — jimgina eslamaydi.
 */
export function readRememberedHeaders(kind: ImportKind): Record<string, ImportFieldKey> {
    try {
        const raw = localStorage.getItem(STORAGE_PREFIX + kind)
        const parsed: unknown = raw ? JSON.parse(raw) : null
        return parsed && typeof parsed === 'object' ? (parsed as Record<string, ImportFieldKey>) : {}
    } catch {
        return {}
    }
}

export function rememberHeaders(kind: ImportKind, headers: readonly string[], mapping: ColumnMapping): void {
    const next = readRememberedHeaders(kind)
    for (const [field, column] of Object.entries(mapping)) {
        if (column == null) continue
        const header = normalizeHeader(headers[column] ?? '')
        if (header) next[header] = field as ImportFieldKey
    }
    try {
        localStorage.setItem(STORAGE_PREFIX + kind, JSON.stringify(next))
    } catch {
        // Saqlab bo'lmadi — keyingi safar avtomatik moslik ishlaydi, xolos.
    }
}
