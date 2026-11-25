import type {
    AttendanceDto,
    BranchDto,
    FullGroupDto,
    GroupDto,
    GroupLevelDto,
    InvoiceDto,
    LeadDto,
    OrganizationDto,
    LessonDto,
    StudentDto,
    TeacherDto,
    TransactionDto,
    PlanDto,
    SubscriptionDto,
    UserDto,
} from '@/shared/types'

/**
 * Demo uchun o'ylab topilgan ma'lumot.
 *
 * FAQAT demo build'ida ishlatiladi (`src/demo/` production bundle'ga
 * tushmaydi) — hech qanday haqiqiy shaxs ma'lumoti yo'q.
 */

export const teachers: TeacherDto[] = [
    { id: 't1', userDto: { id: 'u1', fullName: 'Nodira Rasulova', phone: '+998 90 111 22 33', birthDate: '1990-04-12' } },
    { id: 't2', userDto: { id: 'u2', fullName: 'Jasur Ergashev', phone: '+998 90 222 33 44', birthDate: '1988-11-03' } },
    { id: 't3', userDto: { id: 'u3', fullName: 'Malika Yo‘ldosheva', phone: '+998 91 333 44 55', birthDate: '1993-07-21' } },
]

export const students: StudentDto[] = [
    { id: 's1', parentPhone: '+998 90 900 10 01', userDto: { fullName: 'Aziza Karimova', phone: '+998 93 100 10 01', birthDate: '2007-02-14' } },
    { id: 's2', parentPhone: '+998 90 900 10 02', userDto: { fullName: 'Bekzod Toshev', phone: '+998 93 100 10 02', birthDate: '2006-09-30' } },
    { id: 's3', parentPhone: '+998 90 900 10 03', userDto: { fullName: 'Dilnoza Yusupova', phone: '+998 93 100 10 03', birthDate: '2007-05-05' } },
    { id: 's4', parentPhone: '+998 90 900 10 04', userDto: { fullName: 'Eldor Nazarov', phone: '+998 93 100 10 04', birthDate: '2008-01-19' } },
    { id: 's5', parentPhone: '+998 90 900 10 05', userDto: { fullName: 'Farida Sobirova', phone: '+998 93 100 10 05', birthDate: '2007-12-02' } },
    { id: 's6', parentPhone: '+998 90 900 10 06', userDto: { fullName: 'G‘ayrat Umarov', phone: '+998 93 100 10 06', birthDate: '2006-06-24' } },
    { id: 's7', parentPhone: '+998 90 900 10 07', userDto: { fullName: 'Hilola Ahmedova', phone: '+998 93 100 10 07', birthDate: '2008-03-11' } },
    { id: 's8', parentPhone: '+998 90 900 10 08', userDto: { fullName: 'Islom Qodirov', phone: '+998 93 100 10 08', birthDate: '2007-08-08' } },
]

export const groups: GroupDto[] = [
    {
        id: 'g1',
        name: 'Beginners A',
        room: '12',
        status: 'ONGOING',
        level: { id: 'lvl-a2', name: 'A2', lessonCount: 20, orderNumber: 2, durationInMonths: 4, monthlyFee: 450000 },
        currentMonth: 2,
        lessonsCount: 14,
        teacher: teachers[0],
        timeTable: { id: 'tt1', dayType: 'ODD', startTime: '09:00:00', endTime: '10:30:00' },
    },
    {
        id: 'g2',
        name: 'Intermediate B',
        room: '7',
        status: 'ONGOING',
        teacher: teachers[0],
        timeTable: { id: 'tt2', dayType: 'EVEN', startTime: '15:00:00', endTime: '16:30:00' },
    },
    {
        id: 'g3',
        name: 'IELTS Intensive',
        room: '3',
        status: 'STARTING',
        teacher: teachers[1],
        timeTable: { id: 'tt3', dayType: 'ODD', startTime: '18:00:00', endTime: '20:00:00' },
    },
    {
        id: 'g4',
        name: 'Kids Club',
        room: '1',
        status: 'COMPLETED',
        teacher: teachers[2],
        timeTable: { id: 'tt4', dayType: 'EVEN', startTime: '11:00:00', endTime: '12:00:00' },
    },
]

/** Qaysi guruhda kim o'qiydi. */
export const groupRoster: Record<string, string[]> = {
    g1: ['s1', 's2', 's3', 's4', 's5'],
    g2: ['s6', 's7', 's8'],
    g3: ['s1', 's6', 's8'],
    g4: ['s4', 's5'],
}

// Backend ikkita alohida maydon beradi: `topic` — mavzu, `title` — tartib raqami:
// jadvalda nom, o'qituvchi panelidagi "{{number}}-dars" matnida esa raqam.
export const lessons: LessonDto[] = [
    { id: 'l1', title: '12', topic: 'Unit 12 — Past perfect', lessonDate: '2026-08-03T09:00:00', isComplete: true, group: groups[0], teacherDto: teachers[0] },
    { id: 'l2', title: '13', topic: 'Unit 13 — Reported speech', lessonDate: '2026-08-05T09:00:00', isComplete: true, group: groups[0], teacherDto: teachers[0] },
    { id: 'l3', title: '14', topic: 'Unit 14 — Conditionals', lessonDate: '2026-08-07T09:00:00', isComplete: false, group: groups[1], teacherDto: teachers[1] },
]

