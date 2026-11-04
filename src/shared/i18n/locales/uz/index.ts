import { common } from './common'
import { auth } from './auth'
import { admin } from './admin'
import { teacher } from './teacher'
import { attendance } from './attendance'
import { payments } from './payments'
import { superAdmin } from './superAdmin'
import { settings } from './settings'
import { student } from './student'
import { leads } from './leads'
import { developer } from './developer'
import { importSection } from './import'

/**
 * O'zbekcha lug'at — kalitlarning HAQIQAT MANBAI.
 *
 * Nega bo'lib tashlangan: ilgari uch til uchta katta fayl edi va
 * har kim yangi kalitni faylning bir joyiga qo'shardi — bir vaqtda
 * ishlaganda har PR da merge konflikt chiqardi. Endi har bo'lim o'z
 * faylida, ya'ni ikki kishi turli bo'limga tegsa to'qnashmaydi.
 */
export const uz = {
    ...common,
    ...auth,
    ...admin,
    ...teacher,
    ...attendance,
    ...payments,
    ...superAdmin,
    ...settings,
    ...student,
    ...leads,
    ...developer,
    ...importSection,
}

export type TranslationKey = keyof typeof uz
export type Translations = Record<TranslationKey, string>
