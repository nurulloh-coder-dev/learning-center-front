import { describe, expect, it } from 'vitest'
import { isValidPhone, normalizePhone } from './phone'

describe('normalizePhone', () => {
    it('bo‘shliq, chiziqcha va qavslarni olib tashlaydi', () => {
        expect(normalizePhone(' +998 90 123-45-67 ')).toBe('+998901234567')
        expect(normalizePhone('(90) 123 45 67')).toBe('901234567')
    })
})

describe('isValidPhone', () => {
    it('bo‘shliqli yozuvni ham qabul qiladi', () => {
        expect(isValidPhone('+998 90 123 45 67')).toBe(true)
    })

    it('bo‘sh yoki juda qisqa raqamni rad etadi', () => {
        expect(isValidPhone('')).toBe(false)
        expect(isValidPhone('+9')).toBe(false)
    })

    it('nol bilan boshlangan raqamni rad etadi', () => {
        expect(isValidPhone('+0998901234567')).toBe(false)
    })
})
