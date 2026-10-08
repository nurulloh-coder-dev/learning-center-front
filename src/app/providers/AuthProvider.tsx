import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { logout, refreshSession, toSession } from '@/features/auth/api/authApi'
import { setTokenRefresher } from '@/shared/api'
import { clearAllDrafts } from '@/shared/lib'
import { AuthContext } from './auth-context'
import type { Session } from '@/shared/types'

/**
 * Sessiya holati.
 *
 * Token faqat React state'da yashaydi — `localStorage` da EMAS. Uzoq muddatli
 * kirish httpOnly refresh cookie orqali ta'minlanadi, ya'ni XSS token o'g'irlay
 * olmaydi. Sahifa yangilanganda `refresh-token` yangi access token beradi.
 *
 * Access token 15 daqiqada eskiradi, shuning uchun provider `apiFetch` ga
 * yangilash funksiyasini ham berib qo'yadi: so'rov 401/403 bo'lsa token
 * jimgina yangilanadi va so'rov qaytariladi. Busiz foydalanuvchi 15
 * daqiqadan keyin bo'sh ekran ko'rardi.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
    const [session, setSession] = useState<Session | null>(null)
    const [isRestoring, setIsRestoring] = useState(true)
    const queryClient = useQueryClient()
    /*
     * Chiqish boshlandi — token endi yangilanmaydi. Busiz chiqqan zahoti
     * orqada qolgan so'rov 403 olsa (backend eskirgan token va ruxsatsiz
     * so'rovga bir xil 403 beradi), `apiFetch` refresh cookie bilan jimgina
     * yangi sessiya olib, odamni qaytadan kiritib yuborardi. Refresh javobi
     * logout'dan keyin kelsa, cookie ham qayta yozilib qolardi.
     */
    const signedOut = useRef(false)

    useEffect(() => {
        let cancelled = false

        refreshSession()
            .then((response) => {
                if (!cancelled) setSession(toSession(response))
            })
            // 401 — cookie yo'q yoki eskirgan, ya'ni kirilmagan. Bu xato emas.
            .catch(() => {})
            .finally(() => {
                if (!cancelled) setIsRestoring(false)
            })

        return () => {
            cancelled = true
        }
    }, [])

    const signIn = useCallback((next: Session) => {
        signedOut.current = false
        setSession(next)
    }, [])
    const signOut = useCallback(() => {
        signedOut.current = true
        // Javobni kutmaymiz: chiqish darhol bo'lsin. Endpoint xato bersa ham
        // (hali deploy qilinmagan bo'lsa) frontend baribir chiqadi.
        logout().catch(() => {})
        setSession(null)
        void queryClient.cancelQueries()
        // Keshda oldingi foydalanuvchining ma'lumotlari qoladi — shu
        // brauzerda keyin kirgan boshqa odam ularni bir lahza ko'rardi.
        queryClient.clear()
        // Qoralamalarda ism va telefon bor — keyingi odamga qolmasin.
        clearAllDrafts()
    }, [queryClient])

    useEffect(() => {
        setTokenRefresher(async () => {
            if (signedOut.current) return null
            try {
                const next = toSession(await refreshSession())
                // Yangilash chiqishdan oldin boshlangan bo'lsa ham natijasi kerak emas.
                if (signedOut.current) return null
                setSession(next)
                return next?.token ?? null
            } catch {
                // Refresh cookie ham o'lgan — sessiyani tugatamiz, marshrutlar
                // login ekraniga qaytaradi.
                setSession(null)
                return null
            }
        })
        return () => setTokenRefresher(null)
    }, [])

    const value = useMemo(
        () => ({ session, signIn, signOut, isRestoring }),
        [session, signIn, signOut, isRestoring]
    )

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
