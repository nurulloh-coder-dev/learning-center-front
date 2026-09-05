import { useState } from 'react'
import type { LeadCreateDto, LeadDto, LeadSource, LeadUpdateDto } from '@/shared/types'
import { LEAD_SOURCES } from '@/shared/types'
import { useT } from '@/shared/i18n'
import { Button, ErrorBox, Field, Input, Modal, Select } from '@/shared/ui'
import { useLeadCourseOptions } from '../hooks/useLeads'
import { isValidPhone, normalizePhone } from '../lib/phone'

export interface LeadFormModalProps {
    token: string
    lead?: LeadDto | null
    isPending?: boolean
    onClose: () => void
    onSubmit: (data: LeadCreateDto | LeadUpdateDto) => void
}

export function LeadFormModal({ token, lead, isPending, onClose, onSubmit }: LeadFormModalProps) {
    const { t } = useT()
    const courseOptions = useLeadCourseOptions(token)

    const isEdit = Boolean(lead)
    const [fullName, setFullName] = useState(lead?.fullName ?? '')
    const [phone, setPhone] = useState(lead?.phone ?? '')
    const [source, setSource] = useState<LeadSource | ''>(lead?.source ?? '')
    const [preferredCourse, setPreferredCourse] = useState(lead?.preferredCourse?.id ?? '')

    // Xato faqat yuborishga urinilgandan keyin ko'rsatiladi — yozayotgan
    // paytda "noto'g'ri" deb turish bezovta qiladi.
    const [showErrors, setShowErrors] = useState(false)

    const nameError = fullName.trim() === ''
    const phoneError = !isValidPhone(phone)

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (nameError || phoneError) {
            setShowErrors(true)
            return
        }

        const trimmedName = fullName.trim()
        const trimmedPhone = normalizePhone(phone)
        const trimmedCourse = preferredCourse.trim() || undefined

        if (isEdit && lead) {
            const body: LeadUpdateDto = {
                fullName: trimmedName,
                phone: trimmedPhone,
                source: source || undefined,
                preferredCourse: trimmedCourse,
                status: lead.status ?? 'NEW',
            }
            onSubmit(body)
        } else {
            const body: LeadCreateDto = {
                fullName: trimmedName,
                phone: trimmedPhone,
                source: source || undefined,
                preferredCourse: trimmedCourse,
            }
            onSubmit(body)
        }
    }

    return (
        <Modal
            eyebrow={isEdit ? t('lead.edit') : t('lead.newTitle')}
            title={isEdit ? t('lead.editTitle') : t('lead.newTitle')}
            onClose={onClose}
            footer={
                <>
                    <Button onClick={onClose}>{t('common.cancel')}</Button>
                    <Button variant="primary" onClick={handleSubmit} disabled={isPending}>
                        {t('common.save')}
                    </Button>
                </>
            }
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <Field label={t('lead.fullName')}>
                    <Input value={fullName} onChange={(event) => setFullName(event.target.value)} />
                    {showErrors && nameError && <ErrorBox>{t('lead.nameRequired')}</ErrorBox>}
                </Field>
                <Field label={t('lead.phone')}>
                    <Input
                        type="tel"
                        placeholder="+998901234567"
                        value={phone}
                        onChange={(event) => setPhone(event.target.value)}
                    />
                    <p className="mt-1 text-xs text-fg-muted">{t('lead.phoneHint')}</p>
                    {showErrors && phoneError && <ErrorBox>{t('lead.phoneInvalid')}</ErrorBox>}
                </Field>
                <Field label={t('lead.source')}>
                    <Select
                        placeholder={t('lead.selectSource')}
                        value={source}
                        options={LEAD_SOURCES.map((src) => ({ value: src, label: t(`lead.source.${src}`) || src }))}
                        onChange={(event) => setSource(event.target.value as LeadSource | '')}
                    />
                </Field>
                <Field label={t('lead.preferredCourse')}>
                    <Select
                        placeholder={t('lead.selectCourse')}
                        value={preferredCourse}
                        options={courseOptions.data ?? []}
                        onChange={(event) => setPreferredCourse(event.target.value)}
                    />
                </Field>
            </form>
        </Modal>
    )
}
