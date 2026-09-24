import { useT } from '@/shared/i18n'
import { formatDate } from '@/shared/lib'
import { daysLeft } from '../lib/daysLeft'
import type { SubscriptionDto } from '@/shared/types'

/** Shu kundan kam qolganda ogohlantirish ko'rinadi. */
const WARN_DAYS = 7

export function MySubscriptionPanel({
    subscription,
    isLoading,
}: {
    subscription: SubscriptionDto | null
    isLoading: boolean
}) {
    const { t } = useT()

    if (isLoading) return null

    // Obuna umuman yo'q — yangi markazda shunday bo'ladi va bu xato emas.
    if (!subscription) return null

    const remaining = daysLeft(subscription.expiresAt)
    const isExpired = remaining !== null && remaining < 0
    const isEnding = remaining !== null && remaining >= 0 && remaining <= WARN_DAYS

    /*
     * Hammasi joyida bo'lsa BU BLOK UMUMAN CHIZILMAYDI.
     *
     * Ilgari u har safar ekranning tepasida turardi va eng kerakli
     * ma'lumotni pastga surib yuborardi. Tarif haqidagi to'liq ma'lumot
     * "Tashkilot" bo'limida turadi; bu yerda faqat muddat tugayotgani
     * haqida ogohlantirish chiqadi.
     */
    if (!isExpired && !isEnding) return null

    return (
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-danger/15 bg-danger-soft px-4 py-3">
            <p className="text-sm text-danger-fg">
                {isExpired ? t('subscription.expiredWarning') : t('subscription.endingWarning')}
            </p>
            <p className="font-mono text-xs text-danger-fg/80">
                {subscription.plan?.name} · {t('subscription.expiresAt')}:{' '}
                {formatDate(subscription.expiresAt) || '—'}
            </p>
        </div>
    )
}
