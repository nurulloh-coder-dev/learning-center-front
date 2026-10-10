import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMe } from '@/shared/hooks'
import { useT } from '@/shared/i18n'
import { cn } from '@/shared/lib'
import type { Role } from '@/shared/types'
import type { TranslationKey } from '@/shared/i18n'
import { Avatar } from './Avatar'
import { MoonIcon, SettingsIcon, SignOutIcon, SunIcon } from './icons'

/** Rolni tarjima kalitiga o'giradi — har bo'limda o'z `<bo'lim>.role` kaliti bor. */
const ROLE_LABEL_KEY: Record<Role, TranslationKey> = {
    DEVELOPER: 'superAdmin.developerRole',
    SUPER_ADMIN: 'superAdmin.role',
    ADMINISTRATOR: 'admin.role',
    TEACHER: 'teacher.role',
    STUDENT: 'student.role',
}

interface ProfileMenuProps {
    token: string
    theme?: string
    toggleTheme?: () => void
    onSignOut: () => void
}

/**
 * O'ng yuqori burchakdagi profil menyusi.
 *
 * Avval sozlamalar/tema/chiqish uchta alohida ikonkali tugma edi — bitta
 * avatarga yig'ildi, ochilganda hammasi shu menyu ichida.
 */
export function ProfileMenu({ token, theme, toggleTheme, onSignOut }: ProfileMenuProps) {
    const { t } = useT()
    const navigate = useNavigate()
    const { data: me } = useMe(token)
    const [open, setOpen] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)
    const isDark = theme === 'dark'

    useEffect(() => {
        if (!open) return

        function handlePointerDown(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setOpen(false)
            }
        }
        function handleKey(event: KeyboardEvent) {
            if (event.key === 'Escape') setOpen(false)
        }

        document.addEventListener('mousedown', handlePointerDown)
        document.addEventListener('keydown', handleKey)
        return () => {
            document.removeEventListener('mousedown', handlePointerDown)
            document.removeEventListener('keydown', handleKey)
        }
    }, [open])

    return (
        <div className="relative" ref={containerRef}>
            <button
                type="button"
                onClick={() => setOpen((current) => !current)}
                aria-haspopup="menu"
                aria-expanded={open}
                aria-label={t('nav.menu')}
                className="cursor-pointer rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
                <Avatar name={me?.fullName} src={me?.imageUrl} />
            </button>

            {open && (
                <div
                    role="menu"
                    className="absolute top-[calc(100%+0.5rem)] right-0 z-40 w-60 rounded-xl border border-border-base bg-surface-card/95 p-2 shadow-[var(--shadow-pop)] backdrop-blur-xl"
                >
                    <div className="flex items-center gap-2.5 px-2 py-2">
                        <Avatar name={me?.fullName} src={me?.imageUrl} />
                        <div className="min-w-0">
                            <p className="truncate font-display text-sm font-medium text-fg">
                                {me?.fullName || '—'}
                            </p>
                            <p className="truncate font-mono text-[0.7rem] text-fg-faint">
                                {me?.role ? t(ROLE_LABEL_KEY[me.role]) : ''}
                            </p>
                        </div>
                    </div>

                    <div className="my-1.5 border-t border-border-base" />

                    <button
                        type="button"
                        role="menuitem"
                        onClick={() => {
                            setOpen(false)
                            navigate('/settings')
                        }}
                        className="flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-2 py-2 text-left text-sm text-fg-muted hover:bg-surface-hover"
                    >
                        <SettingsIcon />
                        {t('nav.settings')}
                    </button>

                    <button
                        type="button"
                        role="menuitem"
                        onClick={toggleTheme}
                        className="flex w-full cursor-pointer items-center justify-between gap-2.5 rounded-lg px-2 py-2 text-left text-sm text-fg-muted hover:bg-surface-hover"
                    >
                        <span className="flex items-center gap-2.5">
                            {isDark ? <MoonIcon /> : <SunIcon />}
                            {t('nav.theme')}
                        </span>
                        <span className="font-mono text-[0.7rem] text-fg-faint">
                            {isDark ? t('nav.theme.dark') : t('nav.theme.light')}
                        </span>
                    </button>

                    <div className="my-1.5 border-t border-border-base" />

                    <button
                        type="button"
                        role="menuitem"
                        onClick={() => {
                            setOpen(false)
                            onSignOut()
                        }}
                        className={cn(
                            'flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-2 py-2 text-left text-sm text-danger-fg',
                            'hover:bg-danger hover:text-white'
                        )}
                    >
                        <SignOutIcon />
                        {t('common.signOut')}
                    </button>
                </div>
            )}
        </div>
    )
}
