import type { AdminPermission, Role } from './common'

/** `UserDto` — diqqat: maydon nomi `imageUrl` (`imgUrl` emas). */
export interface UserDto {
    id?: string
    /** Foydalanuvchi biriktirilgan filial — sozlamalardagi markaz bloki shuni yuklaydi. */
    branchId?: string
    imageUrl?: string
    fullName?: string
    phone?: string
    /** `LocalDate` — "yyyy-MM-dd". */
    birthDate?: string
    role?: Role
}

/** `PUT /user/{id}` uchun. */
export interface UserUpdatePayload {
    fullName: string
    phone: string
    /** Bo'sh bo'lsa yuborilmaydi — backend `null` ni "o'zgartirma" deb oladi. */
    birthDate?: string
}

/** `POST /auth/change-password` uchun. */
export interface ChangePasswordPayload {
    oldPassword: string
    newPassword: string
    confirmPassword: string
}

/**
 * `POST /user` tanasi — `UserCreateDto`. O'quvchi va o'qituvchi ham
 * shu maydonlarni `/student`/`/teacher` orqali ichma-ich yuboradi
 * (`StudentCreateDto.userCreateDto`, `TeacherCreateDto.user`), lekin
 * to'g'ridan-to'g'ri `POST /user` — administrator yaratish uchun.
 */
export interface UserCreatePayload {
    fullName: string
    phone: string
    birthDate?: string
    role: Role
    branchId?: string
    /** Faqat `role: 'ADMINISTRATOR'` da ma'noga ega. */
    permissions?: AdminPermission[]
}

/**
 * `POST /user` javobi — `UserCreatedResponseDto`.
 *
 * Vaqtinchalik parol FAQAT shu javobda keladi (o'quvchi/o'qituvchida
 * ham xuddi shunday — boshqa hech qayerdan qayta olib bo'lmaydi).
 *
 * `temporaryPassword` — telefon tizimda ALLAQACHON bo'lsa `null`:
 * `UserService.createUser` bunday holda yangi parol generatsiya
 * qilmaydi, mavjud foydalanuvchini shu tashkilotga biriktiradi xolos.
 */
export interface UserCreatedResponseDto {
    id: string
    fullName: string
    phone: string
    temporaryPassword: string | null
}
