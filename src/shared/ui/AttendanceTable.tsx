import { useT } from '@/shared/i18n'
import { Avatar } from './Avatar'
import { DotBadge } from './Badge'
import { cn, formatDayMonth } from '@/shared/lib'
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
    /**
     * Guruhda rejalashtirilgan darslar soni (`GroupLevelDto.lessonCount`).
     * Mavjud ustunlardan ko'p bo'lsa, farqi qadar BUTUNLAY BO'SH ustun
     * qo'shiladi — hali o'tilmagan darsning sarlavhasida ham, katagida ham
     * hech narsa yozilmasin, deb backend jamoasi so'ragan.
     */
    plannedLessonCount?: number
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
    plannedLessonCount,
}: AttendanceTableProps) {
    const { t, locale } = useT()

    // Qoralama o'tgan dars ustunlaridan biriga tegishli bo'lsa — bu ustun
    // tahrirlanmoqda, alohida oxirgi ustun qo'shilmaydi (ikkilanish bo'lmasin).
    const editingPastLessonId =
        draft && pastColumns.some((column) => column.lessonId === draft.lesson.id) ? draft.lesson.id : null

    // Reja bilan solishtirib, hali o'tilmagan darslar uchun bo'sh ustun sonini
    // topamiz — qoralama ustuni ham "band" hisoblanadi, u alohida dars emas.
    const occupiedColumnsCount = pastColumns.length + (draft && !editingPastLessonId ? 1 : 0)
    const emptyColumnsCount =
        plannedLessonCount && plannedLessonCount > occupiedColumnsCount
            ? plannedLessonCount - occupiedColumnsCount
            : 0
    const emptyColumnKeys = Array.from({ length: emptyColumnsCount }, (_, index) => `empty-${index}`)

    return (
        <div className="overflow-x-auto rounded-lg border border-border-base bg-surface-card">
            <table className="min-w-full border-collapse text-sm">
                <thead>
                    <tr>
                        <th className="text-xs sticky left-0 z-20 border-b border-border-base bg-surface px-4 py-2 text-left whitespace-nowrap text-fg-faint">
                            {t('attendance.student')}
                        </th>
                        {pastColumns.map((column) => {
                            const isEditing = column.lessonId === editingPastLessonId
                            // Qoralama ustuni bilan bir xil tartib: sana asosiy (tepada),
                            // dars raqami ikkinchi darajali (pastda).
                            const label = (
                                <>
                                    <span className="block text-sm font-semibold text-fg-muted">
                                        {formatDayMonth(column.date, locale)}
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
                                    {formatDayMonth(draft.lesson.lessonDate, locale)}
                                </span>
                                <span className="block font-mono text-[0.62rem] text-fg-faint">
                                    {t('attendance.lessonNumber', { number: draft.lesson.title ?? '' })}
                                </span>
                            </th>
                        )}
                        {emptyColumnKeys.map((key) => (
                            <th
                                key={key}
                                className="min-w-16 border-b border-border-base bg-surface px-2 py-1.5 text-center whitespace-nowrap"
                            />
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {students.map((student, index) => (
                        <tr key={student.id} className="group hover:bg-surface-hover">
                            <td className="sticky left-0 z-10 border-b border-border-base bg-surface-card px-4 py-2.5 max-sm:py-3 whitespace-nowrap group-hover:bg-surface-hover">
                                <div className="flex items-center gap-2.5">
                                    <span className="w-5 shrink-0 font-mono text-xs font-bold tabular-nums text-accent-fg">
                                        {index + 1}
                                    </span>
                                    {/* Rasm o'qituvchiga ismni emas, YUZNI tanishga yordam
                                        beradi — guruhda o'xshash ismlar ko'p bo'ladi. */}
                                    <Avatar
                                        name={student.userDto?.fullName}
                                        src={student.userDto?.imageUrl}
                                        size="sm"
                                        colorful
                                    />
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
                                </div>
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

                            {emptyColumnKeys.map((key) => (
                                <td key={key} className="border-b border-border-base px-2 py-1.5 text-center" />
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
