import { useState, type FormEvent } from 'react'
import { useSession } from '@/app/providers/useAuth'
import { errorMessage } from '@/shared/api'
import { useT } from '@/shared/i18n'
import { formatAmount } from '@/shared/lib'
import { Button, ErrorBox, Field, Input, Modal, Select } from '@/shared/ui'
import type { SelectOption } from '@/shared/ui'
import type { PlanDto, SubscriptionCreatePayload } from '@/shared/types'
import { useCurrentExpiries } from '../hooks/useSubscriptions'
import {
    computeExpiryDate,
    MAX_MONTHS,
    MIN_MONTHS,
    monthsDiscountPercent,
    suggestedPaidAmount,
} from '../lib/subscriptionTerm'

interface NewSubscriptionModalProps {
    organizations: SelectOption[]
    plans: PlanDto[]
    isSaving: boolean
    error: unknown
    onSubmit: (body: SubscriptionCreatePayload) => void
    onClose: () => void
}

const MONTHS = Array.from({ length: MAX_MONTHS - MIN_MONTHS + 1 }, (_, index) => MIN_MONTHS + index)

/**
 * Yangi obuna yoki uzaytirish: tarif + necha oy.
 *
 * Sana qo'lda tanlanmaydi (rahbar talabi): oy soni tanlanadi va tugash
 * sanasi shu yerda hisoblanib, backendga tayyor `expiryDate` bo'lib ketadi.
 * Summa chegirma bilan taklif qilinadi, lekin dasturchi uni tuzata oladi —
 * haqiqiy o'tkazma boshqacha bo'lishi mumkin.
 */
export function NewSubscriptionModal({
    organizations,
    plans,
    isSaving,
    error,
    onSubmit,
    onClose,
}: NewSubscriptionModalProps) {
    const { t } = useT()
    const session = useSession()
    const { expiries } = useCurrentExpiries(session.token)
    const [organizationId, setOrganizationId] = useState('')
    const [planId, setPlanId] = useState('')
    const [months, setMonths] = useState(1)
    const [note, setNote] = useState('')
    // `null` — dasturchi summaga tegmagan, taklif qilingani ko'rsatiladi.
    const [paidOverride, setPaidOverride] = useState<string | null>(null)

    const plan = plans.find((item) => item.id === planId)
    const expiryDate = computeExpiryDate(expiries.get(organizationId), months, new Date())
    const suggested = plan ? suggestedPaidAmount(plan, months) : 0
    const paidText = paidOverride ?? (plan ? String(suggested) : '')
    const paidAmount = Number(paidText.replace(/\s/g, ''))
    const discount = monthsDiscountPercent(months)

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        onSubmit({
            organizationId,
            planId,
            note: note.trim() || undefined,
            expiryDate,
            paidAmount: paidAmount > 0 ? paidAmount : undefined,
        })
    }

    return (
        <Modal eyebrow={t('developer.subscriptionsTab')} title={t('subscription.newTitle')} onClose={onClose}>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
                <Field label={t('subscription.organization')}>
                    <Select
                        required
                        value={organizationId}
                        onChange={(event) => setOrganizationId(event.target.value)}
                        options={organizations}
                        placeholder={t('subscription.organization')}
                    />
                </Field>

                <Field label={t('subscription.plan')}>
                    <Select
                        required
                        value={planId}
                        onChange={(event) => {
                            setPlanId(event.target.value)
                            setPaidOverride(null)
                        }}
                        options={plans.map((item) => ({ value: item.id, label: item.name }))}
                        placeholder={t('subscription.plan')}
                    />
                </Field>

                <Field label={t('subscription.months')}>
                    <Select
                        value={String(months)}
                        onChange={(event) => {
                            setMonths(Number(event.target.value))
                            setPaidOverride(null)
                        }}
                        options={MONTHS.map((count) => ({
                            value: String(count),
                            label: t('subscription.monthsOption', { count }),
                        }))}
                    />
                </Field>
                <p className="-mt-2 text-[0.72rem] leading-snug text-fg-muted">
                    {t('subscription.expiryPreview', { date: expiryDate })}
                    {discount > 0 && ` · ${t('subscription.discountPreview', { percent: discount })}`}
                </p>

                <Field label={t('subscription.paidAmount')}>
                    <Input
                        inputMode="numeric"
                        value={paidText}
                        onChange={(event) => setPaidOverride(event.target.value)}
                        placeholder={plan ? formatAmount(suggested) : undefined}
                    />
                </Field>
                <p className="-mt-2 text-[0.72rem] leading-snug text-fg-faint">{t('subscription.paidAmountHint')}</p>

                <Field label={t('subscription.note')}>
                    <Input value={note} onChange={(event) => setNote(event.target.value)} />
                </Field>
                <p className="-mt-2 text-[0.72rem] leading-snug text-fg-faint">{t('subscription.noteHint')}</p>

                <p className="text-[0.72rem] leading-snug text-fg-faint">{t('subscription.renewHint')}</p>

                {error != null && <ErrorBox>{errorMessage(error)}</ErrorBox>}

                <div className="mt-1 flex justify-end gap-2.5">
                    <Button onClick={onClose}>{t('common.cancel')}</Button>
                    <Button
                        type="submit"
                        variant="primary"
                        disabled={isSaving || organizationId === '' || planId === '' || Number.isNaN(paidAmount)}
                    >
                        {isSaving ? t('common.saving') : t('subscription.new')}
                    </Button>
                </div>
            </form>
        </Modal>
    )
}
