/** `PUT /group-level` tanasi — faqat tartib raqamlarini yangilaydi. */
export interface GroupLevelOrderPayload {
    levels: { id: string; orderNumber: number }[]
}

/**
 * Tartib raqami bo'yicha o'sish tartibida qaytaradi.
 * Backend tartibni kafolatlamaydi, shuning uchun ro'yxat har doim shu yerda
 * saralanadi — aks holda ▲/▼ tugmalari ko'rinmaydigan tartibni siljitardi.
 */
export function sortByOrder<T extends { orderNumber?: number }>(rows: T[]): T[] {
    return [...rows].sort(
        (a, b) => (a.orderNumber ?? Number.MAX_SAFE_INTEGER) - (b.orderNumber ?? Number.MAX_SAFE_INTEGER)
    )
}

/**
 * Berilgan darajani bir pog'ona yuqoriga (`-1`) yoki pastga (`1`) suradi.
 * Chekkada bo'lsa aynan o'sha ro'yxat qaytadi — chaqiruvchi buni "o'zgarish
 * yo'q" belgisi sifatida ishlatadi.
 */
export function moveLevel<T extends { id: string }>(rows: T[], id: string, direction: -1 | 1): T[] {
    const index = rows.findIndex((row) => row.id === id)
    const target = index + direction
    if (index === -1 || target < 0 || target >= rows.length) return rows

    const next = [...rows]
    const [moved] = next.splice(index, 1)
    next.splice(target, 0, moved)
    return next
}

/**
 * Ro'yxatdagi joylashuvga qarab 1..n qilib qayta raqamlaydi.
 * O'chirishdan keyin ham shu ishlatiladi — aks holda tartibda bo'shliq
 * qoladi (1, 2, 4) va keyingi daraja noto'g'ri joyga tushadi.
 */
export function toOrderPayload(rows: { id: string }[]): GroupLevelOrderPayload {
    return { levels: rows.map((row, index) => ({ id: row.id, orderNumber: index + 1 })) }
}
