import { cn } from '@/shared/lib'

/**
 * Barcha matn/vaqt/sana inputlari va select'lar uchun yagona ko'rinish.
 *
 * Alohida faylda turibdi, chunki komponent faylidan konstanta eksport
 * qilinsa Vite'ning Fast Refresh'i ishlamay qoladi.
 *
 * `inputBaseClasses` da burchak va gorizontal padding YO'Q: qidiruv
 * maydoni (`SearchInput`) ularni o'zgacha beradi, ikki xil `rounded-*`
 * bir elementda bo'lsa qaysi biri yutishi CSS tartibiga qolib ketadi.
 */
export const inputBaseClasses = cn(
    'min-h-11 w-full border border-border-base bg-surface-card text-sm text-fg',
    'transition-[border-color,box-shadow] duration-150 placeholder:text-fg-faint',
    'hover:border-border-strong',
    'focus:border-accent focus:ring-3 focus:ring-accent/20 focus:outline-none',
    // Bloklangan maydon ochig'idan ko'rinishda farq qilishi SHART: aks holda
    // foydalanuvchi yozmoqchi bo'lib, nega yozilmayotganini tushunmaydi.
    'disabled:cursor-not-allowed disabled:opacity-55 disabled:hover:border-border-base',
    'read-only:bg-surface-muted read-only:text-fg-muted read-only:hover:border-border-base'
)

export const inputClasses = cn(inputBaseClasses, 'rounded-md px-3.5')
