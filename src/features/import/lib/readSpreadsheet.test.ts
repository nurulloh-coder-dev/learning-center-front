import { describe, expect, it } from 'vitest'
import { cellToString, readSpreadsheet, SpreadsheetError, toTable } from './readSpreadsheet'

describe('toTable', () => {
    it('drops empty rows but keeps the original line numbers', () => {
        const table = toTable([['', ''], ['FIO', 'Tel'], ['', ''], ['Ali', '90']])
        expect(table.headers).toEqual(['FIO', 'Tel'])
        expect(table.rows).toEqual([{ line: 4, cells: ['Ali', '90'] }])
    })

    it('rejects a file without data rows', () => {
        expect(() => toTable([['FIO']])).toThrow(SpreadsheetError)
    })
})

describe('cellToString', () => {
    it('turns Excel dates into ISO dates without a timezone shift', () => {
        expect(cellToString(new Date(Date.UTC(2008, 2, 14)))).toBe('2008-03-14')
        expect(cellToString(998901234567)).toBe('998901234567')
        expect(cellToString(null)).toBe('')
    })
})

describe('readSpreadsheet', () => {
    it('reads a CSV file', async () => {
        const file = new File(['FIO;Tel\nAli;901234567'], 'list.csv')
        const table = await readSpreadsheet(file)
        expect(table.rows[0].cells).toEqual(['Ali', '901234567'])
    })

    it('rejects old .xls files', async () => {
        await expect(readSpreadsheet(new File([''], 'old.xls'))).rejects.toMatchObject({ code: 'unsupported' })
    })
})
