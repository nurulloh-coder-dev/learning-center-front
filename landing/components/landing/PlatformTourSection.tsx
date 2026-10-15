'use client'

import React, { useState } from 'react'
import { BarChart3, ArrowRight, Sparkles } from 'lucide-react'
import { useDemoModal } from '@/context/DemoModalContext'
import { useLanguage } from '@/context/LanguageContext'
import { TRANSLATIONS } from '@/data/translations'
import { AnimateOnScroll } from '@/components/ui/AnimateOnScroll'
import { TourMockup } from './TourMockups'

export function PlatformTourSection() {
  const [activeTourTab, setActiveTourTab] = useState('crm')
  const { openDemoModal } = useDemoModal()
  const { language } = useLanguage()
  const t = TRANSLATIONS[language].tour

  const currentTourData = t.tabs.find((tab) => tab.id === activeTourTab) || t.tabs[0]

  return (
    <section id='tour' className='py-24 relative overflow-hidden bg-white dark:bg-black text-neutral-900 dark:text-neutral-100 transition-colors duration-200'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10'>
        {/* Header */}
        <AnimateOnScroll variant='fade-up' delay={0}>
          <div className='text-center max-w-3xl mx-auto mb-14 space-y-4'>
            <div className='inline-flex items-center gap-2 rounded-full border border-neutral-300 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 px-3.5 py-1 text-xs font-semibold text-neutral-800 dark:text-neutral-200'>
              <BarChart3 className='h-3.5 w-3.5 text-blue-600 dark:text-blue-400' />
              <span>{t.badge}</span>
            </div>
            <h2 className='text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-neutral-900 dark:text-white leading-tight'>
              {t.heading}
            </h2>
            <p className='text-neutral-600 dark:text-neutral-400 text-base sm:text-lg leading-relaxed'>
              {t.subheading}
            </p>
          </div>
        </AnimateOnScroll>

        {/* Tab Selector Buttons */}
        <AnimateOnScroll variant='fade-up' delay={100}>
          <div className='flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 mb-10'>
            {t.tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTourTab(tab.id)}
                className={`rounded-md px-5 py-2.5 text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
                  activeTourTab === tab.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </AnimateOnScroll>

        {/* Active Workflow Card */}
        <AnimateOnScroll variant='zoom-in' delay={200}>
          <div className='rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-6 sm:p-10 shadow-xl relative overflow-hidden transition-all duration-300'>
            <div className='grid grid-cols-1 lg:grid-cols-12 gap-8 items-center'>

              {/* Left Column: Workflow Info */}
              <div className='lg:col-span-5 space-y-6'>
                <span className='inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-3 py-1 rounded-md border border-blue-200 dark:border-blue-900'>
                  <Sparkles className='h-3 w-3 text-blue-600 dark:text-blue-400' />
                  <span>{currentTourData.label}</span>
                </span>

                <h3 className='text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white leading-tight'>
                  {currentTourData.title}
                </h3>

                <p className='text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed font-normal'>
                  {currentTourData.desc}
                </p>

                {/* Metrics Grid */}
                <div className='grid grid-cols-3 gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-800'>
                  {currentTourData.metrics.map((m, idx) => (
                    <div key={idx} className='bg-neutral-50 dark:bg-neutral-900 p-3 sm:p-3.5 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:border-blue-500/50 transition-colors'>
                      <div className='text-[10px] text-neutral-500 dark:text-neutral-400 font-semibold truncate'>{m.label}</div>
                      <div className='text-sm sm:text-base font-black text-neutral-900 dark:text-white mt-1'>{m.val}</div>
                      <div className='text-[10px] text-blue-600 dark:text-blue-400 font-bold mt-0.5'>{m.trend}</div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={openDemoModal}
                  className='inline-flex items-center gap-2.5 rounded-md bg-blue-600 hover:bg-blue-700 px-6 py-3.5 text-sm font-semibold text-white transition-all cursor-pointer shadow-xs active:scale-95 group'
                >
                  <span>{t.seeDemoBtn}</span>
                  <ArrowRight className='h-4 w-4 group-hover:translate-x-1 transition-transform' />
                </button>
              </div>

              {/* Right Column: Graphical Live Interface Mockup */}
              <div className='lg:col-span-7 bg-neutral-900 dark:bg-black text-white rounded-xl border border-neutral-800 p-5 sm:p-6 space-y-4 shadow-2xl relative overflow-hidden transition-all duration-300'>
                <div className='flex items-center justify-between border-b border-neutral-800 pb-3.5'>
                  <div className='flex items-center gap-2 text-xs font-mono text-neutral-400'>
                    <div className='h-2.5 w-2.5 rounded-full bg-blue-500' />
                    <span>{t.liveInterface}: {currentTourData.label}</span>
                  </div>
                  <span className='text-[10px] font-bold bg-blue-950 text-blue-400 border border-blue-900 px-2.5 py-0.5 rounded-md uppercase'>
                    {t.synced}
                  </span>
                </div>

                <TourMockup tab={activeTourTab} mock={t.mock} />
              </div>

            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  )
}
