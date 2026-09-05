import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/renderWithProviders'
import type { LeadDto } from '@/shared/types'
import { EditLeadModal } from './EditLeadModal'
import { NewLeadModal } from './NewLeadModal'

const mockLead: LeadDto = {
    id: 'lead-123',
    fullName: 'Ali Valiyev',
    phone: '+998901234567',
    source: 'INSTAGRAM',
    preferredCourse: { id: 'lvl-1', name: 'Elementary', orderNumber: 1, lessonCount: 12, durationInMonths: 2 },
    status: 'CALL_LATER',
}

describe('NewLeadModal', () => {
    it('yangi lid formasini to correctly submit body', async () => {
        const onSubmit = vi.fn()
        const onClose = vi.fn()

        renderWithProviders(
            <NewLeadModal token="fake-token" onClose={onClose} onSubmit={onSubmit} />
        )

        const nameInput = screen.getByLabelText(/F.I.Sh./i)
        const phoneInput = screen.getByLabelText(/Telefon/i)

        await userEvent.type(nameInput, 'Jasur Bek')
        await userEvent.type(phoneInput, '+998911112233')

        const submitBtn = screen.getByRole('button', { name: /saqlash/i })
        expect(submitBtn).not.toBeDisabled()

        await userEvent.click(submitBtn)

        expect(onSubmit).toHaveBeenCalledWith({
            fullName: 'Jasur Bek',
            phone: '+998911112233',
            source: undefined,
            preferredCourse: undefined,
        })
    })
})

describe('EditLeadModal', () => {
    it('mavjud lid ma’lumotlari bilan to’ldiriladi va current status bilan submit qiladi', async () => {
        const onSubmit = vi.fn()
        const onClose = vi.fn()

        renderWithProviders(
            <EditLeadModal
                token="fake-token"
                lead={mockLead}
                onClose={onClose}
                onSubmit={onSubmit}
            />
        )

        const nameInput = screen.getByLabelText(/F.I.Sh./i) as HTMLInputElement
        const phoneInput = screen.getByLabelText(/Telefon/i) as HTMLInputElement

        expect(nameInput.value).toBe('Ali Valiyev')
        expect(phoneInput.value).toBe('+998901234567')

        await userEvent.clear(nameInput)
        await userEvent.type(nameInput, 'Ali Karimov')

        const submitBtn = screen.getByRole('button', { name: /saqlash/i })
        await userEvent.click(submitBtn)

        expect(onSubmit).toHaveBeenCalledWith({
            fullName: 'Ali Karimov',
            phone: '+998901234567',
            source: 'INSTAGRAM',
            preferredCourse: 'lvl-1',
            status: 'CALL_LATER',
        })
    })

    it('telefon yaroqsiz bo’lsa xato matnini ko’rsatadi va yubormaydi', async () => {
        const onSubmit = vi.fn()
        renderWithProviders(
            <EditLeadModal
                token="fake-token"
                lead={mockLead}
                onClose={vi.fn()}
                onSubmit={onSubmit}
            />
        )

        const phoneInput = screen.getByLabelText(/Telefon/i) as HTMLInputElement
        await userEvent.clear(phoneInput)
        await userEvent.type(phoneInput, 'invalid-phone')
        await userEvent.click(screen.getByRole('button', { name: /saqlash/i }))

        expect(onSubmit).not.toHaveBeenCalled()
        expect(screen.getByText(/noto‘g‘ri/i)).toBeInTheDocument()
    })

    // Bo'shliqli yozuv ilgari jimgina rad etilardi — tugma o'chib qolardi.
    it('bo’shliqli telefon raqamini qabul qiladi', async () => {
        const onSubmit = vi.fn()
        renderWithProviders(
            <EditLeadModal
                token="fake-token"
                lead={mockLead}
                onClose={vi.fn()}
                onSubmit={onSubmit}
            />
        )

        const phoneInput = screen.getByLabelText(/Telefon/i) as HTMLInputElement
        await userEvent.clear(phoneInput)
        await userEvent.type(phoneInput, '+998 90 123 45 67')
        await userEvent.click(screen.getByRole('button', { name: /saqlash/i }))

        expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ phone: '+998901234567' }))
    })
})
