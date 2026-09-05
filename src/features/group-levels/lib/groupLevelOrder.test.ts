import { describe, expect, it } from 'vitest'
import { moveLevel, sortByOrder, toOrderPayload } from './groupLevelOrder'

interface Row {
    id: string
    orderNumber?: number
}

const rows: Row[] = [
    { id: 'c', orderNumber: 3 },
    { id: 'a', orderNumber: 1 },
    { id: 'b', orderNumber: 2 },
]

describe('groupLevelOrder', () => {
    it('tartib raqami bo‘yicha saralaydi', () => {
        expect(sortByOrder(rows).map((row) => row.id)).toEqual(['a', 'b', 'c'])
    })

    it('tartib raqami yo‘q darajani oxiriga qo‘yadi', () => {
        expect(sortByOrder<Row>([{ id: 'x' }, ...rows]).map((row) => row.id)).toEqual(['a', 'b', 'c', 'x'])
    })

    it('darajani yuqoriga suradi', () => {
        expect(moveLevel(sortByOrder(rows), 'b', -1).map((row) => row.id)).toEqual(['b', 'a', 'c'])
    })

    it('darajani pastga suradi', () => {
        expect(moveLevel(sortByOrder(rows), 'a', 1).map((row) => row.id)).toEqual(['b', 'a', 'c'])
    })

    it('chekkadan tashqariga chiqarmaydi', () => {
        const sorted = sortByOrder(rows)
        expect(moveLevel(sorted, 'a', -1)).toBe(sorted)
        expect(moveLevel(sorted, 'c', 1)).toBe(sorted)
    })

    it('1..n qilib qayta raqamlaydi — bo‘shliq qoldirmaydi', () => {
        expect(toOrderPayload([{ id: 'a' }, { id: 'c' }])).toEqual({
            levels: [
                { id: 'a', orderNumber: 1 },
                { id: 'c', orderNumber: 2 },
            ],
        })
    })
})
