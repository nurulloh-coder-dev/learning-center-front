import type { LeadDto, LeadFormDto, LeadFormUpdateDto, PublicLeadFormDto } from '@/shared/types'
import { db, json, nextId, noContent } from './state'

/** Demo: markazda forma allaqachon bor — "Havola yaratish" holatini ko'rish uchun `null` qiling. */
let form: LeadFormDto | null = {
    key: 'demo-cornerstone',
    enabled: true,
    title: null,
    description: null,
    courseRequired: false,
    hiddenLevelIds: [],
}

function randomKey() {
    return Math.random().toString(36).slice(2, 12)
}

function publicView(current: LeadFormDto): PublicLeadFormDto {
    return {
        organizationName: 'Cornerstone Education',
        logoUrl: null,
        title: current.title,
        description: current.description,
        courseRequired: current.courseRequired,
        levels: db.groupLevels
            .filter((level) => !current.hiddenLevelIds.includes(level.id))
            .map((level) => ({ id: level.id, name: level.name ?? level.id })),
    }
}

export function handleLeadForm(path: string, method: string, body: Record<string, unknown>): Response | null {
    if (path.startsWith('/public/lead-forms/')) {
        const [key, tail] = path.slice('/public/lead-forms/'.length).split('/')
        if (!form || !form.enabled || decodeURIComponent(key) !== form.key) return json({ message: 'Form not found' }, 404)
        if (!tail && method === 'GET') return json(publicView(form))
        if (tail === 'leads' && method === 'POST') {
            // Honeypot: bot to'ldirgan bo'lsa — "muvaffaqiyat", lekin saqlanmaydi.
            if (body.website) return noContent()
            const level = db.groupLevels.find((item) => item.id === String(body.preferredCourseId))
            const lead: LeadDto = {
                id: nextId('ld'),
                fullName: String(body.fullName ?? ''),
                phone: String(body.phone ?? ''),
                status: 'NEW',
                source: body.source as LeadDto['source'],
                preferredCourse: level,
                createdAt: new Date().toISOString(),
            }
            db.leads = [lead, ...db.leads]
            return noContent()
        }
        return null
    }
    if (path === '/lead-form' && method === 'GET') return form ? json(form) : json({ message: 'Not found' }, 404)
    if (path === '/lead-form' && method === 'POST') {
        form = form ?? { key: randomKey(), enabled: true, title: null, description: null, courseRequired: false, hiddenLevelIds: [] }
        return json(form)
    }
    if (path === '/lead-form' && method === 'PUT' && form) {
        form = { ...form, ...(body as unknown as LeadFormUpdateDto) }
        return json(form)
    }
    if (path === '/lead-form/regenerate' && method === 'POST' && form) {
        form = { ...form, key: randomKey() }
        return json(form)
    }
    return null
}
