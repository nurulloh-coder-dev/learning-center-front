import { useMemo, useRef, useState } from 'react'
import { useSession } from '@/app/providers/useAuth'
import { errorMessage } from '@/shared/api'
import { useT } from '@/shared/i18n'
import { Button, ErrorBox, IconButton, StarIcon, TrashIcon } from '@/shared/ui'
import { cn } from '@/shared/lib'
import { useDeleteImage, useImages, useSetMainImage, useUploadImage } from '../hooks/useImages'
import { useMe } from '../hooks/useMe'
import { isMainImage } from '../lib/mainImage'
import { SettingsSection } from './SettingsSection'
import type { ImageDto } from '@/shared/types'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png']
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png']

interface ImageGalleryProps {
    token?: string
}

export function ImageGallery({ token: propToken }: ImageGalleryProps) {
    const { t } = useT()
    const session = useSession()
    const activeToken = propToken ?? session.token

    const { data: me } = useMe(activeToken)
    const { data: imagesData, isLoading, error: fetchError } = useImages(activeToken)

    const uploadMutation = useUploadImage(activeToken)
    const setMainMutation = useSetMainImage(activeToken)
    const deleteMutation = useDeleteImage(activeToken)

    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [actionError, setActionError] = useState<string | null>(null)
    /** Kattalashtirib ko'rsatilayotgan rasm; `null` — oyna yopiq. */
    const [zoomed, setZoomed] = useState<ImageDto | null>(null)

    /*
     * Tanlangan faylning ko'rinishi. `URL.createObjectURL` xotirada joy
     * egallaydi, shuning uchun eski manzil yangisi yasalganda bo'shatiladi.
     */
    const previewUrl = useMemo(() => {
        if (!selectedFile) return null
        return URL.createObjectURL(selectedFile)
    }, [selectedFile])
    const fileInputRef = useRef<HTMLInputElement>(null)

    const validateFile = (file: File): string | null => {
        const fileType = file.type.toLowerCase()
        const fileName = file.name.toLowerCase()

        const isMimeValid = ALLOWED_MIME_TYPES.includes(fileType)
        const isExtensionValid = ALLOWED_EXTENSIONS.some((ext) => fileName.endsWith(ext))

        if (!isMimeValid && !isExtensionValid) {
            return t('settings.invalidFileType')
        }

        if (file.size > MAX_FILE_SIZE) {
            return t('settings.fileTooLarge')
        }

        return null
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setActionError(null)
        const file = e.target.files?.[0]
        if (!file) {
            setSelectedFile(null)
            return
        }

        const errorMsg = validateFile(file)
        if (errorMsg) {
            setActionError(errorMsg)
            setSelectedFile(null)
            if (fileInputRef.current) fileInputRef.current.value = ''
            return
        }

        setSelectedFile(file)
    }

    const handleUpload = () => {
        if (!selectedFile) return
        setActionError(null)

        const errorMsg = validateFile(selectedFile)
        if (errorMsg) {
            setActionError(errorMsg)
            return
        }

        uploadMutation.mutate(selectedFile, {
            onSuccess: () => {
                setSelectedFile(null)
                if (fileInputRef.current) fileInputRef.current.value = ''
            },
            onError: (err) => {
                setActionError(errorMessage(err, t('settings.uploadError')))
            },
        })
    }

    const handleSetMain = (imageId?: string) => {
        if (!imageId) return
        setActionError(null)

        setMainMutation.mutate(imageId, {
            onError: (err) => {
                setActionError(errorMessage(err, t('settings.setMainError')))
            },
        })
    }

    const handleDelete = (imageId?: string) => {
        if (!imageId) return
        setActionError(null)

        deleteMutation.mutate(imageId, {
            onError: (err) => {
                setActionError(errorMessage(err, t('settings.deleteError')))
            },
        })
    }

    /*
     * Asosiy rasm doim BIRINCHI turadi.
     *
     * Ilgari u qaysi tartibda kelsa shunda turardi: yangisi qo'shilgani
     * sari asosiy rasm orqaga surilib ketardi va uni qidirishga to'g'ri
     * kelardi.
     */
    const images = [...(imagesData ?? [])].sort((a, b) => {
        const aMain = isMainImage(a, me?.imageUrl) ? 0 : 1
        const bMain = isMainImage(b, me?.imageUrl) ? 0 : 1
        return aMain - bMain
    })

    return (
        <SettingsSection title={t('settings.myImages')} description={t('settings.myImagesHint')}>
            <div className="space-y-4">
                {/* Fayl yuklash formasi */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    {/* Tanlangan faylning oldindan ko'rinishi: odam qaysi
                        rasmni tanlaganini yuklashdan OLDIN ko'rishi kerak. */}
                    {previewUrl && (
                        <img
                            src={previewUrl}
                            alt=""
                            className="size-11 shrink-0 rounded-full object-cover ring-2 ring-accent/30"
                        />
                    )}
                    <label htmlFor="image-file-input" className="sr-only">
                        {t('settings.selectImageFile')}
                    </label>
                    <input
                        id="image-file-input"
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png"
                        onChange={handleFileChange}
                        className="block w-full text-sm text-fg-muted file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-surface-elevated file:text-fg hover:file:bg-surface-hover cursor-pointer"
                    />
                    <Button
                        onClick={handleUpload}
                        disabled={!selectedFile || uploadMutation.isPending}
                        variant="primary"
                        size="sm"
                    >
                        {uploadMutation.isPending ? t('settings.uploading') : t('settings.uploadImage')}
                    </Button>
                </div>

                {/* Xatoliklar ko'rsatuvchi oyna */}
                {actionError && <ErrorBox>{actionError}</ErrorBox>}
                {fetchError && <ErrorBox>{errorMessage(fetchError)}</ErrorBox>}

                {/* Yuklanish holati */}
                {isLoading && <p className="text-sm text-fg-faint">{t('common.loading')}</p>}

                {/* Rasmlar yo'q holat */}
                {!isLoading && images.length === 0 && (
                    <p className="text-sm text-fg-muted">{t('settings.noImages')}</p>
                )}

                {/* Rasmlar to'plami grid ko'rinishida */}
                {images.length > 0 && (
                    <div className="flex flex-wrap gap-5">
                        {images.map((img) => {
                            const isMain = isMainImage(img, me?.imageUrl)

                            return (
                                <div
                                    key={img.id ?? img.imageUrl}
                                    className="flex flex-col items-center gap-2.5"
                                >
                                    {/* Dumaloq: profil rasmi qolgan hamma
                                        joyda dumaloq ko'rinadi, bu yerda
                                        to'rtburchak bo'lsa boshqacha kesilgan
                                        ko'rinadi va odam adashadi. */}
                                    <button
                                        type="button"
                                        onClick={() => setZoomed(img)}
                                        aria-label={t('settings.enlargeImage')}
                                        className={cn(
                                            'relative size-28 cursor-pointer overflow-hidden rounded-full bg-surface-elevated',
                                            'transition-transform hover:scale-105',
                                            isMain ? 'ring-3 ring-success' : 'ring-1 ring-border-base'
                                        )}
                                    >
                                        <img
                                            src={img.imageUrl}
                                            alt={img.originalFileName ?? t('settings.uploadedProfileImage')}
                                            className="h-full w-full object-cover"
                                        />
                                    </button>

                                    <div className="flex items-center gap-1">
                                        {/* Yulduz — asosiy qilish. Matn o'rniga
                                            ikonka: uch tilda uch xil uzunlikdagi
                                            matn kartani turtib yuborardi. */}
                                        <IconButton
                                            label={
                                                isMain ? t('settings.mainImage') : t('settings.setAsMain')
                                            }
                                            onClick={() => !isMain && handleSetMain(img.id)}
                                            disabled={isMain || setMainMutation.isPending}
                                        >
                                            <StarIcon filled={isMain} />
                                        </IconButton>
                                        {!isMain && (
                                            <IconButton
                                                label={t('settings.deleteImage')}
                                                tone="danger"
                                                onClick={() => handleDelete(img.id)}
                                                disabled={deleteMutation.isPending}
                                            >
                                                <TrashIcon />
                                            </IconButton>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>

            {/* Kattalashtirilgan ko'rinish. Fon bosilsa yopiladi — bu
                odatiy xatti-harakat va tugma qidirishga hojat qolmaydi. */}
            {zoomed && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-label={t('settings.enlargeImage')}
                    onClick={() => setZoomed(null)}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6 backdrop-blur-sm"
                >
                    <img
                        src={zoomed.imageUrl}
                        alt={zoomed.originalFileName ?? t('settings.uploadedProfileImage')}
                        className="max-h-[80vh] max-w-[90vw] rounded-xl object-contain shadow-2xl"
                    />
                </div>
            )}
        </SettingsSection>
    )
}
