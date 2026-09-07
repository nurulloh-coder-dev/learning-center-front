/**
 * CSV fayl yaratish va yuklab olish uchun utility funksiyalar.
 * Excel Uzbek/Rus/Ingliz va maxsus belgilarni to'g'ri ochishi uchun UTF-8 BOM qo'shiladi.
 */

/**
 * Fayl nomidagi ruxsat berilmagan va muammo tug'diradigan belgilarni xavfsiz belgilarga almashtiradi.
 */
export function sanitizeFilename(name: string): string {
    return name.trim().replace(/[/\\?%*:|"<>]/g, '_') || 'file'
}

/**
 * Matn katagini CSV qoidalariga ko'ra formatlaydi:
 * Agar tarkibida vergul, qo'shtirnoq yoki yangi qator bo'lsa, qo'shtirnoqqa olinadi va
 * ichki qo'shtirnoqlar double-quote (`""`) qilinadi.
 */
function escapeCsvCell(cell: string | number | boolean | null | undefined): string {
    if (cell === null || cell === undefined) return ''
    const str = String(cell)
    if (/[",\n\r]/.test(str)) {
        return `"${str.replace(/"/g, '""')}"`
    }
    return str
}

/**
 * 2D massivni UTF-8 BOM ga ega CSV satriga aylantiradi.
 */
export function generateCsvContent(rows: (string | number | boolean | null | undefined)[][]): string {
    const csvRows = rows.map((row) => row.map(escapeCsvCell).join(','))
    const BOM = '\uFEFF'
    return BOM + csvRows.join('\n')
}

/**
 * Brauzerda CSV faylini yuklab olishni boshlaydi.
 */
export function downloadCsv(filename: string, content: string): void {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
}
