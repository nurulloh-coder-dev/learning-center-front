import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test/renderWithProviders'
import type { LeadDto } from '@/shared/types'
import { LeadColumn } from './LeadColumn'

const mockLeads: LeadDto[] = [
    {
        id: 'lead-1',
        version: 0,
        fullName: 'Ali Valiyev',
        phone: '+998901234567',
        status: 'NEW',
    },
    {
        id: 'lead-2',
        version: 0,
        fullName: 'Sami Qodirov',
        phone: '+998907654321',
        status: 'NEW',
    },
]

describe('LeadColumn', () => {
    it('ustun sarlavhasi va lidlar soni ko‘rinadi', () => {
        renderWithProviders(
            <LeadColumn
                status="NEW"
                leads={mockLeads}
                isLoading={false}
                hasNextPage={false}
                isFetchingNextPage={false}
                loadMoreRef={vi.fn()}
                onEdit={vi.fn()}
                onStatusChange={vi.fn()}
                onDelete={vi.fn()}
                onDragStart={vi.fn()}
                onDragEnd={vi.fn()}
                onDrop={vi.fn()}
            />
        )

        expect(screen.getByRole('heading', { name: /yangi/i })).toBeInTheDocument()
        expect(screen.getByText(/2 ta lid/i)).toBeInTheDocument()
    })

    it('bo‘sh ustunda "Shu yerga tashlang" matni ko‘rinadi', () => {
        renderWithProviders(
            <LeadColumn
                status="NEW"
                leads={[]}
                isLoading={false}
                hasNextPage={false}
                isFetchingNextPage={false}
                loadMoreRef={vi.fn()}
                onEdit={vi.fn()}
                onStatusChange={vi.fn()}
                onDelete={vi.fn()}
                onDragStart={vi.fn()}
                onDragEnd={vi.fn()}
                onDrop={vi.fn()}
            />
        )

        expect(screen.getByText(/shu yerga tashlang/i)).toBeInTheDocument()
    })
})
