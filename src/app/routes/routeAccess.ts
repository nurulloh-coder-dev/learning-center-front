/**
 * `/payments` ga kira oladigan rollar.
 *
 * O'qituvchi YO'Q: backendda `InvoiceController` `INVOICE_MANAGEMENT`
 * ruxsatini talab qiladi, o'qituvchida esa ruxsatlar yo'q — ilgari u
 * sahifani ochib, faqat "Forbidden" xatolarini ko'rardi. Menyuda ham
 * o'qituvchiga bu havola berilmaydi (`AppNavigation`).
 */
export const PAYMENTS_ROLES = ['ADMINISTRATOR', 'SUPER_ADMIN'] as const
