import type { GroupLevelNameDto } from './group'
import type { LeadSource } from './lead'

/**
 * Lid formasi — markazning ochiq havolasi (`/f/<kalit>`).
 *
 * Backend hali yozilmagan: shakllar Nurulloh bilan kelishilgan rejadan
 * (`docs/lead-form.md`). Endpoint chiqqach shu yerda solishtiriladi.
 */

/** `GET /public/lead-forms/{key}` — tokensiz, mijozning telefonida ochiladi. */
export interface PublicLeadFormDto {
    organizationName: string
    logoUrl?: string | null
    title?: string | null
    description?: string | null
    courseRequired: boolean
    /** Yashirilgan va o'chirilganlarsiz — faqat ko'rsatiladiganlar. */
    levels: GroupLevelNameDto[]
}

/** `POST /public/lead-forms/{key}/leads` tanasi. `organizationId` YO'Q — u faqat kalitdan. */
export interface PublicLeadSubmitDto {
    fullName: string
    phone: string
    preferredCourseId?: string
    source: LeadSource
    /** Botlar uchun yashirin maydon (honeypot): odam uni ko'rmaydi va bo'sh qoldiradi. */
    website: string
}

/** `GET /lead-form` — administratorning o'z markazi formasi sozlamasi. */
export interface LeadFormDto {
    key: string
    enabled: boolean
    title?: string | null
    description?: string | null
    courseRequired: boolean
    hiddenLevelIds: string[]
}

/** `PUT /lead-form` tanasi. */
export type LeadFormUpdateDto = Omit<LeadFormDto, 'key'>
