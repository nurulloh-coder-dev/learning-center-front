import type { StudentCreatePayload, TeacherCreatePayload } from '@/shared/types'
import type { ImportKind } from './importFields'
import type { PreparedValues } from './prepareRows'

/** Yaratish formasi (`admin/config/forms.ts`) bilan bir xil shakl — backend bitta DTO kutadi. */
export function toStudentPayload(values: PreparedValues, branchId: string): StudentCreatePayload {
    return {
        userCreateDto: {
            fullName: values.fullName,
            phone: values.phone,
            birthDate: values.birthDate,
            role: 'STUDENT',
            branchId,
        },
        parentPhone: values.parentPhone,
    }
}

export function toTeacherPayload(values: PreparedValues, branchId: string): TeacherCreatePayload {
    return {
        user: {
            fullName: values.fullName,
            phone: values.phone,
            birthDate: values.birthDate,
            role: 'TEACHER',
            branchId,
        },
    }
}

export function toPayload(kind: ImportKind, values: PreparedValues, branchId: string) {
    return kind === 'students' ? toStudentPayload(values, branchId) : toTeacherPayload(values, branchId)
}
