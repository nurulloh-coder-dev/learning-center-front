import { describe, expect, it } from 'vitest'
import { FALLBACK_HOME, roleHome } from './roleHome'

describe('roleHome', () => {
    it('har rolga o‘z manzili', () => {
        expect(roleHome('ADMINISTRATOR')).toBe('/admin')
        expect(roleHome('TEACHER')).toBe('/teacher')
        expect(roleHome('STUDENT')).toBe('/student')
        expect(roleHome('SUPER_ADMIN')).toBe('/super-admin')
        expect(roleHome('DEVELOPER')).toBe('/developer')
    })

    it('noma‘lum rol zaxira manzilga tushadi', () => {
        expect(roleHome('ACCOUNTANT')).toBe(FALLBACK_HOME)
    })
})
