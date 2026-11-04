import { describe, expect, it } from 'vitest'
import { autoMatchColumns, freeColumns, normalizeHeader } from './columnMatch'
import { IMPORT_FIELDS } from './importFields'

const students = IMPORT_FIELDS.students

describe('normalizeHeader', () => {
    it('ignores case, spaces and apostrophe variants', () => {
        expect(normalizeHeader(" Tug‘ilgan  sana ")).toBe(normalizeHeader("tug'ilgan sana"))
        expect(normalizeHeader('Ф.И.О.')).toBe('фио')
    })
})

describe('autoMatchColumns', () => {
    it('matches common uz/ru/en headers', () => {
        const mapping = autoMatchColumns(['FIO', 'Tel', 'Дата рождения', 'Parent phone'], students)
        expect(mapping).toEqual({ fullName: 0, phone: 1, birthDate: 2, parentPhone: 3 })
    })

    it('gives the parent phone column to parentPhone, not to phone', () => {
        const mapping = autoMatchColumns(['Телефон родителя', 'Телефон', 'Имя'], students)
        expect(mapping.phone).toBe(1)
        expect(mapping.parentPhone).toBe(0)
        expect(mapping.fullName).toBe(2)
    })

    it('never uses one column for two fields and leaves unknown fields empty', () => {
        const mapping = autoMatchColumns(['Telefon', 'Izoh'], students)
        expect(mapping).toEqual({ phone: 0, fullName: null, birthDate: null, parentPhone: null })
    })

    it('prefers a remembered manual choice', () => {
        const mapping = autoMatchColumns(['Kontakt', 'Ism'], students, { kontakt: 'phone' })
        expect(mapping.phone).toBe(0)
        expect(mapping.fullName).toBe(1)
    })
})

describe('freeColumns', () => {
    it('lists unused columns plus the current one', () => {
        expect(freeColumns(4, { fullName: 0, phone: 2 }, 2)).toEqual([1, 2, 3])
    })
})
