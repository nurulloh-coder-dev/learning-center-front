import { useState } from 'react'
import { useT } from '@/shared/i18n'
import type { LeadFormDto, LeadFormUpdateDto } from '@/shared/types'
import { Button, Field, Input, type SelectOption } from '@/shared/ui'

interface LeadFormSettingsFieldsProps {
    form: LeadFormDto
    levels: SelectOption[]
    isSaving: boolean
    onSave: (body: LeadFormUpdateDto) => void
}

const CHECKBOX_ROW = 'flex cursor-pointer items-center gap-2.5 text-sm text-fg'

/**
 * Administrator sozlaydigan narsalar. Maydon qo'shib bo'lmaydi — forma
 * backend lid uchun qabul qiladigan ism/telefon/kurs bilan qat'iy.
 * Kurslar yashiriladiganlar ro'yxati bilan saqlanadi: yangi kurs qo'shilsa,
 * formada o'zi chiqadi.
 */
export function LeadFormSettingsFields({ form, levels, isSaving, onSave }: LeadFormSettingsFieldsProps) {
    const { t } = useT()
    const [values, setValues] = useState<LeadFormUpdateDto>(() => ({
        enabled: form.enabled,
        title: form.title ?? '',
        description: form.description ?? '',
        courseRequired: form.courseRequired,
        hiddenLevelIds: form.hiddenLevelIds,
    }))
    const update = (patch: Partial<LeadFormUpdateDto>) => setValues((current) => ({ ...current, ...patch }))

    function toggleLevel(id: string, visible: boolean) {
        update({
            hiddenLevelIds: visible
                ? values.hiddenLevelIds.filter((hidden) => hidden !== id)
                : [...values.hiddenLevelIds, id],
        })
    }

    return (
        <div className="flex flex-col gap-4">
            <label className={CHECKBOX_ROW}>
                <input type="checkbox" className="size-4 cursor-pointer" checked={values.enabled} onChange={(event) => update({ enabled: event.target.checked })} />
                {t('leadForm.enabled')}
            </label>
            <Field label={t('leadForm.title')}>
                <Input placeholder={t('leadForm.defaultTitle')} maxLength={80} value={values.title ?? ''} onChange={(event) => update({ title: event.target.value })} />
            </Field>
            <Field label={t('leadForm.description')}>
                <Input placeholder={t('leadForm.defaultDescription')} maxLength={200} value={values.description ?? ''} onChange={(event) => update({ description: event.target.value })} />
            </Field>
            <label className={CHECKBOX_ROW}>
                <input type="checkbox" className="size-4 cursor-pointer" checked={values.courseRequired} onChange={(event) => update({ courseRequired: event.target.checked })} />
                {t('leadForm.courseRequiredToggle')}
            </label>
            <fieldset className="flex flex-col gap-2">
                <legend className="mb-1 font-mono text-[0.68rem] font-semibold tracking-[0.08em] text-fg-muted uppercase">{t('leadForm.levels')}</legend>
                {levels.map((level) => (
                    <label key={level.value} className={CHECKBOX_ROW}>
                        <input
                            type="checkbox"
                            className="size-4 cursor-pointer"
                            checked={!values.hiddenLevelIds.includes(level.value)}
                            onChange={(event) => toggleLevel(level.value, event.target.checked)}
                        />
                        {level.label}
                    </label>
                ))}
                <p className="text-xs text-fg-faint">{t('leadForm.levelsHint')}</p>
            </fieldset>
            <div className="flex justify-end">
                <Button
                    variant="primary"
                    disabled={isSaving}
                    // Bo'sh matn — "standart sarlavha ishlatilsin" degani, serverga null.
                    onClick={() => onSave({ ...values, title: values.title?.trim() || null, description: values.description?.trim() || null })}
                >
                    {isSaving ? t('common.saving') : t('common.save')}
                </Button>
            </div>
        </div>
    )
}
