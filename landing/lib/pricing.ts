// Narxlar productiondagi tariflar bilan bir xil bo'lishi shart (Developer
// panelidagi 4 ta oylik tarif). O'zgarsa — shu yerda ham yangilanadi.
export interface PricingPlan {
  id: 'start' | 'standard' | 'pro' | 'premium'
  name: string
  monthlyPrice: number
  students: number | null
  teachers: number
  branches: number
}

export const PRICING_PLANS: PricingPlan[] = [
  { id: 'start', name: 'Start', monthlyPrice: 300_000, students: 100, teachers: 50, branches: 1 },
  { id: 'standard', name: 'Standard', monthlyPrice: 500_000, students: 300, teachers: 150, branches: 2 },
  { id: 'pro', name: 'Pro', monthlyPrice: 1_000_000, students: 1000, teachers: 500, branches: 5 },
  // Premium — "1000+": amalda cheklovsiz, shuning uchun son ko'rsatilmaydi.
  { id: 'premium', name: 'Premium', monthlyPrice: 1_750_000, students: null, teachers: 2500, branches: 10 },
]

export const MIN_MONTHS = 1
export const MAX_MONTHS = 12

// Ilovadagi `monthsDiscountPercent` bilan bir xil qoida: 1 oy chegirmasiz,
// keyin har oyga 1,25% (12 oy = 15%). Farq qilsa mijoz saytda bir narx,
// shartnomada boshqa narx ko'radi.
export function monthsDiscountPercent(months: number): number {
  return months < 2 ? 0 : months * 1.25
}

export function planTotals(plan: PricingPlan, months: number) {
  const full = plan.monthlyPrice * months
  const total = Math.round(full * (1 - monthsDiscountPercent(months) / 100))
  return { full, total, perMonth: Math.round(total / months) }
}

export function formatSum(value: number): string {
  // Bo'sh joy bilan guruhlash — tilga bog'liq emas, uchala tilda bir xil.
  return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}
