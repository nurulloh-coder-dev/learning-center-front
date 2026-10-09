import { useMemo, useState } from 'react'
import { useT, type TranslationKey } from '@/shared/i18n'
import { Button, Field, Input, Select } from '@/shared/ui'
import { buildLeadFormLink, LINK_PLACEMENTS, type LinkPlacement } from '../lib/leadFormLink'
import { qrDataUrl } from '../lib/qrCode'

const PLACEMENT_LABEL: Record<LinkPlacement, TranslationKey> = {
    instagram: 'lead.source.INSTAGRAM',
    telegram: 'lead.source.TELEGRAM',
    facebook: 'lead.source.FACEBOOK',
    other: 'leadForm.placement.other',
}

/** Havola, nusxalash, ochib ko'rish va QR-kod. */
export function LeadFormLinkCard({ formKey }: { formKey: string }) {
    const { t } = useT()
    const [placement, setPlacement] = useState<LinkPlacement>('instagram')
    const [copied, setCopied] = useState(false)
    const link = buildLeadFormLink(window.location.origin, formKey, placement)
    const qr = useMemo(() => qrDataUrl(link), [link])

    async function copy() {
        try {
            await navigator.clipboard.writeText(link)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch {
            // Clipboard yopiq (http yoki ruxsat yo'q) — maydon belgilanadi, qo'lda nusxalanadi.
        }
    }

    return (
        <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
            <div className="flex min-w-0 flex-col gap-3">
                <Field label={t('leadForm.placement')}>
                    <Select
                        value={placement}
                        options={LINK_PLACEMENTS.map((value) => ({ value, label: t(PLACEMENT_LABEL[value]) }))}
                        onChange={(event) => setPlacement(event.target.value as LinkPlacement)}
                    />
                </Field>
                <Input readOnly aria-label={t('leadForm.open')} value={link} onFocus={(event) => event.target.select()} />
                <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="primary" onClick={() => void copy()}>
                        {copied ? t('leadForm.copied') : t('leadForm.copy')}
                    </Button>
                    <a
                        href={link}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex min-h-9 items-center rounded-lg border border-border-base px-3.5 text-xs text-fg hover:bg-surface-hover max-sm:min-h-11"
                    >
                        {t('leadForm.preview')}
                    </a>
                </div>
            </div>
            <div className="flex flex-col items-center gap-2">
                <img src={qr} alt={t('leadForm.qrAlt')} className="size-36 rounded-lg border border-border-base bg-white p-1" />
                <a href={qr} download={`lead-form-${placement}.gif`} className="text-xs font-semibold text-accent hover:underline">
                    {t('leadForm.downloadQr')}
                </a>
            </div>
        </div>
    )
}
