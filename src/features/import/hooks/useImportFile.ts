import { useMemo, useState } from 'react'
import { autoMatchColumns, type ColumnMapping } from '../lib/columnMatch'
import { IMPORT_FIELDS, MAX_IMPORT_ROWS, type ImportFieldKey, type ImportKind } from '../lib/importFields'
import { prepareRows } from '../lib/prepareRows'
import { readRememberedHeaders } from '../lib/rememberedHeaders'
import { readSpreadsheet, SpreadsheetError, type SheetTable, type SpreadsheetErrorCode } from '../lib/readSpreadsheet'

interface LoadedFile {
    name: string
    table: SheetTable
}

/**
 * Fayl → ustunlar mosligi → tekshirilgan qatorlar.
 *
 * Bu holat serverdan kelmaydi (fayl brauzerda o'qiladi), shuning uchun
 * `useState` da — TanStack Query faqat server ma'lumoti uchun.
 */
export function useImportFile(kind: ImportKind) {
    const fields = IMPORT_FIELDS[kind]
    const [file, setFile] = useState<LoadedFile | null>(null)
    const [mapping, setMapping] = useState<ColumnMapping>({})
    const [isReading, setIsReading] = useState(false)
    const [error, setError] = useState<SpreadsheetErrorCode | null>(null)

    async function loadFile(selected: File) {
        setIsReading(true)
        setError(null)
        try {
            const table = await readSpreadsheet(selected)
            setFile({ name: selected.name, table })
            setMapping(autoMatchColumns(table.headers, fields, readRememberedHeaders(kind)))
        } catch (caught) {
            setFile(null)
            setError(caught instanceof SpreadsheetError ? caught.code : 'unreadable')
        } finally {
            setIsReading(false)
        }
    }

    function reset() {
        setFile(null)
        setMapping({})
        setError(null)
    }

    function setColumn(field: ImportFieldKey, column: number | null) {
        setMapping((current) => ({ ...current, [field]: column }))
    }

    const missingRequired = fields.filter((field) => field.required && mapping[field.key] == null)
    const canPrepare = missingRequired.length === 0
    const rows = useMemo(
        () => (file && canPrepare ? prepareRows(file.table.rows, mapping, fields) : []),
        [file, mapping, fields, canPrepare]
    )
    const readyRows = rows.filter((row) => row.errors.length === 0)

    return {
        fields,
        file,
        mapping,
        isReading,
        error,
        loadFile,
        reset,
        setColumn,
        missingRequired,
        rows,
        readyRows,
        tooMany: readyRows.length > MAX_IMPORT_ROWS,
    }
}
