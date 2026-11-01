import { useSession } from '@/app/providers/useAuth'
import { errorMessage } from '@/shared/api'
import { useT } from '@/shared/i18n'
import { ErrorBox } from '@/shared/ui'
import { useMe } from '../hooks/useMe'
import { canEditProfile } from '../lib/canEditProfile'
import { ProfileForm } from './ProfileForm'
import { SettingsSection } from './SettingsSection'

/**
 * Profil — `GET /auth/me` dan o'qiladi, `PUT /user/{id}` bilan saqlanadi.
 * (Backendda "o'zimni yangilash" endpoint'i yo'q, `id` `/auth/me` dan olinadi.)
 */
export function ProfileSection() {
    const { t } = useT()
    const session = useSession()
    const { data: me, isLoading, error } = useMe(session.token)

    return (
        <SettingsSection title={t('settings.profile')} description={t('settings.profileHint')}>
            {isLoading && <p className="text-sm text-fg-faint">{t('common.loading')}</p>}
            {error != null && <ErrorBox>{errorMessage(error)}</ErrorBox>}
            {/* `key` — ma'lumot yangilanganda forma toza holatda qayta quriladi */}
            {me && <ProfileForm key={me.id ?? 'me'} user={me} readOnly={!canEditProfile(session)} />}
        </SettingsSection>
    )
}
