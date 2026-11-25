import { useState, type FormEvent } from 'react'
import { errorMessage } from '@/shared/api'
import { useT } from '@/shared/i18n'
import { isCompleteUzPhone, normalizePhone, UZ_PHONE_PREFIX } from '@/shared/lib'
import { Button, ErrorBox, Field, Input, Modal, PhoneInput, Select, type SelectOption } from '@/shared/ui'
import type { AdminPermission, UserCreatePayload } from '@/shared/types'
import { buildAdminCreatePayload } from '../lib/adminPayload'
import { PermissionCheckboxes } from './PermissionCheckboxes'

interface AdminCreateModalProps {
    branchOptions: SelectOption[]
    isSaving: boolean
    error: unknown
    onSubmit: (payload: UserCreatePayload) => void
    onClose: () => void
}

/**
 * Yangi administrator.
 *
 * `EntityFormModal` dagi filial mantig'iga mos (PR #79): bitta filial
 * bo'lsa tanlagich yashiriladi va qiymat yuborishda o'zi qo'yiladi
 * (`buildAdminCreatePayload`). `features/admin` dan hech narsa import
 * qilinmagan — bo'limlar bir-biridan import qilmaydi.
 */
export function AdminCreateModal({ branchOptions, isSaving, error, onSubmit, onClose }: AdminCreateModalProps) {
    const { t } = useT()
    const [fullName, setFullName] = useState('')
    const [phone, setPhone] = useState(UZ_PHONE_PREFIX)
    const [branchId, setBranchId] = useState('')
    const [permissions, setPermissions] = useState<AdminPermission[]>([])

    const soleBranchId = branchOptions.length === 1 ? branchOptions[0].value : undefined
    const isValid = fullName.trim() !== '' && isCompleteUzPhone(phone)

    function togglePermission(permission: AdminPermission) {
        setPermissions((current) =>
            current.includes(permission)
                ? current.filter((item) => item !== permission)
                : [...current, permission]
        )
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        if (!isValid) return
        onSubmit(
            buildAdminCreatePayload(
                { fullName: fullName.trim(), phone: normalizePhone(phone), branchId, permissions },
                soleBranchId
            )
        )
    }

    return (
        <Modal eyebrow={t('admin.newRecord')} title={t('superAdmin.admin.newTitle')} onClose={onClose}>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
                <Field label={t('field.fullName')}>
                    <Input value={fullName} onChange={(event) => setFullName(event.target.value)} required />
                </Field>

                <Field label={t('field.phone')}>
                    <PhoneInput required value={phone} onChange={setPhone} />
                </Field>

                {/* Bitta filial bo'lsa tanlashning ma'nosi yo'q — yashirin,
                    qiymat `buildAdminCreatePayload` orqali o'zi qo'yiladi. */}
                {branchOptions.length > 1 && (
                    <Field label={t('field.branch')}>
                        <Select
                            placeholder={t('field.select')}
                            options={branchOptions}
                            value={branchId}
                            onChange={(event) => setBranchId(event.target.value)}
                        />
                    </Field>
                )}

                <PermissionCheckboxes value={permissions} onToggle={togglePermission} />

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
