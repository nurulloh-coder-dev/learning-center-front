import { fireEvent, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '@/test/renderWithProviders'
import { AttendancePage } from './AttendancePage'
import * as csvLib from '@/shared/lib/csv'

vi.mock('@/app/providers/useAuth', () => ({
    useSession: () => ({
        token: 'test-token',
        role: 'ADMINISTRATOR',
        claims: {},
        permissions: [],
    }),
    useAuth: () => ({ session: null, signIn: vi.fn(), signOut: vi.fn(), isRestoring: false }),
}))

vi.mock('../hooks/useGroupStudents', () => ({
    useGroupStudents: () => ({
        isLoading: false,
        error: null,
        students: [
            { id: 's1', userDto: { fullName: 'Ali Valiyev' } },
            { id: 's2', userDto: { fullName: 'Vali Sodyqov' } },
        ],
    }),
}))

vi.mock('@/shared/hooks', async (importOriginal) => {
    const actual = await importOriginal<typeof import('@/shared/hooks')>()
    return {
        ...actual,
        useAttendanceRecords: () => ({
            isLoading: false,
            error: null,
            records: [
                {
                    id: 'l1',
                    lessonTitle: '1-dars',
                    date: '2026-03-01T10:00:00',
                    attendanceStudentMap: {
                        s1: { status: 'PRESENT' },
                        s2: { status: 'ABSENT' },
                    },
                },
            ],
        }),
    }
})

afterEach(() => {
    vi.restoreAllMocks()
})

describe('AttendancePage CSV Export', () => {
    it('triggers CSV download when Download button is clicked', () => {
        const downloadCsvSpy = vi.spyOn(csvLib, 'downloadCsv').mockImplementation(() => {})

        renderWithProviders(<AttendancePage />, {
            route: '/attendance',
        })

        const downloadButton = screen.getByRole('button', { name: 'Yuklab olish' })
        expect(downloadButton).not.toBeDisabled()

        fireEvent.click(downloadButton)

        expect(downloadCsvSpy).toHaveBeenCalledTimes(1)
        const [filename, content] = downloadCsvSpy.mock.calls[0]
        expect(filename).toContain('attendance_group_')
        expect(filename).toContain('.csv')
        expect(content).toContain("O'quvchi")
        expect(content).toContain('Ali Valiyev')
        expect(content).toContain('Keldi')
        expect(content).toContain('Kelmadi')
    })
})
