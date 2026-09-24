import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test/renderWithProviders'
import { MySubscriptionPanel } from './MySubscriptionPanel'
import type { SubscriptionDto } from '@/shared/types'

function subscription(expiresAt: string): SubscriptionDto {
    return {
        id: 's-1',
        plan: { id: 'p-1', name: 'Standard' },
        status: 'ACTIVE',
        expiresAt,
        paidAmount: 450000,
    }
}

beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-09-17T12:00:00Z'))
})

afterEach(() => {
    vi.useRealTimers()
})

describe('MySubscriptionPanel', () => {
    /*
     * Hammasi joyida bo'lsa blok UMUMAN chizilmaydi: u ekranning eng
     * tepasida turib, kerakli ma'lumotni pastga surib yuborardi. Tarif
     * haqidagi to'liq ma'lumot "Tashkilot" bo'limida.
     */
    it('muddat uzoq bo’lsa hech nima ko’rsatmaydi', () => {
        const { container } = renderWithProviders(
            <MySubscriptionPanel subscription={subscription('2026-10-17T00:00:00Z')} isLoading={false} />
        )

        expect(container).toBeEmptyDOMElement()
    })

    it('muddat yaqinlashganda ogohlantiradi', () => {
        renderWithProviders(
            <MySubscriptionPanel subscription={subscription('2026-09-20T00:00:00Z')} isLoading={false} />
        )

        expect(screen.getByText(/tugayapti/i)).toBeInTheDocument()
    })

    it('muddat o’tgan bo’lsa boshqacha ogohlantiradi', () => {
        renderWithProviders(
            <MySubscriptionPanel subscription={subscription('2026-09-10T00:00:00Z')} isLoading={false} />
        )

        expect(screen.getByText(/tugadi/i)).toBeInTheDocument()
    })

    // Yangi markazda obuna hali ochilmagan bo'ladi — backend 404 qaytaradi.
    it('obuna bo’lmasa hech nima chizmaydi', () => {
        const { container } = renderWithProviders(
            <MySubscriptionPanel subscription={null} isLoading={false} />
        )

        expect(container).toBeEmptyDOMElement()
    })
})
