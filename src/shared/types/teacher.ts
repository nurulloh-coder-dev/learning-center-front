import type { UserCreatedResponseDto, UserDto } from './user'

export interface TeacherDto {
    id: string
    userDto?: UserDto
}

/** `POST /teacher` tanasi — `TeacherCreateDto`. */
export interface TeacherCreatePayload {
    user: {
        fullName: string
        phone: string
        birthDate: string | null
        role: 'TEACHER'
        branchId: string
    }
}

/** `POST /teacher` va `POST /teacher/list` dagi har bir yaratilgan o'qituvchi. */
export interface TeacherCreateResponseDto {
    id: string
    userDto: UserCreatedResponseDto
    totalTeachingExp: number
    currPlaceTeachingExp: number
}
