import { db, json, nextId, type Row } from './state'

/**
 * `POST /student/list` va `/teacher/list` — Excel import.
 *
 * Haqiqiy backend kabi har qatorni alohida "yaratadi". Telefoni ...901234567
 * bilan tugaydigan qator demo'da "telefon band" bo'lib yiqiladi — natija
 * ekranidagi xatolar ro'yxatini ko'rish uchun.
 */
export function handleBulkImport(path: string, method: string, body: unknown): Response | null {
    if (method !== 'POST' || (path !== '/student/list' && path !== '/teacher/list')) return null
    const items = Array.isArray(body) ? (body as Record<string, unknown>[]) : []
    const isStudent = path === '/student/list'
    const succeeded: unknown[] = []
    const failed: unknown[] = []

    items.forEach((input, index) => {
        const user = (isStudent ? input.userCreateDto : input.user) as Record<string, unknown> | undefined
        const phone = String(user?.phone ?? '')
        if (phone.replace(/\D/g, '').endsWith('901234567')) {
            failed.push({ index, input, errorType: 'PHONE_NUMBER_ALREADY_EXISTS', message: 'Bu telefon raqami allaqachon mavjud' })
            return
        }
        const id = nextId(isStudent ? 's' : 't')
        const userDto = { id: nextId('u'), fullName: String(user?.fullName ?? ''), phone, birthDate: user?.birthDate ?? null }
        const row = { id, userDto, ...(isStudent ? { parentPhone: input.parentPhone ?? null } : {}) } as unknown as Row
        ;((isStudent ? db.students : db.teachers) as unknown as Row[]).push(row)
        succeeded.push({ ...row, userDto: { ...userDto, temporaryPassword: 'demo-' + nextId('p') } })
    })

    return json({ succeeded, failed }, failed.length > 0 ? 207 : 201)
}
