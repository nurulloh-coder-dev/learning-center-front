import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test/renderWithProviders'
import { ProfileForm } from './ProfileForm'
import type { UserDto } from '@/shared/types'

vi.mock('@/app/providers/useAuth', () => ({
    useSession: () => ({ token: 'test-token', role: 'TEACHER', claims: {}, permissions: [] }),
}))

const user = { id: 'u1', fullName: 'Ali Valiyev', phone: '998901234567', birthDate: '2000-01-01' } as UserDto

describe('ProfileForm', () => {
    it('hides the save button and locks fields when read-only', () => {
        renderWithProviders(<ProfileForm user={user} readOnly />)

        expect(screen.queryByRole('button', { name: 'Saqlash' })).not.toBeInTheDocument()
        expect(screen.getByDisplayValue('Ali Valiyev')).toBeDisabled()
        expect(screen.getByText(/administratoriga murojaat qiling/)).toBeInTheDocument()
    })

    it('shows the save button when editable', () => {
        renderWithProviders(<ProfileForm user={user} />)

        expect(screen.getByRole('button', { name: 'Saqlash' })).toBeInTheDocument()
        expect(screen.getByDisplayValue('Ali Valiyev')).toBeEnabled()
    })
})
