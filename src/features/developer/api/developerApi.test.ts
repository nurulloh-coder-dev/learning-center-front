import { afterEach, describe, expect, it, vi } from 'vitest'
import { createSubscription, fetchPlans, updateSubscription } from './developerApi'

const TOKEN = 'token'

function mockFetch(payload: unknown) {
    const fetchMock = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        text: () => Promise.resolve(JSON.stringify(payload)),
        json: () => Promise.resolve(payload),
    })
    vi.stubGlobal('fetch', fetchMock)
    return fetchMock
}

afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
})

describe('developerApi', () => {
    it('tariflarni sahifalab so’raydi', async () => {
        const fetchMock = mockFetch({ content: [] })

        await fetchPlans(TOKEN, { page: 0, size: 50 })

        expect(fetchMock.mock.calls[0][0]).toBe('/api/v1/plans?page=0&size=50')
    })

    /*
     * Backend `0f63169` dan keyin tugash sanasi va to'langan summa ham
     * yuboriladi: backend ularni o'zi hisoblamaydi.
     */
    it('obuna yaratishda tugash sanasi va summani ham yuboradi', async () => {
        const fetchMock = mockFetch({ id: 's-1' })
        const body = { organizationId: 'o-1', planId: 'p-1', note: 'Humo', expiryDate: '2026-12-08', paidAmount: 300000 }

        await createSubscription(TOKEN, body)

        const [, init] = fetchMock.mock.calls[0]
        expect(JSON.parse(String(init?.body))).toEqual(body)
    })

    it('holatni PUT bilan o’zgartiradi', async () => {
        const fetchMock = mockFetch({ id: 's-1' })

        await updateSubscription(TOKEN, 's-1', { status: 'CANCELED' })

        const [url, init] = fetchMock.mock.calls[0]
        expect(url).toBe('/api/v1/subscriptions/s-1')
        expect(init?.method).toBe('PUT')
    })
})
