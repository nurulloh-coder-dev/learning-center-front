import { Language } from '@/context/LanguageContext'

export interface PricingTranslations {
  nav: string
  badge: string
  heading: string
  subheading: string
  monthsLabel: string
  monthsValue: (months: number) => string
  discount: (percent: string) => string
  perMonth: string
  total: string
  students: (count: number | null) => string
  teachers: (count: number) => string
  branches: (count: number) => string
  allModules: string
  cta: string
  note: string
}

export const PRICING_TRANSLATIONS: Record<Language, PricingTranslations> = {
  uz: {
    nav: 'Narxlar',
    badge: 'Narxlar',
    heading: "Markazingiz hajmiga mos tarif",
    subheading: "Hamma tarifda barcha modullar bor. Farq — o'quvchi soni va filiallarda. Uzoqroq muddatga olsangiz, arzonroq.",
    monthsLabel: "To'lov muddati",
    monthsValue: (months) => `${months} oy`,
    discount: (percent) => `−${percent}% chegirma`,
    perMonth: "so'm / oy",
    total: 'Jami',
    students: (count) => (count === null ? "1000+ o'quvchi" : `${count} tagacha o'quvchi`),
    teachers: (count) => `${count} tagacha o'qituvchi`,
    branches: (count) => (count === 1 ? '1 ta filial' : `${count} tagacha filial`),
    allModules: 'Barcha modullar',
    cta: 'Bepul demo',
    note: "Narxlar so'mda. 2 oydan boshlab har oy uchun 1,25% chegirma, 12 oyga — 15%.",
  },
  ru: {
    nav: 'Цены',
    badge: 'Цены',
    heading: 'Тариф под размер вашего центра',
    subheading: 'Во всех тарифах есть все модули. Разница — в количестве учеников и филиалов. Чем дольше срок, тем дешевле.',
    monthsLabel: 'Срок оплаты',
    monthsValue: (months) => `${months} мес.`,
    discount: (percent) => `скидка −${percent}%`,
    perMonth: 'сум / мес.',
    total: 'Итого',
    students: (count) => (count === null ? '1000+ учеников' : `до ${count} учеников`),
    teachers: (count) => `до ${count} преподавателей`,
    branches: (count) => (count === 1 ? '1 филиал' : `до ${count} филиалов`),
    allModules: 'Все модули',
    cta: 'Бесплатное демо',
    note: 'Цены в сумах. От 2 месяцев — скидка 1,25% за каждый месяц, за 12 месяцев — 15%.',
  },
  en: {
    nav: 'Pricing',
    badge: 'Pricing',
    heading: 'A plan that fits your center',
    subheading: 'Every plan includes all modules. Plans differ by students and branches. Pay for longer, pay less.',
    monthsLabel: 'Billing period',
    monthsValue: (months) => (months === 1 ? '1 month' : `${months} months`),
    discount: (percent) => `−${percent}% off`,
    perMonth: 'UZS / month',
    total: 'Total',
    students: (count) => (count === null ? '1000+ students' : `Up to ${count} students`),
    teachers: (count) => `Up to ${count} teachers`,
    branches: (count) => (count === 1 ? '1 branch' : `Up to ${count} branches`),
    allModules: 'All modules',
    cta: 'Free demo',
    note: 'Prices in UZS. From 2 months: 1.25% off per month, 15% for 12 months.',
  },
}
