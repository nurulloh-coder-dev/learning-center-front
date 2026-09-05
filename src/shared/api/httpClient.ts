import { ApiError } from './ApiError'
import { getRequestLocale } from './requestLocale'
import { refreshAccessToken } from './sessionRefresh'

const API_PREFIX = '/api/v1'

interface RequestOptions extends Omit<RequestInit, 'body'> {
    /** JWT access token; berilsa `Authorization` sarlavhasi qo'shiladi. */
    token?: string
    /** Obyekt sifatida beriladi — JSON.stringify o'zi bajariladi. `FormData` bo'lsa o'zgarishsiz yuboriladi. */
    body?: unknown
    /** Query parametrlari; `undefined`/`''` qiymatlar tushirib qoldiriladi. */
    params?: Record<string, string | number | undefined | null>
}

function buildUrl(path: string, params?: RequestOptions['params']): string {
    const url = path.startsWith('/api') ? path : `${API_PREFIX}${path}`
    if (!params) return url
    const search = new URLSearchParams()
    for (const [key, value] of Object.entries(params)) {
        if (value === undefined || value === null || value === '') continue
        search.set(key, String(value))
    }
    const query = search.toString()
    return query ? `${url}?${query}` : url
}

/**
 * Loyihadagi yagona HTTP mijozi.
 *
 * Ilgari har bir sahifada o'zining `authFetch` nusxasi bor edi — endi bitta.
 * Ikkita nozik joyni yodda tuting:
 *  - `credentials: 'include'` shart, chunki refresh token httpOnly cookie'da;
 *  - ba'zi endpoint'lar 200 qaytarib, tanani BO'SH qoldiradi (204 ham emas),
 *    `res.json()` esa bunda xato beradi — shuning uchun avval matn o'qiladi.
 *
 * Xato bo'lsa `ApiError` otiladi, ya'ni TanStack Query uni o'zi ushlaydi.
 *
 * Access token eskirgan bo'lsa (401/403) bir marta yangilanadi va so'rov
 * qaytadan yuboriladi — `sessionRefresh.ts` ga qarang.
 */
export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T | null> {
    const { token, body, params, headers, ...rest } = options
    const url = buildUrl(path, params)

    const isFormData = body instanceof FormData

    function send(bearer?: string) {
        return fetch(url, {
            ...rest,
            credentials: 'include',
            headers: {
                // FormData bo'lsa Content-Type qo'yilmaydi — brauzer boundary bilan o'zi qo'yadi.
                ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
                // Backend xato matnini shu sarlavhaga qarab tarjima qiladi.
                'Accept-Language': getRequestLocale(),
                ...(bearer ? { Authorization: `Bearer ${bearer}` } : {}),
                ...headers,
            },
            ...(body === undefined ? {} : { body: isFormData ? body : JSON.stringify(body) }),
        })
    }

    let res = await send(token)

    if (shouldRetryWithFreshToken(res.status, path, token)) {
        const fresh = await refreshAccessToken()
        // Yangi token kelmasa eski javob qoladi — chaqiruvchi 401/403 ni ko'radi
        // va foydalanuvchi login ekraniga qaytariladi.
        if (fresh) res = await send(fresh)
    }

    if (!res.ok) {
        const { message, code } = await readError(res)
        throw new ApiError(message, res.status, code)
    }

    const text = await res.text()
    if (!text) return null
    try {
        return JSON.parse(text) as T
    } catch {
        return null
    }
}

/**
 * Token yangilanib, so'rov qaytadan yuborilsinmi?
 *
 * Uch shart: javob autentifikatsiya xatosi, so'rovda token bo'lgan (tokensiz
 * so'rovga yangi token ham yordam bermaydi) va bu `/auth/**` emas —
 * aks holda `refresh-token` ning o'zi yiqilganda cheksiz halqa hosil bo'lardi.
 */
function shouldRetryWithFreshToken(status: number, path: string, token?: string): boolean {
    if (status !== 401 && status !== 403) return false
    if (!token) return false
    return !path.startsWith('/auth') && !path.startsWith('/api/v1/auth')
}

/**
 * Xato javobidan matn va kodni ajratib oladi.
 *
 * Backend IKKI xil shakl qaytaradi:
 *  1. `{ timestamp, errorCode, message, path }` — odatiy xatolar
 *     (`GlobalExceptionHandler`). `message` `Accept-Language` ga qarab
 *     tarjima qilingan bo'ladi.
 *  2. `{ "phone": "must not be blank", … }` — validatsiya xatolari
 *     (`MethodArgumentNotValidException`) maydon → xabar xaritasi bo'lib
 *     keladi, `message` maydoni umuman yo'q.
 *
 * Ikkinchisini ham o'qiymiz, aks holda forma "Request failed (400)" deb
 * turaverardi. (Backendda bir xillashtirilsa, shu funksiya qisqaradi —
 * `docs/backend-api-request.md` ga qarang.)
 */
async function readError(res: Response): Promise<{ message: string; code?: string }> {
    const fallback = `Request failed (${res.status})`
    try {
        const body = (await res.json()) as Record<string, unknown>
        if (typeof body?.message === 'string' && body.message) {
            const code = typeof body.errorCode === 'string' ? body.errorCode : undefined
            return { message: body.message, code }
        }
        // Validatsiya xaritasi: qiymatlari matn bo'lgan maydonlarni yig'amiz.
        const fieldErrors = Object.entries(body ?? {})
            .filter(([, value]) => typeof value === 'string')
            .map(([field, value]) => `${field}: ${String(value)}`)
        if (fieldErrors.length > 0) return { message: fieldErrors.join('; ') }

        return { message: fallback }
    } catch {
        return { message: fallback }
    }
}

/** Xato obyektidan foydalanuvchiga ko'rsatiladigan matnni oladi. */
export function errorMessage(error: unknown, fallback = 'Something went wrong. Try again.'): string {
    if (error instanceof Error && error.message) {
        if (error.message.startsWith('MessageKey not found:')) return fallback
        return error.message
    }
    return fallback
}
