import { useState, type FormEvent } from 'react'
import { useSession } from '@/app/providers/useAuth'
import { errorMessage } from '@/shared/api'
import { useT } from '@/shared/i18n'
import { Button, ErrorBox, Field, Input } from '@/shared/ui'
import { useChangePassword } from '../hooks/useChangePassword'
import { validatePasswordChange, type PasswordIssue } from '../lib/validatePassword'
import { SettingsSection } from './SettingsSection'

export function PasswordSection() {
    const { t } = useT()
    const session = useSession()

    const [current, setCurrent] = useState('')
    const [next, setNext] = useState('')
    const [repeat, setRepeat] = useState('')
    const [issue, setIssue] = useState<PasswordIssue>(null)

    const change = useChangePassword(session.token)

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        const problem = validatePasswordChange({ current, next, repeat })
        setIssue(problem)
        if (problem) return

        change.mutate(
            { oldPassword: current, newPassword: next, confirmPassword: repeat },
            {
                onSuccess: () => {
                    setCurrent('')
                    setNext('')
                    setRepeat('')
                },
            }
        )
    }

    return (
        <SettingsSection title={t('settings.password')} description={t('settings.passwordHint')}>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
                <Field label={t('settings.currentPassword')}>
                    <Input
                        type="password"
                        autoComplete="current-password"
                        value={current}
                        onChange={(event) => setCurrent(event.target.value)}
                    />
                </Field>
                <Field label={t('settings.newPassword')}>
                    <Input
                        type="password"
                        autoComplete="new-password"
                        value={next}
                        onChange={(event) => setNext(event.target.value)}
                    />
                </Field>
                <Field label={t('settings.repeatPassword')}>
                    <Input
                        type="password"
                        autoComplete="new-password"
                        value={repeat}
                        onChange={(event) => setRepeat(event.target.value)}
                    />
                </Field>

                {issue === 'empty' && <ErrorBox>{t('settings.passwordEmpty')}</ErrorBox>}
                {issue === 'tooShort' && <ErrorBox>{t('settings.passwordTooShort')}</ErrorBox>}
                {issue === 'mismatch' && <ErrorBox>{t('settings.passwordMismatch')}</ErrorBox>}

                {change.error != null && <ErrorBox>{errorMessage(change.error)}</ErrorBox>}
                {change.isSuccess && (
                    <p className="text-sm text-success-fg">{t('settings.passwordChanged')}</p>
                )}

                <div className="flex justify-end">
                    <Button type="submit" variant="primary" className="w-full sm:w-auto" disabled={change.isPending}>
                        {change.isPending ? t('common.saving') : t('common.save')}
                    </Button>
                </div>
            </form>
        </SettingsSection>
    )
}
