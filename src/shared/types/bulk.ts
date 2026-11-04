/**
 * Ommaviy yaratish javobi — `POST /student/list` va `POST /teacher/list`.
 *
 * Backend (`BulkResult`, `FailedItem` record'lari) har qatorni alohida
 * yaratadi: biri yiqilsa qolganlari to'xtamaydi. Hammasi o'tsa `201`,
 * bir qismi yiqilsa `207` keladi — ikkalasida ham tana shu shaklda.
 */
export interface BulkResult<Succeeded, Input> {
    succeeded: Succeeded[]
    failed: BulkFailedItem<Input>[]
}

export interface BulkFailedItem<Input> {
    /** Yuborilgan ro'yxatdagi tartib raqami (0 dan). */
    index: number
    input: Input
    /** Backenddagi `ErrorType` nomi, masalan `PHONE_NUMBER_ALREADY_EXISTS`. */
    errorType: string | null
    /** Server xabari — tarjima qilinmaydi, qanday kelsa shunday ko'rsatiladi. */
    message: string | null
}
