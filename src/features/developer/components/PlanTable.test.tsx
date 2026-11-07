import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test/renderWithProviders'
import type { PlanDto } from '@/shared/types'
import { PlanTable } from './PlanTable'

const plan = (code: string, active?: boolean): PlanDto => ({
    id: code,
    code,
    name: code,
    price: 600_000,
    currency: 'UZS',
    durationMonths: 2,
    active,
})

describe('PlanTable', () => {
    it('shows the duration in months and the status of each plan', () => {
        renderWithProviders(
            <PlanTable plans={[plan('START_2', true), plan('OLD', false)]} isLoading={false} onEdit={vi.fn()} onDelete={vi.fn()} />
        )
        expect(screen.getAllByText('2 oy')).toHaveLength(2)
        expect(screen.getByText('Faol')).toBeInTheDocument()
        expect(screen.getByText('Faol emas')).toBeInTheDocument()
    })
})
