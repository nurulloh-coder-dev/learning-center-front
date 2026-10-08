/**
 * Kursor joyi: formatlangandan keyin kursor oxirga sakramasin. Kursordan
 * oldingi RAQAMLAR soni saqlanadi va yangi satrda o'sha raqamdan keyingi
 * o'rin topiladi.
 */
export function caretAfterDigits(formatted: string, digitsBefore: number): number {
    if (digitsBefore <= 0) return 0
    let seen = 0
    for (let index = 0; index < formatted.length; index++) {
        if (/\d/.test(formatted[index])) seen++
        if (seen === digitsBefore) return index + 1
    }
    return formatted.length
}
