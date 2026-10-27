import { useT } from '@/shared/i18n'
import { cn } from '@/shared/lib'
import { PEOPLE_SECTIONS as PEOPLE, SETTINGS_SECTIONS as SETTINGS, type SectionItem, type SuperAdminSection } from '../lib/sections'

export type { SuperAdminSection }

interface SuperAdminSidebarProps {
    active: SuperAdminSection
    onChange: (section: SuperAdminSection) => void
    /**
     * Diqqat talab qiladigan bo'limlar — yonida qizil nuqta chiqadi.
     *
     * Katta "boshlang'ich qadamlar" bloki o'rniga shu: blok ekranning
     * tepasida oylab turib qolardi, nuqta esa ish bajarilishi bilan
     * o'zi yo'qoladi va joy egallamaydi.
     */
    needsAttention?: SuperAdminSection[]
    /** Filial yo'q bo'lsa qolgan bo'limlar ochilmaydi. */
    lockedTo?: SuperAdminSection
}

function itemClasses(isActive: boolean) {
    return cn(
        // 44px — telefonda barmoq uchun eng kam o'lcham.
        // `cursor-pointer` ataylab yozilgan: Tailwind 4 da tugmalarga u
        // avtomatik qo'yilmaydi va ular bosilmaydigandek ko'rinadi.
        'min-h-11 cursor-pointer rounded-xl px-3 text-left text-sm transition-colors',
        isActive
            ? 'bg-brand font-medium text-brand-fg'
            : 'text-fg-muted hover:bg-surface-hover hover:text-fg'
    )
}

export function SuperAdminSidebar({
    active,
    onChange,
    needsAttention = [],
    lockedTo,
}: SuperAdminSidebarProps) {
    const { t } = useT()

    const renderItem = (item: SectionItem, extraClasses = '') => {
        const isLocked = lockedTo !== undefined && item.key !== lockedTo
        return (
            <button
                key={item.key}
                type="button"
                disabled={isLocked}
                onClick={() => onChange(item.key)}
                className={cn(
                    itemClasses(active === item.key),
                    extraClasses,
                    isLocked && 'cursor-not-allowed opacity-40'
                )}
            >
                <span className="flex items-center gap-3">
                    <span className={cn('shrink-0', active === item.key ? 'text-brand-fg' : 'text-fg-faint')}>
                        <item.Icon />
                    </span>
                    <span className="flex-1">{t(item.labelKey)}</span>
                    {needsAttention.includes(item.key) && (
                        <span
                            aria-label={t('superAdmin.needsAttention')}
                            className="size-2 shrink-0 rounded-full bg-danger"
                        />
                    )}
                </span>
            </button>
        )
    }

    return (
        // Telefonda gorizontal tasma. Kompyuterda bo'limlar umumiy chap
        // menyuda (`AppShell` `nav`, `useSuperAdminNav`).
        <nav className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1 lg:hidden">
            {[...PEOPLE, ...SETTINGS].map((item) => renderItem(item, 'shrink-0 whitespace-nowrap'))}
        </nav>
    )
}
