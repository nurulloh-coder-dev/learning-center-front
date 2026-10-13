import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/renderWithProviders'
import { EntityListHeader } from './EntityListHeader'

function renderHeader(overrides: Partial<Parameters<typeof EntityListHeader>[0]> = {}) {
    const props = {
        plural: 'Groups',
        singular: 'Group',
        showStatusFilter: false,
        statusFilter: 'STARTING',
        search: '',
        onStatusChange: vi.fn(),
        onSearchChange: vi.fn(),
        onCreate: vi.fn(),
        ...overrides,
    }
    renderWithProviders(<EntityListHeader {...props} />)
    return props
}

describe('EntityListHeader', () => {
    it('sarlavhani ko’rsatadi va "yangi" tugmasi onCreate ni chaqiradi', async () => {
        const props = renderHeader()

        expect(screen.getByRole('heading', { name: 'Groups' })).toBeInTheDocument()
        await userEvent.setup().click(screen.getByRole('button'))

        expect(props.onCreate).toHaveBeenCalledTimes(1)
    })

    it('status filtri faqat so’ralganda chiqadi', () => {
        renderHeader({ showStatusFilter: false })
        expect(screen.queryByRole('combobox')).not.toBeInTheDocument()
    })

    it('status filtri yoqilganda tanlash onStatusChange ni chaqiradi', async () => {
        const props = renderHeader({ showStatusFilter: true })

        await userEvent.setup().selectOptions(screen.getByRole('combobox'), 'ONGOING')

        expect(props.onStatusChange).toHaveBeenCalledWith('ONGOING')
    })
})
