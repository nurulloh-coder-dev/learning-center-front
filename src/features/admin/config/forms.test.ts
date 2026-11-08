import { describe, expect, it } from 'vitest'
import { FORM_CONFIGS } from './forms'
import type { AdminRow } from '../types'

describe('students form config', () => {
    const config = FORM_CONFIGS.students!

    it('ichma-ich userDto dan boshlang’ich qiymatlarni oladi', () => {
        const row: AdminRow = {
            id: '1',
            userDto: { fullName: 'Aziza Karimova', phone: '+998901234567', birthDate: '2005-02-01' },
            parentPhone: '+998907654321',
        }
        expect(config.getInitialValues(row)).toEqual({
            fullName: 'Aziza Karimova',
            phone: '+998901234567',
            birthDate: '2005-02-01',
            parentPhone: '+998907654321',
        })
    })

    // StudentDto ning aniq shakli tasdiqlanmagan — yassi maydonlar zaxira yo'l.
    it('userDto bo’lmasa yassi maydonlarga tushadi', () => {
        const row: AdminRow = { id: '1', fullName: 'Bek Toshev', phone: '+998901112233' }
        expect(config.getInitialValues(row)).toMatchObject({
            fullName: 'Bek Toshev',
            phone: '+998901112233',
        })
    })

    it('yangi qator uchun bo’sh forma beradi', () => {
        expect(config.getInitialValues(null)).toEqual({
            fullName: '',
            phone: '',
            birthDate: '',
            parentPhone: '',
        })
    })

    it('create payload rolni STUDENT qilib qo’yadi va branchId ni qo’shadi', () => {
        expect(
            config.buildCreatePayload({ fullName: 'A', phone: 'p', birthDate: 'd', parentPhone: 'pp', branchId: 'b1' })
        ).toEqual({
            userCreateDto: { fullName: 'A', phone: 'p', birthDate: 'd', role: 'STUDENT', branchId: 'b1' },
            parentPhone: 'pp',
        })
    })

    it('update payload rol yubormaydi va `user` kalitini ishlatadi', () => {
        const payload = config.buildUpdatePayload({ fullName: 'A', phone: 'p', birthDate: 'd', parentPhone: 'pp' })
        expect(payload).toEqual({
            user: { fullName: 'A', phone: 'p', birthDate: 'd' },
            parentPhone: 'pp',
        })
    })

    it('yaratishda filial serverdan kelgan ro’yxatdan tanlanadi', () => {
        const fields = typeof config.fields === 'function' ? config.fields('create') : config.fields
        const branchField = fields.find((field) => field.key === 'branchId')
        expect(branchField?.type).toBe('select')
        expect(branchField?.optionsSource).toBe('branches')
    })

    it('tahrirlashda filial maydoni ko’rsatilmaydi', () => {
        const fields = typeof config.fields === 'function' ? config.fields('edit') : config.fields
        expect(fields.map((field) => field.key)).not.toContain('branchId')
    })
})

describe('teachers form config', () => {
    const config = FORM_CONFIGS.teachers!

    it('create payload rolni TEACHER qilib qo’yadi va branchId ni qo’shadi', () => {
        expect(config.buildCreatePayload({ fullName: 'A', phone: 'p', birthDate: 'd', branchId: 'b2' })).toEqual({
            user: { fullName: 'A', phone: 'p', birthDate: 'd', role: 'TEACHER', branchId: 'b2' },
        })
    })

    it('update payload rol va branchId yubormaydi', () => {
        expect(config.buildUpdatePayload({ fullName: 'A', phone: 'p', birthDate: 'd', branchId: 'b2' })).toEqual({
            user: { fullName: 'A', phone: 'p', birthDate: 'd' },
        })
    })

    it('yaratishda filial serverdan kelgan ro’yxatdan tanlanadi', () => {
        const fields = typeof config.fields === 'function' ? config.fields('create') : config.fields
        const branchField = fields.find((field) => field.key === 'branchId')
        expect(branchField?.type).toBe('select')
        expect(branchField?.optionsSource).toBe('branches')
    })

    it('tahrirlashda filial maydoni ko’rsatilmaydi', () => {
        const fields = typeof config.fields === 'function' ? config.fields('edit') : config.fields
        expect(fields.map((field) => field.key)).not.toContain('branchId')
    })
})

