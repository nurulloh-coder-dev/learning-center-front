import { Route, Routes, useMatch } from 'react-router-dom'
import { useAuth } from '@/app/providers/useAuth'
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { AttendancePage } from '@/features/attendance/pages/AttendancePage'
import { GroupLevelsPage } from '@/features/group-levels/pages/GroupLevelsPage'
import { LeadsPage } from '@/features/leads/pages/LeadsPage'
import { PublicLeadFormPage } from '@/features/leads/pages/PublicLeadFormPage'
import { PaymentsPage } from '@/features/payments/pages/PaymentsPage'
import { SettingsPage } from '@/features/settings/pages/SettingsPage'
import { NotFoundPage } from './NotFoundPage'
import { RequirePermission } from './RequirePermission'
import { RequireRole } from './RequireRole'
import { RoleDashboard } from './RoleDashboard'

/**
 * Ilova marshrutlari.
 *
 * Autentifikatsiya shu yerda yagona joyda tekshiriladi: sessiya bo'lmasa
 * hech qanday himoyalangan marshrut umuman render bo'lmaydi, shuning uchun
 * ichkarida `session` doim mavjud (`useSession` shunga tayanadi).
 *
 * Rol tekshiruvi esa `RequireRole` orqali — qarang o'sha faylning
 * izohidagi ogohlantirish: bu faqat UI qulayligi, backendda hali
 * `@PreAuthorize` yo'q.
 */
export function AppRoutes() {
    const { session, signIn, isRestoring } = useAuth()
    const publicForm = useMatch('/f/:key')

    // Ochiq lid formasi — sessiyadan OLDIN: mijoz tizimga kirmaydi va
    // refresh-token tekshiruvini kutib bo'sh ekran ko'rmasligi kerak.
    if (publicForm) {
        return (
            <Routes>
                <Route path="/f/:key" element={<PublicLeadFormPage />} />
            </Routes>
        )
    }

    // Refresh-token tekshiruvi tugamaguncha bo'sh ekran: aks holda kirgan
    // foydalanuvchi bir lahza login sahifasini ko'rib qoladi.
    if (isRestoring) return null

    if (!session) return <LoginPage onLoggedIn={signIn} />

    return (
        <Routes>
            <Route
                path="/attendance"
                element={
                    <RequireRole roles={['ADMINISTRATOR', 'TEACHER']}>
                        <AttendancePage />
                    </RequireRole>
                }
            />
            <Route
                path="/payments"
                element={
                    <RequireRole roles={['ADMINISTRATOR', 'TEACHER', 'SUPER_ADMIN']}>
                        <RequirePermission permission="INVOICE_MANAGEMENT">
                            <PaymentsPage />
                        </RequirePermission>
                    </RequireRole>
                }
            />
            <Route
                path="/group-levels"
                element={
                    <RequireRole roles={['ADMINISTRATOR', 'SUPER_ADMIN']}>
                        <GroupLevelsPage />
                    </RequireRole>
                }
            />
            <Route
                path="/leads"
                element={
                    <RequireRole roles={['ADMINISTRATOR', 'SUPER_ADMIN']}>
                        <RequirePermission permission="LEAD_MANAGEMENT">
                            <LeadsPage />
                        </RequirePermission>
                    </RequireRole>
                }
            />
            <Route
                path="/settings"
                element={
                    <RequireRole roles={['SUPER_ADMIN', 'ADMINISTRATOR', 'TEACHER', 'STUDENT', 'DEVELOPER']}>
                        <SettingsPage />
                    </RequireRole>
                }
            />
            <Route path="/" element={<RoleDashboard />} />
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    )
}
