import { describe, expect, it } from 'vitest'
import { computeExpiryDate, monthsDiscountPercent, suggestedPaidAmount } from './subscriptionTerm'

const today = new Date(Date.UTC(2026, 10, 8))

describe('monthsDiscountPercent', () => {
    it('gives no discount for one month and 1.25% per month after that', () => {
        expect(monthsDiscountPercent(1)).toBe(0)
        expect(monthsDiscountPercent(2)).toBe(2.5)
        expect(monthsDiscountPercent(6)).toBe(7.5)
        expect(monthsDiscountPercent(12)).toBe(15)
    })
})

describe('computeExpiryDate', () => {
    it('counts from today when there is no active subscription', () => {
        expect(computeExpiryDate(undefined, 1, today)).toBe('2026-12-08')
        expect(computeExpiryDate('2026-10-01', 3, today)).toBe('2027-02-08')
    })

    it('continues from the current expiry when it is still ahead', () => {
        expect(computeExpiryDate('2026-11-20', 2, today)).toBe('2027-01-20')
    })

    it('clamps to the last day of a shorter month', () => {
        expect(computeExpiryDate('2027-01-31', 1, today)).toBe('2027-02-28')
    })
})

describe('suggestedPaidAmount', () => {
    it('applies the month discount to a monthly plan', () => {
        expect(suggestedPaidAmount({ price: 300_000, durationMonths: 1 }, 1)).toBe(300_000)
        expect(suggestedPaidAmount({ price: 300_000, durationMonths: 1 }, 12)).toBe(3_060_000)
        expect(suggestedPaidAmount({ price: 500_000, durationMonths: 1 }, 6)).toBe(2_775_000)
    })
})
