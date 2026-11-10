import { useT } from '@/shared/i18n'
import { cn, formatAmount } from '@/shared/lib'
import { Eyebrow, Panel } from '@/shared/ui'
import type { StudentDto } from '@/shared/types'

interface BalanceCardProps {
    /** `null` — o'quvchi kartasi hali kelmagan. */
    student: StudentDto | null
}

/**
 * O'quvchi balansi.
 *
 * Balans butun o'quvchiga tegishli (`Student.balance`), guruhga emas —
 * guruhi yo'q o'quvchi ham o'z balansini ko'rishi kerak. Manfiy son qarzni
 * bildiradi, shuning uchun qizil rangda: birinchi qarashda ko'rinsin.
 */
export function BalanceCard({ student }: BalanceCardProps) {
    const { t } = useT()

    return (
        <Panel>
            <Eyebrow>{t('student.balance')}</Eyebrow>
            <p className="mt-1 mb-4 text-sm text-fg-muted">{t('student.balanceHint')}</p>

            {/* Balans hali kelmagan — o'quvchi kartasi yuklanmoqda yoki backend javobi to'liq emas. */}
            {student?.balance === undefined && <span className="font-display text-2xl font-semibold text-fg-faint">—</span>}

            {student?.balance !== undefined && (
                <span
                    className={cn(
                        'block font-display text-3xl font-semibold tabular-nums',
                        student.balance < 0 ? 'text-danger-fg' : 'text-fg'
                    )}
                >
                    {formatAmount(student.balance)}
                </span>
            )}
        </Panel>
    )
}
