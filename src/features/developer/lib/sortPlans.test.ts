import { describe, expect, it } from 'vitest'
import type { PlanDto } from '@/shared/types'
import { sortPlans } from './sortPlans'

const plan = (code: string, price: number, sortOrder?: number): PlanDto => ({
    id: code,
    code,
    name: code,
    price,
    currency: 'UZS',
    durationMonths: 2,
    sortOrder,
})

describe('sortPlans', () => {
    it('follows sortOrder, not price', () => {
        const sorted = sortPlans([plan('STANDARD_2', 1_000_000, 5), plan('START_4', 1_140_000, 2), plan('START_2', 600_000, 1)])
        expect(sorted.map((p) => p.code)).toEqual(['START_2', 'START_4', 'STANDARD_2'])
    })

    it('puts plans without sortOrder last, by price', () => {
        const sorted = sortPlans([plan('OLD_B', 900, undefined), plan('NEW', 5000, 1), plan('OLD_A', 100, undefined)])
        expect(sorted.map((p) => p.code)).toEqual(['NEW', 'OLD_A', 'OLD_B'])
    })
})
