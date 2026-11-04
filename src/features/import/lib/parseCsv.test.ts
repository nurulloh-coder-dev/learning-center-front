import { describe, expect, it } from 'vitest'
import { parseCsv } from './parseCsv'

describe('parseCsv', () => {
    it('detects the semicolon delimiter Excel uses in uz/ru locales', () => {
        expect(parseCsv('FIO;Tel\r\nAli Valiyev;901234567\r\n')).toEqual([
            ['FIO', 'Tel'],
            ['Ali Valiyev', '901234567'],
        ])
    })

    it('keeps delimiters and quotes inside quoted cells', () => {
        expect(parseCsv('\uFEFFname,note\n"Valiyev, Ali","say ""hi"""')).toEqual([
            ['name', 'note'],
            ['Valiyev, Ali', 'say "hi"'],
        ])
    })
})
