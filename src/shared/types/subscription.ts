/**
 * Obuna (subscription) — o'quv markazining tizimdan foydalanish huquqi.
 *
 * To'lov QO'LDA qabul qilinadi (bank o'tkazmasi), keyin dasturchi obunani
 * qo'lda faollashtiradi. Shuning uchun bu yerda to'lov tizimi yo'q —
 * faqat "kim, qaysi tarifda, qachongacha" degan yozuv.
 */

/** Tarifdagi cheklovlar kaliti — backenddagi `FeatureKey`. */
export const FEATURE_KEYS = [
    'MAX_STUDENTS',
    'MAX_TEACHERS',
    'MAX_GROUPS',
    'MAX_BRANCHES',
    'MAX_USERS',
] as const
export type FeatureKey = (typeof FEATURE_KEYS)[number]

export const SUBSCRIPTION_STATUSES = ['ACTIVE', 'GRACE', 'EXPIRED', 'CANCELED'] as const
/**
 * `GRACE` — muddat tugagan, lekin o'tkazma tasdiqlanguncha kirishga ruxsat
 * beriladi. Ya'ni bu "xato" emas, ataylab qo'yilgan yumshoq holat.
 */
export type SubscriptionStatus = (typeof SUBSCRIPTION_STATUSES)[number]

/** Tarif: START, STANDARD, PRO … */
export interface PlanDto {
    id: string
    code: string
    name: string
    description?: string
    price: number
    currency: string
    durationMonths: number
    active?: boolean
    sortOrder?: number
    limits?: Partial<Record<FeatureKey, number>>
}

export interface PlanPayload {
    code: string
    name: string
    description?: string
    price: number
    currency: string
    durationMonths: number
    sortOrder?: number
    /** Faqat tahrirlashda: `PlanUpdateDto` da `@NotNull`, yaratishda yo'q. */
    active?: boolean
    limits: Partial<Record<FeatureKey, number>>
}

export interface SubscriptionDto {
    id: string
    organization?: { id: string; name: string }
    plan?: { id: string; name: string }
    status?: SubscriptionStatus
    /** `Instant` — ISO-8601 satr. */
    startsAt?: string
    expiresAt?: string
    /**
     * Haqiqatan to'langan summa. Tarif narxi keyin o'zgarishi mumkin,
     * shuning uchun u obunaning o'zida saqlanadi.
     */
    paidAmount?: number
    currency?: string
    activatedByUserId?: string
    note?: string
}

/**
 * `POST /subscriptions` — `SubscriptionCreateDto` (backend `0f63169`).
 * Tugash sanasi va summa endi frontda hisoblanadi (`developer/lib/subscriptionTerm.ts`).
 */
export interface SubscriptionCreatePayload {
    organizationId: string
    planId: string
    note?: string
    /** `YYYY-MM-DD`, majburiy. */
    expiryDate: string
    /** Musbat bo'lishi shart (`@Positive`); bo'sh bo'lsa yuborilmaydi. */
    paidAmount?: number
}

export interface SubscriptionUpdatePayload {
    status: SubscriptionStatus
    note?: string
}
