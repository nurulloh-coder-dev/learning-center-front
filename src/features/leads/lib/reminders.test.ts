import { describe, expect, it } from 'vitest'
import type { LeadDto } from '@/shared/types'
import { dueReminders, reminderKey } from './reminders'

const NOW = new Date('2026-11-26T15:00:00')

function lead(id: string, callAt: string | undefined, status: LeadDto['status'] = 'CALL_LATER'): LeadDto {
    return { id, callAt, status, version: 0 }
}

describe('dueReminders', () => {
    it('vaqti kelgan va o’tgan lidlarni eng eskisidan boshlab qaytaradi', () => {
        const leads = [lead('b', '2026-11-26T14:30:00'), lead('a', '2026-11-26T09:00:00'), lead('c', '2026-11-26T15:00:00')]

        expect(dueReminders(leads, NOW, new Set()).map((item) => item.id)).toEqual(['a', 'b', 'c'])
    })

    it('vaqti hali kelmaganini, vaqtsizini va boshqa holatdagini qaytarmaydi', () => {
        const leads = [lead('soon', '2026-11-26T15:05:00'), lead('none', undefined), lead('done', '2026-11-26T10:00:00', 'ENROLLED')]

        expect(dueReminders(leads, NOW, new Set())).toEqual([])
    })

    it('yopilganini qayta ko’rsatmaydi, lekin yangi vaqt belgilansa yana chiqaradi', () => {
        const old = lead('a', '2026-11-26T10:00:00')
        const dismissed = new Set([reminderKey(old)])

        expect(dueReminders([old], NOW, dismissed)).toEqual([])
        expect(dueReminders([lead('a', '2026-11-26T14:00:00')], NOW, dismissed)).toHaveLength(1)
    })
})
