import { describe, expect, it } from 'vitest'
import { lastPages, newestFirst } from './recentPayments'

describe('recentPayments', () => {
    it('picks the last two pages, newest rows live at the end', () => {
        expect(lastPages(0, 5)).toEqual([])
        expect(lastPages(3, 5)).toEqual([0])
        expect(lastPages(11, 5)).toEqual([1, 2])
    })

    it('sorts by date, newest first, and limits', () => {
        const rows = [
            { id: 'a', createdAt: '2026-10-01T10:00:00' },
            { id: 'b', createdAt: '2026-10-03T09:00:00' },
            { id: 'c', createdAt: '2026-10-02T12:00:00' },
        ]
        expect(newestFirst(rows, 2).map((row) => row.id)).toEqual(['b', 'c'])
    })
})
