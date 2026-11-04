import { describe, expect, it } from 'vitest'
import { IMPORT_FIELDS } from './importFields'
import { prepareRows, toImportPhone, toIsoDate } from './prepareRows'

describe('toImportPhone', () => {
    it('adds the Uzbek code to local and code-without-plus numbers', () => {
        expect(toImportPhone('90 123 45 67')).toBe('+998901234567')
        expect(toImportPhone('998901234567')).toBe('+998901234567')
        expect(toImportPhone('+998 (90) 123-45-67')).toBe('+998901234567')
        expect(toImportPhone('  ')).toBe('')
    })
})

describe('toIsoDate', () => {
    it('accepts ISO, dotted and Excel serial dates', () => {
        expect(toIsoDate('2008-03-14')).toBe('2008-03-14')
        expect(toIsoDate('14.03.2008')).toBe('2008-03-14')
        expect(toIsoDate('39521')).toBe('2008-03-14')
    })

    it('rejects impossible dates', () => {
        expect(toIsoDate('31.02.2008')).toBeNull()
        expect(toIsoDate('kecha')).toBeNull()
    })
})

describe('prepareRows', () => {
    const mapping = { fullName: 0, phone: 1, birthDate: 2, parentPhone: 3 }

    it('blocks rows without a name or with a bad phone', () => {
        const [noName, badPhone] = prepareRows(
            [
                { line: 2, cells: ['', '901234567', '', ''] },
                { line: 3, cells: ['Ali', '12', '', ''] },
            ],
            mapping,
            IMPORT_FIELDS.students
        )
        expect(noName.errors).toEqual(['missingFullName'])
        expect(badPhone.errors).toEqual(['invalidPhone'])
    })

    it('sends a bad optional field as null with a warning', () => {
        const [row] = prepareRows(
            [{ line: 5, cells: ['Ali  Valiyev', '901234567', 'ertaga', 'yo‘q'] }],
            mapping,
            IMPORT_FIELDS.students
        )
        expect(row.errors).toEqual([])
        expect(row.warnings).toEqual(['invalidBirthDate', 'invalidParentPhone'])
        expect(row.values).toEqual({
            fullName: 'Ali Valiyev',
            phone: '+998901234567',
            birthDate: null,
            parentPhone: null,
        })
    })

    it('leaves unmapped optional fields null', () => {
        const [row] = prepareRows([{ line: 2, cells: ['Ali', '901234567'] }], { fullName: 0, phone: 1 }, IMPORT_FIELDS.teachers)
        expect(row.values.birthDate).toBeNull()
        expect(row.values.parentPhone).toBeNull()
        expect(row.warnings).toEqual([])
    })
})
