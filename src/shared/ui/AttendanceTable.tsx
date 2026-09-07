import { useT } from '@/shared/i18n'
import { DotBadge } from './Badge'
import { cn, formatDate } from '@/shared/lib'
import type { AttendanceStatus, StatusReasonDto, StudentDto } from '@/shared/types'
import { STATUS_TONE } from '@/shared/lib/attendanceStatus'
import { AttendanceCell } from './AttendanceCell'

export interface PastLessonColumn {
    /** Davomat yozuvining id si (`MonthlyAttendanceDto.id`), dars id emas. */
    lessonId: string
    lessonTitle?: string
    date?: string
    /** studentId → { status, reason }. Xaritada yo'q o'quvchi hali belgilanmagan, "kelmadi" EMAS. */
    attendanceMap: Record<string, StatusReasonDto>
}

interface AttendanceDraftLike {
    lesson: {
        id: string
        lessonDate?: string
        title?: number | string
    }
    statuses: Record<string, AttendanceStatus>
    reasons: Record<string, string | undefined>
}

interface AttendanceTableProps {
    students: StudentDto[]
    pastColumns: PastLessonColumn[]
    /** `null` — faqat ko'rish rejimi (dashboarddagi kabi). */
    draft?: AttendanceDraftLike | null
    onStatusChange?: (studentId: string, status: AttendanceStatus, reason?: string) => void
    /** Ism ustiga bosilganda — o'quvchi kartasi. */
    onSelectStudent?: (student: StudentDto) => void
    /**
     * O'tgan dars ustun sarlavhasiga bosilganda — o'sha yozuvni qayta
     * tahrirlashga o'tish. Berilmasa ustunlar bosilmaydigan bo'lib qoladi.
     */
    onEditPastLesson?: (column: PastLessonColumn) => void
}

/**
 * O'quvchilar × darslar jadvali.
 *
 * Ism ustuni `sticky left-0` — darslar ko'payganda jadval gorizontal
 * siljiydi, lekin kim haqida gapirayotganimiz ko'rinib turishi kerak.
 */
