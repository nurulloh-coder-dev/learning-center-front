import { useMemo, useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/shared/api'
import type { LeadDto } from '@/shared/types'
import { fetchLeads } from '../api/leadsApi'
import { dueReminders, readDismissedReminders, reminderKey, writeDismissedReminders } from '../lib/reminders'

const PARAMS = { size: 100, status: 'CALL_LATER', scope: 'reminders' } as const

/**
 * "Keyinroq qo'ng'iroq" vaqti kelgan lidlar. Ro'yxat daqiqada bir yangilanadi;
 * kalit `['lead', …]` ostida, shuning uchun lid o'zgarganda (o'z amalimiz
 * yoki jonli oqim) ham darhol yangilanadi. Soat esa har 30 soniyada
 * tekshiriladi — yangi so'rovsiz ham vaqti kelgan eslatma chiqadi.
 */
export function useCallReminders(token: string) {
    const { data } = useQuery({
        queryKey: queryKeys.leads(PARAMS),
        queryFn: () => fetchLeads(token, { page: 0, size: PARAMS.size, status: PARAMS.status }),
        refetchInterval: 60_000,
    })
    const [now, setNow] = useState(() => new Date())
    const [dismissed, setDismissed] = useState(readDismissedReminders)

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 30_000)
        return () => clearInterval(timer)
    }, [])

    const due = useMemo(() => dueReminders(data?.content ?? [], now, dismissed), [data, now, dismissed])

    function dismiss(lead: LeadDto) {
        setDismissed((current) => {
            const next = new Set(current).add(reminderKey(lead))
            writeDismissedReminders(next)
            return next
        })
    }

    return { due, dismiss }
}
