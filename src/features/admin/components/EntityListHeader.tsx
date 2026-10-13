import { useT } from '@/shared/i18n'
import { GROUP_STATUSES } from '@/shared/types'
import { Button, Eyebrow, SearchInput, Select } from '@/shared/ui'

interface EntityListHeaderProps {
    plural: string
    singular: string
    showStatusFilter: boolean
    statusFilter: string
    search: string
    onStatusChange: (status: string) => void
    onSearchChange: (search: string) => void
    onCreate: () => void
}

export function EntityListHeader({
    plural,
    singular,
    showStatusFilter,
    statusFilter,
    search,
    onStatusChange,
    onSearchChange,
    onCreate,
}: EntityListHeaderProps) {
    const { t } = useT()

    return (
        <header className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div className="min-w-0">
                <Eyebrow>{t('admin.records')}</Eyebrow>
                <h1 className="mt-1 font-display text-2xl font-semibold text-fg">{plural}</h1>
            </div>

            <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
                {showStatusFilter && (
                    <Select
                        aria-label={t('admin.filterStatus')}
                        className="w-full sm:w-auto"
                        options={GROUP_STATUSES.map((status) => ({
                            value: status,
                            label: t(`status.${status}`),
                        }))}
                        value={statusFilter}
                        onChange={(event) => onStatusChange(event.target.value)}
                    />
                )}
                <SearchInput
                    className="min-w-40 flex-1 sm:w-64 sm:flex-none"
                    aria-label={t('admin.search', { entity: plural.toLowerCase() })}
                    placeholder={t('admin.search', { entity: plural.toLowerCase() })}
                    value={search}
                    onChange={(event) => onSearchChange(event.target.value)}
                />
                <Button variant="primary" onClick={onCreate}>
                    {t('admin.new', { entity: singular.toLowerCase() })}
                </Button>
            </div>
        </header>
    )
}