// Hisobda o'quvchi endi `enrollmentDto.studentId` orqali — backend
// `student` obyektini qaytarmaydi.
export const invoices: InvoiceDto[] = [
    { id: 'i1', invoiceNumber: 'INV-001', amount: 450000, issuedAt: '2026-07-01T09:00:00', paymentStatus: 'PAID', enrollmentDto: { id: 'e1', studentId: students[0].id, fullName: students[0].userDto?.fullName, phone: students[0].userDto?.phone, groupIdNameDto: { id: 'g1', name: groups.find((g) => g.id === 'g1')?.name ?? '' } } },
    { id: 'i2', invoiceNumber: 'INV-002', amount: 450000, issuedAt: '2026-08-01T09:00:00', paymentStatus: 'PENDING', enrollmentDto: { id: 'e2', studentId: students[1].id, fullName: students[1].userDto?.fullName, phone: students[1].userDto?.phone, groupIdNameDto: { id: 'g1', name: groups.find((g) => g.id === 'g1')?.name ?? '' } } },
    { id: 'i3', invoiceNumber: 'INV-003', amount: 600000, issuedAt: '2026-06-01T09:00:00', paymentStatus: 'OVERDUE', enrollmentDto: { id: 'e3', studentId: students[2].id, fullName: students[2].userDto?.fullName, phone: students[2].userDto?.phone, groupIdNameDto: { id: 'g2', name: groups.find((g) => g.id === 'g2')?.name ?? '' } } },
    { id: 'i4', invoiceNumber: 'INV-004', amount: 450000, issuedAt: '2026-08-05T09:00:00', paymentStatus: 'PENDING', enrollmentDto: { id: 'e4', studentId: students[3].id, fullName: students[3].userDto?.fullName, phone: students[3].userDto?.phone, groupIdNameDto: { id: 'g2', name: groups.find((g) => g.id === 'g2')?.name ?? '' } } },
]

export const transactions: TransactionDto[] = [
    { id: 't1', type: 'PAID', amount: 250000, invoice: invoices[1], user: students[1], createdAt: '2026-08-03T10:15:00' },
    { id: 't2', type: 'PAID', amount: 200000, invoice: invoices[1], user: students[1], createdAt: '2026-08-11T14:40:00' },
    { id: 't3', type: 'REFUND', amount: 100000, invoice: invoices[2], user: students[2], createdAt: '2026-06-20T09:05:00' },
]

export const organizations: OrganizationDto[] = [
    { id: 'o1', name: 'Cornerstone Education', phone: '+998 71 200 10 10', email: 'info@cornerstone.uz', website: 'cornerstone.uz' },
    { id: 'o2', name: 'Bright Minds', phone: '+998 71 200 20 20', email: 'hello@brightminds.uz' },
]

// `GET /user/admins` — super-admin paneldagi administratorlar ro'yxati.
export const administrators: UserDto[] = [
    { id: 'a1', fullName: 'Kamola Rustamova', phone: '+998 90 500 10 01', birthDate: '1991-03-18', role: 'ADMINISTRATOR', branchId: 'b1' },
    { id: 'a2', fullName: 'Sardor Mirzayev', phone: '+998 90 500 10 02', birthDate: '1989-10-02', role: 'ADMINISTRATOR', branchId: 'b2' },
]

export const branches: BranchDto[] = [
    { id: 'b1', name: 'Chilonzor', address: 'Chilonzor 9, Toshkent' },
    { id: 'b2', name: 'Yunusobod', address: 'Amir Temur 108, Toshkent' },
    { id: 'b3', name: 'Samarqand', address: 'Registon 4, Samarqand' },
]

export const groupLevels: GroupLevelDto[] = [
    { id: 'lvl-a1', name: 'A1 Beginner', lessonCount: 16, orderNumber: 1, durationInMonths: 3, monthlyFee: 400000 },
    { id: 'lvl-a2', name: 'A2 Elementary', lessonCount: 20, orderNumber: 2, durationInMonths: 4, monthlyFee: 450000 },
    { id: 'lvl-b1', name: 'B1 Intermediate', lessonCount: 24, orderNumber: 3, durationInMonths: 4, monthlyFee: 500000 },
    { id: 'lvl-b2', name: 'B2 Upper-Intermediate', lessonCount: 24, orderNumber: 4, durationInMonths: 5, monthlyFee: 550000 },
]

