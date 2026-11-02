import { apiFetch } from '@/shared/api'
import type {
    ChangePasswordPayload,
    UserDto,
    UserUpdatePayload,
} from '@/shared/types'

/** Kirgan foydalanuvchining o'z ma'lumoti. */
export function fetchMe(token: string) {
    return apiFetch<UserDto>('/auth/me', { token })
}

/**
 * Parolni o'zgartirish.
 *
 * DIQQAT: backendning `AuthService.changePassword` da shart teskari
 * yozilgan — parollar MOS KELGANDA "passwords do not match" xatosi otiladi.
 * Bu yerda to'g'ri ma'lumot yuboriladi; backend tuzatilgach o'zi ishlaydi.
 */
export function changePassword(token: string, payload: ChangePasswordPayload) {
    return apiFetch<{ response?: string }>('/auth/change-password', {
        method: 'POST',
        token,
        body: payload,
    })
}

/**
 * Profilni saqlash.
 *
 * Alohida "o'zimni yangilash" endpoint'i yo'q, shuning uchun umumiy
 * `PUT /user/{id}` ishlatiladi — `id` `/auth/me` dan olinadi.
 */
export function updateProfile(token: string, userId: string, payload: UserUpdatePayload) {
    return apiFetch<UserDto>(`/user/${userId}`, { method: 'PUT', token, body: payload })
}
