import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

const HIGHLIGHT_MS = 3_000

/**
 * `/leads?lead=<id>` — eslatmadan kelinganda o'sha kartani ekranga suradi
 * va 3 soniya yondiradi, so'ng parametrni olib tashlaydi.
 *
 * Holat (`useState`) yo'q: yonish URL dagi parametrdan hisoblanadi, shuning
 * uchun "orqaga" tugmasi yoki ikkinchi eslatma ham to'g'ri ishlaydi.
 * Karta hali yuklanmagan bo'lsa (`isLoaded` false) kutiladi.
 */
export function useLeadHighlight(isLoaded: (id: string) => boolean): string | null {
    const [params, setParams] = useSearchParams()
    const target = params.get('lead')
    const ready = target !== null && isLoaded(target)

    useEffect(() => {
        if (!target || !ready) return
        document.getElementById(`lead-${target}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        const timer = setTimeout(() => {
            setParams(
                (current) => {
                    const next = new URLSearchParams(current)
                    next.delete('lead')
                    return next
                },
                { replace: true }
            )
        }, HIGHLIGHT_MS)
        return () => clearTimeout(timer)
    }, [target, ready, setParams])

    return ready ? target : null
}
