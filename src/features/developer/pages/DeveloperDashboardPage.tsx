import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAuth, useSession } from '@/app/providers/useAuth'
import { useTheme } from '@/app/providers/useTheme'
import { errorMessage } from '@/shared/api'
import { useT } from '@/shared/i18n'
import { AppShell, Button, ErrorBox, Pagination, Panel, SearchInput, SegmentedControl } from '@/shared/ui'
import { fetchOrganizationOptions } from '../api/developerApi'
import { NewSubscriptionModal } from '../components/NewSubscriptionModal'
import { OrganizationFormModal } from '../components/OrganizationFormModal'
import { OrganizationsPanel } from '../components/OrganizationsPanel'
import { SuperAdminFormModal } from '../components/SuperAdminFormModal'
import { PlanFormModal } from '../components/PlanFormModal'
import { PlanTable } from '../components/PlanTable'
import { SubscriptionTable } from '../components/SubscriptionTable'
import { usePlanMutations, usePlans } from '../hooks/usePlans'
import { useOrganizationMutations } from '../hooks/useOrganizations'
import { useSubscriptionMutations, useSubscriptions } from '../hooks/useSubscriptions'
import type { OrganizationDto, PlanDto, SubscriptionDto } from '@/shared/types'

type Tab = 'organizations' | 'plans' | 'subscriptions'

/**
 * Dasturchi paneli.
 *
 * Bu yerda mijozning ma'lumoti emas, TIZIMNING o'zi boshqariladi: qaysi
 * tariflar bor va qaysi markaz qachongacha to'lagan. Shuning uchun u
 * super-admin panelidan alohida turadi — super-admin bitta markazning
 * egasi, dasturchi esa hammasining ustidan.
 */
