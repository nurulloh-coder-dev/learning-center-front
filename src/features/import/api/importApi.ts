import { apiFetch } from '@/shared/api'
import type {
    BranchDto,
    BulkResult,
    Page,
    StudentCreatePayload,
    StudentCreateResponseDto,
    TeacherCreatePayload,
    TeacherCreateResponseDto,
} from '@/shared/types'
import type { ImportKind } from '../lib/importFields'

export type ImportPayload = StudentCreatePayload | TeacherCreatePayload
export type ImportResult = BulkResult<StudentCreateResponseDto | TeacherCreateResponseDto, ImportPayload>

const ENDPOINTS: Record<ImportKind, string> = {
    students: '/student/list',
    teachers: '/teacher/list',
}

/**
 * Ro'yxatni bitta so'rovda yuboradi. Backend har qatorni alohida yaratadi:
 * javobda yaratilganlar (yangi parollar bilan) va yiqilganlar (tartib
 * raqami va sababi bilan) keladi — `201` ham, `207` ham muvaffaqiyat.
 */
export async function importPeople(token: string, kind: ImportKind, items: ImportPayload[]): Promise<ImportResult> {
    const data = await apiFetch<ImportResult>(ENDPOINTS[kind], { method: 'POST', token, body: items })
    return { succeeded: data?.succeeded ?? [], failed: data?.failed ?? [] }
}

/**
 * Filial tanlagichi uchun. `admin` bo'limidagi bilan bir xil so'rov va
 * shakl (`queryKeys.branchOptions` keshini bo'lishadi) — bo'limlar bir-biridan
 * import qilmagani uchun shu yerda ham yozilgan.
 */
export async function fetchBranchOptions(token: string) {
    const data = await apiFetch<Page<BranchDto>>('/branch', { token, params: { page: 0, size: 200 } })
    return (data?.content ?? []).map((branch) => ({ value: branch.id, label: branch.name || branch.id }))
}
