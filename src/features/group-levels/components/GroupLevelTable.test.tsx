import { describe, expect, it, vi } from 'vitest'
import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/renderWithProviders'
import { GroupLevelTable } from './GroupLevelTable'
import type { GroupLevelDto } from '@/shared/types'

describe('GroupLevelTable', () => {
    it('kichik harfli `monthlyFee` kelganda oylik to‘lovni ko‘rsatadi', () => {
        const rows: GroupLevelDto[] = [
            { id: 'lvl-1', name: 'A1', lessonCount: 20, orderNumber: 1, durationInMonths: 4, monthlyFee: 450000 },
        ]
        renderWithProviders(
            <GroupLevelTable rows={rows} isLoading={false} onEdit={vi.fn()} onDelete={vi.fn()} />
        )

        const row = screen.getByRole('row', { name: /a1/i })
        expect(within(row).getByText(/450/)).toBeInTheDocument()
    })

    // Backend hozircha bosh harf bilan `MonthlyFee` qaytaradi — tuzatilgunga qadar shuni ham qabul qilamiz.
    it('bosh harfli `MonthlyFee` kelganda ham oylik to‘lovni ko‘rsatadi', () => {
        const rows: GroupLevelDto[] = [
            { id: 'lvl-2', name: 'A2', lessonCount: 24, orderNumber: 2, durationInMonths: 4, MonthlyFee: 500000 },
        ]
        renderWithProviders(
            <GroupLevelTable rows={rows} isLoading={false} onEdit={vi.fn()} onDelete={vi.fn()} />
        )

        const row = screen.getByRole('row', { name: /a2/i })
        expect(within(row).getByText(/500/)).toBeInTheDocument()
    })

    it('chekkadagi darajalarda surish tugmalari o‘chiq bo‘ladi', async () => {
        const rows: GroupLevelDto[] = [
            { id: 'lvl-1', name: 'A1', lessonCount: 20, orderNumber: 1, durationInMonths: 4 },
            { id: 'lvl-2', name: 'A2', lessonCount: 20, orderNumber: 2, durationInMonths: 4 },
        ]
        const onMove = vi.fn()
        renderWithProviders(
            <GroupLevelTable rows={rows} isLoading={false} onEdit={vi.fn()} onDelete={vi.fn()} onMove={onMove} />
        )

        const first = screen.getByRole('row', { name: /a1/i })
        expect(within(first).getByRole('button', { name: /yuqoriga/i })).toBeDisabled()

        const last = screen.getByRole('row', { name: /a2/i })
        expect(within(last).getByRole('button', { name: /pastga/i })).toBeDisabled()

        await userEvent.click(within(last).getByRole('button', { name: /yuqoriga/i }))
        expect(onMove).toHaveBeenCalledWith(rows[1], -1)
    })
})
