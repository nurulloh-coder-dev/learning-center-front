import { useT } from '@/shared/i18n'
import { formatPhone } from '@/shared/lib'
import { Badge, Button, Panel } from '@/shared/ui'
import { MAX_IMPORT_ROWS, type ImportField, type ImportKind } from '../lib/importFields'
import type { PreparedRow } from '../lib/prepareRows'
import { RowStatus } from './RowStatus'

const PREVIEW_ROWS = 8

/** Telefon o'qishga qulay ko'rinishda; serverga baribir `+998...` ketadi. */
function displayValue(key: ImportField['key'], value: string | null): string {
    if (!value) return '—'
    return key === 'phone' || key === 'parentPhone' ? formatPhone(value) : value
}
const MAX_LISTED_PROBLEMS = 20

interface PreviewStepProps {
    kind: ImportKind
    fields: readonly ImportField[]
    rows: readonly PreparedRow[]
    readyCount: number
    tooMany: boolean
    needsBranch: boolean
    canSubmit: boolean
    isSubmitting: boolean
    onSubmit: () => void
}

/**
 * 3-qadam: nima yuborilishini oldindan ko'rsatadi.
 *
 * Administrator "qo'shish" ni bosishdan oldin qaysi qatorlar o'tkazib
 * yuborilishini va nega ekanini ko'rishi kerak — keyin 300 ta qator ichidan
 * qidirib o'tirmasin.
 */
export function PreviewStep({
    kind,
    fields,
    rows,
    readyCount,
    tooMany,
    needsBranch,
    canSubmit,
    isSubmitting,
    onSubmit,
}: PreviewStepProps) {
    const { t } = useT()
    const skipped = rows.filter((row) => row.errors.length > 0)
    const warned = rows.filter((row) => row.errors.length === 0 && row.warnings.length > 0)
    const problems = [...skipped, ...warned].sort((a, b) => a.line - b.line)

    return (
        <Panel className="mb-5">
            <h2 className="mb-3 font-display text-lg font-semibold text-fg">{t('import.step.preview')}</h2>

            <div className="mb-4 flex flex-wrap gap-2">
                <Badge tone="success">{t('import.summary.ready', { count: readyCount })}</Badge>
                {skipped.length > 0 && <Badge tone="danger">{t('import.summary.skipped', { count: skipped.length })}</Badge>}
                {warned.length > 0 && <Badge tone="warning">{t('import.summary.warnings', { count: warned.length })}</Badge>}
            </div>

            <p className="mb-2 text-xs text-fg-faint">{t('import.previewHint', { count: Math.min(PREVIEW_ROWS, rows.length) })}</p>
            <div className="mb-4 overflow-x-auto rounded-lg border border-border-base">
                <table className="w-full min-w-xl text-left text-sm">
                    <thead className="bg-surface-muted text-xs text-fg-muted">
                        <tr>
                            <th className="px-3 py-2 font-semibold">{t('import.line')}</th>
                            {fields.map((field) => (
                                <th key={field.key} className="px-3 py-2 font-semibold">
                                    {t(field.labelKey)}
                                </th>
                            ))}
                            <th className="px-3 py-2 font-semibold">{t('import.status')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.slice(0, PREVIEW_ROWS).map((row) => (
                            <tr key={row.line} className="border-t border-border-base text-fg">
                                <td className="px-3 py-2 text-fg-faint">{row.line}</td>
                                {fields.map((field) => (
                                    <td key={field.key} className="px-3 py-2 whitespace-nowrap">
                                        {displayValue(field.key, row.values[field.key])}
                                    </td>
                                ))}
                                <td className="min-w-56 px-3 py-2">
                                    <RowStatus row={row} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {problems.length > 0 && (
                <div className="mb-4">
                    <h3 className="mb-2 text-sm font-semibold text-fg">{t('import.problemsTitle')}</h3>
                    <ul className="flex flex-col gap-1.5 text-sm">
                        {problems.slice(0, MAX_LISTED_PROBLEMS).map((row) => (
                            <li key={row.line} className="flex flex-wrap items-center gap-2">
                                <span className="text-fg-faint">
                                    {t('import.line')} {row.line}
                                </span>
                                <span className="text-fg">{row.values.fullName || displayValue('phone', row.values.phone)}</span>
                                <RowStatus row={row} />
                            </li>
                        ))}
                    </ul>
                    {problems.length > MAX_LISTED_PROBLEMS && (
                        <p className="mt-1.5 text-xs text-fg-faint">
                            {t('import.moreProblems', { count: problems.length - MAX_LISTED_PROBLEMS })}
                        </p>
                    )}
                </div>
            )}

            {tooMany && (
                <p role="alert" className="mb-3 text-sm text-danger-fg">
                    {t('import.tooMany', { max: MAX_IMPORT_ROWS })}
                </p>
            )}

            {needsBranch && (
                <p role="alert" className="mb-3 text-sm text-danger-fg">
                    {t('import.chooseBranch')}
                </p>
            )}

            <div className="flex justify-end">
                <Button variant="primary" disabled={!canSubmit || isSubmitting} onClick={onSubmit}>
                    {isSubmitting ? t('import.submitting') : t(`import.submit.${kind}`, { count: readyCount })}
                </Button>
            </div>
        </Panel>
    )
}
