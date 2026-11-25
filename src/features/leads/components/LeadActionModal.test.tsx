// LeadActionModal komponenti testlari — turli holatlarda (ENROLLED, REJECTED, CALL_LATER) forma xatti-harakatlarini tekshiradi
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/renderWithProviders'
import type { LeadDto } from '@/shared/types'
import { LeadActionModal } from './LeadActionModal'

const mockLead: LeadDto = {
    id: 'lead-123',
    version: 4,
    fullName: 'Ali Valiyev',
    phone: '+998901234567',
    source: 'INSTAGRAM',
    status: 'NEW',
}

const mockGroupOptions = [
    { value: 'group-1', label: 'Guruh 1' },
    { value: 'group-2', label: 'Guruh 2' },
]

describe('LeadActionModal', () => {
    it('ENROLLED holatida guruh tanlanmaguncha Saqlash tugmasi faolsizlantiriladi va tanlangach onEnroll chaqiriladi', async () => {
        const onEnroll = vi.fn()

        renderWithProviders(
            <LeadActionModal
                lead={mockLead}
                status="ENROLLED"
                groupOptions={mockGroupOptions}
                isPending={false}
                onClose={vi.fn()}
                onEnroll={onEnroll}
                onReject={vi.fn()}
                onCallLater={vi.fn()}
            />
        )

        const saveButton = screen.getByRole('button', { name: /saqlash/i })
        expect(saveButton).toBeDisabled()

        const groupSelect = screen.getByRole('combobox', { name: /guruh/i })
        await userEvent.selectOptions(groupSelect, 'group-1')

        expect(saveButton).not.toBeDisabled()
        await userEvent.click(saveButton)

        expect(onEnroll).toHaveBeenCalledWith('group-1')
    })

    it('REJECTED holatida sabab va izoh bilan onReject chaqiriladi', async () => {
        const onReject = vi.fn()

        renderWithProviders(
            <LeadActionModal
                lead={mockLead}
                status="REJECTED"
                groupOptions={[]}
                isPending={false}
                onClose={vi.fn()}
                onEnroll={vi.fn()}
                onReject={onReject}
                onCallLater={vi.fn()}
            />
        )

        const noteInput = screen.getByRole('textbox', { name: /izoh/i })
        await userEvent.type(noteInput, 'Narxi qimmatlik qildi')

        const saveButton = screen.getByRole('button', { name: /saqlash/i })
        expect(saveButton).not.toBeDisabled()
        await userEvent.click(saveButton)

        expect(onReject).toHaveBeenCalledWith({
            reason: 'OTHER',
            note: 'Narxi qimmatlik qildi',
        })
    })

    describe('CALL_LATER — Telegramdagidek g‘ildirak', () => {
        // Mahalliy vaqt qotiriladi: chorshanba, 2026-10-07 20:46.
        beforeEach(() => {
            vi.useFakeTimers({ toFake: ['Date'] })
            vi.setSystemTime(new Date(2026, 9, 7, 20, 46))
        })
        afterEach(() => vi.useRealTimers())

        function renderCallLater(onCallLater = vi.fn()) {
            renderWithProviders(
                <LeadActionModal
                    lead={mockLead}
                    status="CALL_LATER"
                    groupOptions={[]}
                    isPending={false}
                    onClose={vi.fn()}
                    onEnroll={vi.fn()}
                    onReject={vi.fn()}
                    onCallLater={onCallLater}
                />
            )
            return onCallLater
        }

        it('picks day, hour and minute and says when it is scheduled', async () => {
            const onCallLater = renderCallLater()

            // Standart — bir soatdan keyin, soat boshida.
            expect(screen.getByRole('button', { name: 'Bugun, 21:00 ga belgilash' })).toBeEnabled()

            await userEvent.click(within(screen.getByRole('listbox', { name: 'Kun' })).getByRole('option', { name: 'Ertaga' }))
            await userEvent.click(within(screen.getByRole('listbox', { name: 'soat' })).getByRole('option', { name: '10' }))
            await userEvent.click(within(screen.getByRole('listbox', { name: 'daqiqa' })).getByRole('option', { name: '30' }))
            await userEvent.click(screen.getByRole('button', { name: 'Ertaga, 10:30 ga belgilash' }))

            expect(onCallLater).toHaveBeenCalledWith('2026-10-08T10:30')
        })

        it('does not allow a time in the past', async () => {
            renderCallLater()

            await userEvent.click(within(screen.getByRole('listbox', { name: 'soat' })).getByRole('option', { name: '20' }))

            expect(screen.getByRole('button', { name: /20:00 ga belgilash/ })).toBeDisabled()
            expect(screen.getByText(/allaqachon o.tgan/)).toBeInTheDocument()
        })

        it('changes the hour with the arrow keys', async () => {
            renderCallLater()
            screen.getByRole('listbox', { name: 'soat' }).focus()

            await userEvent.keyboard('{ArrowDown}')

            expect(screen.getByRole('button', { name: 'Bugun, 22:00 ga belgilash' })).toBeInTheDocument()
        })
    })
})
