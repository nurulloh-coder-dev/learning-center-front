import type { TranslationKey } from '@/shared/i18n'

export type ImportKind = 'students' | 'teachers'
export type ImportFieldKey = 'fullName' | 'phone' | 'birthDate' | 'parentPhone'

export interface ImportField {
    key: ImportFieldKey
    labelKey: TranslationKey
    /** Yaratish formasidagidek: majburiy maydon moslanmasa import boshlanmaydi. */
    required: boolean
    /**
     * Boshqa CRM yoki qo'lda tuzilgan fayllardagi ustun nomlari (uz/ru/en).
     * Ular `normalizeHeader` dan o'tkazib solishtiriladi, shuning uchun
     * katta-kichik harf, bo'shliq va apostrof farqi muhim emas.
     */
    synonyms: readonly string[]
}

const FULL_NAME: ImportField = {
    key: 'fullName',
    labelKey: 'field.fullName',
    required: true,
    synonyms: [
        'fio', 'f.i.o', 'fish', 'f.i.sh', 'ism', 'ismi', 'ism familiya', 'familiya ism', 'ism sharif',
        "to'liq ism", 'full name', 'name', "o'quvchi", "o'qituvchi", 'student', 'teacher',
        'фио', 'ф.и.о', 'имя', 'полное имя', 'ученик', 'студент', 'преподаватель', 'учитель',
    ],
}

const PHONE: ImportField = {
    key: 'phone',
    labelKey: 'field.phone',
    required: true,
    synonyms: [
        'tel', 'telefon', 'telefon raqami', 'tel raqami', 'raqam', 'phone', 'phone number', 'mobile',
        'mobil', 'телефон', 'тел', 'номер', 'номер телефона', 'мобильный',
    ],
}

const BIRTH_DATE: ImportField = {
    key: 'birthDate',
    labelKey: 'field.birthDate',
    required: false,
    synonyms: [
        "tug'ilgan sana", "tug'ilgan kun", "tug'ilgan yil", 'birth date', 'birthday', 'date of birth',
        'dob', 'дата рождения', 'день рождения', 'др',
    ],
}

const PARENT_PHONE: ImportField = {
    key: 'parentPhone',
    labelKey: 'field.parentPhone',
    required: false,
    synonyms: [
        'ota-ona telefoni', 'ota-ona tel', 'ota-ona', 'otasi', 'onasi', 'otasining telefoni',
        'onasining telefoni', 'parent phone', 'parents phone', 'parent', 'телефон родителя',
        'тел родителя', 'родитель', 'родители',
    ],
}

/** Bizning maydonlar — backenddagi `StudentCreateDto` / `TeacherCreateDto` bo'yicha. */
export const IMPORT_FIELDS: Record<ImportKind, readonly ImportField[]> = {
    students: [FULL_NAME, PHONE, BIRTH_DATE, PARENT_PHONE],
    teachers: [FULL_NAME, PHONE, BIRTH_DATE],
}

/** Backend ro'yxat hajmini cheklamaydi; juda katta so'rov vaqt chegarasiga uriladi. */
export const MAX_IMPORT_ROWS = 500
