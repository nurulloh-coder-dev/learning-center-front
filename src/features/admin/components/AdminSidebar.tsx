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

interface AdminSidebarProps extends AdminNavProps {
    links: AdminSidebarLink[]
}

/**
 * Bo'limlar navigatsiyasi.
 *
 * Kompyuterda chap ustun, mobil ekranda gorizontal siljiydigan tasma.
 * Ikkita alohida komponent — bitta komponentni CSS bilan ikki xil qilishdan
 * ko'ra shu tushunarliroq va har biri o'z holatida to'g'ri ishlaydi.
 */
export function AdminSidebar({ entities, activeTab, onTabChange, links }: AdminSidebarProps) {
    const { t } = useT()

    return (
        <aside className="hidden w-60 shrink-0 flex-col border-r border-border-base bg-sidebar px-3 py-6 text-sidebar-fg backdrop-blur-md lg:flex">
            <div className="mb-6 flex items-center gap-2.5 px-3">
                <span className="rounded-md bg-brand px-1.5 py-0.5 font-mono text-xs tracking-[0.1em] text-brand-fg">
                    ALIA
                </span>
                <span className="font-display text-base font-semibold tracking-tight">A.L.I.A.</span>
            </div>

            <nav className="flex flex-1 flex-col gap-1">
                {entities.map((entity) => (
                    <NavItem
                        key={entity.key}
                        icon={NAV_ICON[entity.key]}
                        label={t(entity.pluralKey)}
                        isActive={activeTab === entity.key}
                        onClick={() => onTabChange(entity.key)}
                    />
                ))}

                {links.length > 0 && (
                    <>
                        <div className="mx-3 my-3 border-t border-border-base" />
                        {links.map((link) => (
                            <NavItem
                                key={link.key}
                                icon={NAV_ICON[link.key]}
                                label={t(link.labelKey)}
                                isActive={false}
                                onClick={link.onClick}
                            />
                        ))}
                    </>
                )}
            </nav>

            <div className="border-t border-border-base px-3 pt-4">
                <div className="text-[0.68rem] font-medium tracking-[0.08em] text-sidebar-fg/45 uppercase">
                    {t('admin.role')}
                </div>
            </div>
        </aside>
    )
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

function NavItem({
    icon,
    label,
    isActive,
    onClick,
}: {
    icon?: ReactNode
    label: string
    isActive: boolean
    onClick: () => void
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
                'flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors',
                isActive
                    // Faol — to'liq rangli kapsula (light: ko'k, dark: moviy→binafsha)
                    ? 'bg-linear-to-r from-brand to-brand-2 font-medium text-brand-fg shadow-[0_6px_16px_-8px_var(--brand)]'
                    : 'text-sidebar-fg/70 hover:bg-surface-hover hover:text-sidebar-fg'
            )}
        >
            <span className={cn('shrink-0', isActive ? 'text-brand-fg' : 'text-sidebar-fg/50')}>{icon}</span>
            {label}
        </button>
    )
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
                            ? 'bg-brand font-semibold text-brand-fg'
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
