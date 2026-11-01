import { describe, expect, it } from 'vitest'
import { canEditProfile } from './canEditProfile'

describe('canEditProfile', () => {
    it('allows the super admin without explicit permissions', () => {
        expect(canEditProfile({ role: 'SUPER_ADMIN', permissions: [] })).toBe(true)
    })

    it('allows an administrator with EMPLOYEE_MANAGEMENT', () => {
        expect(canEditProfile({ role: 'ADMINISTRATOR', permissions: ['EMPLOYEE_MANAGEMENT'] })).toBe(true)
    })

    it('denies an administrator without EMPLOYEE_MANAGEMENT', () => {
        expect(canEditProfile({ role: 'ADMINISTRATOR', permissions: ['LEAD_MANAGEMENT'] })).toBe(false)
    })

    it('denies teachers and students', () => {
        expect(canEditProfile({ role: 'TEACHER', permissions: [] })).toBe(false)
        expect(canEditProfile({ role: 'STUDENT', permissions: [] })).toBe(false)
    })
})
