import { useTheme } from '@/app/providers/useTheme'
import { LOCALE_LABELS, LOCALES, useT } from '@/shared/i18n'
import { Brand, SegmentedControl, ThemeToggle } from '@/shared/ui'
import { LoginForm } from '../components/LoginForm'
import type { Locale } from '@/shared/i18n'
import type { Session } from '@/shared/types'

/**
 * Ikki ustunli kirish sahifasi.
 *
 * Til tanlagichi ATAYLAB shu yerda: foydalanuvchi hali tizimga kirmagan,
 * ya'ni Sozlamalarga o'ta olmaydi — tilni kirishdan oldin tanlay olishi kerak.
 * O'ng ustun (bezak) kichik ekranlarda butunlay yashiriladi.
 */
export function LoginPage({ onLoggedIn }: { onLoggedIn: (session: Session) => void }) {
    const { t, locale, setLocale } = useT()
    const { theme, toggleTheme } = useTheme()

    return (
        <div className="grid min-h-screen lg:grid-cols-[minmax(360px,460px)_1fr]">
            <div className="flex flex-col justify-center bg-surface px-6 pt-8 pb-12 sm:px-14 sm:py-10">
                <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
                    <Brand subtitle={t('auth.brand')} className="min-w-0" />
                    <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
                </div>

                <h1 className="mb-2 font-display text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
                    {t('auth.headline')}
                </h1>
                <p className="mb-7 text-fg-muted">{t('auth.subtitle')}</p>

                <LoginForm onLoggedIn={onLoggedIn} />

                <div className="mt-7 pb-2">
                    <SegmentedControl<Locale>
                        label={t('settings.language')}
                        value={locale}
                        onChange={setLocale}
                        options={LOCALES.map((code) => ({ value: code, label: LOCALE_LABELS[code] }))}
                    />
                </div>
            </div>

            <div className="relative hidden items-end overflow-hidden bg-sidebar p-14 lg:flex">
                {/* Daftar chiziqlari — sof bezak, shuning uchun aria-hidden */}
                <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-[repeating-linear-gradient(to_bottom,transparent,transparent_27px,rgba(250,246,238,0.08)_28px)]"
                />
                <div className="relative max-w-sm">
                    <span className="mb-4 inline-flex -rotate-2 rounded-sm border-[1.5px] border-brand px-2 py-0.5 font-mono text-[0.65rem] tracking-[0.05em] text-brand uppercase">
                        {t('auth.stamp')}
                    </span>
                    <p className="font-display text-2xl leading-snug text-sidebar-fg/90 italic">
                        {t('auth.quote')}
                    </p>
                </div>
            </div>
        </div>
    )
}
