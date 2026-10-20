'use client'

import React, { useState } from 'react'
import { Sparkles, CheckCircle2, ArrowRight, Layers } from 'lucide-react'
import { Dropdown } from '@/components/ui/Dropdown'
import { RoleFilter } from '@/types/landing'
import { useDemoModal } from '@/context/DemoModalContext'
import { useLanguage } from '@/context/LanguageContext'
import { TRANSLATIONS } from '@/data/translations'
import { AnimateOnScroll } from '@/components/ui/AnimateOnScroll'

export function FeatureModulesSection() {
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('all')
  const { openDemoModal } = useDemoModal()
  const { language } = useLanguage()
  const t = TRANSLATIONS[language].features

  const filteredModules = t.modules.filter(
    (m) => roleFilter === 'all' || m.role === roleFilter
  )

  return (
    <section id='features' className='py-24 bg-neutral-50 dark:bg-black relative border-y border-neutral-200 dark:border-neutral-800 transition-colors duration-200 overflow-hidden'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10'>
        {/* Section Header — filtr ro'yxati pastdagi kartalar USTIDA ochilishi
            uchun alohida qatlam: AnimateOnScroll transform bilan o'z qatlamini
            yaratadi, ichidagi z-50 kartalardan oshib chiqa olmaydi. */}
        <div className='relative z-20'>
        <AnimateOnScroll variant='fade-up' delay={0}>
          <div className='flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6'>
            <div className='space-y-3 max-w-2xl'>
              <div className='inline-flex items-center gap-2 rounded-full border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3.5 py-1 text-xs font-semibold text-neutral-800 dark:text-neutral-200'>
                <Layers className='h-3.5 w-3.5 text-blue-600 dark:text-blue-400' />
                <span>{t.badge}</span>
              </div>
              <h2 className='text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-neutral-900 dark:text-white leading-tight'>
                {t.heading}
              </h2>
              <p className='text-neutral-600 dark:text-neutral-400 text-base sm:text-lg leading-relaxed'>
                {t.subheading}
              </p>
            </div>

            {/* Role Filter Dropdown */}
            <div className='w-full sm:w-72 shrink-0'>
              <Dropdown<RoleFilter>
                options={t.roleFilterOptions}
                value={roleFilter}
                onChange={(val) => setRoleFilter(val)}
                label={t.filterLabel}
                size='md'
              />
            </div>
          </div>
        </AnimateOnScroll>
        </div>

        {/* Feature Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8'>
          {filteredModules.map((module, idx) => {
            const IconComp = module.icon
            return (
              <AnimateOnScroll
                key={module.id}
                variant='fade-up'
                delay={(idx % 3) * 100}
                className='h-full'
              >
                <div className='group relative rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-6 sm:p-7 hover:border-blue-600 dark:hover:border-blue-600 transition-all duration-300 flex flex-col justify-between shadow-xs hover:shadow-xl hover:-translate-y-1 h-full'>
                  <div className='space-y-4'>
                    {/* Top Bar: Icon & Badge */}
                    <div className='flex items-center justify-between gap-2'>
                      <div className='p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-blue-600 dark:text-blue-400 inline-flex group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200'>
                        <IconComp className='h-6 w-6' />
                      </div>
                      <span className='text-[11px] font-semibold px-3 py-1 rounded-md border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 whitespace-nowrap'>
                        {module.badge}
                      </span>
                    </div>

                    {/* Title & Tagline */}
                    <div>
                      <h3 className='text-xl font-bold text-neutral-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors'>
                        {module.title}
                      </h3>
                      <p className='text-xs font-semibold text-blue-600 dark:text-blue-400 mt-1'>{module.tagline}</p>
                    </div>

                    {/* Description */}
                    <p className='text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-normal'>{module.description}</p>

                    {/* Highlights List */}
                    <div className='pt-3 border-t border-neutral-200 dark:border-neutral-800 space-y-2'>
                      {module.highlights.map((h, i) => (
                        <div key={i} className='flex items-center gap-2.5 text-xs text-neutral-700 dark:text-neutral-300 font-medium'>
                          <CheckCircle2 className='h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0' />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bottom CTA Link */}
                  <div
                    onClick={openDemoModal}
                    className='mt-6 pt-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 cursor-pointer transition-colors'
                  >
                    <span className='flex items-center gap-1.5'>
                      <Sparkles className='h-3.5 w-3.5 text-blue-600 dark:text-blue-400' />
                      <span>{t.requestDemo}</span>
                    </span>
                    <ArrowRight className='h-4 w-4 group-hover:translate-x-1.5 transition-transform' />
                  </div>
                </div>
              </AnimateOnScroll>
            )
          })}
        </div>
      </div>
    </section>
  )
}
