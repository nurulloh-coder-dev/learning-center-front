import { errorMessage } from '@/shared/api'
import { useT } from '@/shared/i18n'
import { Button, ErrorBox, Modal } from '@/shared/ui'
import { useLeadCourseOptions } from '../hooks/useLeads'
import { useLeadFormMutations, useMyLeadForm } from '../hooks/useLeadForm'
import { LeadFormLinkCard } from './LeadFormLinkCard'
import { LeadFormSettingsFields } from './LeadFormSettingsFields'

/** "Forma havolasi" oynasi — markazning ochiq lid formasini boshqarish. */
export function LeadFormSettingsModal({ token, onClose }: { token: string; onClose: () => void }) {
    const { t } = useT()
    const form = useMyLeadForm(token)
    const levels = useLeadCourseOptions(token)
    const mutations = useLeadFormMutations(token)

    function regenerate() {
        if (confirm(t('leadForm.regenerateConfirm'))) mutations.regenerate.mutate()
    }

    return (
        <Modal eyebrow={t('leadForm.settingsEyebrow')} title={t('leadForm.settingsTitle')} onClose={onClose} maxWidth="max-w-2xl">
            <p className="mb-5 text-sm text-fg-muted">{t('leadForm.intro')}</p>
            {form.isLoading ? (
                <p className="text-sm text-fg-muted">{t('common.loading')}</p>
            ) : form.error ? (
                <ErrorBox>{t('leadForm.loadSettingsFailed', { message: errorMessage(form.error) })}</ErrorBox>
            ) : !form.data ? (
                <div className="rounded-xl border border-dashed border-border-base p-6 text-center">
                    <p className="mb-4 text-sm text-fg-muted">{t('leadForm.notCreated')}</p>
                    <Button variant="primary" disabled={mutations.create.isPending} onClick={() => mutations.create.mutate()}>
                        {t('leadForm.create')}
                    </Button>
                </div>
            ) : (
                <div className="flex flex-col gap-6">
                    <LeadFormLinkCard formKey={form.data.key} />
                    <hr className="border-border-base" />
                    {/* `key` — kalit yangilansa sozlama formasi serverdagi holatdan qayta boshlanadi. */}
                    <LeadFormSettingsFields
                        key={form.data.key}
                        form={form.data}
                        levels={levels.data ?? []}
                        isSaving={mutations.update.isPending}
                        onSave={(body) => mutations.update.mutate(body)}
                    />
                    <hr className="border-border-base" />
                    <div className="flex justify-start">
                        <Button variant="danger" size="sm" disabled={mutations.regenerate.isPending} onClick={regenerate}>
                            {t('leadForm.regenerate')}
                        </Button>
                    </div>
                </div>
            )}
        </Modal>
    )
}
