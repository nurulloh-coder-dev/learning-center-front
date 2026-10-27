import type { Role } from '@/shared/types'

/**
 * Har rolning bosh sahifasi.
 *
 * `/` landing'niki (bir domen: alia.uz), shuning uchun panel o'z manzilida
 * turadi. Yangi rol qo'shilsa — shu ro'yxatga va `Caddyfile` dagi ilova
 * yo'llariga ham qo'shiladi, aks holda sahifa yangilanganda landing'ga tushadi.
 */
const HOME: Record<Role, string> = {
    SUPER_ADMIN: '/super-admin',
    ADMINISTRATOR: '/admin',
    TEACHER: '/teacher',
    STUDENT: '/student',
    DEVELOPER: '/developer',
}

// Noma'lum rol ham qayergadir tushishi kerak — "kutilmoqda" ekrani shu yerda.
export const FALLBACK_HOME = '/dashboard'

export function roleHome(role: string): string {
    return HOME[role as Role] ?? FALLBACK_HOME
}

/**
 * Boshqa rollarning bosh sahifalari. Odam bir akkauntdan chiqib boshqasiga
 * kirsa, manzil eskisicha qoladi (masalan `/developer`) — bu yo'llar 404
 * emas, o'z paneliga yo'naltirishi kerak.
 */
export function otherRoleHomes(role: string): string[] {
    const own = roleHome(role)
    return [...Object.values(HOME), FALLBACK_HOME].filter((path) => path !== own)
}
