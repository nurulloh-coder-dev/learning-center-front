import type { ReactNode } from 'react'
import { useT } from '@/shared/i18n'
import { DataTable, EditIcon, IconButton, LockResetIcon, TrashIcon } from '@/shared/ui'
import type { DataTableColumn } from '@/shared/ui'

export interface SimpleColumn<T> {
    key: string
    label: string
    render: (row: T) => ReactNode
}

interface SimpleTableProps<T> {
    rows: T[]
    columns: SimpleColumn<T>[]
    isLoading: boolean
    emptyText: string
    /** Berilmasa tahrirlash tugmasi ko'rsatilmaydi. */
    onEdit?: (row: T) => void
    /** Berilmasa o'chirish tugmasi umuman ko'rsatilmaydi. */
    onDelete?: (row: T) => void
    /** Berilmasa parolni yangilash tugmasi ko'rsatilmaydi. */
    onResetPassword?: (row: T) => void
}

/**
 * Super-admin paneli uchun oddiy jadval.
 *
 * Admin'dagi `EntityTable` ishlatilmadi: u `AdminRow` ga va generik
 * konfiguratsiyaga bog'langan, bo'limlar esa bir-biridan import qilmaydi.
 * Bu yerda ustunlar shunchaki funksiya bo'lgani uchun ancha soddaroq.
 */
export function SimpleTable<T extends { id: string }>({
    rows,
    columns,
    isLoading,
    emptyText,
    onEdit,
    onDelete,
    onResetPassword,
}: SimpleTableProps<T>) {
    const hasActions = Boolean(onEdit || onDelete || onResetPassword)
    const { t } = useT()
    const tableColumns: DataTableColumn<T>[] = columns.map((column) => ({
        key: column.key,
        header: column.label,
        render: column.render,
    }))

    return (
        <DataTable
            rows={rows}
            columns={tableColumns}
            isLoading={isLoading}
            loadingText={t('common.loading')}
            emptyText={emptyText}
            getRowKey={(row) => row.id}
            // Hech biri berilmasa ustun umuman chizilmaydi: hech nima
            // qilmaydigan tugma tugma yo'qligidan yomonroq.
            actionsHeader={hasActions ? t('admin.actions') : undefined}
            renderActions={
                hasActions
                    ? (row) => (
                          <>
                              {onResetPassword && (
                                  <IconButton
                                      label={t('superAdmin.password.regenerate')}
                                      onClick={() => onResetPassword(row)}
                                  >
                                      <LockResetIcon />
                                  </IconButton>
                              )}
                              {onEdit && (
                                  <IconButton label={t('common.edit')} onClick={() => onEdit(row)}>
                                      <EditIcon />
                                  </IconButton>
                              )}
                              {onDelete && (
                                  <IconButton
                                      label={t('common.delete')}
                                      tone="danger"
                                      onClick={() => onDelete(row)}
                                  >
                                      <TrashIcon />
                                  </IconButton>
                              )}
                          </>
                      )
                    : undefined
            }
        />
    )
}
