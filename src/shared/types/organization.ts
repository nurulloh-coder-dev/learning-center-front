/** `OrganizationDto` — o'quv markazi (tashkilot) darajasi. */
export interface OrganizationDto {
    id: string
    name?: string
    email?: string
    phone?: string
    website?: string
    /**
     * Tashkilotda super admin bormi. Backendga so'ralgan (2026-11-08) —
     * kelmaguncha `undefined`, va "Super-admin qo'shish" tugmasi ko'rinadi.
     */
    hasSuperAdmin?: boolean
}

/**
 * `BranchDto` — filial.
 *
 * Diqqat: DTO'da `organization` YO'Q (backendda izohga olingan), shuning
 * uchun filial qaysi tashkilotga tegishli ekanini ro'yxatdan bilib
 * bo'lmaydi. `email`/`phone` ham entity'da bor, lekin DTO'ga chiqmagan.
 * Oylik to'lov (`chargeForMonth`) endi bu yerda yo'q — u `Level`ga ko'chdi.
 */
export interface BranchDto {
    id: string
    name?: string
    address?: string
    googlePlaceId?: string
    latitude?: number
    longitude?: number
    googleMapsUrl?: string
}

/** `PUT /branch/{id}` tanasi — `BranchDto` dan `id` va `organization` siz. */
export interface BranchUpdatePayload {
    name?: string
    address?: string
    googlePlaceId?: string
    latitude?: number
    longitude?: number
    googleMapsUrl?: string
}
