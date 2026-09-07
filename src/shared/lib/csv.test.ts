import { describe, expect, it, vi } from 'vitest'
import { downloadCsv, generateCsvContent, sanitizeFilename } from './csv'

describe('sanitizeFilename', () => {
    it('normalizes invalid characters in filenames', () => {
        expect(sanitizeFilename('Group/1:A')).toBe('Group_1_A')
        expect(sanitizeFilename('   ')).toBe('file')
        expect(sanitizeFilename('Group 101')).toBe('Group 101')
    })
})

describe('generateCsvContent', () => {
    it('generates CSV with UTF-8 BOM and escapes quotes and commas', () => {
        const data = [
            ['Name', 'Status', 'Note'],
            ['Ali Valiyev', 'PRESENT', 'Good, normal'],
            ['Vali "Hero" Sodyqov', 'EXCUSED', 'Kasal / "Doctor" note'],
        ]
        const csv = generateCsvContent(data)

        // Starts with UTF-8 BOM
        expect(csv.startsWith('\uFEFF')).toBe(true)

        // Contains formatted rows
        expect(csv).toContain('Name,Status,Note')
        expect(csv).toContain('Ali Valiyev,PRESENT,"Good, normal"')
        expect(csv).toContain('"Vali ""Hero"" Sodyqov",EXCUSED,"Kasal / ""Doctor"" note"')
    })

    it('handles empty and null values gracefully', () => {
        const data = [['Header 1', 'Header 2'], [null, undefined], [123, true]]
        const csv = generateCsvContent(data)
        expect(csv).toBe('\uFEFFHeader 1,Header 2\n,\n123,true')
    })
})

describe('downloadCsv', () => {
    it('creates link element and triggers download', () => {
        const appendSpy = vi.spyOn(document.body, 'appendChild')
        const removeSpy = vi.spyOn(document.body, 'removeChild')
        const createObjectURLMock = vi.fn().mockReturnValue('blob:http://localhost/test-url')
        const revokeObjectURLMock = vi.fn()

        globalThis.URL.createObjectURL = createObjectURLMock
        globalThis.URL.revokeObjectURL = revokeObjectURLMock

        const clickMock = vi.fn()
        const createElementOriginal = document.createElement.bind(document)
        vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
            const el = createElementOriginal(tagName)
            if (tagName === 'a') {
                el.click = clickMock
            }
            return el
        })

        downloadCsv('test.csv', '\uFEFFcol1,col2\nval1,val2')

        expect(createObjectURLMock).toHaveBeenCalled()
        expect(appendSpy).toHaveBeenCalled()
        expect(clickMock).toHaveBeenCalled()
        expect(removeSpy).toHaveBeenCalled()
        expect(revokeObjectURLMock).toHaveBeenCalledWith('blob:http://localhost/test-url')
    })
})
