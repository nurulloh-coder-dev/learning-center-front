import { useT } from '@/shared/i18n'
import { cn, formatAmount } from '@/shared/lib'
import { Badge, EmptyState, Eyebrow, Panel, PendingBackend } from '@/shared/ui'
import type { BadgeTone } from '@/shared/ui'
import type { EnrollmentPaymentStatus, StudentDto } from '@/shared/types'

const PAYMENT_STATUS_TONE: Record<EnrollmentPaymentStatus, BadgeTone> = {
    UNPAID: 'danger',
    PARTIAL: 'warning',
    PAID: 'success',
}

interface BalanceCardProps {
    /** `null` — guruh tanlanmagan (o'quvchi hech qaysi guruhda emas). */
    student: StudentDto | null
    hasGroup: boolean
}

/**
 * Tanlangan guruh bo'yicha balans.
 *
 * Balans `paidAmount - monthlyFee` — ya'ni MANFIY son qarzni bildiradi.
 * Shuning uchun manfiy qiymat qizil rangda: o'quvchi buni birinchi
 * qarashda ko'rishi kerak.
 */
export function BalanceCard({ student, hasGroup }: BalanceCardProps) {
    const { t } = useT()

    return (
        <Panel>
            <Eyebrow>{t('student.balance')}</Eyebrow>
            <p className="mt-1 mb-4 text-sm text-fg-muted">{t('student.balanceHint')}</p>

            {!hasGroup && <EmptyState title={t('student.noGroups')} />}

            {/* Guruh bor, lekin balans kelmagan — backend javobi to'liq emas. */}
            {hasGroup && student?.balance === undefined && <PendingBackend />}

            {hasGroup && student?.balance !== undefined && (
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <span
                        className={cn(
                            'font-display text-2xl sm:text-3xl font-semibold tabular-nums min-w-0 break-words',
                            student.balance < 0 ? 'text-danger-fg' : 'text-fg'
                        )}
                    >
                        {formatAmount(student.balance)}
                    </span>
                    {student.status && (
                        <Badge tone={PAYMENT_STATUS_TONE[student.status]}>
                            {t(`student.paymentStatus.${student.status}`)}
                        </Badge>
                    )}
                </div>
            )}
        </Panel>
    )
}
