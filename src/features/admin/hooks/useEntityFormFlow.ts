import { useState } from 'react'
import { createdCredentials } from '../lib/createdCredentials'
import type { CreatedCredentials } from '../components/CredentialsModal'
import type { AdminRow, EntityConfig, EntityFormConfig, FormValues, ModalMode } from '../types'
import { useEntityMutations } from './useEntityMutations'

interface FormModalState {
    mode: ModalMode
    id: string | null
    values: FormValues
}

/**
 * Yaratish/tahrirlash formasi oqimi: modal holati, yuborish va yaratilgan
 * foydalanuvchi ma'lumotlari. Sahifa faqat yig'sin deb shu yerga ajratilgan.
 */
export function useEntityFormFlow(
    entity: EntityConfig,
    token: string,
    formConfig: EntityFormConfig | undefined,
    columns: string[]
) {
    const { save, remove } = useEntityMutations(entity, token)
    const [formModal, setFormModal] = useState<FormModalState | null>(null)

    // Parol faqat yaratish javobida keladi — keyin uni hech qayerdan
    // olib bo'lmaydi, shuning uchun darrov ko'rsatiladi.
    const [credentials, setCredentials] = useState<CreatedCredentials | null>(null)

    function openCreate() {
        const values = formConfig
            ? formConfig.getInitialValues(null)
            : Object.fromEntries(columns.map((column) => [column, '']))
        setFormModal({ mode: 'create', id: null, values })
    }

    function openEdit(row: AdminRow) {
        const values = formConfig ? formConfig.getInitialValues(row) : { ...row }
        setFormModal({ mode: 'edit', id: row.id, values })
    }

    function handleSubmit(values: FormValues) {
        if (!formModal) return

        let body: unknown
        if (formConfig) {
            body =
                formModal.mode === 'create'
                    ? formConfig.buildCreatePayload(values)
                    : formConfig.buildUpdatePayload(values)
        } else {
            const generic = { ...values }
            delete generic.id
            body = generic
        }

        save.mutate(
            { mode: formModal.mode, id: formModal.id, body },
            {
                onSuccess: (created) => {
                    setFormModal(null)
                    const user = createdCredentials(created)
                    if (formModal.mode === 'create' && user) setCredentials(user)
                },
            }
        )
    }

    return {
        save,
        remove,
        formModal,
        credentials,
        openCreate,
        openEdit,
        handleSubmit,
        closeForm: () => setFormModal(null),
        closeCredentials: () => setCredentials(null),
    }
}
