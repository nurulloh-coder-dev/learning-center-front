import { useState } from 'react'
import { cn } from '@/shared/lib'
import { ChevronDownIcon } from './icons'
import type { NavItem, NavSection } from './navTypes'

interface AppSidebarProps {
    sections: NavSection[]
    /** Band bosilgandan keyin (telefonda yon menyuni yopish uchun). */
    onNavigate?: () => void
}

/**
 * Chap menyu — Atoyo ERP namunasidagidek: tepada logotip, ostida
 * guruhlangan bandlar, sarlavhali guruh yig'iladi. Faol band — to'liq rangli
 * kapsula (light: ko'k, dark: moviy→binafsha).
 */
export function AppSidebar({ sections, onNavigate }: AppSidebarProps) {
    const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})

    function renderItem(item: NavItem) {
        return (
            <button
                key={item.key}
                type="button"
                disabled={item.disabled}
                aria-current={item.active ? 'page' : undefined}
                onClick={() => {
                    item.onClick()
                    onNavigate?.()
                }}
                className={cn(
                    // 44px — telefonda barmoq uchun eng kam o'lcham
                    'flex min-h-11 w-full cursor-pointer items-center gap-3 rounded-xl px-3 text-left text-sm transition-colors',
                    'disabled:cursor-not-allowed disabled:opacity-40',
                    item.active
                        ? 'bg-brand font-semibold text-brand-fg'
                        : 'font-medium text-sidebar-fg/80 hover:bg-surface-hover hover:text-sidebar-fg'
                )}
            >
                {item.icon && (
                    <span className={cn('shrink-0', item.active ? 'text-brand-fg' : 'text-sidebar-fg/55')}>{item.icon}</span>
                )}
                <span className="flex-1 truncate">{item.label}</span>
                {item.dot && <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-danger" />}
            </button>
        )
    }

    return (
        <div className="flex h-full flex-col">
            <div className="flex items-center gap-2.5 px-5 py-5">
                <span className="flex size-9 items-center justify-center rounded-full bg-brand font-display text-xs font-bold text-brand-fg">
                    AL
                </span>
                <span className="font-display text-base font-bold tracking-tight text-sidebar-fg">A.L.I.A.</span>
            </div>

            <nav className="flex flex-1 flex-col gap-4 overflow-y-auto px-3 pb-6">
                {sections.map((section) => {
                    const isCollapsed = section.label ? collapsed[section.key] === true : false
                    return (
                        <div key={section.key} className="flex flex-col gap-1">
                            {section.label && (
                                <button
                                    type="button"
                                    aria-expanded={!isCollapsed}
                                    onClick={() => setCollapsed((current) => ({ ...current, [section.key]: !isCollapsed }))}
                                    className="flex cursor-pointer items-center justify-between px-3 pb-1 text-[0.7rem] font-bold tracking-[0.06em] text-fg-faint uppercase hover:text-fg-muted"
                                >
                                    {section.label}
                                    <span className={cn('transition-transform', isCollapsed && '-rotate-90')}>
                                        <ChevronDownIcon size={16} />
                                    </span>
                                </button>
                            )}
                            {!isCollapsed && section.items.map(renderItem)}
                        </div>
                    )
                })}
            </nav>
        </div>
    )
}
