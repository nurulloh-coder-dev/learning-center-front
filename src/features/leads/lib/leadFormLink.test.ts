import { describe, expect, it } from 'vitest'
import { buildLeadFormLink, sourceFromParam } from './leadFormLink'

describe('leadFormLink', () => {
    it('maps ?src= to a lead source, defaulting to WEBSITE', () => {
        expect(sourceFromParam('instagram')).toBe('INSTAGRAM')
        expect(sourceFromParam(' Telegram ')).toBe('TELEGRAM')
        expect(sourceFromParam('tiktok')).toBe('WEBSITE')
        expect(sourceFromParam(null)).toBe('WEBSITE')
    })

    it('builds the public link with the placement as source', () => {
        expect(buildLeadFormLink('https://alia.uz/', 'abc_12', 'instagram')).toBe('https://alia.uz/f/abc_12?src=instagram')
        expect(buildLeadFormLink('https://alia.uz', 'abc_12', 'other')).toBe('https://alia.uz/f/abc_12')
    })
})
