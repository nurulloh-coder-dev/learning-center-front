import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test/renderWithProviders'
import { OrganizationTable } from './OrganizationTable'

describe('OrganizationTable', () => {
    it('hides "add super admin" once the organization has one', () => {
        renderWithProviders(
            <OrganizationTable
                organizations={[
                    { id: 'o1', name: 'Bor', superAdminCount: 2 },
                    { id: 'o2', name: "Yo'q", superAdminCount: 0 },
                ]}
                isLoading={false}
                onAddSuperAdmin={vi.fn()}
            />
        )
        expect(screen.getAllByRole('button', { name: /Super-admin qo/ })).toHaveLength(1)
        expect(screen.getByText('2')).toBeInTheDocument()
    })
})
