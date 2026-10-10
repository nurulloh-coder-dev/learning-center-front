import { apiFetch } from '@/shared/api'
import type {
    AnalyticsCategory,
    AnalyticsStatDto,
    BranchDto,
    LeadDto,
    LeadStatus,
    OrganizationDto,
    Page,
    SubscriptionDto,
    TransactionDto,
    UserCreatePayload,
    UserCreatedResponseDto,
    UserDto,
} from '@/shared/types'

// Backend yo'lni ko'plikdan birlikka o'zgartirdi (2026-09-11, `login apis fixes`).
const ORGANIZATIONS = '/organization'
const BRANCHES = '/branch'
const ANALYTICS = '/analytics'

export interface ListParams {
    page: number
    size: number
    search?: string
    [param: string]: string | number | undefined
}

// --- tashkilotlar ---

export function fetchOrganizations(token: string, params: ListParams) {
    return apiFetch<Page<OrganizationDto>>(ORGANIZATIONS, { token, params })
}

export interface OrganizationPayload {
    name: string
    email?: string
    phone?: string
    website?: string
}

export function createOrganization(token: string, body: OrganizationPayload) {
    return apiFetch<OrganizationDto>(ORGANIZATIONS, { method: 'POST', token, body })
}

export function updateOrganization(token: string, id: string, body: OrganizationPayload) {
    return apiFetch<OrganizationDto>(`${ORGANIZATIONS}/${id}`, { method: 'PUT', token, body })
}

// Tashkilotni o'chirish ATAYLAB yo'q: backendda `OrganizationService.delete`
// bo'sh metod, lekin controller 204 qaytaradi. Tugma qo'ysak, foydalanuvchi
// "o'chdi" deb o'ylaydi va sahifa yangilanganda yozuv joyida turaveradi.
// `docs/backend-api-request.md` ga qarang.

// --- filiallar ---

export function fetchBranches(token: string, params: ListParams) {
    return apiFetch<Page<BranchDto>>(BRANCHES, { token, params })
}

export interface BranchPayload {
    name: string
    address?: string
    /** Faqat yaratishda: qaysi tashkilotga tegishli. */
    organizationId?: string
    /** Administrator nusxalab qo'ygan Google Maps havolasi. */
    googleMapsUrl?: string
    latitude?: number
    longitude?: number
    googlePlaceId?: string
}

export function createBranch(token: string, body: BranchPayload) {
    return apiFetch<BranchDto>(BRANCHES, { method: 'POST', token, body })
}

export function updateBranch(token: string, id: string, body: Omit<BranchPayload, 'organizationId'>) {
    return apiFetch<BranchDto>(`${BRANCHES}/${id}`, { method: 'PUT', token, body })
}

export function deleteBranch(token: string, id: string) {
    return apiFetch(`${BRANCHES}/${id}`, { method: 'DELETE', token })
}

// --- analytics ---

export function fetchAnalytics(token: string, category: AnalyticsCategory) {
    return apiFetch<AnalyticsStatDto>(`${ANALYTICS}/${category}`, { token })
}

export function fetchInvoiceAnalyticsRange(token: string, from: string, to: string) {
    return apiFetch<AnalyticsStatDto>(`${ANALYTICS}/invoice`, {
        token,
        params: { from, to },
    })
}

/**
 * Markazning o'z obunasi.
 *
 * `GET /subscriptions/my` — ADMINISTRATOR va SUPER_ADMIN uchun. Bu yerda
 * tashkilot id'si yuborilmaydi: backend tokendan o'zi oladi, ya'ni
 * boshqa markazning obunasini so'rab bo'lmaydi.
 */
export function fetchMySubscription(token: string) {
    return apiFetch<SubscriptionDto>('/subscriptions/my', { token })
}

// --- user / admin count ---

// Backend administratorlar ro'yxatini `/user` dan `/user/admins` ga
// ko'chirdi (2026-09-27) — endi `role` filtrisiz, o'zi faqat adminlarni
// qaytaradi (`docs/backend-notes.md`).
export async function fetchAdminCount(token: string): Promise<number> {
    const data = await apiFetch<Page<UserDto>>('/user/admins', {
        token,
        params: { page: 0, size: 1 },
    })
    return data?.totalElements ?? 0
}

// --- odamlar ---

/** Sidebardagi odamlar bo'limlari. Har biri o'z endpointidan keladi. */
export type PeopleKind = 'students' | 'teachers' | 'administrators'

const PEOPLE_ENDPOINT: Record<PeopleKind, string> = {
    students: '/student',
    teachers: '/teacher',
    administrators: '/user/admins',
}

export interface PersonRow {
    id: string
    userDto?: UserDto
    parentPhone?: string
}

/**
 * Bo'lim bo'yicha odamlar ro'yxati.
 *
 * `/user/admins` allaqachon faqat administratorlarni qaytaradi, `role`
 * filtri kerak emas. `/student` va `/teacher` esa o'z turini biladi.
 *
 * `/user/admins` qatorlari YASSI (`UserDto` ning o'zi), `/student` va
 * `/teacher` esa ichma-ich `userDto` bilan keladi — shuning uchun bitta
 * shaklga keltiriladi, jadval ikki xil ko'rinishni bilmasin.
 */
export async function fetchPeople(
    token: string,
    kind: PeopleKind,
    params: ListParams
): Promise<Page<PersonRow>> {
    const data = await apiFetch<Page<PersonRow & UserDto>>(PEOPLE_ENDPOINT[kind], {
        token,
        params,
    })

    return {
        content: (data?.content ?? []).map((row) =>
            kind === 'administrators' ? { id: row.id ?? '', userDto: row } : row
        ),
        totalPages: data?.totalPages ?? 0,
        totalElements: data?.totalElements ?? 0,
    }
}

/** Super-admin o'z tashkilotini tahrirlaydi. */
export function updateOwnOrganization(token: string, id: string, body: OrganizationPayload) {
    return apiFetch<OrganizationDto>(`${ORGANIZATIONS}/${id}`, { method: 'PUT', token, body })
}

/**
 * Yangi administrator.
 *
 * `UserController.create` — class darajasidagi rol tekshiruvidan tashqari
 * o'zining `hasRole('SUPER_ADMIN') or hasAuthority('EMPLOYEE_MANAGEMENT')`
 * qoidasi ham bor; super-admin panelidan chaqirilgani uchun har doim o'tadi.
 * Telefon allaqachon tizimda bo'lsa, backend uni shu tashkilotga
 * administrator sifatida biriktiradi (yangi parol yaratmaydi) — o'quvchi va
 * o'qituvchidagi "mavjud odam" oqimi bilan bir xil mexanizm.
 */
export function createAdmin(token: string, body: UserCreatePayload) {
    return apiFetch<UserCreatedResponseDto>('/user', { method: 'POST', token, body })
}

// --- dashboard: lidlar voronkasi va so'nggi to'lovlar ---

/** Holat bo'yicha lidlar soni — sahifaning o'zi kerak emas, faqat `totalElements`. */
export async function fetchLeadCount(token: string, status: LeadStatus) {
    const data = await apiFetch<Page<LeadDto>>('/leads', { token, params: { status, page: 0, size: 1 } })
    return data?.totalElements ?? 0
}

export async function fetchTransactionCount(token: string) {
    const data = await apiFetch<{ count?: number }>('/transaction/count', { token })
    return data?.count ?? 0
}

export async function fetchTransactionPage(token: string, page: number, size: number) {
    const data = await apiFetch<Page<TransactionDto>>('/transaction', { token, params: { page, size } })
    return data?.content ?? []
}
