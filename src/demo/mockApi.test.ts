import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { apiFetch } from '@/shared/api'
import { installMockApi, resetMockApiInstalledFlag } from './mockApi'

describe('mockApi', () => {
    const originalFetch = window.fetch

    beforeEach(() => {
        resetMockApiInstalledFlag()
        installMockApi()
    })

    afterEach(() => {
        resetMockApiInstalledFlag()
        window.fetch = originalFetch
    })

    it('PUT /user/u-demo updates user profile without returning 404', async () => {
        const data = await apiFetch<Record<string, unknown>>('/user/u-demo', {
            method: 'PUT',
            body: {
                fullName: 'New Demo Name',
                phone: '+998 90 999 99 99',
                birthDate: '2000-01-01',
            },
        })

        expect(data).not.toBeNull()
        expect(data?.fullName).toBe('New Demo Name')
        expect(data?.phone).toBe('+998 90 999 99 99')
    })

    it('GET /user/admins returns the seeded administrators page', async () => {
        const data = await apiFetch<{ content?: Record<string, unknown>[]; totalElements?: number }>(
            '/user/admins',
            { token: 'demo' }
        )

        expect(data?.totalElements).toBeGreaterThan(0)
        expect(data?.content?.[0]).toMatchObject({ role: 'ADMINISTRATOR' })
    })

    it('POST /user creates an administrator and returns a temporary password', async () => {
        const created = await apiFetch<Record<string, unknown>>('/user', {
            method: 'POST',
            token: 'demo',
            body: {
                fullName: 'Test Administrator',
                phone: '+998 90 000 00 00',
                role: 'ADMINISTRATOR',
                branchId: 'b1',
                permissions: ['LEAD_MANAGEMENT'],
            },
        })

        expect(created?.fullName).toBe('Test Administrator')
        expect(created?.phone).toBe('+998 90 000 00 00')
        expect(typeof created?.temporaryPassword).toBe('string')

        const list = await apiFetch<{ content?: Record<string, unknown>[] }>('/user/admins', {
            token: 'demo',
            params: { page: 0, size: 50 },
        })
        expect(list?.content?.some((row) => row.fullName === 'Test Administrator')).toBe(true)
    })

    it('handles /leads endpoints correctly', async () => {
        // GET /leads
        const getPage = await apiFetch<Record<string, unknown>>('/leads', { token: 'demo' })
        expect(getPage).not.toBeNull()
        const content = getPage?.content as Array<Record<string, unknown>>
        expect(content.length).toBeGreaterThan(0)

        // POST /leads
        const created = await apiFetch<Record<string, unknown>>('/leads', {
            method: 'POST',
            token: 'demo',
            body: {
                fullName: 'Test Lead',
                phone: '+998 90 000 00 00',
                source: 'INSTAGRAM',
                preferredCourseId: 'lvl-a1',
            },
        })
        expect(created?.fullName).toBe('Test Lead')
        expect(created?.status).toBe('NEW')

        const leadId = created?.id as string

        // PUT /leads/:id
        const updated = await apiFetch<Record<string, unknown>>(`/leads/${leadId}`, {
            method: 'PUT',
            token: 'demo',
            body: {
                fullName: 'Updated Lead',
                status: 'NEW',
            },
        })
        expect(updated?.fullName).toBe('Updated Lead')

        // Har o'zgarishda versiya bittaga oshadi; yaratilganda 0, PUT dan keyin 1.
        expect(updated?.version).toBe(1)

        // PATCH /leads/callLater — id va versiya tanada
        const calledLater = await apiFetch<Record<string, unknown>>('/leads/callLater', {
            method: 'PATCH',
            token: 'demo',
            body: { id: leadId, leadVersion: 1, callAt: '2026-09-01T10:00:00' },
        })
        expect(calledLater?.status).toBe('CALL_LATER')
        expect(calledLater?.callAt).toBe('2026-09-01T10:00:00')

        // Eskirgan versiya bilan amal 409 beradi (boshqa xodim lidni oldin o'zgartirgan)
        await expect(
            apiFetch('/leads/enroll', { method: 'POST', token: 'demo', params: { id: leadId, groupId: 'g1', leadVersion: 1 } })
        ).rejects.toMatchObject({ status: 409 })

        // POST /leads/enroll — so'rov parametrlari
        const enrolled = await apiFetch<Record<string, unknown>>('/leads/enroll', {
            method: 'POST',
            token: 'demo',
            params: { id: leadId, groupId: 'g1', leadVersion: 2 },
        })
        expect(enrolled?.status).toBe('ENROLLED')

        // DELETE /leads/:id
        await expect(apiFetch(`/leads/${leadId}`, { method: 'DELETE', token: 'demo' })).resolves.toBeNull()
    })

    it('handles /group-level endpoints correctly', async () => {
        // GET /group-level/names
        const names = await apiFetch<Array<Record<string, unknown>>>('/group-level/names', { token: 'demo' })
        expect(Array.isArray(names)).toBe(true)
        expect(names?.[0]).toHaveProperty('id')
        expect(names?.[0]).toHaveProperty('name')

        // GET /group-level
        const levels = await apiFetch<Array<Record<string, unknown>>>('/group-level', { token: 'demo' })
        expect(Array.isArray(levels)).toBe(true)
        expect(levels!.length).toBeGreaterThan(0)

        // POST /group-level
        const created = await apiFetch<Record<string, unknown>>('/group-level', {
            method: 'POST',
            token: 'demo',
            body: {
                name: 'C1 Advanced',
                lessonCount: 30,
                durationInMonths: 6,
                monthlyFee: 600000,
            },
        })
        expect(created?.name).toBe('C1 Advanced')

        const levelId = created?.id as string

        // PUT /group-level/:id
        const updated = await apiFetch<Record<string, unknown>>(`/group-level/${levelId}`, {
            method: 'PUT',
            token: 'demo',
            body: {
                monthlyFee: 650000,
            },
        })
        expect(updated?.monthlyFee).toBe(650000)

        // DELETE /group-level/:id
        await expect(apiFetch(`/group-level/${levelId}`, { method: 'DELETE', token: 'demo' })).resolves.toBeNull()
    })

    it('handles /analytics/:category endpoints correctly', async () => {
        const categories = ['student', 'teacher', 'lead', 'invoice', 'enrollment', 'branch']
        for (const cat of categories) {
            const data = await apiFetch<Record<string, unknown>>(`/analytics/${cat}`, { token: 'demo' })
            expect(data).not.toBeNull()
            expect(typeof data).toBe('object')
        }
    })

    it('handles /image endpoints correctly', async () => {
        // GET /image — haqiqiy backend MASSIV qaytaradi, sahifalangan
        // obyekt emas. Demo ham shunday bo'lishi kerak: farq qilsa,
        // productionda galereya bo'sh chiqadi va demo buni ko'rsatmaydi.
        const list = await apiFetch<Array<Record<string, unknown>>>('/image', { token: 'demo' })
        expect(Array.isArray(list)).toBe(true)
        expect(list?.length ?? 0).toBeGreaterThan(0)

        // POST /image/upload
        const formData = new FormData()
        formData.append('file', new File(['dummy content'], 'test.png', { type: 'image/png' }))
        const uploaded = await apiFetch<Record<string, unknown>>('/image/upload', {
            method: 'POST',
            token: 'demo',
            body: formData,
        })
        expect(uploaded).not.toBeNull()
        expect(uploaded?.imageUrl).toBeDefined()

        const newImg = uploaded?.imageUrl as Record<string, unknown>
        const imageId = newImg.id as string

        // PUT /image/main/:id
        await expect(apiFetch(`/image/main/${imageId}`, { method: 'PUT', token: 'demo' })).resolves.toBeNull()

        // Verify /auth/me updated
        const me = await apiFetch<Record<string, unknown>>('/auth/me', { token: 'demo' })
        expect(me?.imageUrl).toBe(newImg.imageUrl)

        // DELETE /image/:id
        await expect(apiFetch(`/image/${imageId}`, { method: 'DELETE', token: 'demo' })).resolves.toBeNull()
    })
})
