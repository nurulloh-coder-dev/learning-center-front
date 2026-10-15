'use client'

import React from 'react'
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react'
import { useDemoModal } from '@/context/DemoModalContext'
import { useLanguage } from '@/context/LanguageContext'
import { TRANSLATIONS } from '@/data/translations'
import { AnimateOnScroll } from '@/components/ui/AnimateOnScroll'

export function CtaSection() {
  const { openDemoModal } = useDemoModal()
  const { language } = useLanguage()
  const t = TRANSLATIONS[language].cta

  return (
    <section className='py-20 relative overflow-hidden bg-white dark:bg-black text-neutral-900 dark:text-neutral-100 transition-colors duration-200'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10'>
        <AnimateOnScroll variant='zoom-in' delay={0}>
          <div className='relative rounded-2xl border border-neutral-800 bg-neutral-900 dark:bg-black p-10 md:p-16 text-center space-y-6 shadow-2xl overflow-hidden text-white'>
            {/* Ambient Pulse Aura */}
            <div className='pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-72 w-96 rounded-full bg-blue-600/20 blur-[100px]' />

            <h2 className='text-3xl sm:text-5xl font-black tracking-tight text-white max-w-3xl mx-auto leading-tight relative z-10'>
              {t.heading}
            </h2>

            <p className='text-neutral-400 text-base sm:text-lg max-w-2xl mx-auto font-normal leading-relaxed relative z-10'>
              {t.subheading}
            </p>

            <div className='flex flex-wrap items-center justify-center gap-4 pt-4 relative z-10'>
              <button
                onClick={openDemoModal}
                className='inline-flex items-center gap-2.5 rounded-md bg-blue-600 hover:bg-blue-700 px-8 py-4 text-base font-bold text-white shadow-xs transition-all cursor-pointer active:scale-95 group'
              >
                <Sparkles className='h-4 w-4 text-white' />
                <span>{t.bookDemoBtn}</span>
                <ArrowRight className='h-4 w-4 group-hover:translate-x-1 transition-transform' />
              </button>
              <button
                onClick={openDemoModal}
                className='inline-flex items-center gap-2 rounded-md border border-neutral-700 bg-neutral-800 hover:bg-neutral-700 px-8 py-4 text-base font-bold text-white transition-all cursor-pointer active:scale-95'
              >
                <span>{t.freeTrialBtn}</span>
              </button>
            </div>

            <p className='text-xs text-neutral-400 pt-2 flex items-center justify-center gap-2 font-medium relative z-10'>
              <ShieldCheck className='h-4 w-4 text-blue-400' />
              <span>{t.guaranteeText}</span>
            </p>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  )
}
