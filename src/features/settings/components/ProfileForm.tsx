import { useState, type FormEvent } from 'react'
import { useSession } from '@/app/providers/useAuth'
import { errorMessage } from '@/shared/api'
import { useT } from '@/shared/i18n'
import { normalizePhone } from '@/shared/lib'
import { Button, ErrorBox, Field, Input, PhoneInput } from '@/shared/ui'
import { useUpdateProfile } from '../hooks/useUpdateProfile'
import type { UserDto } from '@/shared/types'

/**
 * Profil formasi.
 *
 * Ataylab alohida komponent: boshlang'ich qiymatlar `useState` ga bir marta
 * beriladi va ma'lumot yangilanganda ota-komponent `key` orqali uni qaytadan
 * yaratadi. Shu sabab `useEffect` ichida `setState` qilish kerak emas —
 * u zanjirli render va "yozayotgan matnni ustidan yozish" muammosini keltiradi.
 *
 * `readOnly` — saqlashga ruxsat yo'q (`canEditProfile`): maydonlar ko'rinadi,
 * lekin o'zgartirilmaydi va tugma o'rniga kimga murojaat qilish yoziladi.
 */
export function ProfileForm({ user, readOnly = false }: { user: UserDto; readOnly?: boolean }) {
    const { t } = useT()
    const session = useSession()

    const [fullName, setFullName] = useState(user.fullName ?? '')
    const [phone, setPhone] = useState(user.phone ?? '')
    const [birthDate, setBirthDate] = useState(user.birthDate ?? '')

    const save = useUpdateProfile(session.token, user.id)

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        save.mutate({ fullName, phone: normalizePhone(phone), birthDate })
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
            <Field label={t('field.fullName')}>
                <Input
                    value={fullName}
                    disabled={readOnly}
                    onChange={(event) => setFullName(event.target.value)}
                />
            </Field>
            <Field label={t('field.phone')}>
                <PhoneInput value={phone} disabled={readOnly} onChange={setPhone} />
            </Field>
            <Field label={t('field.birthDate')}>
                <Input
                    type="date"
                    value={birthDate}
                    disabled={readOnly}
                    onChange={(event) => setBirthDate(event.target.value)}
                />
            </Field>

            {save.error != null && <ErrorBox>{errorMessage(save.error)}</ErrorBox>}
            {save.isSuccess && <p className="text-sm text-success-fg">{t('settings.profileSaved')}</p>}

            {readOnly ? (
                <p className="text-sm text-fg-muted">{t('settings.profileReadOnly')}</p>
            ) : (
                <div className="flex justify-end">
                    <Button type="submit" variant="primary" disabled={save.isPending || !user.id}>
                        {save.isPending ? t('common.saving') : t('common.save')}
                    </Button>
                </div>
            )}
        </form>
    )
}
