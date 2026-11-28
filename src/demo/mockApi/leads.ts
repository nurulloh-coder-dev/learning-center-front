import type { LeadDto, LeadStatus } from '@/shared/types'
import { db, json, nextId, noContent, page, type Row } from './state'

export function handleLeads(
    path: string,
    method: string,
    url: URL,
    body: Record<string, unknown>
): Response | null {
    if (path === '/leads' && method === 'GET') {
        const status = url.searchParams.get('status')
        const rows = status
            ? db.leads.filter((lead) => lead.status === status)
            : db.leads
        return page(rows as unknown as Row[], url)
    }
    if (path === '/leads' && method === 'POST') {
        const level = db.groupLevels.find((item) => item.id === String(body.preferredCourseId))
        const newLead: LeadDto = {
            id: nextId('ld'),
            fullName: String(body.fullName ?? ''),
            phone: String(body.phone ?? ''),
            status: 'NEW',
            source: body.source as LeadDto['source'],
            preferredCourse: level,
            createdAt: new Date().toISOString(),
            version: 0,
        }
        db.leads = [newLead, ...db.leads]
        return json(newLead)
    }
    if (path.startsWith('/leads/') && method === 'PUT') {
        const id = path.slice('/leads/'.length)
        const level = body.preferredCourseId
            ? db.groupLevels.find((item) => item.id === String(body.preferredCourseId))
            : undefined
        db.leads = db.leads.map((lead) => {
            if (lead.id !== id) return lead
            return {
                ...lead,
                fullName: body.fullName !== undefined ? String(body.fullName) : lead.fullName,
                phone: body.phone !== undefined ? String(body.phone) : lead.phone,
                status: (body.status as LeadStatus) ?? lead.status,
                source: body.source ? (body.source as LeadDto['source']) : lead.source,
                preferredCourse: level ?? lead.preferredCourse,
                callAt: body.callAt !== undefined ? String(body.callAt) : lead.callAt,
                updatedAt: new Date().toISOString(),
                version: lead.version + 1,
            }
        })
        const updated = db.leads.find((lead) => lead.id === id)
        return updated ? json(updated) : json({ message: 'Lead not found' }, 404)
    }
    // Backend endi id va `leadVersion` ni so'rovning o'zida oladi (yo'lda emas).
    // Uchala amal ham (`enroll`, `reject`, `callLater`) JSON tanada keladi.
    const action = path === '/leads/enroll' ? 'enroll' : path === '/leads/reject' ? 'reject' : path === '/leads/callLater' ? 'callLater' : null
    if (action) {
        const id = String(body.id ?? '')
        const sentVersion = Number(body.leadVersion)
        const lead = db.leads.find((item) => item.id === id)
        if (!lead) return json({ message: 'Lead not found' }, 404)
        if (lead.version !== sentVersion) return json({ message: 'Lead was changed by someone else' }, 409)
        const next: Partial<LeadDto> =
            action === 'enroll'
                ? { status: 'ENROLLED' }
                : action === 'reject'
                  ? { status: 'REJECTED' }
                  : { status: 'CALL_LATER', callAt: body.callAt === undefined ? undefined : String(body.callAt) }
        const updated: LeadDto = { ...lead, ...next, version: lead.version + 1, updatedAt: new Date().toISOString() }
        db.leads = db.leads.map((item) => (item.id === id ? updated : item))
        return json(updated)
    }
    if (path.startsWith('/leads/') && method === 'DELETE') {
        const id = path.slice('/leads/'.length)
        db.leads = db.leads.filter((lead) => lead.id !== id)
        return noContent()
    }
    return null
}
