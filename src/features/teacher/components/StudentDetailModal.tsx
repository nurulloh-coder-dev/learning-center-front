import { useT } from '@/shared/i18n'
import { Avatar, Button, Modal } from '@/shared/ui'
import type { TranslationKey } from '@/shared/i18n'
import type { StudentDto } from '@/shared/types'

const ROWS: { labelKey: TranslationKey; get: (student: StudentDto) => string | undefined }[] = [
    { labelKey: 'field.phone', get: (student) => student.userDto?.phone },
    { labelKey: 'field.birthDate', get: (student) => student.userDto?.birthDate },
    { labelKey: 'field.parentPhone', get: (student) => student.parentPhone },
]

export function StudentDetailModal({ student, onClose }: { student: StudentDto; onClose: () => void }) {
    const { t } = useT()

    return (
        <Modal
            title={
                <span className="flex items-center gap-3">
                    <Avatar name={student.userDto?.fullName} src={student.userDto?.imageUrl} size="lg" />
                    <span className="min-w-0 truncate">{student.userDto?.fullName || '—'}</span>
                </span>
            }
            onClose={onClose}
            footer={<Button onClick={onClose}>{t('common.close')}</Button>}
        >
            <dl className="divide-y divide-border-base rounded-lg border border-border-base bg-surface p-2 sm:p-3">
                {ROWS.map((row) => (
                    <div
                        key={row.labelKey}
                        className="flex flex-col gap-1 py-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:py-3 text-sm"
                    >
                        <dt className="text-xs font-semibold text-fg-faint">
                            {t(row.labelKey)}
                        </dt>
                        <dd className="font-medium text-fg break-all sm:truncate">{row.get(student) || '—'}</dd>
                    </div>
                ))}
            </dl>
        </Modal>
    )
}
