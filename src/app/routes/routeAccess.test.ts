import { describe, expect, it } from 'vitest'
import { canManageLeads } from './routeAccess'

describe('canManageLeads', () => {
    it('super admin doim lidlar bilan ishlaydi', () => {
        expect(canManageLeads({ role: 'SUPER_ADMIN', permissions: [] })).toBe(true)
    })

    it('administrator faqat LEAD_MANAGEMENT ruxsati bilan', () => {
        expect(canManageLeads({ role: 'ADMINISTRATOR', permissions: ['LEAD_MANAGEMENT'] })).toBe(true)
        expect(canManageLeads({ role: 'ADMINISTRATOR', permissions: ['STUDENT_MANAGEMENT'] })).toBe(false)
    })

    it('o’qituvchi va o’quvchi eslatma olmaydi', () => {
        expect(canManageLeads({ role: 'TEACHER', permissions: [] })).toBe(false)
        expect(canManageLeads({ role: 'STUDENT', permissions: [] })).toBe(false)
    })
})
