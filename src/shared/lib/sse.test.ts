import { describe, expect, it } from 'vitest'
import { createSseParser, type SseMessage } from './sse'

function collect() {
    const messages: SseMessage[] = []
    return { messages, parser: createSseParser((message) => messages.push(message)) }
}

describe('createSseParser', () => {
    it('nomi, id si va ma’lumoti bilan hodisani o’qiydi', () => {
        const { messages, parser } = collect()

        parser.push('id: 12\nevent: lead-changed\ndata: {"leadId":"l1"}\n\n')

        expect(messages).toEqual([{ event: 'lead-changed', data: '{"leadId":"l1"}', id: '12' }])
    })

    it('hodisa parchalar orasida uzilsa ham to’liq qaytaradi', () => {
        const { messages, parser } = collect()

        parser.push('event: lead-chan')
        parser.push('ged\ndata: {"a"')
        parser.push(':1}\n')
        expect(messages).toHaveLength(0)
        parser.push('\n')

        expect(messages).toEqual([{ event: 'lead-changed', data: '{"a":1}', id: undefined }])
    })

    it('ping izohlarini tashlab yuboradi', () => {
        const { messages, parser } = collect()

        parser.push(': ping\n\n')

        expect(messages).toEqual([])
    })

    it('CRLF qator ajratgichini tushunadi va ko’p qatorli ma’lumotni birlashtiradi', () => {
        const { messages, parser } = collect()

        parser.push('data: bir\r\ndata: ikki\r\n\r\n')

        expect(messages[0].data).toBe('bir\nikki')
        expect(messages[0].event).toBe('message')
    })

    it('id keyingi hodisalarda ham saqlanadi (Last-Event-ID uchun)', () => {
        const { messages, parser } = collect()

        parser.push('id: 5\nevent: a\ndata: 1\n\nevent: b\ndata: 2\n\n')

        expect(messages.map((message) => message.id)).toEqual(['5', '5'])
    })
})
