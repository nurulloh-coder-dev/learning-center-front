import { afterEach, describe, expect, it, vi } from 'vitest'
import { callLaterLead, enrollLead, rejectLead } from './leadsApi'

const TOKEN = 'token'

function mockFetch() {
    const fetchMock = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        text: () => Promise.resolve('{}'),
    })
    vi.stubGlobal('fetch', fetchMock)
    return fetchMock
}

afterEach(() => {
    vi.unstubAllGlobals()
})

/*
 * Backend (`8fd0e6b`) lid amallarini o'zgartirdi: id va `leadVersion` endi
 * yo'lda emas, so'rovning o'zida. Versiya mos kelmasa backend 409 qaytaradi.
 */
describe('leadsApi', () => {
    it('qabul qilishda id, guruh va versiya tanada ketadi', async () => {
        const fetchMock = mockFetch()

        await enrollLead(TOKEN, 'l-1', 7, 'g-1')

        const [url, init] = fetchMock.mock.calls[0]
        expect(url).toBe('/api/v1/leads/enroll')
        expect(init.method).toBe('POST')
        expect(JSON.parse(init.body)).toEqual({ id: 'l-1', groupId: 'g-1', leadVersion: 7 })
    })

    it('rad etishda id va versiya tanada ketadi', async () => {
        const fetchMock = mockFetch()

        await rejectLead(TOKEN, 'l-1', 7, { reason: 'PRICE_TOO_HIGH', note: 'qimmat' })

        const [url, init] = fetchMock.mock.calls[0]
        expect(url).toBe('/api/v1/leads/reject')
        expect(JSON.parse(init.body)).toEqual({ id: 'l-1', leadVersion: 7, reason: 'PRICE_TOO_HIGH', note: 'qimmat' })
    })

    it('keyinroq qo’ng’iroqda vaqt endi tanada (so’rov parametrida emas)', async () => {
        const fetchMock = mockFetch()

        await callLaterLead(TOKEN, 'l-1', 7, '2026-12-01T15:00:00')

        const [url, init] = fetchMock.mock.calls[0]
        expect(url).toBe('/api/v1/leads/callLater')
        expect(init.method).toBe('PATCH')
        expect(JSON.parse(init.body)).toEqual({ id: 'l-1', leadVersion: 7, callAt: '2026-12-01T15:00:00' })
    })
})
