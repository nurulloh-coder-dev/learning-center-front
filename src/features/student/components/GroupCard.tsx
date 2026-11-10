import { useT } from '@/shared/i18n'
import { Avatar, Badge } from '@/shared/ui'
import { formatTime } from '@/shared/lib'
import type { GroupDto } from '@/shared/types'

/** O'quvchining tanlangan guruhi haqida qisqa ma'lumot. */
export function GroupCard({ group }: { group: GroupDto }) {
    const { t } = useT()
    const teacherUser = group.teacher?.userDto
    const timeTable = group.timeTable

    return (
        <div>
            <div className="mb-4 flex items-center justify-between gap-3">
                <h3 className="truncate font-display text-lg font-semibold text-fg">{group.name || '—'}</h3>
                {group.level?.name && <Badge tone="accent">{group.level.name}</Badge>}
            </div>

            <div className="mb-4 flex items-center gap-3">
                <Avatar name={teacherUser?.fullName} src={teacherUser?.imageUrl} />
                <div className="min-w-0">
                    <p className="truncate font-display font-medium text-fg">{teacherUser?.fullName || '—'}</p>
                    <p className="text-xs text-fg-faint">
                        {t('teacher.role')}
                    </p>
                </div>
            </div>

            <p className="text-sm text-fg-muted">
                {timeTable?.dayType ? t(`group.dayType.${timeTable.dayType}`) : '—'}
                {timeTable?.startTime && ` · ${formatTime(timeTable.startTime)}–${formatTime(timeTable.endTime)}`}
            </p>
        </div>
    )
}
