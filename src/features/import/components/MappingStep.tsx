import { useT } from '@/shared/i18n'
import { Badge, Panel, Select } from '@/shared/ui'
import { freeColumns, type ColumnMapping } from '../lib/columnMatch'
import type { ImportField, ImportFieldKey } from '../lib/importFields'
import type { SheetRow } from '../lib/readSpreadsheet'

interface MappingStepProps {
    fields: readonly ImportField[]
    headers: readonly string[]
    rows: readonly SheetRow[]
    mapping: ColumnMapping
    missingRequired: readonly ImportField[]
    onChange: (field: ImportFieldKey, column: number | null) => void
}

/**
 * 2-qadam: chapda fayl ustuni (tanlanadi), o'ngda bizning maydon (qotib turadi).
 *
 * Tanlagichda faqat hali band bo'lmagan ustunlar chiqadi — bitta ustunni
 * ikki maydonga (masalan "Tel" ni ham telefon, ham tug'ilgan sanaga) qo'yib
 * bo'lmaydi. Noto'g'ri moslikni bo'shatib, boshqasini tanlash kifoya.
 */
export function MappingStep({ fields, headers, rows, mapping, missingRequired, onChange }: MappingStepProps) {
    const { t } = useT()

    const columnLabel = (index: number) => headers[index] || `#${index + 1}`
    // Ustun nomi tushunarsiz bo'lsa ("A", "Ustun1") — birinchi to'ldirilgan qiymat yordam beradi.
    const example = (column: number | null | undefined) =>
        column == null ? '' : (rows.find((row) => row.cells[column])?.cells[column] ?? '')

    return (
        <Panel className="mb-5">
            <h2 className="mb-1 font-display text-lg font-semibold text-fg">{t('import.step.mapping')}</h2>
            <p className="mb-4 text-sm text-fg-muted">{t('import.mappingHint')}</p>

            <div className="mb-2 hidden grid-cols-[1fr_2rem_1fr] gap-3 text-xs font-semibold tracking-wide text-fg-faint uppercase sm:grid">
                <span>{t('import.column')}</span>
                <span />
                <span>{t('import.field')}</span>
            </div>

            <ul className="flex flex-col gap-3">
                {fields.map((field) => {
                    const column = mapping[field.key] ?? null
                    const label = t(field.labelKey)
                    const sample = example(column)
                    return (
                        <li
                            key={field.key}
                            className="grid grid-cols-1 items-start gap-1.5 sm:grid-cols-[1fr_2rem_1fr] sm:items-center sm:gap-3"
                        >
                            <div className="min-w-0">
                                <Select
                                    aria-label={`${t('import.column')} — ${label}`}
                                    placeholder={t('import.notMapped')}
                                    options={freeColumns(headers.length, mapping, column).map((index) => ({
                                        value: String(index),
                                        label: columnLabel(index),
                                    }))}
                                    value={column == null ? '' : String(column)}
                                    onChange={(event) =>
                                        onChange(field.key, event.target.value === '' ? null : Number(event.target.value))
                                    }
                                />
                                {sample && <p className="mt-1 truncate text-xs text-fg-faint">{sample}</p>}
                            </div>
                            <span aria-hidden className="text-center text-lg text-fg-faint">
                                <span className="sm:hidden">↓</span>
                                <span className="max-sm:hidden">→</span>
                            </span>
                            <div className="flex min-h-11 items-center justify-between gap-2 rounded-md border border-border-base bg-surface-muted px-3 py-2">
                                <span className="text-sm font-medium text-fg">{label}</span>
                                {field.required && <Badge tone="accent">{t('import.required')}</Badge>}
                            </div>
                        </li>
                    )
                })}
            </ul>

            {missingRequired.length > 0 && (
                <p role="alert" className="mt-4 text-sm text-danger-fg">
                    {t('import.requiredMissing', {
                        fields: missingRequired.map((field) => t(field.labelKey)).join(', '),
                    })}
                </p>
            )}
        </Panel>
    )
}
