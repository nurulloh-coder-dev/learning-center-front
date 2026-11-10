import { useT } from '@/shared/i18n'
import { PendingTag, StatCard } from '@/shared/ui'
import type { TranslationKey } from '@/shared/i18n'
import type { GroupStatsDto } from '@/shared/types'

interface Kpi {
    labelKey: TranslationKey
    value: (stats: GroupStatsDto) => number | undefined
}

const KPIS: Kpi[] = [
    { labelKey: 'kpi.total', value: (s) => s.totalStudents },
    { labelKey: 'kpi.active', value: (s) => s.activeStudents },
    { labelKey: 'kpi.new', value: (s) => s.newStudents },
    { labelKey: 'kpi.lost', value: (s) => s.lostStudents },
    {
        labelKey: 'kpi.potentialFail',
        value: (s) => s.potentialFailStudents,
    },
]

/**
 * Qizil va qora ro'yxat ALOHIDA turadi, chunki ular hali hisoblanmaydi:
 * backend so'rovida ikkalasi ham `CAST(0 AS BIGINT)`. Birinchisi uy
 * vazifasi imkoniyatini, ikkinchisi bloklangan o'quvchi statusini kutyapti.
 *
 * Ularni qolganlari bilan birga "0" qilib ko'rsatish yaramaydi: o'qituvchi
 * "muammoli o'quvchi yo'q" deb tushunadi, holbuki hech kim sanamagan.
 * Shuning uchun raqam o'rnida "—" va "endpoint yo'q" belgisi turadi.
 */
const PENDING_KPIS: { labelKey: TranslationKey }[] = [
    { labelKey: 'kpi.redList' },
    { labelKey: 'kpi.blackList' },
]

function KpiCard({ label, value }: { label: string; value: number | undefined }) {
    return <StatCard compact label={label} value={value ?? '—'} muted={value === undefined} />
}

/**
 * O'qituvchi ko'rsatkichlari — uning BARCHA guruhlari bo'yicha birga.
 *
 * Backend `groupId` qabul qilmaydi, shuning uchun bu pastdagi tanlangan
 * guruhga emas, umumiy manzaraga tegishli. Sarlavha shuni aytib turadi,
 * aks holda o'qituvchi raqamlarni tanlangan guruhniki deb o'ylaydi.
 */
export function KpiRow({ stats }: { stats: GroupStatsDto | null }) {
    const { t } = useT()

    return (
        <section className="mb-5">
            <div className="mb-2 flex items-center justify-between gap-3">
                <p className="text-xs text-fg-faint">
                    {t('kpi.allGroups')}
                </p>
                <PendingTag />
            </div>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 xl:grid-cols-7">
                {KPIS.map((kpi) => (
                    <KpiCard key={kpi.labelKey} label={t(kpi.labelKey)} value={stats ? kpi.value(stats) : undefined} />
                ))}
                {PENDING_KPIS.map((kpi) => (
                    <KpiCard key={kpi.labelKey} label={t(kpi.labelKey)} value={undefined} />
                ))}
            </div>
        </section>
    )
}
