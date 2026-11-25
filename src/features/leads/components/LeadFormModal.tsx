import { useState } from 'react'
import { useDraft } from '@/shared/hooks'
import type { LeadCreateDto, LeadDto, LeadSource, LeadUpdateDto } from '@/shared/types'
import { LEAD_SOURCES } from '@/shared/types'
import { useT } from '@/shared/i18n'
import { Button, ErrorBox, Field, Input, Modal, PhoneInput, Select } from '@/shared/ui'
import { useLeadCourseOptions } from '../hooks/useLeads'
import { isCompleteUzPhone, normalizePhone } from '@/shared/lib'

export interface LeadFormModalProps {
    token: string
    lead?: LeadDto | null
    isPending?: boolean
    onClose: () => void
    onSubmit: (data: LeadCreateDto | Omit<LeadUpdateDto, 'version'>) => void
}

export function LeadFormModal({ token, lead, isPending, onClose, onSubmit }: LeadFormModalProps) {
    const { t } = useT()
    const courseOptions = useLeadCourseOptions(token)

    const isEdit = Boolean(lead)
    const draft = useDraft(lead ? `lead-edit:${lead.id}` : 'lead-new', {
        fullName: lead?.fullName ?? '',
        phone: lead?.phone ?? '',
        source: (lead?.source ?? '') as LeadSource | '',
        preferredCourse: lead?.preferredCourse?.id ?? '',
    })
    const { fullName, phone, source, preferredCourse } = draft.value
    const update = (patch: Partial<typeof draft.value>) => draft.setValue((current) => ({ ...current, ...patch }))

    // Xato faqat yuborishga urinilgandan keyin ko'rsatiladi — yozayotgan
    // paytda "noto'g'ri" deb turish bezovta qiladi.
    const [showErrors, setShowErrors] = useState(false)

    const nameError = fullName.trim() === ''
    const phoneError = !isCompleteUzPhone(phone)

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (nameError || phoneError) {
            setShowErrors(true)
            return
        }
        draft.discard()

        const trimmedName = fullName.trim()
        const trimmedPhone = normalizePhone(phone)
        const trimmedCourse = preferredCourse.trim() || undefined

        if (isEdit && lead) {
            const body: Omit<LeadUpdateDto, 'version'> = {
                fullName: trimmedName,
                phone: trimmedPhone,
                source: source || undefined,
                preferredCourseId: trimmedCourse,
                status: lead.status ?? 'NEW',
            }
            onSubmit(body)
        } else {
            const body: LeadCreateDto = {
                fullName: trimmedName,
                phone: trimmedPhone,
                source: source || undefined,
                preferredCourseId: trimmedCourse,
            }
            onSubmit(body)
        }
    }

    return (
        <Modal
            eyebrow={isEdit ? t('lead.edit') : t('lead.newTitle')}
            title={isEdit ? t('lead.editTitle') : t('lead.newTitle')}
            onClose={onClose}
            draft={draft}
            footer={
                <>
                    <Button
                        onClick={() => {
                            draft.discard()
                            onClose()
                        }}
                    >{t('common.cancel')}</Button>
                    <Button variant="primary" onClick={handleSubmit} disabled={isPending}>
                        {t('common.save')}
                    </Button>
                </>
            }
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <Field label={t('lead.fullName')}>
                    <Input value={fullName} onChange={(event) => update({ fullName: event.target.value })} />
                    {showErrors && nameError && <ErrorBox>{t('lead.nameRequired')}</ErrorBox>}
                </Field>
                <Field label={t('lead.phone')}>
                    <PhoneInput value={phone} onChange={(next) => update({ phone: next })} />
                    <p className="mt-1 text-xs text-fg-muted">{t('lead.phoneHint')}</p>
                    {showErrors && phoneError && <ErrorBox>{t('lead.phoneInvalid')}</ErrorBox>}
                </Field>
                <Field label={t('lead.source')}>
                    <Select
                        placeholder={t('lead.selectSource')}
                        value={source}
                        options={LEAD_SOURCES.map((src) => ({ value: src, label: t(`lead.source.${src}`) || src }))}
                        onChange={(event) => update({ source: event.target.value as LeadSource | '' })}
                    />
                </Field>
                <Field label={t('lead.preferredCourse')}>
                    <Select
                        placeholder={t('lead.selectCourse')}
                        value={preferredCourse}
                        options={courseOptions.data ?? []}
                        onChange={(event) => update({ preferredCourse: event.target.value })}
                    />
                </Field>
            </form>
        </Modal>
    )
}
