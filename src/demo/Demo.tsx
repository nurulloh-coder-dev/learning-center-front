import { useState, type ReactNode } from 'react'
import { MemoryRouter } from 'react-router-dom'
import App from '@/app/App'
import { setDemoRole } from './mockApi'
import { DemoBar } from './DemoBar'
import { DEMO_ROLES, type DemoRole } from './roles'

/**
 * Boshlang'ich rolni URL hash'idan oladi (`…/demo.html#TEACHER`).
 *
 * Shu tufayli aniq bir ekranga havola ulashish mumkin, hash bo'lmasa
 * administrator paneli ochiladi.
 */
function initialRole(): DemoRole {
    const fromHash = window.location.hash.replace('#', '').toUpperCase()
    const match = DEMO_ROLES.find((role) => role.value === fromHash)
    return match?.value ?? DEMO_ROLES[0].value
}

/**
 * `…/demo.html#f/demo-cornerstone` — ochiq lid formasi (tizimga kirmasdan).
 * Demo bitta fayl, haqiqiy `/f/<kalit>` manzili yo'q — shuning uchun hash.
 */
const publicPath = window.location.hash.startsWith('#f/') ? `/${window.location.hash.slice(1)}` : null

function PublicRouter({ children }: { children: ReactNode }) {
    return <MemoryRouter initialEntries={[publicPath ?? '/']}>{children}</MemoryRouter>
}

/** Demo ildizi: ilova + rol almashtirgich. */
export function Demo() {
    const [role, setRole] = useState<DemoRole>(() => {
        const start = initialRole()
        setDemoRole(start)
        return start
    })

    function changeRole(next: DemoRole) {
        setDemoRole(next)
        setRole(next)
        window.location.hash = next
    }

    if (publicPath) return <App router={PublicRouter} />

    return (
        <>
            {/* `key` — rol o'zgarganda daraxt qayta quriladi va AuthProvider
                sessiyani yangi rol bilan qaytadan tiklaydi. */}
            <App key={role} router={MemoryRouter} />
            <DemoBar role={role} onRoleChange={changeRole} />
        </>
    )
}
