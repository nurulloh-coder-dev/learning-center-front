import type { Translations } from '../uz'
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
 * Ruscha.
 *
 * `Translations` tipi `uz/` dan chiqadi — biror kalit yetishmasa
 * kompilyator xato beradi. Xato QAYSI faylda ekani ham ko'rinadi,
 * chunki har bo'lim alohida tekshiriladi.
 *
 * Rus tilida son bilan kelishik o'zgaradi (1 ученик / 2 ученика /
 * 5 учеников). Shuning uchun sonli matnlar ataylab "Ученики: 5"
 * ko'rinishida yozilgan — bu har qanday son bilan to'g'ri o'qiladi.
 */
export const ru: Translations = {
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
