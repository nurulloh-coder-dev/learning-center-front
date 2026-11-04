import { useState, type DragEvent } from 'react'
import { useT } from '@/shared/i18n'
import { cn } from '@/shared/lib'
import { Button, ErrorBox, Field, Panel, Select, type SelectOption } from '@/shared/ui'
import type { SpreadsheetErrorCode } from '../lib/readSpreadsheet'

interface FileStepProps {
    branchOptions: SelectOption[]
    branchId: string
    onBranchChange: (branchId: string) => void
    fileName: string | null
    rowCount: number
    isReading: boolean
    error: SpreadsheetErrorCode | null
    onFile: (file: File) => void
    onReset: () => void
}

/** 1-qadam: filial va fayl. Fayl tanlash ham, sudrab tashlash ham ishlaydi. */
export function FileStep({
    branchOptions,
    branchId,
    onBranchChange,
    fileName,
    rowCount,
    isReading,
    error,
    onFile,
    onReset,
}: FileStepProps) {
    const { t } = useT()
    const [isDragging, setIsDragging] = useState(false)

    function handleDrop(event: DragEvent<HTMLLabelElement>) {
        event.preventDefault()
        setIsDragging(false)
        const dropped = event.dataTransfer.files[0]
        if (dropped) onFile(dropped)
    }

    return (
        <Panel className="mb-5">
            <h2 className="mb-1 font-display text-lg font-semibold text-fg">{t('import.step.file')}</h2>
            <p className="mb-4 text-sm text-fg-muted">{t('import.fileHint')}</p>

            <Field label={t('field.branch')} className="mb-4 sm:max-w-sm">
                <Select
                    options={branchOptions}
                    placeholder={t('import.chooseBranch')}
                    value={branchId}
                    onChange={(event) => onBranchChange(event.target.value)}
                />
            </Field>
            <p className="-mt-2 mb-4 text-xs text-fg-faint">{t('import.branchHint')}</p>

            {fileName ? (
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border-base bg-surface-muted px-4 py-3">
                    <span className="min-w-0 truncate text-sm font-medium text-fg">
                        {t('import.fileInfo', { name: fileName, count: rowCount })}
                    </span>
                    <Button size="sm" onClick={onReset}>
                        {t('import.otherFile')}
                    </Button>
                </div>
            ) : (
                <label
                    onDragOver={(event) => {
                        event.preventDefault()
                        setIsDragging(true)
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    className={cn(
                        'flex min-h-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-6 text-center text-sm transition-colors',
                        isDragging
                            ? 'border-accent bg-accent-soft text-accent-fg'
                            : 'border-border-strong text-fg-muted hover:border-accent hover:text-fg'
                    )}
                >
                    <span className="font-medium">{isReading ? t('import.reading') : t('import.dropHere')}</span>
                    <span className="text-xs text-fg-faint">.xlsx · .csv</span>
                    <input
                        type="file"
                        accept=".xlsx,.csv,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        className="sr-only"
                        disabled={isReading}
                        onChange={(event) => {
                            const selected = event.target.files?.[0]
                            if (selected) onFile(selected)
                            // Bir xil faylni qayta tanlasa ham `change` ishlasin.
                            event.target.value = ''
                        }}
                    />
                </label>
            )}

            {error && (
                <div className="mt-3">
                    <ErrorBox>{t(`import.error.${error}`)}</ErrorBox>
                </div>
            )}
        </Panel>
    )
}
