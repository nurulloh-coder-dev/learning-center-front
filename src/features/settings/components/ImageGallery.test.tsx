import { afterEach, describe, expect, it, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/renderWithProviders'
import { ImageGallery } from './ImageGallery'

vi.mock('@/app/providers/useAuth', () => ({
    useSession: () => ({ token: 'test-token', role: 'ADMINISTRATOR', claims: {} }),
    useAuth: () => ({ session: null, signIn: vi.fn(), signOut: vi.fn(), isRestoring: false }),
}))

function setupMockFetch() {
    const fetchMock = vi.fn().mockImplementation((url: string, init?: RequestInit) => {
        const method = (init?.method ?? 'GET').toUpperCase()

        if (url.includes('/auth/me')) {
            return Promise.resolve({
                ok: true,
                status: 200,
                text: () => Promise.resolve(JSON.stringify({
                    id: 'user-1',
                    imageUrl: 'https://example.com/main.jpg',
                })),
                json: () => Promise.resolve({
                    id: 'user-1',
                    imageUrl: 'https://example.com/main.jpg',
                }),
            })
        }

        if (url.includes('/image') && method === 'GET') {
            return Promise.resolve({
                ok: true,
                status: 200,
                text: () => Promise.resolve(JSON.stringify({
                    content: [
                        { id: 'img-main', imageUrl: 'https://example.com/main.jpg', originalFileName: 'main.jpg' },
                        { id: 'img-other', imageUrl: 'https://example.com/other.jpg', originalFileName: 'other.jpg' },
                    ],
                    totalPages: 1,
                    totalElements: 2,
                })),
                json: () => Promise.resolve({
                    content: [
                        { id: 'img-main', imageUrl: 'https://example.com/main.jpg', originalFileName: 'main.jpg' },
                        { id: 'img-other', imageUrl: 'https://example.com/other.jpg', originalFileName: 'other.jpg' },
                    ],
                    totalPages: 1,
                    totalElements: 2,
                }),
            })
        }

        if (url.includes('/image/main/') && method === 'PUT') {
            return Promise.resolve({
                ok: true,
                status: 204,
                text: () => Promise.resolve(''),
                json: () => Promise.resolve(null),
            })
        }

        if (url.includes('/image/') && method === 'DELETE') {
            return Promise.resolve({
                ok: true,
                status: 204,
                text: () => Promise.resolve(''),
                json: () => Promise.resolve(null),
            })
        }

        return Promise.resolve({
            ok: true,
            status: 200,
            text: () => Promise.resolve('{}'),
            json: () => Promise.resolve({}),
        })
    })

    vi.stubGlobal('fetch', fetchMock)
    return fetchMock
}

afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
})

describe('ImageGallery', () => {
    it('asosiy rasmda o‘chirish tugmasi bo‘lmaydi, boshqa rasmlarda o‘chirish tugmasi bo‘ladi', async () => {
        setupMockFetch()

        renderWithProviders(<ImageGallery />)

        // "Asosiy" endi matn emas, yulduz ikonkasi — uning nomi bo'yicha
        // topamiz. Tugmalar rol va nom bo'yicha izlanadi, ko'rinish emas.
        await waitFor(() => {
            expect(screen.getByRole('button', { name: /^asosiy$/i })).toBeInTheDocument()
        })

        // Faqat bitta o'chirish tugmasi va bitta "Asosiy qilish" tugmasi bo'lishi kerak (chunki ikkinchi rasm asosiy emas)
        const deleteButtons = screen.getAllByRole('button', { name: /o‘chirish/i })
        expect(deleteButtons).toHaveLength(1)

        const setMainButtons = screen.getAllByRole('button', { name: /asosiy qilish/i })
        expect(setMainButtons).toHaveLength(1)
    })

    it('Asosiy qilish tugmasi bosilganda tegishli API so‘rovi (PUT /image/main/{id}) yuboriladi', async () => {
        const user = userEvent.setup()
        const fetchMock = setupMockFetch()

        renderWithProviders(<ImageGallery />)

        await waitFor(() => {
            expect(screen.getByRole('button', { name: /asosiy qilish/i })).toBeInTheDocument()
        })

        const setMainButton = screen.getByRole('button', { name: /asosiy qilish/i })
        await user.click(setMainButton)

        await waitFor(() => {
            const putCall = fetchMock.mock.calls.find(([url, init]) =>
                url.includes('/image/main/img-other') && (init?.method === 'PUT')
            )
            expect(putCall).toBeDefined()
        })
    })
})
