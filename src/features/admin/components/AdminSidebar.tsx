import type { ReactNode } from 'react'
import { useT } from '@/shared/i18n'
import type { TranslationKey } from '@/shared/i18n'
import { cn } from '@/shared/lib'
import { BookOpenIcon, FolderIcon, LayersIcon, TargetIcon, TeacherIcon, UsersIcon, WalletIcon } from '@/shared/ui'
import type { EntityConfig, EntityKey } from '../types'

/** Sidebarning pastki guruhidagi havola — tab emas, marshrutga o'tadi. */
export interface AdminSidebarLink {
    key: string
    labelKey: TranslationKey
    onClick: () => void
}

interface AdminNavProps {
    entities: EntityConfig[]
    activeTab: EntityKey
    onTabChange: (tab: EntityKey) => void
    links?: AdminSidebarLink[]
}

/** Belgisi bo'lmagan yangi bo'lim qo'shilsa, menyu buzilmaydi — faqat belgisiz chiqadi. */
const NAV_ICON: Record<string, ReactNode> = {
    students: <UsersIcon />,
    teachers: <TeacherIcon />,
    groups: <FolderIcon />,
    lessons: <BookOpenIcon />,
    'group-levels': <LayersIcon />,
    leads: <TargetIcon />,
    payments: <WalletIcon />,
}

/** Bo'lim ikonkasi — umumiy chap menyu (`AppShell` `nav`) uchun. */
export function AdminNavIcon({ navKey }: { navKey: string }) {
    return <>{NAV_ICON[navKey] ?? null}</>
}

/** Mobil variant — sarlavha ostidagi tasma. */
export function AdminTabStrip({ entities, activeTab, onTabChange, links }: AdminNavProps) {
    const { t } = useT()

    return (
        <div className="relative lg:hidden">
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-6 bg-gradient-to-l from-surface to-transparent" />
            <div className="flex gap-2 overflow-x-auto pr-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {entities.map((entity) => (
                <button
                    key={entity.key}
                    type="button"
                    onClick={() => onTabChange(entity.key)}
                    className={cn(
                        'shrink-0 cursor-pointer rounded-full px-3.5 py-1.5 max-sm:py-2.5 max-sm:min-h-11 text-xs whitespace-nowrap transition-colors',
                        activeTab === entity.key
                            ? 'bg-linear-to-r from-brand to-brand-2 font-semibold text-brand-fg'
                            : 'border border-border-base text-fg-muted hover:bg-surface-hover'
                    )}
                >
                    {t(entity.pluralKey)}
                </button>
            ))}
            {links && links.length > 0 && (
                <>
                    <div className="my-auto h-4 w-px shrink-0 bg-border-base" />
                    {links.map((link) => (
                        <button
                            key={link.key}
                            type="button"
                            onClick={link.onClick}
                            className="shrink-0 cursor-pointer rounded-full border border-border-base px-3.5 py-1.5 max-sm:py-2.5 max-sm:min-h-11 text-xs whitespace-nowrap text-fg-muted transition-colors hover:bg-surface-hover hover:text-fg"
                        >
                            {t(link.labelKey)}
                        </button>
                    ))}
                </>
            )}
            </div>
        </div>
    )
}
