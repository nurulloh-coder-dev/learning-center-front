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
        {
            key: 'superAdmins',
            header: t('organization.superAdmins'),
            align: 'right',
            render: (row) => <span className="tabular-nums">{row.superAdminCount ?? '—'}</span>,
        },
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
            // Dasturchi faqat BIRINCHI super adminni ochadi (rahbar qarori);
            // keyingilarini markazning super admini o'z panelidan qo'shadi.
            // Son backenddan keladi — boshqa qurilmada ham bir xil.
            renderActions={(row) =>
                (row.superAdminCount ?? 0) > 0 ? null : (
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
