import type { ReactNode } from 'react'
import { useT } from '@/shared/i18n'
import type { TranslationKey } from '@/shared/i18n'
import { cn } from '@/shared/lib'
import { BuildingIcon, ChartIcon, LayersIcon, ShieldIcon, TeacherIcon, UsersIcon } from '@/shared/ui'

export type SuperAdminSection =
    | 'analytics'
    | 'students'
    | 'teachers'
    | 'administrators'
    | 'branches'
    | 'organization'

interface SectionItem {
    key: SuperAdminSection
    labelKey: TranslationKey
    icon: ReactNode
}

/**
 * Bo'limlar ikki guruhga bo'lingan: odamlar va sozlama.
 *
 * Tashkilotlar RO'YXATI ataylab yo'q — super-admin bitta markazning egasi
 * va boshqalarnikini ko'rmasligi kerak. "Tashkilot" bo'limi faqat o'zinikini
 * ochadi.
 */
const PEOPLE: SectionItem[] = [
    { key: 'analytics', labelKey: 'superAdmin.section.analytics', icon: <ChartIcon /> },
    { key: 'students', labelKey: 'superAdmin.section.students', icon: <UsersIcon /> },
    { key: 'teachers', labelKey: 'superAdmin.section.teachers', icon: <TeacherIcon /> },
    { key: 'administrators', labelKey: 'superAdmin.section.administrators', icon: <ShieldIcon /> },
]

const SETTINGS: SectionItem[] = [
    { key: 'branches', labelKey: 'superAdmin.section.branches', icon: <LayersIcon /> },
    { key: 'organization', labelKey: 'superAdmin.section.organization', icon: <BuildingIcon /> },
]

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
            ? 'bg-linear-to-r from-brand to-brand-2 font-medium text-brand-fg shadow-[0_6px_16px_-8px_var(--brand)]'
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
                        {item.icon}
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

    // Kompyuterda to'liq kenglik, telefonda tasma ichida o'z kengligi —
    // ikkisi bitta elementga birga tushmasin (`w-full` + `w-auto`).
    const renderGroup = (items: SectionItem[]) => items.map((item) => renderItem(item, 'w-full'))

    return (
        <>
            {/* Kompyuterda chap ustun */}
            {/* Namunadagidek alohida oq (dark'da navy) ustun — kontentdan ajralib turadi */}
            <nav className="hidden w-56 shrink-0 flex-col gap-1 self-start rounded-2xl border border-border-base bg-sidebar p-3 shadow-[var(--shadow-card)] lg:flex">
                <p className="px-3 pb-1 text-[0.68rem] font-semibold tracking-[0.08em] text-fg-faint uppercase">
                    {t('superAdmin.group.people')}
                </p>
                {renderGroup(PEOPLE)}

                <p className="mt-4 px-3 pb-1 text-[0.68rem] font-semibold tracking-[0.08em] text-fg-faint uppercase">
                    {t('superAdmin.group.settings')}
                </p>
                {renderGroup(SETTINGS)}
            </nav>

            {/* Telefonda gorizontal tasma — chap ustun ekranning yarmini yeydi */}
            <nav className="-mx-1 mb-4 flex gap-1 overflow-x-auto px-1 pb-1 lg:hidden">
                {[...PEOPLE, ...SETTINGS].map((item) => renderItem(item, 'shrink-0 whitespace-nowrap'))}
            </nav>
        </>
    )
}
