import { AnalyticsStatsRow } from './AnalyticsStatsRow'
import { LeadFunnelCard } from './dashboard/LeadFunnelCard'
import { QuickLinksCard } from './dashboard/QuickLinksCard'
import { RecentPaymentsCard } from './dashboard/RecentPaymentsCard'
import { RevenueChartCard } from './dashboard/RevenueChartCard'
import type { SuperAdminSection } from './SuperAdminSidebar'
import { useAnalytics } from '../hooks/useAnalytics'
import { useLeadStatusCounts, useRecentPayments } from '../hooks/useDashboardLists'
import { useMonthlyInvoiceRevenue } from '../hooks/useMonthlyInvoiceRevenue'

interface AnalyticsPanelProps {
    token: string
    onOpenSection?: (section: SuperAdminSection) => void
}

/**
 * Super-admin dashboardi — namunadagi (ERP) tartib: tepada to'rt karta,
 * o'rtada grafik + lidlar holati, pastda so'nggi to'lovlar + tezkor havolalar.
 */
export default function AnalyticsPanel({ token, onOpenSection = () => {} }: AnalyticsPanelProps) {
    const analytics = useAnalytics(token)
    const revenue = useMonthlyInvoiceRevenue(token)
    const leads = useLeadStatusCounts(token)
    const payments = useRecentPayments(token)

    return (
        <div className="space-y-5">
            <AnalyticsStatsRow items={analytics.items} />

            <div className="grid gap-5 lg:grid-cols-3">
                <RevenueChartCard
                    className="lg:col-span-2"
                    data={revenue.chartData}
                    isLoading={revenue.isLoading}
                    isError={revenue.isError}
                />
                <LeadFunnelCard counts={leads.counts} isLoading={leads.isLoading} hasError={leads.error != null} />
            </div>

            <div className="grid gap-5 lg:grid-cols-3">
                <RecentPaymentsCard
                    className="lg:col-span-2"
                    rows={payments.rows}
                    isLoading={payments.isLoading}
                    hasError={payments.error != null}
                />
                <QuickLinksCard
                    leadCount={analytics.items.lead?.total}
                    branchCount={analytics.items.branch?.total}
                    enrollmentCount={analytics.items.enrollment?.total}
                    onOpenSection={onOpenSection}
                />
            </div>
        </div>
    )
}

export { AnalyticsPanel }
