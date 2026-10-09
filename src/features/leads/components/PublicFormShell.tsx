import type { ReactNode } from 'react'
import { LOCALES, useT } from '@/shared/i18n'
import { cn } from '@/shared/lib'
import { Brand } from '@/shared/ui'

/**
 * Ochiq sahifa qobig'i: tepada chapda logotip, o'ngda til (UZ · RU · EN).
 *
 * Ataylab sodda — nur, soya va gradientlarsiz: mijoz Instagram'dan bir
 * daqiqaga kiradi, unga bezak emas, tez to'ldiriladigan forma kerak.
 * Til tepada, chunki mijoz uni birinchi bo'lib qidiradi (tizimga kirmagan).
 */
export function PublicFormShell({ children }: { children: ReactNode }) {
    const { t, locale, setLocale } = useT()
    return (
        <div className="min-h-screen bg-surface">
            <header className="mx-auto flex max-w-md items-center justify-between px-4 pt-5">
                <Brand />
                <div role="group" aria-label={t('settings.language')} className="flex gap-1">
                    {LOCALES.map((code) => (
                        <button
                            key={code}
                            type="button"
                            aria-pressed={locale === code}
                            onClick={() => setLocale(code)}
                            className={cn(
                                'min-h-9 cursor-pointer rounded-md px-2.5 font-mono text-xs font-semibold',
                                locale === code ? 'bg-surface-card text-fg ring-1 ring-border-base' : 'text-fg-muted hover:text-fg'
                            )}
                        >
                            {code.toUpperCase()}
                        </button>
                    ))}
                </div>
            </header>
            <main className="mx-auto max-w-md px-4 py-6">
                <div className="rounded-xl border border-border-base bg-surface-card p-5 sm:p-7">{children}</div>
            </main>
        </div>
    )
}
