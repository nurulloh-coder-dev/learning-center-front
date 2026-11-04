import { useT } from '@/shared/i18n'
import { downloadCsv, formatPhone, generateCsv } from '@/shared/lib'
import { Badge, Button, Panel } from '@/shared/ui'
import type { CreatedLogin, FailedLine } from '../lib/importOutcome'

interface ImportResultPanelProps {
    logins: readonly CreatedLogin[]
    failed: readonly FailedLine[]
    onAgain: () => void
    onBack: () => void
}

/**
 * Natija. Yangi parollar backenddan FAQAT shu javobda keladi — shuning
 * uchun ular ekranda ko'rsatiladi va CSV qilib yuklab olinadi; sahifadan
 * chiqilsa qayta tiklab bo'lmaydi (faqat "parolni yangilash" orqali).
 */
export function ImportResultPanel({ logins, failed, onAgain, onBack }: ImportResultPanelProps) {
    const { t } = useT()

    function downloadLogins() {
        const csv = generateCsv([...logins], [
            { header: t('field.fullName'), accessor: (login) => login.fullName },
            { header: t('field.phone'), accessor: (login) => login.phone },
            {
                header: t('import.result.password'),
                accessor: (login) => login.password ?? t('import.result.existingAccount'),
            },
        ])
        downloadCsv(csv, `logins-${new Date().toISOString().slice(0, 10)}.csv`)
    }

    return (
        <Panel className="mb-5">
            <h2 className="mb-3 font-display text-lg font-semibold text-fg">{t('import.result.title')}</h2>
            <div className="mb-4 flex flex-wrap gap-2">
                <Badge tone="success">{t('import.result.created', { count: logins.length })}</Badge>
                {failed.length > 0 && <Badge tone="danger">{t('import.result.failed', { count: failed.length })}</Badge>}
            </div>

            {logins.length > 0 && (
                <>
                    <p role="alert" className="mb-3 rounded-md bg-warning-soft px-4 py-3 text-sm text-warning-fg">
                        {t('import.result.passwordsWarning')}
                    </p>
                    <div className="mb-3 max-h-96 overflow-auto rounded-lg border border-border-base">
                        <table className="w-full min-w-md text-left text-sm">
                            <thead className="sticky top-0 bg-surface-muted text-xs text-fg-muted">
                                <tr>
                                    <th className="px-3 py-2 font-semibold">{t('field.fullName')}</th>
                                    <th className="px-3 py-2 font-semibold">{t('field.phone')}</th>
                                    <th className="px-3 py-2 font-semibold">{t('import.result.password')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {logins.map((login) => (
                                    <tr key={login.phone} className="border-t border-border-base text-fg">
                                        <td className="px-3 py-2">{login.fullName}</td>
                                        <td className="px-3 py-2 whitespace-nowrap">{formatPhone(login.phone)}</td>
                                        <td className="px-3 py-2 font-mono">
                                            {login.password ?? (
                                                <span className="font-sans text-xs text-fg-faint">
                                                    {t('import.result.existingAccount')}
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <Button className="mb-5" onClick={downloadLogins}>
                        {t('import.result.downloadLogins')}
                    </Button>
                </>
            )}

            {failed.length > 0 && (
                <ul className="mb-5 flex flex-col gap-1.5 text-sm">
                    {failed.map((item) => (
                        <li key={item.line} className="flex flex-wrap items-center gap-2">
                            <span className="text-fg-faint">
                                {t('import.line')} {item.line}
                            </span>
                            <span className="text-fg">{item.fullName}</span>
                            <Badge tone="danger">{item.reason}</Badge>
                        </li>
                    ))}
                </ul>
            )}

            <div className="flex flex-wrap justify-end gap-2">
                <Button onClick={onAgain}>{t('import.result.again')}</Button>
                <Button variant="primary" onClick={onBack}>
                    {t('import.result.backToList')}
                </Button>
            </div>
        </Panel>
    )
}