describe('groups form config', () => {
    const config = FORM_CONFIGS.groups!

    it('kunlar tanlagichi emas, ODD/EVEN tanlagichi ishlatiladi', () => {
        const fields = typeof config.fields === 'function' ? config.fields('create') : config.fields
        const dayField = fields.find((field) => field.key === 'dayType')
        expect(dayField?.type).toBe('select')
        expect(dayField?.options?.map((option) => option.value)).toEqual(['ODD', 'EVEN'])
    })

    it('yaratishda status maydoni ko’rsatilmaydi', () => {
        const fields = typeof config.fields === 'function' ? config.fields('create') : config.fields
        expect(fields.map((field) => field.key)).not.toContain('status')
    })

    it('yaratishda filial tanlanadi va payload’ga branchId ketadi', () => {
        const fields = typeof config.fields === 'function' ? config.fields('create') : config.fields
        expect(fields.find((field) => field.key === 'branchId')?.optionsSource).toBe('branches')
        expect(config.buildCreatePayload({ branchId: 'b1' })).toMatchObject({ branchId: 'b1' })
    })

    it('tahrirlashda filial maydoni yo’q', () => {
        const fields = typeof config.fields === 'function' ? config.fields('edit') : config.fields
        expect(fields.map((field) => field.key)).not.toContain('branchId')
    })

    it('tahrirlashda status maydoni qo’shiladi', () => {
        const fields = typeof config.fields === 'function' ? config.fields('edit') : config.fields
        expect(fields.map((field) => field.key)).toContain('status')
    })

    it('jadval vaqtidan soniyalarni olib tashlaydi va dayType ni oladi', () => {
        const row: AdminRow = {
            id: 'g1',
            name: 'Beginners A',
            timeTable: { dayType: 'EVEN', startTime: '09:00:00', endTime: '10:30:00' },
        }
        expect(config.getInitialValues(row)).toMatchObject({
            startTime: '09:00',
            endTime: '10:30',
            dayType: 'EVEN',
        })
    })

    // Jadvali yo'q guruhda forma bo'sh emas, ODD dan boshlansin.
    it('jadval yo’q bo’lsa dayType ODD bo’ladi', () => {
        expect(config.getInitialValues(null)).toMatchObject({ dayType: 'ODD' })
    })

    it('startDate maydoni room dan keyin joylashgan', () => {
        const fields = typeof config.fields === 'function' ? config.fields('create') : config.fields
        const keys = fields.map((f) => f.key)
        expect(keys.indexOf('startDate')).toBe(keys.indexOf('room') + 1)

        const startDateField = fields.find((f) => f.key === 'startDate')
        expect(startDateField).toEqual({
            key: 'startDate',
            labelKey: 'group.startDate',
            type: 'date',
        })
    })

    it('teacherId maydoni endTime dan keyin joylashgan va optionsSource freeTeachers', () => {
        const fields = typeof config.fields === 'function' ? config.fields('create') : config.fields
        const keys = fields.map((f) => f.key)
        expect(keys.indexOf('teacherId')).toBe(keys.indexOf('endTime') + 1)

        const teacherIdField = fields.find((f) => f.key === 'teacherId')
        expect(teacherIdField?.optionsSource).toBe('freeTeachers')
    })

    it('row dagi startDate mavjud bo’lsa uni oladi, yo’q bo’lsa bugungi sana qilib beradi', () => {
        const row: AdminRow = {
            id: 'g1',
            name: 'Beginners A',
            startDate: '2025-01-15T00:00:00Z',
        }
        expect(config.getInitialValues(row)).toMatchObject({
            startDate: '2025-01-15',
        })

        const today = new Date().toISOString().slice(0, 10)
        expect(config.getInitialValues(null)).toMatchObject({
            startDate: today,
        })
    })

    it('create payload startDate ni o’z ichiga oladi', () => {
        expect(
            config.buildCreatePayload({
                name: 'Beginners A',
                room: '12',
                startDate: '2025-02-01',
                teacherId: 't1',
                dayType: 'ODD',
                startTime: '09:00',
                endTime: '10:30',
            })
        ).toEqual({
            name: 'Beginners A',
            room: '12',
            startDate: '2025-02-01',
            teacherId: 't1',
            timeTable: { dayType: 'ODD', startTime: '09:00', endTime: '10:30' },
        })
    })

    it('update payload startDate ni o’z ichiga oladi', () => {
        expect(
            config.buildUpdatePayload({
                name: 'Beginners A',
                room: '12',
                startDate: '2025-02-01',
                teacherId: 't1',
                dayType: 'ODD',
                startTime: '09:00',
                endTime: '10:30',
                status: 'ONGOING',
            })
        ).toEqual({
            name: 'Beginners A',
            room: '12',
            startDate: '2025-02-01',
            teacherId: 't1',
            timeTable: { dayType: 'ODD', startTime: '09:00', endTime: '10:30' },
            status: 'ONGOING',
        })
    })
})

describe('lessons form config', () => {
    const config = FORM_CONFIGS.lessons!

    function fieldsFor(mode: 'create' | 'edit') {
        return typeof config.fields === 'function' ? config.fields(mode) : config.fields
    }

    it('yaratishda guruh serverdan kelgan ro’yxatdan tanlanadi', () => {
        const groupField = fieldsFor('create').find((field) => field.key === 'groupId')
        expect(groupField?.type).toBe('select')
        expect(groupField?.optionsSource).toBe('groups')
    })

    // LessonUpdateDto faqat `topic` ni oladi — guruhni almashtirib bo'lmaydi.
    it('tahrirlashda guruh maydoni ko’rsatilmaydi', () => {
        expect(fieldsFor('edit').map((field) => field.key)).toEqual(['topic'])
    })

    it('create payload LessonCreateDto shaklida', () => {
        expect(config.buildCreatePayload({ groupId: 'g1', topic: 'Unit 3' })).toEqual({
            groupId: 'g1',
            topic: 'Unit 3',
        })
    })

    it('update payload faqat nomni yuboradi', () => {
        expect(config.buildUpdatePayload({ groupId: 'g1', topic: 'Unit 3' })).toEqual({
            topic: 'Unit 3',
        })
    })

    it('tahrirlashda guruh id si qatordan olinadi', () => {
        const row: AdminRow = { id: 'l1', group: { id: 'g7', name: 'Beginners A' } }
        expect(config.getInitialValues(row)).toEqual({ groupId: 'g7', topic: '' })
    })

    it('yangi dars uchun bo’sh forma beradi', () => {
        expect(config.getInitialValues(null)).toEqual({ groupId: '', topic: '' })
    })
})
