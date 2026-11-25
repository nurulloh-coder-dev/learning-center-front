import { useNavigate } from 'react-router-dom'
import { useT } from '@/shared/i18n'
import { Button, TargetIcon } from '@/shared/ui'
import { useCallReminders } from '../hooks/useCallReminders'
import { formatCallAt } from '../lib/schedule'

/**
 * "Keyinroq qo'ng'iroq" vaqti kelganda istalgan sahifada chiqadigan oyna.
 * "Lidni ko'rish" Lidlar sahifasiga olib boradi va kartani yondiradi
 * (`?lead=<id>` → `useLeadHighlight`). Bir vaqtda bitta eslatma, qolgani soni.
 */
export function LeadReminder({ token }: { token: string }) {
    const { t, locale } = useT()
    const navigate = useNavigate()
    const { due, dismiss } = useCallReminders(token)
    const lead = due[0]
    if (!lead) return null

    const labels = { today: t('lead.today'), tomorrow: t('lead.tomorrow') }

    return (
        <div
            role="alert"
            className="fixed inset-x-4 bottom-16 z-50 rounded-xl border border-accent bg-surface-card p-4 shadow-lg sm:inset-x-auto sm:right-4 sm:w-96"
        >
            <div className="flex items-start gap-3">
                <span className="mt-0.5 shrink-0 text-accent">
                    <TargetIcon size={22} />
                </span>
                <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-fg">{t('lead.reminder.title')}</p>
                    <p className="mt-1 truncate text-sm text-fg">{lead.fullName || t('lead.unnamed')}</p>
                    {lead.phone && (
                        <a href={`tel:${lead.phone}`} className="text-sm text-accent-fg hover:underline">
                            {lead.phone}
                        </a>
                    )}
                    <p className="mt-0.5 text-xs text-fg-muted">
                        {t('lead.callAt')}: {formatCallAt(lead.callAt, new Date(), locale, labels)}
                    </p>
                    {due.length > 1 && (
                        <p className="mt-1 text-xs text-fg-muted">{t('lead.reminder.more', { count: due.length - 1 })}</p>
                    )}
                </div>
            </div>
            <div className="mt-3 flex justify-end gap-2">
                <Button size="sm" onClick={() => dismiss(lead)}>
                    {t('lead.reminder.dismiss')}
                </Button>
                <Button
                    size="sm"
                    variant="primary"
                    onClick={() => {
                        dismiss(lead)
                        navigate(`/leads?lead=${encodeURIComponent(lead.id)}`)
                    }}
                >
                    {t('lead.reminder.open')}
                </Button>
            </div>
        </div>
    )
}