export function DeveloperDashboardPage() {
    const { t } = useT()
    const session = useSession()
    const { signOut } = useAuth()
    const { theme, toggleTheme } = useTheme()

    const [tab, setTab] = useState<Tab>('organizations')
    const [page, setPage] = useState(0)
    const [search, setSearch] = useState('')
    const [editingPlan, setEditingPlan] = useState<PlanDto | null>(null)
    const [isPlanFormOpen, setIsPlanFormOpen] = useState(false)
    const [isSubscriptionFormOpen, setIsSubscriptionFormOpen] = useState(false)
    const [isOrganizationFormOpen, setIsOrganizationFormOpen] = useState(false)
    const [superAdminFor, setSuperAdminFor] = useState<OrganizationDto | null>(null)

    const { plans, isLoading: plansLoading, error: plansError } = usePlans(session.token)
    const planMutations = usePlanMutations(session.token)
    const { subscriptions, totalPages, totalElements, isLoading, error } = useSubscriptions(
        session.token,
        page,
        search
    )
    const subscriptionMutations = useSubscriptionMutations(session.token)

    const organizations = useQuery({
        queryKey: ['organization', 'options'] as const,
        queryFn: () => fetchOrganizationOptions(session.token),
        staleTime: 5 * 60_000,
    })
    const organizationMutations = useOrganizationMutations(session.token)

    function closePlanForm() {
        setIsPlanFormOpen(false)
        setEditingPlan(null)
        planMutations.save.reset()
    }

    return (
        <AppShell
            subtitle={t('developer.title')}
            onSignOut={signOut}
            token={session.token}
            theme={theme}
            toggleTheme={toggleTheme}
        >
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <SegmentedControl
                    label={t('developer.title')}
                    value={tab}
                    onChange={(next) => {
                        // Qidiruv va sahifa tab'ga bog'liq — almashganda
                        // eski qidiruv yangi ro'yxatni bo'sh ko'rsatardi.
                        setTab(next as Tab)
                        setSearch('')
                        setPage(0)
                    }}
                    options={[
                        { value: 'organizations', label: t('developer.organizationsTab') },
                        { value: 'subscriptions', label: t('developer.subscriptionsTab') },
                        { value: 'plans', label: t('developer.plansTab') },
                    ]}
                />

                {tab === 'organizations' && (
                    <Button variant="primary" size="sm" onClick={() => setIsOrganizationFormOpen(true)}>
                        {t('organization.new')}
                    </Button>
                )}
                {tab === 'plans' && (
                    <Button variant="primary" size="sm" onClick={() => setIsPlanFormOpen(true)}>
                        {t('plan.new')}
                    </Button>
                )}
                {tab === 'subscriptions' && (
                    <Button variant="primary" size="sm" onClick={() => setIsSubscriptionFormOpen(true)}>
                        {t('subscription.new')}
                    </Button>
                )}
            </div>

            {tab === 'organizations' && (
                <OrganizationsPanel
                    token={session.token}
                    page={page}
                    search={search}
                    onPageChange={setPage}
                    onSearchChange={(next) => {
                        setSearch(next)
                        setPage(0)
                    }}
                    onAddSuperAdmin={setSuperAdminFor}
                />
            )}

            {tab === 'plans' && (
                <Panel>
                    {plansError != null && <ErrorBox>{errorMessage(plansError)}</ErrorBox>}
                    <PlanTable
                        plans={plans}
                        isLoading={plansLoading}
                        onEdit={(plan) => {
                            setEditingPlan(plan)
                            setIsPlanFormOpen(true)
                        }}
                        onDelete={(plan) => planMutations.remove.mutate(plan.id)}
                    />
                </Panel>
            )}

            {/* Faqat o'z tabida: ilgari `plans ? … : …` shakli tufayli obunalar
                jadvali "Tashkilotlar" tabida ham ikkinchi bo'lib chiqardi. */}
            {tab === 'subscriptions' && (
                <Panel>
                    <div className="mb-3 max-w-xs">
                        <SearchInput
                            value={search}
                            onChange={(event) => {
                                setSearch(event.target.value)
                                // Qidiruv o'zgarsa birinchi sahifaga qaytamiz:
                                // aks holda natija kam bo'lsa bo'sh sahifa chiqadi.
                                setPage(0)
                            }}
                            placeholder={t('subscription.search')}
                        />
                    </div>

                    {error != null && <ErrorBox>{errorMessage(error)}</ErrorBox>}

                    <SubscriptionTable
                        subscriptions={subscriptions}
                        isLoading={isLoading}
                        onCancel={(row: SubscriptionDto) =>
                            subscriptionMutations.changeStatus.mutate({
                                id: row.id,
                                body: { status: 'CANCELED', note: row.note },
                            })
                        }
                    />

                    <Pagination
                        page={page}
                        totalPages={totalPages}
                        totalElements={totalElements}
                        onPageChange={setPage}
                    />
                </Panel>
            )}

            {isPlanFormOpen && (
                <PlanFormModal
                    plan={editingPlan}
                    isSaving={planMutations.save.isPending}
                    error={planMutations.save.error}
                    onSubmit={(body) =>
                        planMutations.save.mutate(
                            { id: editingPlan?.id, body },
                            { onSuccess: closePlanForm }
                        )
                    }
                    onClose={closePlanForm}
                />
            )}

            {isOrganizationFormOpen && (
                <OrganizationFormModal
                    isSaving={organizationMutations.create.isPending}
                    error={organizationMutations.create.error}
                    onSubmit={(body) =>
                        organizationMutations.create.mutate(body, {
                            onSuccess: () => setIsOrganizationFormOpen(false),
                        })
                    }
                    onClose={() => setIsOrganizationFormOpen(false)}
                />
            )}

            {superAdminFor && (
                <SuperAdminFormModal
                    organizationName={superAdminFor.name ?? ''}
                    isSaving={organizationMutations.addSuperAdmin.isPending}
                    error={organizationMutations.addSuperAdmin.error}
                    onSubmit={(body) =>
                        organizationMutations.addSuperAdmin.mutate(
                            { organizationId: superAdminFor.id, body },
                            { onSuccess: () => setSuperAdminFor(null) }
                        )
                    }
                    onClose={() => setSuperAdminFor(null)}
                />
            )}

            {isSubscriptionFormOpen && (
                <NewSubscriptionModal
                    organizations={organizations.data ?? []}
                    plans={plans.filter((plan) => plan.active !== false)}
                    isSaving={subscriptionMutations.create.isPending}
                    error={subscriptionMutations.create.error}
                    onSubmit={(body) =>
                        subscriptionMutations.create.mutate(body, {
                            onSuccess: () => setIsSubscriptionFormOpen(false),
                        })
                    }
                    onClose={() => setIsSubscriptionFormOpen(false)}
                />
            )}
        </AppShell>
    )
}
