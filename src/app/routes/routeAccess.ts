import type { Session } from '@/shared/types'

/**
 * `/payments` ga kira oladigan rollar.
 *
 * O'qituvchi YO'Q: backendda `InvoiceController` `INVOICE_MANAGEMENT`
 * ruxsatini talab qiladi, o'qituvchida esa ruxsatlar yo'q — ilgari u
 * sahifani ochib, faqat "Forbidden" xatolarini ko'rardi. Menyuda ham
 * o'qituvchiga bu havola berilmaydi (`AppNavigation`).
 */
export const PAYMENTS_ROLES = ['ADMINISTRATOR', 'SUPER_ADMIN'] as const

/**
 * Lidlar bilan ishlay oladimi (sahifa va qo'ng'iroq eslatmasi uchun):
 * super admin — doim, administrator — `LEAD_MANAGEMENT` ruxsati bo'lsa.
 * `/leads` marshrutidagi `RequireRole` + `RequirePermission` bilan bir xil.
 */
export function canManageLeads(session: Pick<Session, 'role' | 'permissions'>): boolean {
    if (session.role === 'SUPER_ADMIN') return true
    return session.role === 'ADMINISTRATOR' && session.permissions.includes('LEAD_MANAGEMENT')
}

