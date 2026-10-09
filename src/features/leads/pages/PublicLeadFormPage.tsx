import { useParams, useSearchParams } from 'react-router-dom'
import { ApiError } from '@/shared/api'
import { useT } from '@/shared/i18n'
import { Button } from '@/shared/ui'
import { PublicFormShell } from '../components/PublicFormShell'
import { PublicLeadForm } from '../components/PublicLeadForm'
import { usePublicLeadForm, useSubmitPublicLead } from '../hooks/useLeadForm'
import { sourceFromParam } from '../lib/leadFormLink'

/**
 * `/f/<kalit>` — Instagram/Telegram'dan kelgan mijoz to'ldiradigan ochiq forma.
 * Tizimga kirish talab qilinmaydi (`AppRoutes` uni sessiyadan oldin chizadi).
 */
export function PublicLeadFormPage() {
    const { t } = useT()
    const { key = '' } = useParams()
    const [searchParams] = useSearchParams()
    const form = usePublicLeadForm(key)
    const submit = useSubmitPublicLead(key)

    if (form.isLoading) {
        return (
            <PublicFormShell>
                <p className="text-center text-sm text-fg-muted">{t('common.loading')}</p>
            </PublicFormShell>
        )
    }

    if (form.error || !form.data) {
        const notFound = form.error instanceof ApiError && form.error.status === 404
        return (
            <PublicFormShell>
                {notFound && <h1 className="mb-2 font-display text-xl font-semibold text-fg">{t('leadForm.notFoundTitle')}</h1>}
                <p className="text-sm text-fg-muted">{notFound ? t('leadForm.notFoundText') : t('leadForm.loadFailed')}</p>
                {!notFound && (
                    <Button className="mt-5" onClick={() => void form.refetch()}>
                        {t('leadForm.retry')}
                    </Button>
                )}
            </PublicFormShell>
        )
    }

    const data = form.data
    return (
        <PublicFormShell>
            <div className="mb-6 flex items-center gap-3">
                {data.logoUrl && <img src={data.logoUrl} alt="" className="size-12 rounded-xl object-cover" />}
                {/* Markaz nomi — backenddan, tarjima qilinmaydi. */}
                <p className="font-display text-base font-semibold text-fg">{data.organizationName}</p>
            </div>
            {submit.isSuccess ? (
                <div role="status" className="py-6 text-center">
                    <p className="font-display text-2xl font-semibold text-fg">{t('leadForm.successTitle')}</p>
                    <p className="mt-2 text-sm text-fg-muted">{t('leadForm.successText')}</p>
                </div>
            ) : (
                <>
                    {/* Administrator yozgan sarlavha bo'lsa — o'sha, aks holda standart. */}
                    <h1 className="font-display text-2xl font-semibold tracking-tight text-fg">
                        {data.title || t('leadForm.defaultTitle')}
                    </h1>
                    <p className="mt-2 mb-6 text-sm text-fg-muted">{data.description || t('leadForm.defaultDescription')}</p>
                    <PublicLeadForm
                        form={data}
                        source={sourceFromParam(searchParams.get('src'))}
                        isSending={submit.isPending}
                        error={submit.error}
                        onSubmit={(body) => submit.mutate(body)}
                    />
                </>
            )}
        </PublicFormShell>
    )
}
