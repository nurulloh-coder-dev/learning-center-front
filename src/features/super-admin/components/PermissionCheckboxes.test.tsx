import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/renderWithProviders'
import { PermissionCheckboxes } from './PermissionCheckboxes'

describe('PermissionCheckboxes', () => {
    it('ruxsat nomini bosganda aynan o’sha ruxsat o’zgaradi', async () => {
        const onToggle = vi.fn()
        renderWithProviders(<PermissionCheckboxes value={[]} onToggle={onToggle} />)

        await userEvent.click(screen.getByText('O‘quvchilar'))

        expect(onToggle).toHaveBeenCalledTimes(1)
        expect(onToggle).toHaveBeenCalledWith('STUDENT_MANAGEMENT')
    })

    it('tanlangan ruxsatlar belgilangan holda ko’rinadi', () => {
        renderWithProviders(<PermissionCheckboxes value={['LEAD_MANAGEMENT']} onToggle={vi.fn()} />)

        expect(screen.getByRole('checkbox', { name: 'Lidlar' })).toBeChecked()
        expect(screen.getByRole('checkbox', { name: 'O‘quvchilar' })).not.toBeChecked()
        expect(screen.getByRole('group', { name: 'Ruxsatlar' })).toBeInTheDocument()
    })
})
