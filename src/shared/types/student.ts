import type { UserCreatedResponseDto, UserDto } from './user'

export interface StudentDto {
    id: string
    userDto?: UserDto
    parentPhone?: string
    /**
     * Balans faqat `GET /student/me` javobida keladi — boshqa endpointlarda
     * bo'sh bo'ladi. U butun o'quvchiga tegishli, guruhga emas: to'lovlar
     * unga qo'shilib boradi, manfiy son qarzni bildiradi.
     */
    balance?: number
}

/** `POST /student` tanasi — `StudentCreateDto`. */
export interface StudentCreatePayload {
    userCreateDto: {
        fullName: string
        phone: string
        birthDate: string | null
        role: 'STUDENT'
        branchId: string
    }
    parentPhone: string | null
}

/**
 * `POST /student` va `POST /student/list` dagi har bir yaratilgan o'quvchi.
 * Yangi parol `userDto.temporaryPassword` da — boshqa hech qayerda kelmaydi.
 */
export interface StudentCreateResponseDto {
    id: string
    userDto: UserCreatedResponseDto
    parentPhone: string | null
    balance: number | null
}
