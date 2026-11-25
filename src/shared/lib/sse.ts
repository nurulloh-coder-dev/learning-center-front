/** Server-Sent Events oqimidan o'qilgan bitta hodisa. */
export interface SseMessage {
    /** `event:` maydoni; berilmasa — `message`. */
    event: string
    data: string
    /** `id:` maydoni — qayta ulanishda `Last-Event-ID` bo'lib ketadi. */
    id?: string
}

/**
 * SSE matnini hodisalarga ajratuvchi parser.
 *
 * `EventSource` ishlatilmaydi: u `Authorization` sarlavhasini yubora olmaydi,
 * tokenni esa URL ga qo'yish mumkin emas (jurnallarga tushadi). Shuning uchun
 * oqim `fetch` bilan o'qiladi va matn shu yerda bo'laklanadi.
 *
 * Parcha (chunk) hodisaning o'rtasida uzilishi mumkin, shuning uchun
 * to'liq bo'lmagan qism keyingi `push` gacha saqlanadi.
 */
export function createSseParser(onMessage: (message: SseMessage) => void) {
    let buffer = ''
    let event = ''
    let id: string | undefined
    let data: string[] = []

    function flush() {
        if (data.length > 0) onMessage({ event: event || 'message', data: data.join('\n'), id })
        event = ''
        data = []
    }

    function line(text: string) {
        if (text === '') return flush()
        // `: ping` kabi izohlar ulanishni tirik tutish uchun — e'tibor berilmaydi.
        if (text.startsWith(':')) return
        const colon = text.indexOf(':')
        const field = colon === -1 ? text : text.slice(0, colon)
        const value = colon === -1 ? '' : text.slice(colon + 1).replace(/^ /, '')
        if (field === 'event') event = value
        else if (field === 'data') data.push(value)
        else if (field === 'id') id = value
    }

    return {
        push(chunk: string) {
            buffer += chunk
            const lines = buffer.split(/\r\n|\n|\r/)
            // Oxirgi qism hali tugamagan bo'lishi mumkin.
            buffer = lines.pop() ?? ''
            lines.forEach(line)
        },
    }
}
