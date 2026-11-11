import { useContext, useState, type ReactNode } from 'react'
import { useT } from '@/shared/i18n'
import { cn } from '@/shared/lib'
import { AppSidebar } from './AppSidebar'
import { Brand } from './Brand'
import { MenuIcon } from './icons'
import { AppNavContext, type NavSection } from './navTypes'
import { ProfileMenu } from './ProfileMenu'

interface AppShellProps {
    subtitle: string
    onSignOut: () => void
    /** `useMe` uchun — profil menyusi shu bilan o'zining ismi va rasmini yuklaydi. */
    token: string
    /** Tema va almashtirish funksiyasi. */
    theme?: string
    toggleTheme?: () => void
    /** Sahifaga xos tugmalar — mobil ekranda alohida qatorga tushadi. */
    actions?: ReactNode
    /** Sarlavha ostidagi qo'shimcha qator (guruh almashtirgich va h.k.). */
    secondary?: ReactNode
    /**
     * Sahifaning o'z bo'limlari (admin: o'quvchilar, o'qituvchilar…). Menyuda
     * umumiy havolalardan (`AppNavContext`) OLDIN turadi; berilsa, umumiy
     * "Bosh sahifa" bandi chiqmaydi — sahifaning o'zi bosh sahifa.
     */
    nav?: NavSection[]
    /** `main` uchun qo'shimcha klasslar (fon gradienti va h.k.). */
    mainClassName?: string
    children: ReactNode
}

/**
 * Barcha ekranlar uchun umumiy karkas (Atoyo ERP namunasi): chapda butun
 * balandlikdagi menyu, o'ngda oq tepa panel va kontent. Telefonda menyu
 * gamburger tugmasi bilan yon tomondan chiqadi.
 *
 * Sahifa tugmalari kompyuterda sarlavha bilan bir qatorda (o'ngda), telefonda
 * pastki tasmada — BIR marta chiziladi, joyi `order` bilan o'zgaradi.
 */
export function AppShell({
    subtitle,
    onSignOut,
    token,
    theme,
    toggleTheme,
    actions,
    secondary,
    nav,
    mainClassName,
    children,
}: AppShellProps) {
    const { t } = useT()
    const globalNav = useContext(AppNavContext)
    const [drawerOpen, setDrawerOpen] = useState(false)

    const sections: NavSection[] = [
        ...(nav ?? []),
        ...globalNav
            .map((section) => ({
                ...section,
                items: nav?.length ? section.items.filter((item) => item.key !== 'home') : section.items,
            }))
            .filter((section) => section.items.length > 0),
    ]
    const hasSidebar = sections.length > 0

    return (
        <div className="flex min-h-screen bg-surface">
            {hasSidebar && (
                <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-border-base bg-sidebar/70 backdrop-blur-xl lg:block">
                    <AppSidebar sections={sections} />
                </aside>
            )}

            {hasSidebar && drawerOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <button
                        type="button"
                        aria-label={t('common.close')}
                        onClick={() => setDrawerOpen(false)}
                        className="absolute inset-0 cursor-default bg-black/45"
                    />
                    <aside className="absolute inset-y-0 left-0 w-72 max-w-[85vw] bg-sidebar shadow-[var(--shadow-pop)]">
                        <AppSidebar sections={sections} onNavigate={() => setDrawerOpen(false)} />
                    </aside>
                </div>
            )}

            {/* `min-w-0` shart: busiz keng jadval flex elementni cho'zib yuboradi */}
            <div className="flex min-w-0 flex-1 flex-col">
                <header className="sticky top-0 z-30 border-b border-border-base bg-surface-card/80 backdrop-blur-xl">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2.5 px-4 py-3 sm:px-8">
                        <div className="flex min-w-0 items-center gap-3">
                            {hasSidebar && (
                                <button
                                    type="button"
                                    // "Menyu" — profil tugmasining nomi; bu bo'limlar ro'yxati
                                    aria-label={t('nav.group.sections')}
                                    aria-expanded={drawerOpen}
                                    onClick={() => setDrawerOpen(true)}
                                    className="-ml-1.5 flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-lg text-fg-muted hover:bg-surface-hover lg:hidden"
                                >
                                    <MenuIcon size={22} />
                                </button>
                            )}
                            {/* Kompyuterda logotip chap menyuda — tepada takrorlanmaydi */}
                            {!hasSidebar && <Brand />}
                            {!hasSidebar && <span aria-hidden="true" className="h-5 w-px bg-border-base" />}
                            <span className="truncate font-display text-lg font-bold text-fg">{subtitle}</span>
                        </div>

                        {actions && (
                            <div className="order-last -mx-px flex w-full gap-2 overflow-x-auto [scrollbar-width:none] lg:order-none lg:ml-auto lg:w-auto [&::-webkit-scrollbar]:hidden">
                                {actions}
                            </div>
                        )}

                        {/* Tugmalar bo'lsa kompyuterda o'ngga ular suriladi, profil yonida turadi */}
                        <div className={cn('ml-auto flex shrink-0 items-center gap-1.5', actions != null && 'lg:ml-0')}>
                            <ProfileMenu token={token} theme={theme} toggleTheme={toggleTheme} onSignOut={onSignOut} />
                        </div>
                    </div>

                    {secondary && <div className="px-4 pb-2.5 sm:px-8">{secondary}</div>}
                </header>

                <main className={cn('flex-1 bg-surface px-4 py-6 pb-16 sm:px-8', mainClassName)}>{children}</main>
            </div>
        </div>
    )
}
