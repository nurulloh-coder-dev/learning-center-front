import { describe, expect, it } from 'vitest'
import { toCreateGroupLevelPayload, toUpdateGroupLevelPayload } from './groupLevelPayload'

describe('group level payloads', () => {
    it('creates DTO without id and with numeric fields coerced', () => {
        expect(
            toCreateGroupLevelPayload({
                name: 'B1',
                lessonCount: '20',
                orderNumber: '2',
                durationInMonths: '4',
                monthlyFee: '450000',
            })
        ).toEqual({
            name: 'B1',
            lessonCount: 20,
            orderNumber: 2,
            durationInMonths: 4,
            monthlyFee: 450000,
        })
    })

    it('oylik to‘lov bo‘sh bo‘lsa 0 yuboradi', () => {
        expect(
            toCreateGroupLevelPayload({
                name: 'B1',
                lessonCount: '20',
                orderNumber: '2',
                durationInMonths: '4',
                monthlyFee: '',
            }).monthlyFee
        ).toBe(0)
    })

    it('builds the update DTO with name but without orderNumber', () => {
        expect(
            toUpdateGroupLevelPayload({
                id: 'lvl-2',
                name: 'B2',
                lessonCount: '24',
                orderNumber: '3',
                durationInMonths: '6',
                monthlyFee: '450000',
            })
        ).toEqual({
            name: 'B2',
            lessonCount: 24,
            durationInMonths: 6,
            monthlyFee: 450000,
        })
    })
})
