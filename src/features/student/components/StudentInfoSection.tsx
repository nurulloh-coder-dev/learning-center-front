import { useT } from '@/shared/i18n'
import type { TranslationKey } from '@/shared/i18n'

interface StudentInfoSectionProps {
    parentPhone?: string
    birthDate?: string
}

/** "Ma'lumotlarim" bo'limi — ota-ona telefoni va tug'ilgan sana. */
export function StudentInfoSection({ parentPhone, birthDate }: StudentInfoSectionProps) {
    const { t } = useT()

    const rows: { labelKey: TranslationKey; value?: string }[] = [
        { labelKey: 'field.parentPhone', value: parentPhone },
        { labelKey: 'field.birthDate', value: birthDate },
    ]

    return (
        <dl>
            {rows.map((row) => (
                <div
                    key={row.labelKey}
                    className="flex items-center justify-between gap-3 border-b border-border-base py-2.5 text-sm last:border-b-0"
                >
                    <dt className="text-xs shrink-0 text-fg-faint">
                        {t(row.labelKey)}
                    </dt>
                    <dd className="truncate text-right text-fg" title={row.value || '—'}>
                        {row.value || '—'}
                    </dd>
                </div>
            ))}
        </dl>
    )
}