export function AttendanceTable({
    students,
    pastColumns,
    draft = null,
    onStatusChange,
    onSelectStudent,
    onEditPastLesson,
}: AttendanceTableProps) {
    const { t } = useT()

    // Qoralama o'tgan dars ustunlaridan biriga tegishli bo'lsa — bu ustun
    // tahrirlanmoqda, alohida oxirgi ustun qo'shilmaydi (ikkilanish bo'lmasin).
    const editingPastLessonId =
        draft && pastColumns.some((column) => column.lessonId === draft.lesson.id) ? draft.lesson.id : null

    return (
        <div className="overflow-x-auto rounded-lg border border-border-base bg-surface-card">
            <table className="min-w-full border-collapse text-sm">
                <thead>
                    <tr>
                        <th className="sticky left-0 z-20 border-r border-b border-border-base bg-surface px-4 py-3 text-left font-mono text-[0.66rem] tracking-[0.05em] whitespace-nowrap text-fg-faint uppercase shadow-[4px_0_8px_-4px_rgba(0,0,0,0.08)] dark:shadow-[4px_0_8px_-4px_rgba(0,0,0,0.4)]">
                            {t('attendance.student')}
                        </th>
                        {pastColumns.map((column) => {
                            const isEditing = column.lessonId === editingPastLessonId
                            // Qoralama ustuni bilan bir xil tartib: sana asosiy (tepada),
                            // dars raqami ikkinchi darajali (pastda).
                            const label = (
                                <>
                                    <span className="block text-sm font-semibold tabular-nums text-fg-muted">
                                        {formatDate(column.date)}
                                    </span>
                                    <span className="block font-mono text-[0.62rem] text-fg-faint">
                                        {column.lessonTitle}
                                    </span>
                                </>
                            )
                            return (
                                <th
                                    key={column.lessonId}
                                    className={cn(
                                        'min-w-16 border-b px-2 py-1.5 text-center whitespace-nowrap',
                                        isEditing ? 'border-brand bg-brand/10' : 'border-border-base bg-surface'
                                    )}
                                >
                                    {onEditPastLesson ? (
                                        <button
                                            type="button"
                                            onClick={() => onEditPastLesson(column)}
                                            aria-label={t('attendance.editPastLesson', {
                                                title: column.lessonTitle ?? '',
                                            })}
                                            className="w-full cursor-pointer"
                                        >
                                            {label}
                                        </button>
                                    ) : (
                                        label
                                    )}
                                </th>
                            )
                        })}
                        {draft && !editingPastLessonId && (
                            <th className="min-w-18 border-b border-brand bg-brand/10 px-2 py-1.5 text-center whitespace-nowrap">
                                <span className="block text-sm font-semibold tabular-nums text-fg-muted">
                                    {formatDate(draft.lesson.lessonDate)}
                                </span>
                                <span className="block font-mono text-[0.62rem] text-fg-faint">
                                    {t('attendance.lessonNumber', { number: draft.lesson.title ?? '' })}
                                </span>
                            </th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {students.map((student, index) => (
                        <tr key={student.id} className="group hover:bg-surface-hover">
                            <td className="sticky left-0 z-10 border-r border-b border-border-base bg-surface-card px-4 py-2.5 whitespace-nowrap group-hover:bg-surface-hover shadow-[4px_0_8px_-4px_rgba(0,0,0,0.08)] dark:shadow-[4px_0_8px_-4px_rgba(0,0,0,0.4)]">
                                <span className="mr-2.5 inline-block w-5 font-mono text-xs font-bold tabular-nums text-accent-fg">
                                    {index + 1}
                                </span>
                                {onSelectStudent ? (
                                    <button
                                        type="button"
                                        onClick={() => onSelectStudent(student)}
                                        className="cursor-pointer font-display font-medium text-fg hover:underline"
                                    >
                                        {student.userDto?.fullName || '—'}
                                    </button>
                                ) : (
                                    <span className="font-display font-medium text-fg">
                                        {student.userDto?.fullName || '—'}
                                    </span>
                                )}
                            </td>

                            {pastColumns.map((column) => {
                                if (column.lessonId === editingPastLessonId && draft && onStatusChange) {
                                    return (
                                        <td
                                            key={column.lessonId}
                                            className="border-b border-border-base px-2 py-1.5 text-center"
                                        >
                                            <AttendanceCell
                                                studentName={student.userDto?.fullName ?? student.id}
                                                status={draft.statuses[student.id] ?? 'PRESENT'}
                                                reason={draft.reasons[student.id]}
                                                onChange={(status, reason) =>
                                                    onStatusChange(student.id, status, reason)
                                                }
                                            />
                                        </td>
                                    )
                                }

                                const entry = column.attendanceMap[student.id]
                                return (
                                    <td
                                        key={column.lessonId}
                                        className="border-b border-border-base px-2 py-1.5 text-center"
                                    >
                                        {/* Xaritada yo'q o'quvchi — katak bo'sh va rangsiz qoladi, bu
                                            "kelmadi" bilan chalkashmasligi kerak. */}
                                        {entry && (
                                            <DotBadge tone={STATUS_TONE[entry.status]} title={entry.reason}>
                                                {entry.status.charAt(0)}
                                            </DotBadge>
                                        )}
                                    </td>
                                )
                            })}

                            {draft && onStatusChange && !editingPastLessonId && (
                                <td className="border-b border-border-base px-2 py-1.5 text-center">
                                    <AttendanceCell
                                        studentName={student.userDto?.fullName ?? student.id}
                                        status={draft.statuses[student.id] ?? 'PRESENT'}
                                        reason={draft.reasons[student.id]}
                                        onChange={(status, reason) =>
                                            onStatusChange(student.id, status, reason)
                                        }
                                    />
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
