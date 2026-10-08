// LeadCard komponentining testlari — ma'lumotlar to'g'ri ko'rinishi hamda tugmalar bosilganda va status o'zgarganda hodisalar chaqirilishini tekshiradi
import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/renderWithProviders'
import type { LeadDto } from '@/shared/types'
import { LeadCard } from './LeadCard'

const mockLead: LeadDto = {
    id: 'lead-123',
    fullName: 'Ali Valiyev',
    phone: '+998901234567',
    source: 'INSTAGRAM',
    preferredCourse: {
        id: 'lvl-1',
        name: 'Elementary',
        orderNumber: 1,
        lessonCount: 12,
        durationInMonths: 2,
    },
    status: 'NEW',
}

describe('LeadCard', () => {
    it('ism, telefon raqami va tanlangan kurs nomini ko’rsatadi', () => {
        renderWithProviders(
            <LeadCard
                lead={mockLead}
                status="NEW"
                onEdit={vi.fn()}
                onStatusChange={vi.fn()}
                onDelete={vi.fn()}
                onDragStart={vi.fn()}
                onDragEnd={vi.fn()}
            />
        )

        expect(screen.getByRole('heading', { name: 'Ali Valiyev' })).toBeInTheDocument()
        expect(screen.getByRole('link', { name: '+998901234567' })).toBeInTheDocument()
        expect(screen.getByText('Elementary')).toBeInTheDocument()
    })

    it('Tahrirlash tugmasi bosilganda onEdit chaqiriladi', async () => {
        const onEdit = vi.fn()

        renderWithProviders(
            <LeadCard
                lead={mockLead}
                status="NEW"
                onEdit={onEdit}
                onStatusChange={vi.fn()}
                onDelete={vi.fn()}
                onDragStart={vi.fn()}
                onDragEnd={vi.fn()}
            />
        )

        const editBtn = screen.getByRole('button', { name: /tahrirlash/i })
        await userEvent.click(editBtn)

        expect(onEdit).toHaveBeenCalledWith(mockLead)
    })

    it('O‘chirish tugmasi bosilganda onDelete chaqiriladi', async () => {
        const onDelete = vi.fn()

        renderWithProviders(
            <LeadCard
                lead={mockLead}
                status="NEW"
                onEdit={vi.fn()}
                onStatusChange={vi.fn()}
                onDelete={onDelete}
                onDragStart={vi.fn()}
                onDragEnd={vi.fn()}
            />
        )

        const deleteBtn = screen.getByRole('button', { name: /o.chirish/i })
        await userEvent.click(deleteBtn)

        expect(onDelete).toHaveBeenCalledWith(mockLead)
    })

    it('status o’zgartirilganda onStatusChange chaqiriladi', async () => {
        const onStatusChange = vi.fn()

        renderWithProviders(
            <LeadCard
                lead={mockLead}
                status="NEW"
                onEdit={vi.fn()}
                onStatusChange={onStatusChange}
                onDelete={vi.fn()}
                onDragStart={vi.fn()}
                onDragEnd={vi.fn()}
            />
        )

        const statusSelect = screen.getByRole('combobox', { name: /holatni o.zgartirish/i })
        await userEvent.selectOptions(statusSelect, 'ENROLLED')

        expect(onStatusChange).toHaveBeenCalledWith(mockLead, 'ENROLLED')
    })
})
