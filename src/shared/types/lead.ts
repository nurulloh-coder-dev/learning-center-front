export const LEAD_STATUSES = ['NEW', 'ENROLLED', 'REJECTED', 'CALL_LATER'] as const
export type LeadStatus = (typeof LEAD_STATUSES)[number]

export const REJECTION_REASONS = ['PRICE_TOO_HIGH', 'SCHEDULE_CONFLICT', 'LOCATION_FAR', 'CHOSE_COMPETITOR', 'UNRESPONSIVE', 'NOT_INTERESTED', 'OTHER'] as const
export type RejectionReason = (typeof REJECTION_REASONS)[number]

export const LEAD_SOURCES = ['INSTAGRAM', 'FACEBOOK', 'TELEGRAM'] as const
/**
 * `WEBSITE` — ochiq lid formasidan kelgan lid. Qo'lda tanlanadigan
 * ro'yxatda (`LEAD_SOURCES`) yo'q: uni faqat forma qo'yadi.
 */
export type LeadSource = (typeof LEAD_SOURCES)[number] | 'WEBSITE'

/**
 * `LeadDto` — potentsial o'quvchi (lid).
 *
 * Backend `GroupLevel` enum'ini jadvalga aylantirdi. O'quvchining qiziqishi
 * ro'yxatdan kelgan obyekt bo'lib, lekin yaratish/yangilash uchun faqat uning
 * `id` yuboriladi.
 */
export interface LeadCourse {
    id: string
    name: string
    orderNumber: number
    lessonCount: number
    durationInMonths: number
}

export type LeadRejectReason = RejectionReason

export interface LeadDto {
    id: string
    fullName?: string
    phone?: string
    /** `LocalDateTime` — qo'ng'iroq qilish rejalashtirilgan vaqt. */
    callAt?: string
    status?: LeadStatus
    source?: LeadSource
    preferredCourse?: LeadCourse
    createdAt?: string
    updatedAt?: string
}

/** `POST /leads` va tasdiqlangan `PUT /leads/{id}` maydonlari. */
export interface LeadCreateDto {
    fullName: string
    phone: string
    source?: LeadSource
    /** Backend `LeadCreateDto.preferredCourseId` — nomi aynan shunday, aks holda kurs yetib bormaydi. */
    preferredCourseId?: string
}

export interface LeadUpdateDto {
    fullName?: string
    phone?: string
    status: LeadStatus
    source?: LeadSource
    preferredCourseId?: string
    callAt?: string
}

export interface LeadRejectDto {
    reason: LeadRejectReason
    note?: string
}
