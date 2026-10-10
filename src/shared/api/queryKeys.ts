/**
 * `people(kind, params)` ning prefiksi — `invalidateQueries` sahifa/qidiruv
 * holatidan qat'i nazar butun bo'limni eskirgan deb belgilashi uchun shu
 * qisqa kalitni ishlatadi. Alohida funksiya: obyekt ichida o'zini-o'ziga
 * murojaat qilib bo'lmaydi.
 */
function peopleKindKey(kind: string) {
    return ['people', kind] as const
}

/**
 * TanStack Query kalitlari — bitta joyda.
 *
 * Nega markazlashtirildi: mutatsiyadan keyin `invalidateQueries` chaqirganda
 * kalit satrini qo'lda yozish eng ko'p uchraydigan xato manbai. Bu yerdan
 * olinsa, kalit o'zgarsa hamma joyda bir vaqtda o'zgaradi.
 */
export const queryKeys = {
    /** Admin jadvali: entity + sahifalash/filtr holati. */
    entityList: (entity: string, params: Record<string, unknown>) =>
        ['entity', entity, 'list', params] as const,
    entityCount: (entity: string) => ['entity', entity, 'count'] as const,

    me: () => ['auth', 'me'] as const,
    myStudentRecord: () => ['student', 'me'] as const,
    myGroups: () => ['group', 'my'] as const,
    /** `previousMonths` ham kalitga kiradi — oy almashsa alohida so'rov/keshlanadi. */
    myAttendance: (groupId: string, previousMonths: number) =>
        ['attendance', 'my', groupId, previousMonths] as const,

    teacherOptions: () => ['teacher', 'options'] as const,
    freeTeacherOptions: (dayType?: string, startTime?: string, endTime?: string) =>
        ['teacher', 'options', 'free', dayType, startTime, endTime] as const,
    groupOptions: () => ['group', 'options'] as const,
    branchOptions: () => ['branch', 'options'] as const,
    groupLevels: () => ['group-level', 'list'] as const,
    groupLevelNameOptions: () => ['group-level', 'name-options'] as const,
    /**
     * Lid formasidagi kurs tanlagichi — `groupLevelNameOptions` bilan BIR XIL
     * endpoint, lekin boshqa shakl (`{value, label}`). Kalit alohida bo'lmasa
     * admin paneli keshga yozgan `{id, name}` qaytib, ro'yxat bo'sh chiqadi.
     */
    leadCourseOptions: () => ['lead', 'course-options'] as const,

    groupEnrollments: (groupId: string) => ['enrollments', groupId] as const,

    teacherGroups: () => ['teacher', 'groups'] as const,
    groupInfo: (groupId: string) => ['group', 'info', groupId] as const,

    attendance: () => ['attendance', 'list'] as const,
    /** `previousMonths` ham kalitga kiradi — oy almashsa alohida so'rov/keshlanadi. */
    attendanceMonthly: (groupId: string, previousMonths: number) =>
        ['attendance', 'list', groupId, previousMonths] as const,

    // `role` kalitga kiradi: o'qituvchi va admin bir xil guruhni turli
    // endpointdan oladi, kesh aralashib ketmasligi kerak.
    studentsByGroup: (groupId: string, role: string) => ['student', 'byGroup', groupId, role] as const,

    invoices: (params: Record<string, unknown>) => ['invoice', 'list', params] as const,
    /** `invoice` prefiksi bilan — to'lov yozilgach `['invoice']` invalidatsiyasi buni ham yangilaydi. */
    /** `type` ham kalitda: to'lov va qaytarish hisoblarni turli endpointdan oladi. */
    studentInvoices: (studentId: string, type: string) => ['invoice', 'byStudent', studentId, type] as const,
    studentSearch: (search: string) => ['student', 'search', search] as const,
    transactions: (params: Record<string, unknown>) => ['transaction', 'list', params] as const,

    organizations: (params: Record<string, unknown>) => ['organization', 'list', params] as const,
    organization: (id?: string) => ['organization', 'one', id] as const,
    branches: (params: Record<string, unknown>) => ['branch', 'list', params] as const,
    branch: (id: string) => ['branch', 'one', id] as const,

    leads: (params: Record<string, unknown>) => ['lead', 'list', params] as const,
    /** `lead` prefiksi YO'Q: lid o'zgarganda forma sozlamasi qayta so'ralmasin. */
    leadForm: () => ['lead-form', 'mine'] as const,
    publicLeadForm: (key: string) => ['lead-form', 'public', key] as const,

    analytics: (category: string) => ['analytics', category] as const,
    /** `lead` prefiksi — lid o'zgarganda super-admin voronkasi ham yangilanadi. */
    leadStatusCount: (status: string) => ['lead', 'count', status] as const,
    /** `transaction` prefiksi — to'lov yozilgach "so'nggi to'lovlar" ham yangilanadi. */
    transactionCount: () => ['transaction', 'count'] as const,
    transactionPage: (page: number, size: number) => ['transaction', 'page', page, size] as const,
    analyticsInvoiceRange: (from: string, to: string) => ['analytics', 'invoice', 'range', { from, to }] as const,

    groupStats: () => ['group', 'stats'] as const,
    userByPhone: (phone: string) => ['user', 'byPhone', phone] as const,

    plans: (params: Record<string, unknown>) => ['plan', 'list', params] as const,
    subscriptions: (params: Record<string, unknown>) => ['subscription', 'list', params] as const,
    mySubscription: () => ['subscription', 'my'] as const,
    people: (kind: string, params: Record<string, unknown>) => [...peopleKindKey(kind), params] as const,
    /** `invalidateQueries`da params bilmasdan butun `kind`ni eskirtirish uchun. */
    peopleKind: peopleKindKey,

    images: (params?: Record<string, unknown>) => ['images', params] as const,

    adminCount: () => ['user', 'adminCount'] as const,
} as const
