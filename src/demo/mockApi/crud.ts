import type { LessonDto, UserDto } from '@/shared/types'
import { db, demoUser, flatten, json, nextId, page, type Row } from './state'

export function handleCrud(
    path: string,
    method: string,
    url: URL,
    body: Record<string, unknown>
): Response | null {
    // Profil saqlash `PUT /user/{id}` orqali ketadi — demo'da shunchaki
    // yangi qiymatni qaytaramiz.
    const [, resource, tail, action] = path.split('/')
    if (resource === 'user' && method === 'PUT') {
        // Super-admin administratorni tahrirlasa — ro'yxatdagi yozuv yangilanadi.
        const admin = db.administrators.find((row) => row.id === tail)
        if (admin) {
            Object.assign(admin, body)
            return json(admin)
        }
        Object.assign(demoUser, body)
        return json(demoUser)
    }

    // Parolni yangilash — demo'da har safar yangi soxta parol.
    if (resource === 'user' && action === 'password-regenerate' && method === 'POST') {
        const admin = db.administrators.find((row) => row.id === tail)
        return json({ id: tail, fullName: admin?.fullName ?? '', phone: admin?.phone ?? '', temporaryPassword: 'demo-' + nextId('p') })
    }

    // Super-admin paneldagi administratorlar ro'yxati (2026-09-27: backend
    // `/user` dan `/user/admins` ga ko'chirdi).
    if (resource === 'user' && tail === 'admins' && method === 'GET') {
        return page(db.administrators as unknown as Row[], url)
    }

    // Yangi administrator (super-admin paneli). Backendda xuddi shu yo'l
    // orqali o'quvchi/o'qituvchi ham yaratilishi mumkin, lekin frontend
    // ularni `/student`/`/teacher` orqali yuboradi — demo'da faqat
    // `role: 'ADMINISTRATOR'` holatini ushlaymiz.
    if (resource === 'user' && method === 'POST') {
        const id = nextId('a')
        const fullName = String(body.fullName ?? '')
        const phone = String(body.phone ?? '')
        const created: UserDto = {
            id,
            fullName,
            phone,
            birthDate: body.birthDate as string | undefined,
            branchId: body.branchId as string | undefined,
            role: (body.role as UserDto['role']) ?? 'ADMINISTRATOR',
        }
        db.administrators = [...db.administrators, created]
        return json({
            id,
            fullName,
            phone,
            temporaryPassword: 'demo-' + nextId('p'),
        })
    }

    // Telefon bo'yicha qidiruv. Demo'da bitta raqam "topiladi", shunda
    // tasdiq oynasini ko'rish mumkin bo'ladi.
    if (resource === 'user' && tail === 'phone' && method === 'GET') {
        const phone = url.searchParams.get('phone') ?? ''
        if (phone.replace(/\D/g, '').endsWith('901234567')) {
            return json({
                id: 'u-existing',
                fullName: 'Nodir Aliyev',
                phone,
                birthDate: '2007-02-14',
                role: 'STUDENT',
            })
        }
        return json(null)
    }

    // --- generik CRUD: /student, /teacher, /group, /lesson ---
    const table = {
        student: 'students',
        teacher: 'teachers',
        group: 'groups',
        lesson: 'lessons',
    }[resource] as 'students' | 'teachers' | 'groups' | 'lessons' | undefined

    if (!table) return json({ message: `No mock for ${path}` }, 404)

    if (tail === 'count') return json(db[table].length)

    if (method === 'GET') {
        const rows = db[table] as unknown as Row[]
        const status = url.searchParams.get('status')
        const filtered =
            table === 'groups' && status ? rows.filter((row) => row.status === status) : rows
        return page(filtered, url)
    }

    if (method === 'POST') {
        // Dars boshlash: o'qituvchi paneli LessonDto kutadi.
        if (table === 'lessons') {
            const group = db.groups.find((item) => item.id === String(body.groupId))
            const lesson: LessonDto = {
                id: nextId('l'),
                title: String(db.lessons.length + 12),
                lessonDate: new Date().toISOString().slice(0, 19),
                isComplete: false,
                group,
                teacherDto: group?.teacher,
            }
            db.lessons = [...db.lessons, lesson]
            return json(lesson)
        }
        const created = { id: nextId(resource[0]), ...flatten(body) } as Row
        ;(db[table] as unknown as Row[]).push(created)

        // O'quvchi va o'qituvchi yaratilganda backend generatsiya qilingan
        // parolni qaytaradi — administrator uni faqat shu yerda ko'radi.
        if (table === 'students' || table === 'teachers') {
            const user = (created.userDto ?? {}) as Record<string, unknown>
            return json({ ...created, userDto: { ...user, temporaryPassword: 'demo-' + nextId('p') } })
        }

        return json(created)
    }

    if (method === 'PUT' && tail) {
        const rows = db[table] as unknown as Row[]
        const index = rows.findIndex((row) => row.id === tail)
        if (index >= 0) rows[index] = { ...rows[index], ...flatten(body), id: tail }
        return json(rows[index] ?? null)
    }

    if (method === 'DELETE' && tail) {
        db[table] = (db[table] as unknown as Row[]).filter(
            (row) => row.id !== tail
        ) as never
        return new Response('', { status: 204 })
    }

    return json({ message: `No mock for ${method} ${path}` }, 405)
}
