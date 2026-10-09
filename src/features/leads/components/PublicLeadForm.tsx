import { useState, type FormEvent } from 'react'
import { errorMessage } from '@/shared/api'
import { useT } from '@/shared/i18n'
import { isCompleteUzPhone, normalizePhone, UZ_PHONE_PREFIX } from '@/shared/lib'
import type { LeadSource, PublicLeadFormDto, PublicLeadSubmitDto } from '@/shared/types'
import { Button, ErrorBox, Field, Input, PhoneInput, Select } from '@/shared/ui'

interface PublicLeadFormProps {
    form: PublicLeadFormDto
    source: LeadSource
    isSending: boolean
    error: unknown
    onSubmit: (body: PublicLeadSubmitDto) => void
}

/**
 * Mijoz to'ldiradigan forma: ism, telefon, kurs. Maydonlar qat'iy —
 * backend lid yaratishda aynan shularni qabul qiladi.
 */
export function PublicLeadForm({ form, source, isSending, error, onSubmit }: PublicLeadFormProps) {
    const { t } = useT()
    const [fullName, setFullName] = useState('')
    const [phone, setPhone] = useState(UZ_PHONE_PREFIX)
    const [courseId, setCourseId] = useState('')
    // Botlar har maydonni to'ldiradi; odam bu maydonni ko'rmaydi.
    const [website, setWebsite] = useState('')
    // Xato faqat yuborishga urinilgandan keyin — yozayotganda "noto'g'ri" deb turish bezovta qiladi.
    const [showErrors, setShowErrors] = useState(false)

    const nameError = fullName.trim() === ''
    const phoneError = !isCompleteUzPhone(phone)
    const courseError = form.courseRequired && courseId === ''
    const courseLabel = form.courseRequired ? t('leadForm.course') : t('leadForm.courseOptional')

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        if (nameError || phoneError || courseError) {
            setShowErrors(true)
            return
        }
        onSubmit({
            fullName: fullName.trim(),
            phone: normalizePhone(phone),
            preferredCourseId: courseId || undefined,
            source,
            website,
        })
    }

    return (
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            <Field label={t('leadForm.fullName')}>
                <Input autoComplete="name" value={fullName} onChange={(event) => setFullName(event.target.value)} />
                {showErrors && nameError && <ErrorBox>{t('leadForm.nameRequired')}</ErrorBox>}
            </Field>
            <Field label={t('leadForm.phone')}>
                <PhoneInput value={phone} onChange={setPhone} />
                {showErrors && phoneError && <ErrorBox>{t('leadForm.phoneInvalid')}</ErrorBox>}
            </Field>
            {form.levels.length > 0 && (
                <Field label={courseLabel}>
                    <Select
                        placeholder={t('leadForm.selectCourse')}
                        value={courseId}
                        // Kurs nomlari markaz kiritgan matn — tarjima qilinmaydi.
                        options={form.levels.map((level) => ({ value: level.id, label: level.name }))}
                        onChange={(event) => setCourseId(event.target.value)}
                    />
                    {showErrors && courseError && <ErrorBox>{t('leadForm.courseRequired')}</ErrorBox>}
                </Field>
            )}
            <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
                <label>
                    Website
                    <input tabIndex={-1} autoComplete="off" value={website} onChange={(event) => setWebsite(event.target.value)} />
                </label>
            </div>
            {error != null && <ErrorBox>{t('leadForm.submitFailed', { message: errorMessage(error) })}</ErrorBox>}
            <Button type="submit" variant="primary" disabled={isSending} className="mt-1 w-full">
                {isSending ? t('leadForm.sending') : t('leadForm.submit')}
            </Button>
        </form>
    )
}
