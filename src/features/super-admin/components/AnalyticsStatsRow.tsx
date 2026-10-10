import type { ReactNode } from 'react'
import { useT } from '@/shared/i18n'
import { formatAmount } from '@/shared/lib'
import { FolderIcon, LayersIcon, StatCard, TargetIcon, TeacherIcon, UsersIcon, WalletIcon } from '@/shared/ui'
import type { AnalyticsCategory } from '@/shared/types'
import type { AnalyticsItemResult } from '../hooks/useAnalytics'

const CATEGORY_ICON: Record<AnalyticsCategory, { icon: ReactNode; tone: string }> = {
    student: { icon: <UsersIcon />, tone: 'bg-accent-soft text-accent-fg' },
    teacher: { icon: <TeacherIcon />, tone: 'bg-success-soft text-success-fg' },
    lead: { icon: <TargetIcon />, tone: 'bg-amber-soft text-amber-fg' },
    invoice: { icon: <WalletIcon />, tone: 'bg-purple-soft text-purple-fg' },
    enrollment: { icon: <FolderIcon />, tone: 'bg-accent-soft text-accent-fg' },
    branch: { icon: <LayersIcon />, tone: 'bg-steel-soft text-steel-fg' },
}

/** Hisob-fakturalar — pul: "1950000" emas, "1 950 000". */
function formatTotal(category: AnalyticsCategory, value: number): string {
    return category === 'invoice' ? formatAmount(value) : String(value)
}

/** Tepadagi to'rt karta (namunadagidek). A'zolar va filiallar — "Tezkor havolalar"da. */
const MAIN_CATEGORIES: AnalyticsCategory[] = ['invoice', 'student', 'lead', 'teacher']

export function AnalyticsStatsRow({
    items,
    categories = MAIN_CATEGORIES,
}: {
    items: Record<AnalyticsCategory, AnalyticsItemResult>
    categories?: AnalyticsCategory[]
}) {
    const { t } = useT()

    return (
        <div className="grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-4">
            {categories.map((category) => {
                const item = items[category]
                const hasError = Boolean(item?.error)
                const totalText = hasError
                    ? t('analytics.error')
                    : item?.total === null
                      ? '—'
                      : item?.total === undefined
                        ? '···'
                        : formatTotal(category, item.total)

                const thisMonthText = hasError
                    ? null
                    : item?.thisMonth === null || item?.thisMonth === undefined
                      ? null
                      : t('analytics.thisMonth', { count: formatTotal(category, item.thisMonth) })

                return (
                    <StatCard
                        key={category}
                        label={t(`analytics.${category}` as Parameters<typeof t>[0])}
                        icon={CATEGORY_ICON[category].icon}
                        tone={CATEGORY_ICON[category].tone}
                        value={hasError ? <span className="text-sm font-normal text-danger-fg">{totalText}</span> : totalText}
                        hint={thisMonthText ?? (item?.isLoading ? '···' : null)}
                    />
                )
            })}
        </div>
    )
}
