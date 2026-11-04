import type { ImportResult } from '../api/importApi'
import type { PreparedRow } from './prepareRows'

export interface CreatedLogin {
    fullName: string
    phone: string
    /** `null` — telefon tizimda allaqachon bor edi: backend yangi parol bermaydi, odam eski paroli bilan kiradi. */
    password: string | null
}

export interface FailedLine {
    line: number
    fullName: string
    /** Server xabari — tarjima qilinmaydi (`errorType` faqat xabar bo'lmasa). */
    reason: string
}

/**
 * Backend javobini administrator tushunadigan ko'rinishga keltiradi.
 *
 * `failed[].index` — biz YUBORGAN ro'yxatdagi tartib; Excel'dagi qator
 * raqamini `sent` dan topamiz, aks holda "3-qator" deganda fayldagi
 * boshqa odam tushunilib qolardi (xato qatorlar yuborilmagan).
 */
export function describeOutcome(result: ImportResult, sent: readonly PreparedRow[]) {
    const logins: CreatedLogin[] = result.succeeded.map((created) => ({
        fullName: created.userDto?.fullName ?? '',
        phone: created.userDto?.phone ?? '',
        password: created.userDto?.temporaryPassword ?? null,
    }))
    const failed: FailedLine[] = result.failed.map((item) => {
        const row = sent[item.index]
        return {
            line: row?.line ?? item.index + 1,
            fullName: row?.values.fullName ?? '',
            reason: item.message || item.errorType || '',
        }
    })
    return { logins, failed }
}
