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
    myStudentRecord: (phone: string) => ['student', 'byPhone', phone] as const,
    myGroups: () => ['group', 'my'] as const,
    /** `previousMonths` ham kalitga kiradi — oy almashsa alohida so'rov/keshlanadi. */
    myAttendance: (groupId: string, previousMonths: number) =>
        ['attendance', 'my', groupId, previousMonths] as const,
    myBalance: () => ['student', 'my-balance'] as const,

    teacherOptions: () => ['teacher', 'options'] as const,
    groupOptions: () => ['group', 'options'] as const,
    groupLevels: () => ['group-level', 'list'] as const,
    groupLevelNameOptions: () => ['group-level', 'name-options'] as const,

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

    organizations: (params: Record<string, unknown>) => ['organization', 'list', params] as const,
    branches: (params: Record<string, unknown>) => ['branch', 'list', params] as const,
    branch: (id: string) => ['branch', 'one', id] as const,

    leads: (params: Record<string, unknown>) => ['lead', 'list', params] as const,

    analytics: (category: string) => ['analytics', category] as const,
} as const
