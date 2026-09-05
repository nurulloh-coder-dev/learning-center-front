import type { ReactNode } from 'react'
import { cn } from '@/shared/lib'
import { dataTableClasses } from './dataTableClasses'
import type { DataTableColumn } from './dataTableTypes'

interface DataTableProps<T> {
    rows: T[]
    columns: DataTableColumn<T>[]
    isLoading: boolean
    loadingText: string
    emptyText: string
    getRowKey: (row: T) => string
    actionsHeader?: ReactNode
    /** `index` — ro'yxatdagi o'rni; tartib siljitish tugmalarini chetda o'chirish uchun kerak. */
    renderActions?: (row: T, index: number) => ReactNode
}

export function DataTable<T>({
    rows,
    columns,
    isLoading,
    loadingText,
    emptyText,
    getRowKey,
    actionsHeader,
    renderActions,
}: DataTableProps<T>) {
    const hasActions = Boolean(renderActions)
    const colSpan = columns.length + (hasActions ? 1 : 0)

    return (
        <div className={dataTableClasses.container}>
            <table className={dataTableClasses.table}>
                <thead>
                    <tr>
                        {columns.map((column) => (
                            <th
                                key={column.key}
                                className={cn(dataTableClasses.headerCell, column.align === 'right' && 'text-right')}
                            >
                                {column.header}
                            </th>
                        ))}
                        {hasActions && (
                            <th className={cn(dataTableClasses.headerCell, 'text-right')}>{actionsHeader}</th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {isLoading && (
                        <tr>
                            <td colSpan={colSpan} className={dataTableClasses.stateCell}>
                                {loadingText}
                            </td>
                        </tr>
                    )}

                    {!isLoading && rows.length === 0 && (
                        <tr>
                            <td colSpan={colSpan} className={dataTableClasses.stateCell}>
                                {emptyText}
                            </td>
                        </tr>
                    )}

                    {!isLoading &&
                        rows.map((row, index) => (
                            <tr key={getRowKey(row)} className={dataTableClasses.row}>
                                {columns.map((column) => (
                                    <td
                                        key={column.key}
                                        className={cn(
                                            dataTableClasses.cell,
                                            column.align === 'right' && 'text-right',
                                            column.className,
                                        )}
                                    >
                                        {column.render(row)}
                                    </td>
                                ))}
                                {renderActions && (
                                    <td className={cn(dataTableClasses.cell, 'text-right')}>
                                        <div className={dataTableClasses.actions}>{renderActions(row, index)}</div>
                                    </td>
                                )}
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    )
}
