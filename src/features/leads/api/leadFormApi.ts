import { ApiError, apiFetch } from '@/shared/api'
import type { LeadFormDto, LeadFormUpdateDto, PublicLeadFormDto, PublicLeadSubmitDto } from '@/shared/types'

const PUBLIC = '/public/lead-forms'
const MINE = '/lead-form'

/** Ochiq forma — tokensiz. Kalit yo'q yoki forma o'chiq bo'lsa backend 404 beradi. */
export function fetchPublicLeadForm(key: string) {
    return apiFetch<PublicLeadFormDto>(`${PUBLIC}/${encodeURIComponent(key)}`)
}

export function submitPublicLead(key: string, body: PublicLeadSubmitDto) {
    return apiFetch<void>(`${PUBLIC}/${encodeURIComponent(key)}/leads`, { method: 'POST', body })
}

/** 404 — markazda hali forma yaratilmagan; bu xato emas, `null`. */
export async function fetchLeadForm(token: string) {
    try {
        return await apiFetch<LeadFormDto>(MINE, { token })
    } catch (error) {
        if (error instanceof ApiError && error.status === 404) return null
        throw error
    }
}

export function createLeadForm(token: string) {
    return apiFetch<LeadFormDto>(MINE, { method: 'POST', token })
}

export function updateLeadForm(token: string, body: LeadFormUpdateDto) {
    return apiFetch<LeadFormDto>(MINE, { method: 'PUT', token, body })
}

export function regenerateLeadFormKey(token: string) {
    return apiFetch<LeadFormDto>(`${MINE}/regenerate`, { method: 'POST', token })
}
