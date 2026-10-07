import React from 'react'
import ReactDOM from 'react-dom/client'
import { Demo } from './Demo'
import { installMockApi } from './mockApi'
import './fonts.inline.css'
import '@/styles/index.css'
import './palettes.css'

/**
 * Demo kirish nuqtasi.
 *
 * Backend yo'q joyda (statik hosting yoki ulashilgan sahifa) ilovani to'liq
 * ko'rsatish uchun. `fetch` soxta API bilan almashtiriladi, `App` esa hech
 * qanday o'zgarishsiz ishlaydi.
 */

/**
 * Demo boshqa sahifa ichida (iframe) ko'rsatilishi mumkin. Agar o'sha sahifa
 * o'z temasini `data-theme` bilan e'lon qilgan bo'lsa, undan boshlaymiz —
 * aks holda to'q fon ustida yorug' ilova chiqib qolishi mumkin.
 */
/** UI tanlovi uchun: `?palette=ocean|mono` — palitra variantini yoqadi. */
function applyPaletteFromUrl() {
    const palette = new URLSearchParams(window.location.search).get('palette')
    if (palette === 'ocean' || palette === 'mono') document.documentElement.dataset.palette = palette
}
applyPaletteFromUrl()

function seedThemeFromHost() {
    const hostTheme = document.documentElement.dataset.theme
    if (hostTheme !== 'dark' && hostTheme !== 'light') return
    try {
        localStorage.setItem('clc-theme', hostTheme)
    } catch {
        /* localStorage yopiq — tizim sozlamasiga tayanamiz */
    }
}

seedThemeFromHost()
installMockApi()

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Demo />
    </React.StrictMode>
)
