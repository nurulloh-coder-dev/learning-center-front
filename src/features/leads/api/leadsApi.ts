import { apiFetch } from '@/shared/api'
import type { GroupOverviewDto, GroupLevelNameDto, LeadCreateDto, LeadDto, LeadRejectDto, LeadStatus, LeadUpdateDto, Page } from '@/shared/types'

const ENDPOINT = '/leads'

export async function fetchGroupOptions(token: string) {
    const data = await apiFetch<Page<GroupOverviewDto>>('/group', { token, params: { page: 0, size: 200 } })
    return (data?.content ?? []).map((group) => ({ value: group.id, label: group.name || group.id }))
}

export async function fetchLeadCourseOptions(token: string) {
    const data = await apiFetch<GroupLevelNameDto[]>('/group-level/names', { token })
    return (data ?? []).map((level) => ({ value: level.id, label: level.name || level.id }))
}

export interface LeadListParams {
    page: number
    size: number
    search?: string
    status?: LeadStatus | ''
    [param: string]: string | number | undefined
}

export function fetchLeads(token: string, params: LeadListParams) {
    return apiFetch<Page<LeadDto>>(ENDPOINT, { token, params })
}

export function createLead(token: string, body: LeadCreateDto) {
    return apiFetch<LeadDto>(ENDPOINT, { method: 'POST', token, body })
}

export function updateLead(token: string, id: string, body: LeadUpdateDto) {
    return apiFetch<LeadDto>(`${ENDPOINT}/${id}`, { method: 'PUT', token, body })
}

/**
 * Backend `enroll(EnrolledLeadDto)` da `@RequestBody` yo'q — maydonlar
 * so'rov parametri bo'lib ketadi, JSON tana o'qilmaydi. Backend tanaga
 * o'tkazilsa shu yerni o'zgartiramiz.
 */
export function enrollLead(token: string, id: string, version: number, groupId: string) {
    return apiFetch<LeadDto>(`${ENDPOINT}/enroll`, { method: 'POST', token, params: { id, groupId, leadVersion: version } })
}

export function rejectLead(token: string, id: string, version: number, body: LeadRejectDto) {
    return apiFetch<LeadDto>(`${ENDPOINT}/reject`, { method: 'POST', token, body: { id, leadVersion: version, ...body } })
}

export function callLaterLead(token: string, id: string, version: number, callAt: string) {
    return apiFetch<LeadDto>(`${ENDPOINT}/callLater`, { method: 'PATCH', token, body: { id, leadVersion: version, callAt } })
}

export function deleteLead(token: string, id: string) {
    return apiFetch<void>(`${ENDPOINT}/${id}`, { method: 'DELETE', token })
}
