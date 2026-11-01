import type { Session } from '@/shared/types'

/**
 * Profilni (`PUT /user/{id}`) saqlay oladimi.
 *
 * Backend qarori (Nurulloh, 2026-11-01): profilni faqat markaz xodimlarini
 * boshqaradigan odam o'zgartiradi — endpoint `EMPLOYEE_MANAGEMENT` talab
 * qiladi, o'qituvchi yoki o'quvchi o'zinikini ham tahrirlay olmaydi.
 * Forma ochiq qolsa, ular saqlashda faqat 403 ko'rardi.
 * `SUPER_ADMIN` yaratilganda barcha ruxsatlarni oladi, lekin JWT da
 * `permissions` kelmasligi mumkin — shuning uchun roli bo'yicha ruxsat.
 */
export function canEditProfile(session: Pick<Session, 'role' | 'permissions'>): boolean {
    if (session.role === 'SUPER_ADMIN') return true
    return session.role === 'ADMINISTRATOR' && session.permissions.includes('EMPLOYEE_MANAGEMENT')
}
