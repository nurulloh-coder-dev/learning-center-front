import { useState, type FormEvent } from 'react'
import { errorMessage } from '@/shared/api'
import { useT } from '@/shared/i18n'
import { isCompleteUzPhone, normalizePhone } from '@/shared/lib'
import { Button, ErrorBox, Field, Input, Modal, PhoneInput } from '@/shared/ui'
import type { UserDto, UserUpdatePayload } from '@/shared/types'

interface AdminEditModalProps {
    admin: UserDto
    isSaving: boolean
    error: unknown
    onSubmit: (payload: UserUpdatePayload) => void
    onClose: () => void
}

/**
 * Administratorni tahrirlash.
 *
 * Ruxsatlar bu yerda yo'q: `PUT /user/{id}` (`UserUpdateDto`) ularni qabul
 * qilmaydi va `UserDto` ularni qaytarmaydi — forma joriy holatni ko'rsata
 * olmasdi. Backend qo'shgach shu yerga qo'shiladi.
 */
export function AdminEditModal({ admin, isSaving, error, onSubmit, onClose }: AdminEditModalProps) {
    const { t } = useT()
    const [fullName, setFullName] = useState(admin.fullName ?? '')
    const [phone, setPhone] = useState(admin.phone ?? '')
    const [birthDate, setBirthDate] = useState(admin.birthDate ?? '')

    const isValid = fullName.trim() !== '' && isCompleteUzPhone(phone)

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        if (!isValid) return
        onSubmit({
            fullName: fullName.trim(),
            phone: normalizePhone(phone),
            ...(birthDate ? { birthDate } : {}),
        })
    }

    return (
        <Modal eyebrow={t('common.edit')} title={admin.fullName || t('superAdmin.admin.editTitle')} onClose={onClose}>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
                <Field label={t('field.fullName')}>
                    <Input value={fullName} onChange={(event) => setFullName(event.target.value)} required />
                </Field>

                <Field label={t('field.phone')}>
                    <PhoneInput required value={phone} onChange={setPhone} />
                </Field>

                <Field label={t('field.birthDate')}>
                    <Input type="date" value={birthDate} onChange={(event) => setBirthDate(event.target.value)} />
                </Field>

                {error != null && <ErrorBox>{errorMessage(error)}</ErrorBox>}

                <div className="mt-1 flex justify-end gap-2.5">
                    <Button onClick={onClose}>{t('common.cancel')}</Button>
                    <Button type="submit" variant="primary" disabled={isSaving || !isValid}>
                        {isSaving ? t('common.saving') : t('common.save')}
                    </Button>
                </div>
            </form>
        </Modal>
    )
}
