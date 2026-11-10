import { useT } from '@/shared/i18n'
import { PendingTag } from '@/shared/ui'
import type { GroupDto } from '@/shared/types'

/**
 * Guruh haqidagi qisqa ma'lumot qatori.
 *
 * Uch katak backenddan keladi (`GroupDto.level`, `currentMonth`,
 * `lessonsCount`), uy vazifasi esa hali yo'q — u "—" bilan turadi.
 */
export function LessonStrip({ group }: { group?: GroupDto }) {
    const { t } = useT()

    const cells = [
        { key: 'level', label: t('teacher.level'), value: group?.level?.name },
        {
            key: 'month',
            label: t('teacher.currentUnit'),
            value: group?.currentMonth ? t('teacher.month', { current: group.currentMonth }) : undefined,
        },
        { key: 'lessons', label: t('teacher.lessonsCount'), value: group?.lessonsCount },
        { key: 'homework', label: t('teacher.homeworkDone'), value: undefined, pending: true },
    ]

    return (
        <section className="mb-5 rounded-lg border border-border-base bg-surface-card p-1.5">
            <div className="grid grid-cols-2 gap-1.5 lg:grid-cols-4">
                {cells.map((cell) => (
                    <div key={cell.key} className="rounded-md bg-surface px-3.5 py-3">
                        <div className="flex items-center justify-between gap-2">
                            <span className="text-xs truncate text-fg-faint">
                                {cell.label}
                            </span>
                            {cell.pending && <PendingTag />}
                        </div>
                        <div className="mt-1 font-display text-lg font-semibold text-fg">
                            {cell.value ?? <span className="text-fg-faint">—</span>}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}
