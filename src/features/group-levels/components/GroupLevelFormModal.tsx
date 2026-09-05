import { useState, type FormEvent } from 'react'
import { errorMessage } from '@/shared/api'
import { useT } from '@/shared/i18n'
import { Button, ErrorBox, Field, Input, Modal } from '@/shared/ui'
import type { GroupLevelDto } from '@/shared/types'

export interface GroupLevelFormValues {
    id?: string
    name: string
    lessonCount: string
    orderNumber: string
    durationInMonths: string
    monthlyFee: string
}

interface GroupLevelFormModalProps {
    mode: 'create' | 'edit'
    initialValues: GroupLevelFormValues
    isSaving: boolean
    error: unknown
    onSubmit: (values: GroupLevelFormValues) => void
    onClose: () => void
    row?: GroupLevelDto | null
}

export function GroupLevelFormModal({
    mode,
    initialValues,
    isSaving,
    error,
    onSubmit,
    onClose,
    row,
}: GroupLevelFormModalProps) {
    const { t } = useT()
    const [values, setValues] = useState<GroupLevelFormValues>(initialValues)

    function setValue(key: keyof GroupLevelFormValues, value: string) {
        setValues((current) => ({ ...current, [key]: value }))
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        onSubmit(values)
    }

    return (
        <Modal
            eyebrow={mode === 'create' ? t('groupLevel.new') : t('groupLevel.edit')}
            title={mode === 'create' ? t('groupLevel.newTitle') : t('groupLevel.editTitle')}
            onClose={onClose}
        >
            <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
                <Field label={t('groupLevel.name')}>
                    <Input
                        value={values.name}
                        onChange={(event) => setValue('name', event.target.value)}
                    />
                </Field>

                <Field label={t('groupLevel.lessonCount')}>
                    <Input
                        type="number"
                        min="0"
                        value={values.lessonCount}
                        onChange={(event) => setValue('lessonCount', event.target.value)}
                    />
                </Field>

                {mode === 'create' && (
                    <Field label={t('groupLevel.orderNumber')}>
                        <Input
                            type="number"
                            min="0"
                            value={values.orderNumber}
                            onChange={(event) => setValue('orderNumber', event.target.value)}
                        />
                    </Field>
                )}

                <Field label={t('groupLevel.durationInMonths')}>
                    <Input
                        type="number"
                        min="0"
                        value={values.durationInMonths}
                        onChange={(event) => setValue('durationInMonths', event.target.value)}
                    />
                </Field>

                <Field label={t('groupLevel.monthlyFee')}>
                    <Input
                        type="number"
                        min="0"
                        value={values.monthlyFee}
                        onChange={(event) => setValue('monthlyFee', event.target.value)}
                    />
                </Field>

                {row && <p className="text-[0.72rem] leading-snug text-fg-faint">ID: {row.id}</p>}

                {error != null && <ErrorBox>{errorMessage(error)}</ErrorBox>}

                <div className="mt-1 flex justify-end gap-2.5">
                    <Button onClick={onClose}>{t('common.cancel')}</Button>
                    <Button type="submit" variant="primary" disabled={isSaving}>
                        {isSaving ? t('common.saving') : t('common.save')}
                    </Button>
                </div>
            </form>
        </Modal>
    )
}
