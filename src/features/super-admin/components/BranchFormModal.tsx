import { useMemo, useState, type FormEvent } from 'react'
import { errorMessage } from '@/shared/api'
import { useT } from '@/shared/i18n'
import { Button, ErrorBox, Field, Input, Modal, type SelectOption } from '@/shared/ui'
import type { BranchPayload } from '../api/superAdminApi'
import { isShortGoogleMapsUrl, parseGoogleMapsUrl } from '../lib/googleMapsUrl'
import type { BranchDto } from '@/shared/types'

interface Props {
    branch: BranchDto | null
    organizationOptions: SelectOption[]
    isSaving: boolean
    error: unknown
    onSubmit: (body: BranchPayload) => void
    onClose: () => void
}

export function BranchFormModal({
    branch,
    organizationOptions,
    isSaving,
    error,
    onSubmit,
    onClose,
}: Props) {
    const { t } = useT()
    const isEdit = branch !== null

    /*
     * Tashkilot TANLANMAYDI.
     *
     * Super-admin bitta markazning egasi — filial baribir shunga ochiladi.
     * Tanlagich qo'ysak, bitta variantli ro'yxatdan o'sha bittasini tanlab
     * o'tirishga to'g'ri keladi va tanlamay qolsa "Saqlash" jimgina
     * ishlamaydi. Shuning uchun u avtomatik olinadi.
     */
    const organizationId = organizationOptions[0]?.value ?? ''
    const [name, setName] = useState(branch?.name ?? '')
    const [address, setAddress] = useState(branch?.address ?? '')
    const [mapsUrl, setMapsUrl] = useState(branch?.googleMapsUrl ?? '')

    const parsedLocation = useMemo(() => parseGoogleMapsUrl(mapsUrl), [mapsUrl])
    const hasCoordinates = parsedLocation.latitude !== undefined
    // Qisqartirilgan havola ichida koordinata yo'q — ochib, to'liq havolani olish kerak.
    const needsFullUrl = mapsUrl.trim() !== '' && !hasCoordinates && isShortGoogleMapsUrl(mapsUrl)

    // Yaratishda tashkilot shart: `BranchCreateDto.organizationId` busiz
    // filial hech qaysi tashkilotga bog'lanmay qoladi.
    const isValid = name.trim() !== '' && (isEdit || organizationId !== '')

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        if (!isValid) return
        onSubmit({
            name: name.trim(),
            address,
            organizationId: isEdit ? undefined : organizationId,
            googleMapsUrl: mapsUrl.trim() || undefined,
            ...parsedLocation,
        })
    }

    return (
        <Modal
            eyebrow={isEdit ? t('admin.editRecord') : t('admin.newRecord')}
            title={isEdit ? t('branch.editTitle') : t('branch.newTitle')}
            onClose={onClose}
        >
            <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
                <Field label={t('branch.name')}>
                    <Input value={name} onChange={(e) => setName(e.target.value)} required />
                </Field>
                <Field label={t('branch.address')}>
                    <Input value={address} onChange={(e) => setAddress(e.target.value)} />
                </Field>

                <Field label={t('branch.mapsUrl')}>
                    <Input
                        type="url"
                        placeholder="https://www.google.com/maps/place/..."
                        value={mapsUrl}
                        onChange={(e) => setMapsUrl(e.target.value)}
                    />
                    <p className="mt-1 text-[0.72rem] leading-snug text-fg-faint">{t('branch.mapsUrlHint')}</p>
                    {hasCoordinates && (
                        <p className="mt-1 text-[0.72rem] leading-snug text-fg-muted">
                            {t('branch.mapsUrlParsed', {
                                latitude: String(parsedLocation.latitude),
                                longitude: String(parsedLocation.longitude),
                            })}
                        </p>
                    )}
                    {needsFullUrl && <ErrorBox>{t('branch.mapsUrlShort')}</ErrorBox>}
                </Field>

                {isEdit && (
                    <p className="text-[0.72rem] leading-snug text-fg-faint">
                        {t('branch.organizationLocked')}
                    </p>
                )}

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
