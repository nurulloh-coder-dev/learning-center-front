import { parseCsv } from './parseCsv'

export interface SheetRow {
    /** Fayldagi asl qator raqami (1 dan) — bo'sh qatorlar tashlansa ham Excel'dagi bilan bir xil. */
    line: number
    cells: string[]
}

export interface SheetTable {
    headers: string[]
    rows: SheetRow[]
}

export type SpreadsheetErrorCode = 'unsupported' | 'empty' | 'unreadable'

/** Fayl o'qilmadi — sababi UI matniga (`import.error.*`) aylantiriladi. */
export class SpreadsheetError extends Error {
    readonly code: SpreadsheetErrorCode

    constructor(code: SpreadsheetErrorCode) {
        super(code)
        this.code = code
    }
}

/**
 * Faylni BRAUZERNING O'ZIDA o'qiydi — serverga fayl yuborilmaydi, faqat
 * administrator tasdiqlagan qatorlar JSON bo'lib ketadi.
 *
 * Eski `.xls` (Excel 97–2003) qo'llab-quvvatlanmaydi: uni o'qiydigan
 * kutubxona katta va eskirgan. Administratorga "xlsx yoki csv qilib saqlang"
 * deyiladi.
 */
export async function readSpreadsheet(file: File): Promise<SheetTable> {
    const name = file.name.toLowerCase()
    let cells: string[][]
    if (name.endsWith('.csv') || name.endsWith('.txt')) {
        cells = parseCsv(await file.text())
    } else if (name.endsWith('.xlsx')) {
        cells = await readXlsx(file)
    } else {
        throw new SpreadsheetError('unsupported')
    }
    return toTable(cells)
}

async function readXlsx(file: File): Promise<string[][]> {
    // Kutubxona faqat shu sahifada kerak — asosiy bundle'ga tushmasin.
    const { readSheet } = await import('read-excel-file/browser')
    try {
        const data = await readSheet(file)
        return data.map((row) => row.map(cellToString))
    } catch {
        throw new SpreadsheetError('unreadable')
    }
}

/** Excel katakchasi har xil turda keladi; biz hammasini matn qilib olamiz. */
export function cellToString(value: unknown): string {
    if (value == null || typeof value === 'boolean') return ''
    // Sana katakchasi UTC yarim tunda keladi — mahalliy vaqtga o'tkazilsa
    // G'arb mintaqalarida bir kun oldinga surilib qoladi.
    if (value instanceof Date) return Number.isNaN(value.getTime()) ? '' : value.toISOString().slice(0, 10)
    return String(value).trim()
}

/** Bo'sh qatorlarni tashlab, birinchisini sarlavha qiladi. */
export function toTable(cells: string[][]): SheetTable {
    const filled = cells
        .map((row, index) => ({ line: index + 1, cells: row.map((cell) => cell.trim()) }))
        .filter((row) => row.cells.some((cell) => cell !== ''))
    if (filled.length < 2) throw new SpreadsheetError('empty')
    const [header, ...rows] = filled
    return {
        headers: header.cells,
        rows: rows.map((row) => ({ line: row.line, cells: header.cells.map((_, index) => row.cells[index] ?? '') })),
    }
}
