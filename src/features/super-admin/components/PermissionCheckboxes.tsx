import { useT } from '@/shared/i18n'
import { cn } from '@/shared/lib'
import { ADMIN_PERMISSIONS, type AdminPermission } from '@/shared/types'

interface PermissionCheckboxesProps {
    value: AdminPermission[]
    onToggle: (permission: AdminPermission) => void
}

/**
 * Administrator ruxsatlari.
 *
 * `Field` ishlatilmaydi: u `<label>` bilan o'raydi, ichidagi har bir belgi
 * ham `<label>` — ichma-ich label'da brauzer bosishni boshqa belgiga
 * yo'naltirib yuborardi (rahbar "bosib bo'lmayapti" degan). Shuning uchun
 * `fieldset`, har qator esa butun eni bo'ylab bosiladigan 44 px balandlikdagi
 * maydon — telefonda barmoq bilan ham oson tegiladi.
 */
export function PermissionCheckboxes({ value, onToggle }: PermissionCheckboxesProps) {
    const { t } = useT()

    return (
        <fieldset className="flex flex-col gap-1.5">
            <legend className="mb-1.5 text-sm font-medium text-fg">{t('superAdmin.admin.permissions')}</legend>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {ADMIN_PERMISSIONS.map((permission) => {
                    const checked = value.includes(permission)
                    return (
                        <label
                            key={permission}
                            className={cn(
                                'flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border px-3 py-2 text-sm transition-colors select-none',
                                checked
                                    ? 'border-accent bg-accent-soft text-accent-fg'
                                    : 'border-border-base text-fg hover:bg-surface-hover'
                            )}
                        >
                            <input
                                type="checkbox"
                                className="size-5 shrink-0 cursor-pointer accent-brand"
                                checked={checked}
                                onChange={() => onToggle(permission)}
                            />
                            {t(`superAdmin.permission.${permission}`)}
                        </label>
                    )
                })}
            </div>
        </fieldset>
    )
}
