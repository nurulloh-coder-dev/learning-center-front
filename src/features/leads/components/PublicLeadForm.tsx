import { useState, type FormEvent } from 'react'
import { errorMessage } from '@/shared/api'
import { useT } from '@/shared/i18n'
import { isCompleteUzPhone, normalizePhone, UZ_PHONE_PREFIX } from '@/shared/lib'
import type { LeadSource, PublicLeadFormDto, PublicLeadSubmitDto } from '@/shared/types'
import { ErrorBox, Field, Input, PhoneInput } from '@/shared/ui'

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
                // Google Forms'dagidek ochiq ro'yxat: telefonda ochiladigan
                // ro'yxatdan ko'ra hamma variant birdan ko'rinib turgani qulay.
                <fieldset className="flex flex-col gap-2">
                    <legend className="mb-2 font-mono text-[0.68rem] font-semibold tracking-[0.08em] text-fg-muted uppercase">
                        {courseLabel}
                    </legend>
                    {form.levels.map((level) => (
                        <label
                            key={level.id}
                            className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border border-border-base px-3.5 text-sm text-fg has-checked:border-accent has-checked:bg-accent-soft"
                        >
                            <input
                                type="radio"
                                name="course"
                                value={level.id}
                                checked={courseId === level.id}
                                onChange={() => setCourseId(level.id)}
                                className="size-4 cursor-pointer accent-accent"
                            />
                            {/* Kurs nomi markaz kiritgan matn — tarjima qilinmaydi. */}
                            {level.name}
                        </label>
                    ))}
                    {showErrors && courseError && <ErrorBox>{t('leadForm.courseRequired')}</ErrorBox>}
                </fieldset>
            )}
            <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
                <label>
                    Website
                    <input tabIndex={-1} autoComplete="off" value={website} onChange={(event) => setWebsite(event.target.value)} />
                </label>
            </div>
            {error != null && <ErrorBox>{t('leadForm.submitFailed', { message: errorMessage(error) })}</ErrorBox>}
            {/* Oddiy to'liq rangli tugma — ilovadagi gradientli `primary` bu yerda ortiqcha. */}
            <button
                type="submit"
                disabled={isSending}
                className="mt-1 min-h-12 w-full cursor-pointer rounded-lg bg-accent text-sm font-semibold text-white hover:brightness-110 disabled:cursor-default disabled:opacity-60 dark:text-surface"
            >
                {isSending ? t('leadForm.sending') : t('leadForm.submit')}
            </button>
        </form>
    )
}
