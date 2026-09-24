import { useT } from '@/shared/i18n'
import { cn } from '@/shared/lib'
import { SegmentedControl } from '@/shared/ui'
import type { GroupNameDto } from '@/shared/types'

export type DayFilter = 'all' | 'ODD' | 'EVEN'

interface GroupTabsProps {
    groups: GroupNameDto[]
    selectedId: string
    onSelect: (groupId: string) => void
    /** Berilmasa juft/toq tanlagichi ko'rsatilmaydi. */
    dayFilter?: DayFilter
    onDayFilterChange?: (value: DayFilter) => void
}

/**
 * Juft/toq tanlagichi.
 *
 * Guruhlar RO'YXATI USTIDA turadi, yuqori qatorda emas: u aynan shu
 * ro'yxatni filtrlaydi va undan uzoqda tursa, nimaga ta'sir qilayotgani
 * ko'rinmaydi.
 */
function DayFilterControl({
    value,
    onChange,
    compact = false,
}: {
    value: DayFilter
    onChange: (value: DayFilter) => void
    /** Chap ustunda joy tor — qisqa nomlar ishlatiladi. */
    compact?: boolean
}) {
    const { t } = useT()

    return (
        <SegmentedControl<DayFilter>
            label={t('teacher.allDays')}
            value={value}
            onChange={onChange}
            className="mb-2"
            options={[
                { value: 'all', label: compact ? t('teacher.allShort') : t('teacher.allDays') },
                {
                    value: 'ODD',
                    label: compact ? t('teacher.oddShort') : t('group.dayType.ODD'),
                },
                {
                    value: 'EVEN',
                    label: compact ? t('teacher.evenShort') : t('group.dayType.EVEN'),
                },
            ]}
        />
    )
}

/**
 * Guruhlar TASMASI — faqat tor ekran uchun.
 *
 * Kompyuterda `GroupSidebar` ishlatiladi: administrator va super-admin
 * panellarida chap ustun bor, o'qituvchida esa yo'q edi va uchta panel
 * uch xil ko'rinardi.
 *
 * Vaqt ko'rsatilmaydi — `GET /group/groups` faqat `id` va `name` beradi.
 */
export function GroupTabs({
    groups,
    selectedId,
    onSelect,
    dayFilter,
    onDayFilterChange,
}: GroupTabsProps) {
    const { t } = useT()

    if (groups.length === 0 && !onDayFilterChange) return null

    return (
        <div className="lg:hidden">
            {dayFilter && onDayFilterChange && (
                <DayFilterControl value={dayFilter} onChange={onDayFilterChange} />
            )}
        <div
            role="tablist"
            aria-label={t('teacher.switchGroup')}
            className="mb-4 flex gap-2 overflow-x-auto lg:hidden rounded-lg border border-border-base bg-surface-card p-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
            {groups.map((group) => {
                const isActive = group.id === selectedId
                return (
                    <button
                        key={group.id}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        onClick={() => onSelect(group.id)}
                        className={cn(
                            'flex shrink-0 cursor-pointer items-center gap-2 rounded-md px-4 py-2 max-sm:py-3 max-sm:min-h-11 transition-colors',
                            isActive ? 'bg-purple-soft' : 'hover:bg-surface-hover'
                        )}
                    >
                        <span
                            className={cn(
                                'text-sm font-semibold whitespace-nowrap',
                                isActive ? 'text-purple-fg' : 'text-fg'
                            )}
                        >
                            {group.name}
                        </span>
                        {group.dayType && (
                            <span className="rounded-full bg-steel-soft px-2 py-0.5 font-mono text-[0.58rem] text-steel-fg uppercase">
                                {t(`group.dayType.${group.dayType}`)}
                            </span>
                        )}
                    </button>
                )
            })}
        </div>
        </div>
    )
}

/**
 * Guruhlar ustuni — kompyuter uchun.
 *
 * Tasma o'rniga ustun: guruh nomlari uzun bo'lishi mumkin va yonma-yon
 * turganda ular qisqarib, o'qituvchi qaysi guruhda ekanini darrov
 * ajrata olmaydi. Ustunda har biri to'liq ko'rinadi.
 */
export function GroupSidebar({
    groups,
    selectedId,
    onSelect,
    dayFilter,
    onDayFilterChange,
}: GroupTabsProps) {
    const { t } = useT()

    if (groups.length === 0 && !onDayFilterChange) return null

    return (
        <nav
            aria-label={t('teacher.switchGroup')}
            className="hidden w-52 shrink-0 flex-col gap-1 lg:flex"
        >
            <p className="px-3 pb-1 font-mono text-[0.6rem] tracking-[0.05em] text-fg-faint uppercase">
                {t('teacher.myGroups')}
            </p>
            {dayFilter && onDayFilterChange && (
                <DayFilterControl value={dayFilter} onChange={onDayFilterChange} compact />
            )}
            {groups.map((group) => {
                const isActive = group.id === selectedId
                return (
                    <button
                        key={group.id}
                        type="button"
                        aria-current={isActive ? 'true' : undefined}
                        onClick={() => onSelect(group.id)}
                        className={cn(
                            'min-h-11 w-full cursor-pointer rounded-lg px-3 text-left transition-colors',
                            isActive ? 'bg-purple-soft' : 'hover:bg-surface-hover'
                        )}
                    >
                        <span
                            className={cn(
                                'block text-sm font-medium',
                                isActive ? 'text-purple-fg' : 'text-fg'
                            )}
                        >
                            {group.name}
                        </span>
                        {group.dayType && (
                            <span className="mt-0.5 block font-mono text-[0.58rem] text-fg-faint uppercase">
                                {t(`group.dayType.${group.dayType}`)}
                            </span>
                        )}
                    </button>
                )
            })}
        </nav>
    )
}
