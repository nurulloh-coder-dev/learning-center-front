import type { ReactNode } from 'react'
import { cn } from '@/shared/lib'
import { Brand } from './Brand'
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
    /** `main` uchun qo'shimcha klasslar (fon gradienti va h.k.). */
    mainClassName?: string
    children: ReactNode
}

/**
 * Barcha ekranlar uchun umumiy karkas.
 *
 * Mobil uchun muhim qaror: sarlavha qatori HECH QACHON o'ralib ketmaydi.
 * Chapda brend (siqiladi va kesiladi), o'ngda faqat ikonkali tugmalar.
 * Sahifaga xos tugmalar esa pastdagi gorizontal siljiydigan tasmada —
 * shu tufayli tor ekranda ham baland "tugmalar ustuni" hosil bo'lmaydi.
 */
export function AppShell({
    subtitle,
    onSignOut,
    token,
    theme,
    toggleTheme,
    actions,
    secondary,
    mainClassName,
    children,
}: AppShellProps) {
    return (
        <div className="flex min-h-screen flex-col bg-surface">
            {/* Namunadagidek: oq panel, ingichka chiziq, katta soya yo'q. Kompyuterda
                sahifa tugmalari sarlavha bilan bir qatorda (o'ngda), telefonda —
                pastki qatorda gorizontal tasma. Tugmalar BIR marta chiziladi —
                faqat joyi `order` bilan o'zgaradi. */}
            <header className="sticky top-0 z-30 border-b border-border-base bg-surface-card">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2.5 px-4 py-3 sm:px-8">
                    <div className="flex min-w-0 items-center gap-3">
                        <Brand />
                        <span aria-hidden="true" className="h-5 w-px bg-border-base" />
                        <span className="truncate font-display text-lg font-semibold text-fg">{subtitle}</span>
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
    )
}
