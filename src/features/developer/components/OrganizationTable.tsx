import { useT } from '@/shared/i18n'
import { Button, DataTable } from '@/shared/ui'
import type { DataTableColumn } from '@/shared/ui'
import type { OrganizationDto } from '@/shared/types'

interface OrganizationTableProps {
    organizations: OrganizationDto[]
    isLoading: boolean
    onAddSuperAdmin: (organization: OrganizationDto) => void
}

export function OrganizationTable({
    organizations,
    isLoading,
    onAddSuperAdmin,
}: OrganizationTableProps) {
    const { t } = useT()

    const columns: DataTableColumn<OrganizationDto>[] = [
        { key: 'name', header: t('field.organizationName'), render: (row) => row.name ?? '—' },
        {
            key: 'phone',
            header: t('field.phone'),
            render: (row) => <span className="font-mono text-sm">{row.phone || '—'}</span>,
        },
        { key: 'email', header: t('organization.email'), render: (row) => row.email || '—' },
        { key: 'website', header: t('organization.website'), render: (row) => row.website || '—' },
    ]

    return (
        <DataTable
            rows={organizations}
            columns={columns}
            isLoading={isLoading}
            loadingText={t('common.loading')}
            emptyText={t('organization.empty')}
            getRowKey={(row) => row.id}
            actionsHeader={t('admin.actions')}
            // Har markazga bitta super admin (rahbar qarori): qo'shilgandan
            // keyin tugma qaytib chiqmaydi. Ma'lumot backenddan keladi,
            // shuning uchun boshqa qurilma va boshqa dasturchida ham bir xil.
            renderActions={(row) =>
                row.hasSuperAdmin ? null : (
                    <div className="flex justify-end">
                        <Button size="sm" onClick={() => onAddSuperAdmin(row)}>
                            {t('organization.addSuperAdmin')}
                        </Button>
                    </div>
                )
            }
        />
    )
}
