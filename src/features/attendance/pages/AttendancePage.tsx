import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth, useSession } from '@/app/providers/useAuth'
import { errorMessage } from '@/shared/api'
import { useAttendanceRecords } from '@/shared/hooks'
import { useT } from '@/shared/i18n'
import { AppShell, AttendanceTable, Button, EmptyState, ErrorBox, SegmentedControl, type PastLessonColumn } from '@/shared/ui'
import { DraftBar } from '../components/DraftBar'
import { useAttendanceDraft, type AttendanceDraftInitial } from '../hooks/useAttendanceDraft'
import { useGroupStudents } from '../hooks/useGroupStudents'
import { useSubmitAttendance } from '../hooks/useSubmitAttendance'
import type { AttendanceStatus, LessonDto } from '@/shared/types'

/** Dashboard'dan `navigate('/attendance', { state })` orqali keladigan yuk. */
interface AttendanceRouteState {
    activeLesson?: LessonDto | null
    groupId?: string
}

/** Oy tanlagich qiymati — `fetchMonthlyAttendance` ning `previousMonths` iga to'g'ridan-to'g'ri o'tadi. */
type MonthOption = '1' | '2' | '3'

export function AttendancePage() {
    const { t } = useT()
    const session = useSession()
    const { signOut } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    const state = (location.state ?? null) as AttendanceRouteState | null
    const activeLesson = state?.activeLesson ?? null
    const groupId = state?.groupId ?? ''

    const [month, setMonth] = useState<MonthOption>('1')
    // O'tgan darslardan biri qayta tahrirlanayotgan bo'lsa shu yerda turadi.
    const [editingColumn, setEditingColumn] = useState<PastLessonColumn | null>(null)

    const studentsQuery = useGroupStudents(session.token, groupId, session.role)
    const recordsQuery = useAttendanceRecords(session.token, groupId, Number(month))
    const students = studentsQuery.students

    const pastColumns = useMemo<PastLessonColumn[]>(
        () =>
            recordsQuery.records.map((record) => ({
                lessonId: record.id,
                lessonTitle: record.lessonTitle,
                date: record.date,
                attendanceMap: record.attendanceStudentMap ?? {},
            })),
        [recordsQuery.records]
    )

    // Tahrirlash rejimida qoralama shu "soxta dars" ustida ochiladi — id si
    // xuddi tahrirlanayotgan yozuvniki bilan bir xil, shuning uchun jadval
    // uni o'sha ustunning o'zida ko'rsatadi (yangi ustun qo'shilmaydi).
    const effectiveActiveLesson: LessonDto | null = editingColumn
        ? { id: editingColumn.lessonId, lessonName: editingColumn.lessonTitle, lessonDate: editingColumn.date }
        : activeLesson

    const editingInitial = useMemo<AttendanceDraftInitial | null>(() => {
        if (!editingColumn) return null
        const statuses: Record<string, AttendanceStatus> = {}
        const reasons: Record<string, string> = {}
        Object.entries(editingColumn.attendanceMap).forEach(([studentId, entry]) => {
            statuses[studentId] = entry.status
            if (entry.reason) reasons[studentId] = entry.reason
        })
        return { statuses, reasons }
    }, [editingColumn])

    const draft = useAttendanceDraft(students, effectiveActiveLesson, editingInitial)
    const submit = useSubmitAttendance(session.token, () => {
        if (editingColumn) {
            setEditingColumn(null)
        } else {
            draft.clearDraft()
            navigate('/')
        }
    })

    function handleEditPastLesson(column: PastLessonColumn) {
        // Sarlavhaga qayta bosilsa — tahrirlashdan chiqadi (bekor qilish).
        setEditingColumn((current) => (current?.lessonId === column.lessonId ? null : column))
    }

    function handleFinish() {
        const payload = draft.toPayload()
        if (!payload) return
        if (editingColumn) {
            submit.mutate({ id: editingColumn.lessonId, students: payload.students })
        } else {
            submit.mutate({ lessonId: payload.lessonId, students: payload.students })
        }
    }

    const isLoading = studentsQuery.isLoading || recordsQuery.isLoading
    const failure = submit.error ?? studentsQuery.error ?? recordsQuery.error

    return (
        <AppShell
            subtitle={t('attendance.title')}
            onSignOut={signOut}
            actions={
                <>
                    <SegmentedControl<MonthOption>
                        label={t('attendance.monthFilter')}
                        value={month}
                        onChange={setMonth}
                        options={[
                            { value: '1', label: t('attendance.monthCurrent') },
                            { value: '2', label: t('attendance.monthPrevious') },
                            { value: '3', label: t('attendance.monthTwoAgo') },
                        ]}
                    />
                    <Button size="sm" onClick={() => navigate('/')}>
                        ← {t('attendance.backToDashboard')}
                    </Button>
                </>
            }
        >
            {failure && (
                <div className="mb-5">
                    <ErrorBox>{errorMessage(failure)}</ErrorBox>
                </div>
            )}

            {isLoading && <p className="font-mono text-sm text-fg-faint">{t('common.loading')}</p>}

            {!isLoading && students.length === 0 && (
                <EmptyState
                    title={t('attendance.noStudents')}
                    description={t('attendance.noStudentsHint')}
                />
            )}

            {!isLoading && students.length > 0 && (
                <>
                    {pastColumns.length > 0 && (
                        <p className="mb-4 font-mono text-xs text-fg-faint">
                            {t('attendance.pastLessons', { count: pastColumns.length })}
                        </p>
                    )}

                    {draft.hasDraft && (
                        <DraftBar
                            counts={draft.counts}
                            statuses={draft.statuses}
                            isSubmitting={submit.isPending}
                            onFinish={handleFinish}
                            finishLabel={editingColumn ? t('attendance.save') : undefined}
                        />
                    )}

                    <AttendanceTable
                        students={students}
                        pastColumns={pastColumns}
                        draft={draft.draft}
                        onStatusChange={draft.setStatus}
                        onEditPastLesson={handleEditPastLesson}
                    />
                </>
            )}
        </AppShell>
    )
}
