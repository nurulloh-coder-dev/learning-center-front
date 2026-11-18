import type { StudentDto } from './student'
import type { TeacherDto } from './teacher'

/**
 * Guruh jadvali turi.
 *
 * Backend kunlar ro'yxatini emas, shu ikki qiymatdan birini saqlaydi:
 * toq kunlar (Du/Cho/Ju) yoki juft kunlar (Se/Pay/Sha).
 */
export const DAY_TYPES = ['ODD', 'EVEN'] as const
export type DayType = (typeof DAY_TYPES)[number]

export interface TimeTableDto {
    id?: string
    dayType?: DayType
    /** `LocalTime` — "HH:mm:ss". */
    startTime?: string
    endTime?: string
}

export const GROUP_STATUSES = ['STARTING', 'ONGOING', 'COMPLETED'] as const
export type GroupStatus = (typeof GROUP_STATUSES)[number]

export const GROUP_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const
export type GroupLevel = (typeof GROUP_LEVELS)[number]

export interface GroupLevelNameDto {
    id: string
    name: string
}

export interface GroupLevelDto {
    id: string
    name: string
    lessonCount: number
    orderNumber: number
    durationInMonths: number
    /**
     * Oylik to'lov. Backend hozircha bosh harf bilan `MonthlyFee` qaytaradi —
     * bu backend'dagi xato, tan olingan va tuzatiladi. Tuzatilgunga qadar
     * ikkalasini ham qabul qilamiz; keyin `MonthlyFee` olib tashlanadi.
     */
    monthlyFee?: number
    MonthlyFee?: number
}

export interface GroupDto {
    id: string
    name?: string
    room?: string
    teacher?: TeacherDto
    timeTable?: TimeTableDto
    status?: GroupStatus
    level?: GroupLevelDto
    /** Kurs boshlanganidan beri nechanchi oy. */
    currentMonth?: number
    /** Guruhda o'tilgan darslar soni. */
    lessonsCount?: number
    /** Guruhga sig'adigan eng ko'p o'quvchi; `null` — limit yo'q. */
    maxStudents?: number | null
}

/**
 * `GET /group/stats` javobi — o'qituvchining BARCHA guruhlari bo'yicha.
 *
 * Diqqat: `groupId` qabul qilmaydi. Backend kirgan o'qituvchini topib,
 * uning hamma guruhlarini birga hisoblaydi — ya'ni bu bitta guruhning
 * emas, o'qituvchining umumiy manzarasi.
 *
 * `redList` va `blackList` hozircha DOIM 0 bo'lib keladi (so'rovda
 * `CAST(0 AS BIGINT)` yozilgan): birinchisi uy vazifasi imkoniyatini,
 * ikkinchisi bloklangan o'quvchi statusini kutyapti. Shuning uchun
 * ekranda ular raqam emas, "hali yo'q" belgisi bilan ko'rsatiladi —
 * aks holda "0 ta muammoli o'quvchi" degan yolg'on chiqadi.
 */
export interface GroupStatsDto {
    totalStudents?: number
    activeStudents?: number
    newStudents?: number
    lostStudents?: number
    /** Ketma-ket 3 va undan ko'p dars qoldirganlar. */
    potentialFailStudents?: number
    redList?: number
    blackList?: number
}

/**
 * `GET /group` (sahifalangan ro'yxat) javobi.
 *
 * Bu `GroupDto` EMAS: backend ro'yxat uchun alohida `GroupOverviewDto`
 * qaytaradi (2026-09-15). Ikki muhim farqi bor — o'qituvchi ichma-ich
 * `TeacherDto` emas, `{ id, name }`; daraja obyekt emas, tayyor `levelName`
 * satri. Bitta guruhni olganda (`GET /group/{id}`) hamon to'liq `GroupDto`
 * keladi, shuning uchun ikkalasi alohida turadi.
 */
export interface GroupOverviewDto {
    id: string
    name?: string
    room?: string
    /** Guruh boshlangan sana. */
    startDate?: string
    status?: GroupStatus
    levelName?: string
    teacher?: GroupLevelNameDto
    timeTable?: TimeTableDto
    currentMonth?: number
    lessonsCount?: number
    /** Guruhdagi faol o'quvchilar soni. */
    activeStudentsCount?: number
}

/**
 * `GET /group/groups` (o'qituvchining guruhlari) javobi.
 *
 * Bu TO'LIQ `GroupDto` emas — backend `GroupNameProjection` qaytaradi,
 * ya'ni faqat `id` va `name`. `dayType` optional: proyeksiyaga qo'shilsa
 * o'qituvchi panelidagi toq/juft filtri o'zi ishlab ketadi.
 */
export interface GroupNameDto {
    id: string
    name?: string
    dayType?: DayType
}

/** `GET /group/groupInfo` javobi: guruh + uning ro'yxati. */
export interface FullGroupDto {
    groupDto?: GroupDto
    studentDto?: StudentDto[]
}

export interface LessonDto {
    id: string
    /**
     * Dars mavzusi — o'qituvchi/admin kiritadi. Yaratishda va tahrirlashda
     * yuboriladigan YAGONA maydon (`LessonCreateDto{groupId, topic}`).
     */
    topic?: string
    /**
     * Tartib raqami ("1.2" kabi) — backend o'zi qo'yadi, biz yubormaymiz.
     * Nomi `title` bo'lsa ham, bu sarlavha emas, raqam.
     */
    title?: string
    /** `LocalDateTime` — "yyyy-MM-ddTHH:mm:ss". */
    lessonDate?: string
    isComplete?: boolean
    group?: GroupDto
    teacherDto?: TeacherDto
}
