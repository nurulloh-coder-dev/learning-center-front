/**
 * CSV matnini katakchalar jadvaliga aylantiradi.
 *
 * Ajratuvchi birinchi qatordan aniqlanadi: Excel'ning rus/o'zbek sozlamasi
 * CSV ni `;` bilan saqlaydi, boshqa dasturlar `,` yoki tab bilan.
 * Qo'shtirnoq ichidagi ajratuvchi va qator ko'chishi katakcha ichida qoladi.
 */
export function parseCsv(text: string): string[][] {
    const source = text.replace(/^\uFEFF/, '')
    const delimiter = detectDelimiter(source)
    const rows: string[][] = []
    let row: string[] = []
    let cell = ''
    let quoted = false

    for (let index = 0; index < source.length; index++) {
        const char = source[index]
        if (quoted) {
            if (char === '"' && source[index + 1] === '"') {
                cell += '"'
                index++
            } else if (char === '"') {
                quoted = false
            } else {
                cell += char
            }
            continue
        }
        if (char === '"') quoted = true
        else if (char === delimiter) {
            row.push(cell)
            cell = ''
        } else if (char === '\n' || char === '\r') {
            if (char === '\r' && source[index + 1] === '\n') index++
            row.push(cell)
            rows.push(row)
            row = []
            cell = ''
        } else cell += char
    }
    if (cell !== '' || row.length > 0) {
        row.push(cell)
        rows.push(row)
    }
    return rows
}

function detectDelimiter(text: string): string {
    const firstLine = text.split(/\r?\n/, 1)[0] ?? ''
    const candidates = [';', ',', '\t']
    let best = ','
    let bestCount = 0
    for (const candidate of candidates) {
        const count = firstLine.split(candidate).length - 1
        if (count > bestCount) {
            best = candidate
            bestCount = count
        }
    }
    return best
}
