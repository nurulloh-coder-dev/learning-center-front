import { useState } from 'react'
import { useAuth, useSession } from '@/app/providers/useAuth'
import { useTheme } from '@/app/providers/useTheme'
import { errorMessage } from '@/shared/api'
import { useT } from '@/shared/i18n'
import { ErrorBox, Pagination, Panel } from '@/shared/ui'
import { AdminTabStrip } from '../components/AdminSidebar'
import { useAdminNav } from '../hooks/useAdminNav'
import { AssignStudentsModal } from '../components/AssignStudentsModal'
import { EntityFormModal } from '../components/EntityFormModal'
import { EntityListHeader } from '../components/EntityListHeader'
import { EntityTable } from '../components/EntityTable'
import { CredentialsModal } from '../components/CredentialsModal'
import { OnboardingSteps } from '../components/OnboardingSteps'
import { StatsRow } from '../components/StatsRow'
import { COLUMN_CONFIGS, inferColumns } from '../config/columns'
import { entityByKey } from '../config/entities'
import { FORM_CONFIGS } from '../config/forms'
import { useAdminPermissions } from '../hooks/useAdminPermissions'
import { useEntityCounts } from '../hooks/useEntityCounts'
import { useEntityList } from '../hooks/useEntityList'
import { useGroupLevelNames } from '../hooks/useGroupLevelNames'
import { useEntityFormFlow } from '../hooks/useEntityFormFlow'
import { useBranchOptions } from '../hooks/useBranchOptions'
import { useGroupOptions } from '../hooks/useGroupOptions'
import { useTeacherOptions } from '../hooks/useTeacherOptions'
import { AppShell } from '@/shared/ui'
import type { AdminRow, EntityKey } from '../types'

export function AdminDashboardPage() {
    const { t } = useT()
    const session = useSession()
    const { signOut } = useAuth()
    const { theme, toggleTheme } = useTheme()

    const { visibleEntities, hasLeadPermission, hasInvoicePermission } = useAdminPermissions()

    const [activeTab, setActiveTab] = useState<EntityKey>(() => visibleEntities[0]?.key ?? 'groups')
    const [page, setPage] = useState(0)
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('STARTING')
    const [assignGroup, setAssignGroup] = useState<AdminRow | null>(null)

    const entity = entityByKey(activeTab)
    const formConfig = FORM_CONFIGS[activeTab]
    const columnConfigs = COLUMN_CONFIGS[activeTab]

    const plural = t(entity.pluralKey)
    const singular = t(entity.singularKey)

    const list = useEntityList(entity, session.token, {
        page,
        search,
        // Status filtri faqat guruhlarda ma'noga ega.
        status: activeTab === 'groups' ? statusFilter : undefined,
    })
    const counts = useEntityCounts(session.token, visibleEntities)
    const groupLevelNames = useGroupLevelNames(session.token)
    const teacherOptions = useTeacherOptions(session.token)
    const groupOptions = useGroupOptions(session.token)
    const branchOptions = useBranchOptions(session.token)
    const columns = columnConfigs ? columnConfigs.map((column) => column.key) : inferColumns(list.rows)
    const flow = useEntityFormFlow(entity, session.token, formConfig, columns)
    const { save, remove, formModal, credentials } = flow

    /** Tab almashganda sahifalash va filtrlarni tozalaymiz — aks holda yangi
     *  bo'limda "3-sahifa, qidiruv: Ali" holati qolib ketadi. */
    function changeTab(tab: EntityKey) {
        setActiveTab(tab)
        setPage(0)
        setSearch('')
        setStatusFilter('STARTING')
    }

    const { nav, links } = useAdminNav(visibleEntities, activeTab, changeTab, {
        leads: hasLeadPermission,
        invoices: hasInvoicePermission,
    })

    function handleDelete(row: AdminRow) {
        if (!confirm(t('admin.deleteConfirm', { entity: singular.toLowerCase() }))) return
        remove.mutate(row.id)
    }

    return (
        <>
        <AppShell
            subtitle={plural}
            nav={nav}
            onSignOut={signOut}
            token={session.token}
            theme={theme}
            toggleTheme={toggleTheme}
            secondary={
                <AdminTabStrip
                    entities={visibleEntities}
                    activeTab={activeTab}
                    onTabChange={changeTab}
                    links={links}
                />
            }
        >
            <StatsRow entities={visibleEntities} counts={counts} />

            <OnboardingSteps
                levelCount={groupLevelNames.data?.length ?? 0}
                teacherCount={counts.teachers ?? 0}
                groupCount={counts.groups ?? 0}
                studentCount={counts.students ?? 0}
                onTabChange={changeTab}
            />

            <Panel>
                <EntityListHeader
                    plural={plural}
                    singular={singular}
                    showStatusFilter={activeTab === 'groups'}
                    statusFilter={statusFilter}
                    search={search}
                    onStatusChange={(status) => {
                        setStatusFilter(status)
                        setPage(0)
                    }}
                    onSearchChange={(value) => {
                        setSearch(value)
                        setPage(0)
                    }}
                    onCreate={flow.openCreate}
                />

                {list.error && (
                    <div className="mb-4">
                        <ErrorBox>
                            {t('admin.loadFailed', {
                                entity: plural.toLowerCase(),
                                message: errorMessage(list.error),
                            })}
                        </ErrorBox>
                    </div>
                )}

                {remove.error && (
                    <div className="mb-4">
                        <ErrorBox>
                            {t('admin.deleteFailed', { message: errorMessage(remove.error) })}
                        </ErrorBox>
                    </div>
                )}

                {!list.error && (
                    <EntityTable
                        rows={list.rows}
                        columns={columns}
                        columnConfigs={columnConfigs}
                        isLoading={list.isLoading}
                        entityLabel={plural.toLowerCase()}
                        onAssignStudents={activeTab === 'groups' ? setAssignGroup : undefined}
                        onEdit={flow.openEdit}
                        onDelete={handleDelete}
                    />
                )}

                <Pagination
                    page={page}
                    totalPages={list.totalPages}
                    totalElements={list.totalElements}
                    onPageChange={setPage}
                />
            </Panel>
        </AppShell>

            {formModal && (
                <EntityFormModal
                    // `key` — tab yoki qator almashganda forma state'i toza
                    // boshlanishi uchun (React komponentni qayta yaratadi).
                    key={`${activeTab}-${formModal.id ?? 'new'}`}
                    mode={formModal.mode}
                    entityLabel={singular}
                    initialValues={formModal.values}
                    draftKey={`entity:${activeTab}:${formModal.id ?? 'new'}`}
                    formConfig={formConfig}
                    fallbackColumns={columns}
                    teacherOptions={teacherOptions}
                    groupOptions={groupOptions}
                    branchOptions={branchOptions}
                    isSaving={save.isPending}
                    error={save.error}
                    onSubmit={flow.handleSubmit}
                    onClose={flow.closeForm}
                />
            )}

            {credentials && (
                <CredentialsModal credentials={credentials} onClose={flow.closeCredentials} />
            )}

            {assignGroup && (
                <AssignStudentsModal group={assignGroup} onClose={() => setAssignGroup(null)} />
            )}
        </>
    )
}
