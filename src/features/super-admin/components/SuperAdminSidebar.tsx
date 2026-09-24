import { useT } from '@/shared/i18n'
import type { TranslationKey } from '@/shared/i18n'
import { cn } from '@/shared/lib'

export type SuperAdminSection =
    | 'students'
    | 'teachers'
    | 'administrators'
    | 'branches'
    | 'organization'

interface SectionItem {
    key: SuperAdminSection
    labelKey: TranslationKey
}

/**
 * Bo'limlar ikki guruhga bo'lingan: odamlar va sozlama.
 *
 * Tashkilotlar RO'YXATI ataylab yo'q — super-admin bitta markazning egasi
 * va boshqalarnikini ko'rmasligi kerak. "Tashkilot" bo'limi faqat o'zinikini
 * ochadi.
 */
const PEOPLE: SectionItem[] = [
    { key: 'students', labelKey: 'superAdmin.section.students' },
    { key: 'teachers', labelKey: 'superAdmin.section.teachers' },
    { key: 'administrators', labelKey: 'superAdmin.section.administrators' },
]

const SETTINGS: SectionItem[] = [
    { key: 'branches', labelKey: 'superAdmin.section.branches' },
    { key: 'organization', labelKey: 'superAdmin.section.organization' },
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
        'min-h-11 w-full cursor-pointer rounded-lg px-3 text-left text-sm transition-colors',
        isActive
            ? 'bg-accent-soft font-medium text-accent-fg'
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
                <span className="flex items-center justify-between gap-2">
                    {t(item.labelKey)}
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

    const renderGroup = (items: SectionItem[]) => items.map((item) => renderItem(item))

    return (
        <>
            {/* Kompyuterda chap ustun */}
            <nav className="hidden w-52 shrink-0 flex-col gap-1 lg:flex">
                <p className="px-3 pb-1 font-mono text-[0.6rem] tracking-[0.05em] text-fg-faint uppercase">
                    {t('superAdmin.group.people')}
                </p>
                {renderGroup(PEOPLE)}

                <p className="mt-4 px-3 pb-1 font-mono text-[0.6rem] tracking-[0.05em] text-fg-faint uppercase">
                    {t('superAdmin.group.settings')}
                </p>
                {renderGroup(SETTINGS)}
            </nav>

            {/* Telefonda gorizontal tasma — chap ustun ekranning yarmini yeydi */}
            <nav className="-mx-1 mb-4 flex gap-1 overflow-x-auto px-1 pb-1 lg:hidden">
                {[...PEOPLE, ...SETTINGS].map((item) => renderItem(item, 'w-auto shrink-0'))}
            </nav>
        </>
    )
}
