import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { Route, Routes } from 'react-router-dom'
import { renderWithProviders } from '@/test/renderWithProviders'
import { PaymentsPage } from '@/features/payments/pages/PaymentsPage'
import { RequireRole } from './RequireRole'
import { PAYMENTS_ROLES } from './routeAccess'

/**
 * `useSession` bu yerda sessiyani soxtalashtiradi — testda auth oqimi emas,
 * rol tekshiruvi tekshirilyapti (xuddi `PasswordSection.test.tsx`dagidek).
 */
const { sessionState } = vi.hoisted(() => ({ sessionState: { role: 'STUDENT' } }))

vi.mock('@/app/providers/useAuth', () => ({
    useSession: () => ({ token: 'test-token', role: sessionState.role, claims: {} }),
    useAuth: () => ({ session: null, signIn: vi.fn(), signOut: vi.fn(), isRestoring: false }),
}))

/**
 * `PaymentsPage`ning o'zi soxtalashtirilgan: uning ichidagi so'rovlar
 * (`useInvoices` va h.k.) bu testga aloqasi yo'q — bu yerda faqat
 * `RequireRole` uni umuman render qilmasligi tekshiriladi.
 */
vi.mock('@/features/payments/pages/PaymentsPage', () => ({
    PaymentsPage: () => <div>To‘lovlar sahifasi</div>,
}))

function renderPayments() {
    renderWithProviders(
        <Routes>
            <Route
                path="/payments"
                element={
                    <RequireRole roles={[...PAYMENTS_ROLES]}>
                        <PaymentsPage />
                    </RequireRole>
                }
            />
            <Route path="/" element={<div>Bosh sahifa</div>} />
        </Routes>,
        { route: '/payments' }
    )
}

describe('RequireRole', () => {
    it.each(['STUDENT', 'TEACHER'])('%s roli bilan /payments ochilganda PaymentsPage render bo‘lmaydi', (role) => {
        sessionState.role = role
        renderPayments()

        expect(screen.queryByText('To‘lovlar sahifasi')).not.toBeInTheDocument()
        expect(screen.getByText('Bosh sahifa')).toBeInTheDocument()
    })

    it('ADMINISTRATOR /payments ni ochadi', () => {
        sessionState.role = 'ADMINISTRATOR'
        renderPayments()

        expect(screen.getByText('To‘lovlar sahifasi')).toBeInTheDocument()
    })
})
