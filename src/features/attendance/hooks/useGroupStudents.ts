import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/shared/api'
import { fetchGroupStudents, fetchStudentsByGroup } from '../api/attendanceApi'

/**
 * Guruhning o'quvchilari — davomat jadvalining qatorlari uchun.
 *
 * Rolga qarab boshqa endpoint: `/student/{id}/students` ni backend faqat
 * adminlarga ochgan, o'qituvchi u yerdan 403 oladi.
 */
export function useGroupStudents(token: string, groupId: string, role: string) {
    const isTeacher = role === 'TEACHER'

    const query = useQuery({
        queryKey: queryKeys.studentsByGroup(groupId, role),
        queryFn: () => (isTeacher ? fetchGroupStudents(token, groupId) : fetchStudentsByGroup(token, groupId)),
        enabled: Boolean(groupId),
    })

    return { ...query, students: query.data ?? [] }
}
