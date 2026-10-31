/**
 * Administrator ruxsatlari — faqat `ADMINISTRATOR` rolida ma'noga ega.
 * `SUPER_ADMIN` da bu ro'yxat umuman kelmaydi (unga cheklov yo'q).
 */
export const ADMIN_PERMISSIONS = [
    'LEAD_MANAGEMENT',
    'EMPLOYEE_MANAGEMENT',
    'TEACHER_MANAGEMENT',
    'STUDENT_MANAGEMENT',
    'INVOICE_MANAGEMENT',
    'GROUP_MANAGEMENT',
] as const
export type AdminPermission = (typeof ADMIN_PERMISSIONS)[number]

/**
 * JWT ichidagi claim'lar. `role` ataylab oddiy string: backend yangi rol
 * qo'shsa build yiqilmasligi, balki App'dagi `default` shoxiga tushishi kerak.
 */
export interface JwtClaims {
    role?: string
    permissions?: AdminPermission[]
    /**
     * Kirilgan markaz. Bitta odam bir nechta markazga a'zo bo'lishi mumkin,
     * shuning uchun bu "qaysi markazga kirdi" degani — `userId` kabi qat'iy
     * emas, har kirishda o'zgarishi mumkin.
     */
    organizationId?: string
    [claim: string]: unknown
}

/** Tizimga kirgan foydalanuvchi sessiyasi. */
export interface Session {
    token: string
    role: string
    claims: JwtClaims
    /** Faqat `ADMINISTRATOR` uchun ma'noli; boshqa rollarda bo'sh massiv. */
    permissions: AdminPermission[]
}

/**
 * `POST /auth/login` va `/auth/refresh-token` javobi.
 *
 * Refresh token javob TANASIDA kelmaydi — backend uni httpOnly
 * `refresh_token` cookie'siga yozadi (`AuthService.setRefreshCookie`).
 */
export interface AuthResponse {
    /**
     * Bir nechta markazda o'qiydigan o'quvchida birinchi javob TOKENSIZ
     * keladi — avval tashkilot tanlanishi kerak.
     */
    token?: string | null
    expiry?: string
    /** `true` bo'lsa `organizations` dan bittasi tanlanib, ikkinchi bosqich chaqiriladi. */
    requiresOrganizationSelection?: boolean
    organizations?: OrganizationViewDto[] | null
}

/**
 * Kirish paytida tanlanadigan a'zolik.
 *
 * `role` shu markazdagi rol: bitta odam bir joyda o'qituvchi, boshqasida
 * o'quvchi bo'lishi mumkin, shuning uchun u markaz bilan birga keladi.
 */
export interface OrganizationViewDto {
    id: string
    name: string
    role?: Role
}

export interface LoginCredentials {
    phone: string
    password: string
    rememberMe: boolean
}

export type Role = 'DEVELOPER' | 'SUPER_ADMIN' | 'ADMINISTRATOR' | 'TEACHER' | 'STUDENT'
