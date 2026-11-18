import type { TranslationKey } from '@/shared/i18n'
import type {
    AdminPermission,
    GroupDto,
    GroupLevelNameDto,
    GroupStatus,
    TeacherDto,
    TimeTableDto,
    UserDto,
} from '@/shared/types'

export type EntityKey = 'students' | 'teachers' | 'groups' | 'lessons'

export interface EntityConfig {
    key: EntityKey
    /** Ko'plik va birlik alohida: rus tilida ular boshqacha turlanadi. */
    pluralKey: TranslationKey
    singularKey: TranslationKey
    endpoint: string
    /** Bo'lmasa — hammaga ko'rinadi (guruhlar, darslar). */
    permission?: AdminPermission
}

/**
 * Admin jadvalining bitta qatori.
 *
 * Bu sahifa to'rt xil DTO'ni BITTA generik jadvalda ko'rsatadi, shuning uchun
 * qator tipi — o'sha DTO'lar maydonlarining birlashmasi, plus konfiguratsiyasiz
 * (avtomatik) rejim uchun indeks imzosi. Hammasi optional, chunki qaysi
 * maydon kelishi ochiq turgan tabga bog'liq.
 */
export interface AdminRow {
    id: string
    userDto?: UserDto
    parentPhone?: string
    name?: string
    room?: string
    /**
     * Guruhlar ro'yxatida o'qituvchi ichma-ich `TeacherDto` emas,
     * `{ id, name }` bo'lib keladi (`GroupOverviewDto`). Darslar tabida esa
     * hamon `teacherDto` — shuning uchun ikkalasi alohida.
     */
    teacher?: TeacherDto | GroupLevelNameDto
    timeTable?: TimeTableDto
    status?: GroupStatus
    /** `GroupOverviewDto` maydonlari — guruhlar tabi uchun. */
    startDate?: string
    levelName?: string
    activeStudentsCount?: number
    /** `LessonDto` maydonlari — darslar tabi uchun. */
    topic?: string
    title?: string
    lessonDate?: string
    isComplete?: boolean
    group?: GroupDto
    /** Darsda o'qituvchi `teacher` emas, `teacherDto` deb keladi. */
    teacherDto?: TeacherDto
    [key: string]: unknown
}

/**
 * Forma qiymatlari `unknown`: konfiguratsiyasiz rejimda qatorning istalgan
 * maydoni formaga tushadi, ichma-ich obyektlar ham. Ular render paytida
 * stringga aylantiriladi, state'da esa asl ko'rinishida qoladi.
 */
export type FormValues = Record<string, unknown>

export type FormFieldType = 'text' | 'tel' | 'date' | 'time' | 'select' | 'number'

export interface FormField {
    key: string
    labelKey: TranslationKey
    type: FormFieldType
    options?: { value: string; labelKey: TranslationKey }[]
    /** Variantlar serverdan kelsa (masalan o'qituvchilar yoki guruhlar ro'yxati). */
    optionsSource?: 'teachers' | 'groups' | 'branches' | 'freeTeachers'
}

export type ModalMode = 'create' | 'edit'

export interface EntityFormConfig {
    fields: FormField[] | ((mode: ModalMode) => FormField[])
    /**
     * Yaratishda avval telefon so'raladi va u bo'yicha mavjud odam
     * qidiriladi. Faqat odamga tegishli bo'limlarda (o'quvchi, o'qituvchi)
     * ma'noga ega.
     */
    lookupByPhone?: boolean
    /** Faqat yaratish rejimida ko'rinadigan izoh (masalan boshlang'ich parol). */
    createHintKey?: TranslationKey
    getInitialValues: (row: AdminRow | null) => FormValues
    /** Create va Update DTO'lari har xil bo'lgani uchun ikkita alohida funksiya. */
    buildCreatePayload: (values: FormValues) => unknown
    buildUpdatePayload: (values: FormValues) => unknown
}
