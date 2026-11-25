import type { LeadDto } from '@/shared/types'

/** Yopilgan eslatmalar shu brauzerda saqlanadi — sahifa yangilansa qayta chiqmasin. */
const STORAGE_KEY = 'alia-lead-reminders-dismissed'
const MAX_STORED = 300

/**
 * Bitta eslatmaning kaliti: lid + qo'ng'iroq vaqti. Lidga yangi vaqt
 * belgilansa kalit o'zgaradi va eslatma yana chiqadi.
 */
export function reminderKey(lead: Pick<LeadDto, 'id' | 'callAt'>): string {
    return `${lead.id}@${lead.callAt ?? ''}`
}

/**
 * Qo'ng'iroq vaqti kelgan (yoki o'tib ketgan) va hali yopilmagan lidlar,
 * eng eskisi birinchi. `callAt` backenddan mintaqasiz `LocalDateTime` bo'lib
 * keladi — brauzerning mahalliy vaqti sifatida o'qiladi (markaz va xodim
 * bitta mintaqada).
 */
export function dueReminders(leads: LeadDto[], now: Date, dismissed: ReadonlySet<string>): LeadDto[] {
    return leads
        .filter((lead) => lead.status === 'CALL_LATER' && lead.callAt)
        .filter((lead) => new Date(lead.callAt!).getTime() <= now.getTime())
        .filter((lead) => !dismissed.has(reminderKey(lead)))
        .sort((a, b) => new Date(a.callAt!).getTime() - new Date(b.callAt!).getTime())
}

export function readDismissedReminders(): Set<string> {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        const parsed: unknown = raw ? JSON.parse(raw) : []
        return new Set(Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : [])
    } catch {
        return new Set()
    }
}

export function writeDismissedReminders(keys: ReadonlySet<string>): void {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...keys].slice(-MAX_STORED)))
    } catch {
        // Xotira yopiq (maxfiy oyna) — eslatma faqat shu sahifa davomida yopiladi.
    }
}
