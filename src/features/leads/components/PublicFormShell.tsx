import type { ReactNode } from 'react'
import { LOCALE_LABELS, LOCALES, useT, type Locale } from '@/shared/i18n'
import { Brand, SegmentedControl } from '@/shared/ui'

/**
 * Ochiq sahifa qobig'i: markazdagi karta, pastda til tanlagich.
 * Mijoz tizimga kirmagan — tilni shu yerning o'zida tanlay olishi kerak.
 */
export function PublicFormShell({ children }: { children: ReactNode }) {
    const { t, locale, setLocale } = useT()
    return (
        <div className="relative min-h-screen overflow-hidden bg-surface px-4 py-10 sm:py-16">
            <div
                aria-hidden="true"
                className="absolute inset-0 bg-[radial-gradient(60%_40%_at_50%_0%,rgb(99_102_241/0.16),transparent_70%)]"
            />
            <main className="relative mx-auto flex max-w-md flex-col gap-6">
                <div className="rounded-2xl border border-border-base bg-surface-card p-6 shadow-[var(--shadow-card)] sm:p-8">
                    {children}
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <SegmentedControl<Locale>
                        label={t('settings.language')}
                        value={locale}
                        onChange={setLocale}
                        options={LOCALES.map((code) => ({ value: code, label: LOCALE_LABELS[code] }))}
                    />
                    <Brand />
                </div>
            </main>
        </div>
    )
}