export const leads: LeadDto[] = [
    {
        id: 'ld1',
        fullName: 'Jasur Salimov',
        phone: '+998 90 123 45 67',
        status: 'NEW',
        source: 'INSTAGRAM',
        preferredCourse: groupLevels[0],
        createdAt: '2026-08-01T10:00:00',
        version: 0,
    },
    {
        id: 'ld2',
        fullName: 'Madina Umarova',
        phone: '+998 91 234 56 78',
        status: 'NEW',
        source: 'TELEGRAM',
        preferredCourse: groupLevels[1],
        createdAt: '2026-08-02T11:30:00',
        version: 0,
    },
    {
        id: 'ld3',
        fullName: 'Sardor Aliyev',
        phone: '+998 93 345 67 89',
        status: 'CALL_LATER',
        source: 'FACEBOOK',
        preferredCourse: groupLevels[2],
        callAt: '2026-08-15T15:00:00',
        createdAt: '2026-08-03T14:20:00',
        version: 0,
    },
    {
        id: 'ld4',
        fullName: 'Nigora Abdullayeva',
        phone: '+998 94 456 78 90',
        status: 'ENROLLED',
        source: 'INSTAGRAM',
        preferredCourse: groupLevels[1],
        createdAt: '2026-08-04T09:10:00',
        version: 0,
    },
    {
        id: 'ld5',
        fullName: 'Bobur Rakhimov',
        phone: '+998 97 567 89 01',
        status: 'REJECTED',
        source: 'TELEGRAM',
        preferredCourse: groupLevels[0],
        createdAt: '2026-08-05T16:45:00',
        version: 0,
    },
]

export const attendance: AttendanceDto[] = [
    {
        id: 'a1',
        lessonId: 'l1',
        createdAt: '2026-08-03T09:05:00Z',
        attendanceStudents: [
            { studentId: 's1', status: 'PRESENT' },
            { studentId: 's2', status: 'ABSENT' },
            { studentId: 's3', status: 'PRESENT' },
            { studentId: 's4', status: 'EXCUSED', reason: 'Kasal' },
            { studentId: 's5', status: 'PRESENT' },
        ],
    },
    {
        id: 'a2',
        lessonId: 'l2',
        createdAt: '2026-08-05T09:03:00Z',
        attendanceStudents: [
            { studentId: 's1', status: 'PRESENT' },
            { studentId: 's2', status: 'PRESENT' },
            { studentId: 's3', status: 'EXCUSED', reason: 'Oilaviy sabab' },
            { studentId: 's4', status: 'PRESENT' },
            { studentId: 's5', status: 'PRESENT' },
        ],
    },
]

export function fullGroup(groupId: string): FullGroupDto {
    const group = groups.find((item) => item.id === groupId) ?? groups[0]
    const ids = groupRoster[group.id] ?? []
    return { groupDto: group, studentDto: students.filter((student) => ids.includes(student.id)) }
}

/** Dasturchi paneli uchun: tariflar. */
export const plans: PlanDto[] = [
    {
        id: 'pl-1',
        code: 'START',
        name: 'Start',
        description: 'Kichik markazlar uchun',
        price: 250000,
        currency: 'UZS',
        durationMonths: 1,
        active: true,
        sortOrder: 1,
        limits: { MAX_STUDENTS: 100, MAX_TEACHERS: 5, MAX_GROUPS: 10, MAX_BRANCHES: 1, MAX_USERS: 3 },
    },
    {
        id: 'pl-2',
        code: 'STANDARD',
        name: 'Standard',
        price: 450000,
        currency: 'UZS',
        durationMonths: 1,
        active: true,
        sortOrder: 2,
        limits: { MAX_STUDENTS: 500, MAX_TEACHERS: 20, MAX_GROUPS: 50, MAX_BRANCHES: 3, MAX_USERS: 10 },
    },
    {
        id: 'pl-3',
        code: 'PRO',
        name: 'Pro',
        description: 'Cheklovsiz',
        price: 1200000,
        currency: 'UZS',
        durationMonths: 12,
        active: true,
        sortOrder: 3,
        limits: { MAX_STUDENTS: 5000, MAX_TEACHERS: 200, MAX_GROUPS: 500, MAX_BRANCHES: 20, MAX_USERS: 100 },
    },
]

/** Dasturchi paneli uchun: obunalar. */
export const subscriptions: SubscriptionDto[] = [
    {
        id: 'sb-1',
        organization: { id: organizations[0].id, name: organizations[0].name ?? '' },
        plan: { id: 'pl-2', name: 'Standard' },
        status: 'ACTIVE',
        startsAt: '2026-09-01T00:00:00Z',
        expiresAt: '2026-10-01T00:00:00Z',
        paidAmount: 450000,
        currency: 'UZS',
        note: 'Humo o‘tkazma, JB-7K2M',
    },
    {
        id: 'sb-2',
        organization: { id: 'org-demo-2', name: 'Bilim maskani' },
        plan: { id: 'pl-1', name: 'Start' },
        status: 'GRACE',
        startsAt: '2026-08-01T00:00:00Z',
        expiresAt: '2026-09-01T00:00:00Z',
        paidAmount: 250000,
        currency: 'UZS',
        note: 'O‘tkazma tasdiqlanmoqda',
    },
]
