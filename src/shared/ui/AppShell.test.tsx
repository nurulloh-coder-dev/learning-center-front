import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test/renderWithProviders'
import { AppShell } from './AppShell'
import { Button } from './Button'

vi.mock('@/shared/hooks', () => ({
    useMe: () => ({ data: { fullName: 'Aziza Karimova', role: 'ADMINISTRATOR' } }),
}))

describe('AppShell', () => {
    // Tugmalar kompyuterda ham, telefonda ham BIR marta chiziladi — faqat
    // joyi o'zgaradi. Ikki nusxa ekran o'quvchida ikki marta o'qilardi.
    it('shows the page title and renders each action once', () => {
        renderWithProviders(
            <AppShell subtitle="Lidlar" token="t" onSignOut={vi.fn()} actions={<Button>Forma havolasi</Button>}>
                <p>kontent</p>
            </AppShell>
        )
        expect(screen.getByText('Lidlar')).toBeInTheDocument()
        expect(screen.getAllByRole('button', { name: 'Forma havolasi' })).toHaveLength(1)
    })
})
