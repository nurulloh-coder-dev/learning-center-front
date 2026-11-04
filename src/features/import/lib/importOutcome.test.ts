import { describe, expect, it } from 'vitest'
import { describeOutcome } from './importOutcome'
import type { PreparedRow } from './prepareRows'

const row = (line: number, fullName: string): PreparedRow => ({
    line,
    values: { fullName, phone: '+998901234567', birthDate: null, parentPhone: null },
    errors: [],
    warnings: [],
})

describe('describeOutcome', () => {
    it('maps failed indexes back to file line numbers', () => {
        const sent = [row(2, 'Ali'), row(5, 'Vali')]
        const { failed } = describeOutcome(
            {
                succeeded: [],
                failed: [{ index: 1, input: {} as never, errorType: 'PHONE_NUMBER_ALREADY_EXISTS', message: 'Telefon band' }],
            },
            sent
        )
        expect(failed).toEqual([{ line: 5, fullName: 'Vali', reason: 'Telefon band' }])
    })

    it('keeps a null password for an already existing account', () => {
        const { logins } = describeOutcome(
            {
                succeeded: [
                    {
                        id: 's1',
                        userDto: { id: 'u1', fullName: 'Ali', phone: '+998901234567', temporaryPassword: null },
                        parentPhone: null,
                        balance: null,
                    },
                ],
                failed: [],
            },
            [row(2, 'Ali')]
        )
        expect(logins).toEqual([{ fullName: 'Ali', phone: '+998901234567', password: null }])
    })
})
