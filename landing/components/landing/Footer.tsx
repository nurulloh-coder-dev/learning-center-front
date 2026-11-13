'use client'

import React from 'react'
import Image from 'next/image'
import { ShieldCheck, MessageSquare } from 'lucide-react'
import { useDemoModal } from '@/context/DemoModalContext'
import { useLanguage } from '@/context/LanguageContext'
import { TRANSLATIONS } from '@/data/translations'

export function Footer() {
  const { openDemoModal } = useDemoModal()
  const { language } = useLanguage()
  const t = TRANSLATIONS[language].footer
  const navT = TRANSLATIONS[language].nav

  return (
    <footer className='border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-black py-16 text-neutral-600 dark:text-neutral-400 text-sm transition-colors duration-200'>
      <div className='mx-auto max-w-7xl px-6 grid grid-cols-1 md:grid-cols-5 gap-10'>
        {/* Brand Col - NO graphic logo image per prompt instructions ("DO NOT PUT LOGO. I'LL PUT IT") */}
        <div className='md:col-span-2 space-y-4'>
          <div className='flex items-center gap-2.5'>
            <Image src='/logo.png' alt='' width={28} height={28} className='h-7 w-7' />
            <span className='text-xl font-black text-neutral-900 dark:text-white tracking-wider uppercase'>A.L.I.A</span>
          </div>

          <p className='text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-sm font-normal'>
            {t.brandDesc}
          </p>

          <div className='flex items-center gap-2 pt-1 text-xs text-neutral-500 font-semibold'>
            <ShieldCheck className='h-4 w-4 text-blue-600 dark:text-blue-400' />
            <span>{t.security}</span>
          </div>
        </div>

        {/* Product Links */}
        <div className='space-y-3'>
          <div className='text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white'>{t.modulesTitle}</div>
          <ul className='space-y-2 text-xs font-medium'>
            <li><a href='#features' className='hover:text-blue-600 dark:hover:text-white transition-colors'>{navT.modules}</a></li>
            <li><a href='#features' className='hover:text-blue-600 dark:hover:text-white transition-colors'>{navT.tour}</a></li>
            <li><a href='#faq' className='hover:text-blue-600 dark:hover:text-white transition-colors'>{navT.faq}</a></li>
          </ul>
        </div>

        {/* Solutions */}
        <div className='space-y-3'>
          <div className='text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white'>{t.solutionsTitle}</div>
          <ul className='space-y-2 text-xs font-medium'>
            {t.solutions.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className='space-y-3'>
          <div className='text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white'>{t.contactTitle}</div>
          <p className='text-xs text-neutral-600 dark:text-neutral-400 font-normal'>{t.contactSub}</p>
          <button
            onClick={openDemoModal}
            className='inline-flex items-center gap-2 rounded-md bg-blue-600 hover:bg-blue-700 px-3.5 py-2 text-xs font-semibold text-white transition-all cursor-pointer shadow-xs'
          >
            <MessageSquare className='h-3.5 w-3.5' /> {t.contactBtn}
          </button>
        </div>
      </div>

      <div className='mx-auto max-w-7xl px-6 pt-12 mt-12 border-t border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 font-medium gap-4'>
        <div>© {new Date().getFullYear()} A.L.I.A. {t.allRightsReserved}</div>
      </div>
    </footer>
  )
}
