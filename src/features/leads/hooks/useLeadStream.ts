import { useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { apiStream } from '@/shared/api'
import { createSseParser } from '@/shared/lib'

/**
 * Backend `LeadStreamEmitterController` — markazning lidlari o'zgarganda
 * xabar beradi. Yo'l `/api/v1` ostida bo'lishi kerak (proksi faqat shuni
 * o'tkazadi); backend boshqa yo'lga qo'ysa, shu bitta joy o'zgaradi.
 */
export const LEAD_STREAM_PATH = '/stream/leads/stream'

const MIN_DELAY_MS = 1_000
const MAX_DELAY_MS = 30_000

function sleep(ms: number, signal: AbortSignal) {
    return new Promise<void>((resolve) => {
        const timer = setTimeout(resolve, ms)
        signal.addEventListener('abort', () => {
            clearTimeout(timer)
            resolve()
        })
    })
}

/**
 * Lidlar ro'yxatini jonli yangilaydi: boshqa xodim lid qo'shsa, o'zgartirsa
 * yoki ochiq formadan lid tushsa — so'rovni kutmasdan ro'yxat yangilanadi.
 *
 * Hodisa ichidagi lid tanasidan foydalanilmaydi, shunchaki ro'yxat qayta
 * yuklanadi: filtr, qidiruv va sahifalash serverda hisoblanadi, ularni
 * brauzerda takrorlash xatoga olib keladi.
 *
 * Qaytadi: oqim hozir ulanganmi. Ulanmagan bo'lsa chaqiruvchi eski usulga
 * (davriy so'rov) tayanadi — shuning uchun backend oqimni hali qo'llamasa
 * ham ekran buzilmaydi.
 */
export function useLeadStream(token: string): boolean {
    const client = useQueryClient()
    const [connected, setConnected] = useState(false)

    useEffect(() => {
        const controller = new AbortController()
        const { signal } = controller
        let lastEventId: string | undefined
        let failures = 0

        const refresh = () => void client.invalidateQueries({ queryKey: ['lead'] })

        async function run() {
            while (!signal.aborted) {
                try {
                    const response = await apiStream(LEAD_STREAM_PATH, { token, signal, lastEventId })
                    const reader = response.body!.getReader()
                    const decoder = new TextDecoder()
                    const parser = createSseParser((message) => {
                        if (message.id) lastEventId = message.id
                        if (message.event === 'connected') {
                            failures = 0
                            setConnected(true)
                        } else if (message.event === 'lead-changed' || message.event === 'resync') {
                            refresh()
                        }
                    })
                    for (;;) {
                        const { done, value } = await reader.read()
                        if (done) break
                        parser.push(decoder.decode(value, { stream: true }))
                    }
                } catch {
                    // Uzilish yoki xato: pastda kutib, qayta ulanamiz.
                }
                if (signal.aborted) return
                setConnected(false)
                failures += 1
                await sleep(Math.min(MAX_DELAY_MS, MIN_DELAY_MS * 2 ** (failures - 1)), signal)
            }
        }

        void run()
        return () => controller.abort()
    }, [client, token])

    return connected
}
