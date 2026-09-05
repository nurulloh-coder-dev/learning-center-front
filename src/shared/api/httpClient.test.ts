import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ApiError } from './ApiError'
import { apiFetch, errorMessage } from './httpClient'
import { setRequestLocale } from './requestLocale'

/**
 * `fetch` ni soxtalashtiradi.
 *
 * `Partial<Response>` ishlatilmadi: u yerda `body` — `ReadableStream`,
 * bizga esa oddiy matn qulay.
 */
interface FakeResponse {
    ok?: boolean
    status?: number
    text?: string
}

function mockFetch({ ok = true, status = 200, text = '' }: FakeResponse) {
    const fetchMock = vi.fn().mockResolvedValue({
        ok,
        status,
        text: () => Promise.resolve(text),
        json: () => Promise.resolve(JSON.parse(text || '{}')),
    })
    vi.stubGlobal('fetch', fetchMock)
    return fetchMock
}

beforeEach(() => vi.unstubAllGlobals())
afterEach(() => vi.restoreAllMocks())

describe('apiFetch', () => {
    it('nisbiy yo’lga /api/v1 prefiksini qo’shadi', async () => {
        const fetchMock = mockFetch({ text: '{"id":"1"}' })
        await apiFetch('/student')
        expect(fetchMock.mock.calls[0][0]).toBe('/api/v1/student')
    })

    it('to’liq yo’lga prefiks qo’shmaydi', async () => {
        const fetchMock = mockFetch({ text: '{}' })
        await apiFetch('/api/v1/auth/login')
        expect(fetchMock.mock.calls[0][0]).toBe('/api/v1/auth/login')
    })

    it('token berilsa Authorization sarlavhasini qo’shadi', async () => {
        const fetchMock = mockFetch({ text: '{}' })
        await apiFetch('/student', { token: 'abc' })
        expect(fetchMock.mock.calls[0][1].headers).toMatchObject({ Authorization: 'Bearer abc' })
    })

    it('token berilmasa Authorization qo’shmaydi', async () => {
        const fetchMock = mockFetch({ text: '{}' })
        await apiFetch('/auth/login')
        expect(fetchMock.mock.calls[0][1].headers).not.toHaveProperty('Authorization')
    })

    it('refresh cookie yuborilishi uchun credentials: include ishlatadi', async () => {
        const fetchMock = mockFetch({ text: '{}' })
        await apiFetch('/auth/refresh-token', { method: 'POST' })
        expect(fetchMock.mock.calls[0][1].credentials).toBe('include')
    })

    it('bo’sh va null query parametrlarini tushirib qoldiradi', async () => {
        const fetchMock = mockFetch({ text: '{}' })
        await apiFetch('/student', { params: { page: 0, search: '', status: undefined, size: 10 } })
        expect(fetchMock.mock.calls[0][0]).toBe('/api/v1/student?page=0&size=10')
    })

    it('body ni JSON qilib yuboradi', async () => {
        const fetchMock = mockFetch({ text: '{}' })
        await apiFetch('/lesson', { method: 'POST', body: { groupId: 'g1' } })
        expect(fetchMock.mock.calls[0][1].body).toBe('{"groupId":"g1"}')
    })

    // FormData bo'lsa brauzer boundary bilan Content-Type'ni o'zi qo'yadi.
    it('FormData tanani o’zgarishsiz yuboradi va Content-Type qo’ymaydi', async () => {
        const fetchMock = mockFetch({ text: '{}' })
        const formData = new FormData()
        formData.append('file', 'content')
        await apiFetch('/upload', { method: 'POST', body: formData })
        expect(fetchMock.mock.calls[0][1].body).toBe(formData)
        expect(fetchMock.mock.calls[0][1].headers).not.toHaveProperty('Content-Type')
    })

    // 200 + bo'sh tana — backendning haqiqiy xatti-harakati, res.json() bunda yiqiladi.
    it('bo’sh tanali 200 javobda null qaytaradi', async () => {
        mockFetch({ text: '' })
        await expect(apiFetch('/lesson')).resolves.toBeNull()
    })

    it('JSON bo’lmagan tanada ham yiqilmaydi', async () => {
        mockFetch({ text: 'plain text' })
        await expect(apiFetch('/lesson')).resolves.toBeNull()
    })

    it('xato javobda ApiError otadi va status kodini saqlaydi', async () => {
        mockFetch({ ok: false, status: 401, text: '{"message":"Bad credentials"}' })
        await expect(apiFetch('/auth/login')).rejects.toMatchObject({
            message: 'Bad credentials',
            status: 401,
        })
    })

    it('xato tanasi o’qilmasa ham tushunarli xabar beradi', async () => {
        mockFetch({ ok: false, status: 500, text: '' })
        await expect(apiFetch('/student')).rejects.toThrow('Request failed (500)')
    })

    // `GlobalExceptionHandler` shakli: { timestamp, errorCode, message, path }
    it('backendning errorCode ini saqlaydi', async () => {
        mockFetch({
            ok: false,
            status: 404,
            text: '{"timestamp":1,"errorCode":"NotFound","message":"Guruh topilmadi","path":"/api/v1/group/1"}',
        })
        await expect(apiFetch('/group/1')).rejects.toMatchObject({
            message: 'Guruh topilmadi',
            status: 404,
            code: 'NotFound',
        })
    })

    // Validatsiya xatolari boshqa shaklda keladi — maydon → xabar xaritasi.
    it('validatsiya xaritasini o’qiydi', async () => {
        mockFetch({ ok: false, status: 400, text: '{"phone":"must not be blank"}' })
        await expect(apiFetch('/student', { method: 'POST' })).rejects.toThrow(
            'phone: must not be blank'
        )
    })

    it('tanlangan tilni Accept-Language sarlavhasida yuboradi', async () => {
        setRequestLocale('ru')
        const fetchMock = mockFetch({ text: '{}' })
        await apiFetch('/student')
        expect(fetchMock.mock.calls[0][1].headers['Accept-Language']).toBe('ru')
        setRequestLocale('uz')
    })
})

describe('errorMessage', () => {
    it('Error xabarini oladi', () => {
        expect(errorMessage(new ApiError('Nope', 403))).toBe('Nope')
    })

    it('noma’lum qiymat uchun zaxira matnni qaytaradi', () => {
        expect(errorMessage(undefined, 'fallback')).toBe('fallback')
        expect(errorMessage({}, 'fallback')).toBe('fallback')
    })

    it('backend topilmagan message kalitini zaxira matn bilan almashtiradi', () => {
        expect(errorMessage(new Error('MessageKey not found: illegal.phone.number.or.password'), 'fallback')).toBe(
            'fallback'
        )
    })
})
