import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useT } from '@/shared/i18n'
import { formatAmount } from '@/shared/lib'
import type { MonthRevenueData } from '../../hooks/useMonthlyInvoiceRevenue'
import { DashboardCard } from './DashboardCard'

interface RevenueChartCardProps {
    data: MonthRevenueData[]
    isLoading: boolean
    isError: boolean
    className?: string
}

/**
 * Oylik tushum — namunadagi "Savdo dinamikasi" kabi silliq egri, ostida
 * yumshoq gradient, nuqtalar va oq tooltip kartasi. Ranglar CSS tokenlardan:
 * tema almashsa grafik ham o'zi qayta bo'yaladi.
 */
export function RevenueChartCard({ data, isLoading, isError, className }: RevenueChartCardProps) {
    const { t } = useT()

    return (
        <DashboardCard title={t('analytics.revenueDynamics')} subtitle={t('analytics.monthlyInvoiceRevenue')} className={className}>
            <div className="h-72 w-full">
                {isLoading ? (
                    <div className="flex h-full items-center justify-center text-sm text-fg-muted">···</div>
                ) : isError ? (
                    <div className="flex h-full items-center justify-center text-sm text-danger-fg">{t('analytics.error')}</div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="var(--color-accent)" stopOpacity={0.28} />
                                    <stop offset="100%" stopColor="var(--color-accent)" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="var(--color-border-base)" />
                            <XAxis dataKey="monthLabel" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-fg-muted)', fontSize: 12 }} />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: 'var(--color-fg-muted)', fontSize: 12 }}
                                // Standart 60px "1 200 000" ga yetmaydi — boshi qirqilib
                                // "200 000" ko'rinardi va summa 6 baravar kam tuyulardi.
                                width={84}
                                tickFormatter={(val) => formatAmount(val)}
                            />
                            <Tooltip
                                cursor={{ stroke: 'var(--color-border-strong)', strokeDasharray: '4 4' }}
                                contentStyle={{
                                    backgroundColor: 'var(--color-surface-card)',
                                    borderColor: 'var(--color-border-base)',
                                    borderRadius: '0.75rem',
                                    boxShadow: 'var(--shadow-card)',
                                    color: 'var(--color-fg)',
                                }}
                                formatter={(value: unknown) => [formatAmount(typeof value === 'number' ? value : 0), t('analytics.revenue')]}
                                labelStyle={{ color: 'var(--color-fg)', fontWeight: 600 }}
                            />
                            <Area
                                type="monotone"
                                dataKey="amount"
                                stroke="var(--color-accent)"
                                strokeWidth={2.5}
                                fill="url(#revenueGradient)"
                                dot={{ r: 3.5, fill: 'var(--color-surface-card)', stroke: 'var(--color-accent)', strokeWidth: 2 }}
                                activeDot={{ r: 5, fill: 'var(--color-accent)', stroke: 'var(--color-surface-card)', strokeWidth: 2 }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                )}
            </div>
        </DashboardCard>
    )
}
