import { useState } from 'react'
import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PhoneInput } from './PhoneInput'

function Harness({ initial = '+998 ' }: { initial?: string }) {
    const [value, setValue] = useState(initial)
    return (
        <>
            <PhoneInput aria-label="Telefon" value={value} onChange={setValue} />
            <output>{value}</output>
        </>
    )
}

describe('PhoneInput', () => {
    // Nurulloh telefonda "99 899 …" yozganda 998 qayta qo'shilib, raqam buzilardi.
    it('types a number that starts with 99 8 without doubling the prefix', async () => {
        render(<Harness />)
        await userEvent.type(screen.getByLabelText('Telefon'), '998998999')
        expect(screen.getByLabelText('Telefon')).toHaveValue('99 899 89 99')
        expect(screen.getByRole('status')).toHaveTextContent('+998 99 899 89 99')
    })

    it('deletes digits with Backspace down to empty', async () => {
        render(<Harness initial="+998 90 1" />)
        const input = screen.getByLabelText('Telefon')
        await userEvent.type(input, '{Backspace}{Backspace}{Backspace}{Backspace}')
        expect(input).toHaveValue('')
        expect(screen.getByRole('status')).toHaveTextContent('+998')
    })

    it('takes a pasted full number', () => {
        render(<Harness />)
        fireEvent.change(screen.getByLabelText('Telefon'), { target: { value: '+998 90 123 45 67' } })
        expect(screen.getByLabelText('Telefon')).toHaveValue('90 123 45 67')
    })
})
