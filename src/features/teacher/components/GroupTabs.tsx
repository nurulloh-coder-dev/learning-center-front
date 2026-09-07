import { useT } from '@/shared/i18n'
import { cn } from '@/shared/lib'
import type { GroupNameDto } from '@/shared/types'

interface GroupTabsProps {
    groups: GroupNameDto[]
    selectedId: string
    onSelect: (groupId: string) => void
}

/**
 * Guruhlar tasmasi.
 *
 * Ochiladigan ro'yxat o'rniga tab'lar: o'qituvchida odatda 2–6 ta guruh
 * bo'ladi va ularni bir qarashda ko'rish qulayroq. Tor ekranda siljiydi.
 *
 * Vaqt ko'rsatilmaydi — `GET /group/groups` faqat `id` va `name` beradi.
 */
export function GroupTabs({ groups, selectedId, onSelect }: GroupTabsProps) {
    const { t } = useT()

    if (groups.length === 0) return null

    return (
        <div
            role="tablist"
            aria-label={t('teacher.switchGroup')}
            className="mb-5 flex gap-2 overflow-x-auto rounded-lg border border-border-base bg-surface-card p-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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
                            'flex shrink-0 cursor-pointer items-center gap-2 rounded-md px-4 py-2.5 min-h-[38px] transition-colors',
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
    )
}
