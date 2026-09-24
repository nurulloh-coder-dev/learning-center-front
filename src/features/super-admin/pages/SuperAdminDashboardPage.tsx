import { useState } from 'react'
import { useAuth, useSession } from '@/app/providers/useAuth'
import { useTheme } from '@/app/providers/useTheme'
import { useMyOrganization } from '@/shared/hooks'
import { useT } from '@/shared/i18n'
import { AppShell } from '@/shared/ui'
import { AnalyticsStatsRow } from '../components/AnalyticsStatsRow'
import { BranchesPanel } from '../components/BranchesPanel'
import { MySubscriptionPanel } from '../components/MySubscriptionPanel'
import { OrganizationPanel } from '../components/OrganizationPanel'
import { PeoplePanel } from '../components/PeoplePanel'
import { SuperAdminSidebar, type SuperAdminSection } from '../components/SuperAdminSidebar'
import { useAnalytics } from '../hooks/useAnalytics'
import { useAdminCount, useBranches } from '../hooks/useSuperAdminData'
import { useMySubscription } from '../hooks/useMySubscription'

/**
 * Markaz egasining paneli.
 *
 * Tashkilotlar RO'YXATI bu yerda yo'q va yangi tashkilot ham ochilmaydi:
 * super-admin BITTA markazning egasi, boshqalarni ko'rmasligi kerak.
 * Ikkalasi ham dasturchi panelida.
 */
export function SuperAdminDashboardPage() {
    const { t } = useT()
    const session = useSession()
    const { signOut } = useAuth()
    const { theme, toggleTheme } = useTheme()

    const [section, setSection] = useState<SuperAdminSection>('students')
    const [page, setPage] = useState(0)
    const [search, setSearch] = useState('')

    const organizationId = session.claims?.organizationId
    const { data: organization } = useMyOrganization(session.token, organizationId)
    const analytics = useAnalytics(session.token)
    const mySubscription = useMySubscription(session.token)
    const branches = useBranches(session.token, 0, '')
    const adminCount = useAdminCount(session.token)

    /*
     * Filial yo'q bo'lsa boshqa hech narsa qilib bo'lmaydi: o'quvchi ham,
     * o'qituvchi ham, administrator ham filialga biriktiriladi. Shuning
     * uchun ekran o'zi filiallarga qulflanadi — bo'sh ro'yxatlarni ochib,
     * keyin "nega qo'sha olmayapman" degan savolga qolgandan ko'ra shu
     * tushunarli.
     */
    const needsBranch = !branches.isLoading && branches.totalElements === 0
    const activeSection = needsBranch ? 'branches' : section

    /** Qizil nuqta: bajarilishi kerak, lekin hali bajarilmagan ishlar. */
    const needsAttention: SuperAdminSection[] = [
        ...(needsBranch ? (['branches'] as const) : []),
        ...(!needsBranch && adminCount === 0 ? (['administrators'] as const) : []),
    ]

    function changeSection(next: SuperAdminSection) {
        // Qidiruv va sahifa bo'limga tegishli — almashganda tozalanadi,
        // aks holda yangi ro'yxat eski qidiruv bilan bo'sh chiqadi.
        setSection(next)
        setSearch('')
        setPage(0)
    }

    return (
        <AppShell
            subtitle={t('superAdmin.role')}
            onSignOut={signOut}
            token={session.token}
            theme={theme}
            toggleTheme={toggleTheme}
        >
            <MySubscriptionPanel
                subscription={mySubscription.subscription}
                isLoading={mySubscription.isLoading}
            />

            <AnalyticsStatsRow items={analytics.items} />

            <div className="flex gap-6">
                <SuperAdminSidebar
                    active={activeSection}
                    onChange={changeSection}
                    needsAttention={needsAttention}
                    lockedTo={needsBranch ? 'branches' : undefined}
                />

                <div className="min-w-0 flex-1">
                    {needsBranch && (
                        <p className="mb-3 rounded-lg border border-amber/20 bg-amber-soft px-4 py-3 text-sm text-amber-fg">
                            {t('superAdmin.branchRequired')}
                        </p>
                    )}

                    {activeSection === 'branches' && (
                        <BranchesPanel
                            token={session.token}
                            page={page}
                            search={search}
                            organizationId={organizationId}
                            organizationName={organization?.name}
                            onPageChange={setPage}
                            onSearchChange={(next) => {
                                setSearch(next)
                                setPage(0)
                            }}
                        />
                    )}

                    {activeSection === 'organization' && (
                        <OrganizationPanel token={session.token} organizationId={organizationId} />
                    )}

                    {activeSection !== 'branches' && activeSection !== 'organization' && (
                        <PeoplePanel
                            token={session.token}
                            kind={activeSection}
                            page={page}
                            search={search}
                            onPageChange={setPage}
                            onSearchChange={(next) => {
                                setSearch(next)
                                setPage(0)
                            }}
                        />
                    )}
                </div>
            </div>
        </AppShell>
    )
}
