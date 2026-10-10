import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { useT } from '@/shared/i18n'
import { FolderIcon, LayersIcon, ShieldIcon, TargetIcon, WalletIcon } from '@/shared/ui'
import type { SuperAdminSection } from '../SuperAdminSidebar'
import { DashboardCard } from './DashboardCard'

interface QuickLinksCardProps {
    leadCount?: number | null
    branchCount?: number | null
    enrollmentCount?: number | null
    onOpenSection: (section: SuperAdminSection) => void
}

interface LinkRow {
    label: string
    icon: ReactNode
    tone: string
    value?: number | null
    onClick?: () => void
}

/**
 * Namunadagi "Tezkor havolalar": tez-tez ochiladigan joylar bir bosishda.
 * A'zolar soni ham shu yerda — tepadagi to'rt kartaga sig'magan, lekin
 * ilgari ko'rinib turgan raqam yo'qolmasin.
 */
export function QuickLinksCard({ leadCount, branchCount, enrollmentCount, onOpenSection }: QuickLinksCardProps) {
    const { t } = useT()
    const navigate = useNavigate()

    const rows: LinkRow[] = [
        { label: t('lead.title'), icon: <TargetIcon />, tone: 'bg-amber-soft text-amber-fg', value: leadCount, onClick: () => navigate('/leads') },
        { label: t('invoice.title'), icon: <WalletIcon />, tone: 'bg-success-soft text-success-fg', onClick: () => navigate('/payments') },
        { label: t('superAdmin.section.branches'), icon: <LayersIcon />, tone: 'bg-steel-soft text-steel-fg', value: branchCount, onClick: () => onOpenSection('branches') },
        { label: t('superAdmin.section.administrators'), icon: <ShieldIcon />, tone: 'bg-purple-soft text-purple-fg', onClick: () => onOpenSection('administrators') },
        { label: t('analytics.enrollment'), icon: <FolderIcon />, tone: 'bg-accent-soft text-accent-fg', value: enrollmentCount },
    ]

    return (
        <DashboardCard title={t('analytics.quickLinks')}>
            <ul className="flex flex-col gap-2">
                {rows.map((row) => {
                    const content = (
                        <>
                            <span className={`flex size-8 shrink-0 items-center justify-center rounded-full ${row.tone}`}>{row.icon}</span>
                            <span className="flex-1 truncate text-sm font-medium text-fg">{row.label}</span>
                            {row.value != null && <span className="text-sm font-semibold tabular-nums text-fg-muted">{row.value}</span>}
                        </>
                    )
                    return (
                        <li key={row.label}>
                            {row.onClick ? (
                                <button
                                    type="button"
                                    onClick={row.onClick}
                                    className="flex min-h-11 w-full cursor-pointer items-center gap-3 rounded-xl border border-border-base px-3 text-left transition-colors hover:border-border-strong hover:bg-surface-hover"
                                >
                                    {content}
                                </button>
                            ) : (
                                <div className="flex min-h-11 items-center gap-3 rounded-xl bg-surface-muted px-3">{content}</div>
                            )}
                        </li>
                    )
                })}
            </ul>
        </DashboardCard>
    )
}
