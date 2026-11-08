import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/renderWithProviders'
import type { PlanDto } from '@/shared/types'
import { NewSubscriptionModal } from './NewSubscriptionModal'

vi.mock('@/app/providers/useAuth', () => ({
    useSession: () => ({ token: 'test-token', role: 'DEVELOPER', claims: {}, permissions: [] }),
}))

const plan: PlanDto = { id: 'p1', code: 'START', name: 'Start', price: 300_000, currency: 'UZS', durationMonths: 1 }

beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date('2026-11-08T09:00:00Z'))
    vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
            ok: true,
            status: 200,
            text: () =>
                Promise.resolve(
                    JSON.stringify({
                        content: [{ id: 's1', organization: { id: 'o1', name: 'Markaz' }, status: 'ACTIVE', expiresAt: '2026-11-20' }],
                    })
                ),
        })
    )
})

afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
})

describe('NewSubscriptionModal', () => {
    it('continues from the current expiry and suggests the discounted amount', async () => {
        const onSubmit = vi.fn()
        const user = userEvent.setup()
        renderWithProviders(
            <NewSubscriptionModal
                organizations={[{ value: 'o1', label: 'Markaz' }]}
                plans={[plan]}
                isSaving={false}
                error={null}
                onSubmit={onSubmit}
                onClose={vi.fn()}
            />
        )

        await user.selectOptions(screen.getByRole('combobox', { name: 'Tashkilot' }), 'o1')
        await user.selectOptions(screen.getByRole('combobox', { name: 'Tarif' }), 'p1')
        await user.selectOptions(screen.getByRole('combobox', { name: 'Muddat' }), '6')

        await waitFor(() => expect(screen.getByText(/Yangi tugash sanasi: 2027-05-20/)).toBeInTheDocument())
        expect(screen.getByText(/Chegirma: 7.5%/)).toBeInTheDocument()

        await user.click(screen.getByRole('button', { name: 'Obunani faollashtirish' }))
        expect(onSubmit).toHaveBeenCalledWith({
            organizationId: 'o1',
            planId: 'p1',
            note: undefined,
            expiryDate: '2027-05-20',
            paidAmount: 1_665_000,
        })
    })
})
