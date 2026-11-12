'use client'

import { useState } from 'react'
import { Check, Tag } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { useDemoModal } from '@/context/DemoModalContext'
import { PRICING_TRANSLATIONS } from '@/data/pricing'
import { AnimateOnScroll } from '@/components/ui/AnimateOnScroll'
import {
  formatSum,
  MAX_MONTHS,
  MIN_MONTHS,
  monthsDiscountPercent,
  planTotals,
  PRICING_PLANS,
} from '@/lib/pricing'

export function PricingSection() {
  const [months, setMonths] = useState(1)
  const { language } = useLanguage()
  const { openDemoModal } = useDemoModal()
  const t = PRICING_TRANSLATIONS[language]
  const discount = monthsDiscountPercent(months)
  // 3.75 → "3,75": uz/ru da kasr vergul bilan yoziladi.
  const discountText = language === 'en' ? String(discount) : String(discount).replace('.', ',')

  return (
    <section id='pricing' className='py-24 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors duration-200'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <AnimateOnScroll variant='fade-up' delay={0}>
          <div className='text-center max-w-2xl mx-auto mb-12 space-y-4'>
            <div className='inline-flex items-center gap-2 rounded-full border border-neutral-300 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 px-4 py-1.5 text-xs font-semibold text-neutral-800 dark:text-neutral-200'>
              <Tag className='h-3.5 w-3.5 text-blue-600 dark:text-blue-400' />
              <span>{t.badge}</span>
            </div>
            <h2 className='text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-neutral-900 dark:text-white leading-tight'>
              {t.heading}
            </h2>
            <p className='text-neutral-600 dark:text-neutral-400 text-base sm:text-lg leading-relaxed'>{t.subheading}</p>
          </div>
        </AnimateOnScroll>

        <div className='mx-auto mb-10 max-w-xl rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5'>
          <div className='mb-3 flex items-center justify-between gap-3'>
            <label htmlFor='pricing-months' className='text-sm font-semibold text-neutral-700 dark:text-neutral-300'>
              {t.monthsLabel}
            </label>
            <div className='flex items-center gap-2'>
              <span className='text-lg font-bold text-neutral-900 dark:text-white'>{t.monthsValue(months)}</span>
              {discount > 0 && (
                <span className='rounded-full bg-blue-600/10 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:text-blue-300'>
                  {t.discount(discountText)}
                </span>
              )}
            </div>
          </div>
          <input
            id='pricing-months'
            type='range'
            min={MIN_MONTHS}
            max={MAX_MONTHS}
            step={1}
            value={months}
            onChange={(event) => setMonths(Number(event.target.value))}
            className='w-full cursor-pointer accent-blue-600'
          />
          <div className='mt-1 flex justify-between text-xs text-neutral-500'>
            <span>{t.monthsValue(MIN_MONTHS)}</span>
            <span>{t.monthsValue(MAX_MONTHS)}</span>
          </div>
        </div>

        <div className='grid gap-5 sm:grid-cols-2 lg:grid-cols-4'>
          {PRICING_PLANS.map((plan) => {
            const { full, total, perMonth } = planTotals(plan, months)
            return (
              <div
                key={plan.id}
                className='flex flex-col rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6'
              >
                <h3 className='text-lg font-bold text-neutral-900 dark:text-white'>{plan.name}</h3>
                <p className='mt-1 text-sm text-neutral-500'>{t.students(plan.students)}</p>

                <div className='mt-5'>
                  {discount > 0 && (
                    <span className='text-sm text-neutral-400 line-through'>{formatSum(plan.monthlyPrice)}</span>
                  )}
                  <div className='flex items-baseline gap-1.5'>
                    <span className='text-3xl font-black tracking-tight text-neutral-900 dark:text-white'>{formatSum(perMonth)}</span>
                    <span className='text-sm text-neutral-500'>{t.perMonth}</span>
                  </div>
                  {months > 1 && (
                    <p className='mt-1 text-sm text-neutral-600 dark:text-neutral-400'>
                      {t.total}: <span className='font-semibold text-neutral-900 dark:text-white'>{formatSum(total)}</span>
                      {discount > 0 && <span className='ml-1.5 text-neutral-400 line-through'>{formatSum(full)}</span>}
                    </p>
                  )}
                </div>

                <ul className='mt-6 flex-1 space-y-2.5 text-sm text-neutral-700 dark:text-neutral-300'>
                  {[t.allModules, t.teachers(plan.teachers), t.branches(plan.branches)].map((item) => (
                    <li key={item} className='flex items-start gap-2'>
                      <Check className='mt-0.5 h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400' />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <button
                  type='button'
                  onClick={openDemoModal}
                  className='mt-6 w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 cursor-pointer'
                >
                  {t.cta}
                </button>
              </div>
            )
          })}
        </div>

        <p className='mt-8 text-center text-xs text-neutral-500'>{t.note}</p>
      </div>
    </section>
  )
}
