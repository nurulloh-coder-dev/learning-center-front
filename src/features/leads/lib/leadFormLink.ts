import type { LeadSource } from '@/shared/types'

/** Havola qayerga qo'yilishi — `?src=` qiymati. `other` — parametrsiz. */
export const LINK_PLACEMENTS = ['instagram', 'telegram', 'facebook', 'other'] as const
export type LinkPlacement = (typeof LINK_PLACEMENTS)[number]

const SOURCE_BY_PARAM: Record<string, LeadSource> = {
    instagram: 'INSTAGRAM',
    telegram: 'TELEGRAM',
    facebook: 'FACEBOOK',
}

/**
 * Havoladagi `?src=` dan lid manbai. Noma'lum yoki yo'q bo'lsa — `WEBSITE`:
 * lid baribir tushsin, manbasi noaniq bo'lishi uni yo'qotishdan yaxshi.
 */
export function sourceFromParam(param: string | null): LeadSource {
    return SOURCE_BY_PARAM[(param ?? '').trim().toLowerCase()] ?? 'WEBSITE'
}

/**
 * Ochiq forma havolasi. Manba havolaning o'zida — administrator Instagram
 * va Telegram'ga turli havola qo'yadi va lid qayerdan kelgani ko'rinadi.
 */
export function buildLeadFormLink(origin: string, key: string, placement: LinkPlacement): string {
    const base = `${origin.replace(/\/$/, '')}/f/${encodeURIComponent(key)}`
    return placement === 'other' ? base : `${base}?src=${placement}`
}
