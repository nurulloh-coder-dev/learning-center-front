import { useMemo, type ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useSession } from '@/app/providers/useAuth'
import { useT } from '@/shared/i18n'
import {
    AppNavContext,
    CalendarIcon,
    DashboardIcon,
    LayersIcon,
    SettingsIcon,
    TargetIcon,
    WalletIcon,
    type NavItem,
    type NavSection,
} from '@/shared/ui'
import { roleHome } from './roleHome'

/**
 * Rolga qarab umumiy havolalar — har sahifaning chap menyusi pastida.
 *
 * Faqat `AppRoutes` ruxsat bergan marshrutlar: menyuda bor, lekin bosganda
 * "/" ga qaytaradigan band bo'lmasin. Ruxsat ham shu yerda tekshiriladi
 * (`RequirePermission` bilan bir xil qoida).
 */
export function AppNavigation({ children }: { children: ReactNode }) {
    const session = useSession()
    const { t } = useT()
    const navigate = useNavigate()
    const { pathname } = useLocation()

    const sections = useMemo<NavSection[]>(() => {
        const role = session.role
        const can = (permission: 'LEAD_MANAGEMENT' | 'INVOICE_MANAGEMENT') =>
            role !== 'ADMINISTRATOR' || session.permissions.includes(permission)
        const link = (key: string, path: string, label: string, icon: ReactNode): NavItem => ({
            key,
            label,
            icon,
            active: pathname === path,
            onClick: () => navigate(path),
        })

        const items: NavItem[] = [link('home', roleHome(role), t('nav.home'), <DashboardIcon />)]
        if (role === 'TEACHER') items.push(link('attendance', '/attendance', t('nav.attendance'), <CalendarIcon />))
        if (role === 'ADMINISTRATOR' || role === 'SUPER_ADMIN') {
            items.push(link('group-levels', '/group-levels', t('groupLevel.title'), <LayersIcon />))
            if (can('LEAD_MANAGEMENT')) items.push(link('leads', '/leads', t('lead.title'), <TargetIcon />))
            if (can('INVOICE_MANAGEMENT')) items.push(link('payments', '/payments', t('invoice.title'), <WalletIcon />))
        }
        items.push(link('settings', '/settings', t('nav.settings'), <SettingsIcon />))

        return [{ key: 'global', label: t('nav.group.sections'), items }]
    }, [session.role, session.permissions, pathname, navigate, t])

    return <AppNavContext.Provider value={sections}>{children}</AppNavContext.Provider>
}
