'use client'

import React, { useState } from 'react'
import { Menu, X, ArrowRight, LogIn } from 'lucide-react'
import { useDemoModal } from '@/context/DemoModalContext'
import { useLanguage } from '@/context/LanguageContext'
import { TRANSLATIONS } from '@/data/translations'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { LanguageSelector } from '@/components/ui/LanguageSelector'

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { openDemoModal } = useDemoModal()
  const { language } = useLanguage()
  const t = TRANSLATIONS[language].nav

  return (
    <header className='fixed top-0 left-0 right-0 z-50 border-b border-neutral-200 dark:border-neutral-800 bg-white/90 dark:bg-black/90 backdrop-blur-md transition-colors duration-200'>
      <nav className='mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 py-3.5'>
        {/* Brand Logo - NO graphic logo image per prompt instructions */}
        <a href='#' className='flex items-center gap-3 group shrink-0'>
          <span className='text-xl font-black tracking-wider text-black dark:text-white uppercase group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors'>
            A.L.I.A
          </span>
          <span className='hidden sm:inline-block rounded-full bg-blue-50 dark:bg-blue-950/80 px-2.5 py-0.5 text-[10px] font-bold text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900 tracking-wider uppercase'>
            ERP &amp; CRM
          </span>
        </a>

        {/* Desktop Nav Links */}
        <div className='hidden lg:flex items-center gap-1 xl:gap-2 text-xs xl:text-sm font-semibold text-neutral-600 dark:text-neutral-400'>
          <a
            href='#comparison'
            className='px-3 py-1.5 rounded-md hover:text-blue-600 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-all whitespace-nowrap'
          >
            {t.whyUs}
          </a>
          <a
            href='#features'
            className='px-3 py-1.5 rounded-md hover:text-blue-600 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-all whitespace-nowrap'
          >
            {t.modules}
          </a>
          <a
            href='#tour'
            className='px-3 py-1.5 rounded-md hover:text-blue-600 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-all whitespace-nowrap'
          >
            {t.tour}
          </a>
          <a
            href='#team'
            className='px-3 py-1.5 rounded-md hover:text-blue-600 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-all whitespace-nowrap'
          >
            {t.team}
          </a>
          <a
            href='#faq'
            className='px-3 py-1.5 rounded-md hover:text-blue-600 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-all whitespace-nowrap'
          >
            {t.faq}
          </a>
        </div>

        {/* Desktop Controls & Minimal Blue Action Button */}
        <div className='hidden lg:flex items-center gap-3 shrink-0'>
          <LanguageSelector />
          <ThemeToggle />

          <div className='h-4 w-[1px] bg-neutral-200 dark:bg-neutral-800 mx-1' />

          <button
            onClick={openDemoModal}
            className='flex items-center gap-1.5 text-xs xl:text-sm font-semibold text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors cursor-pointer px-3 py-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-900 whitespace-nowrap'
          >
            <LogIn className='h-3.5 w-3.5 text-neutral-500 dark:text-neutral-400' />
            <span>{t.login}</span>
          </button>

          <button
            onClick={openDemoModal}
            className='inline-flex items-center gap-2 rounded-md bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 px-4 xl:px-5 py-2 xl:py-2.5 text-xs xl:text-sm font-semibold text-white transition-all active:scale-95 cursor-pointer whitespace-nowrap shadow-xs'
          >
            <span>{t.bookDemo}</span>
            <ArrowRight className='h-3.5 w-3.5' />
          </button>
        </div>

        {/* Mobile Controls */}
        <div className='flex items-center gap-2 lg:hidden shrink-0'>
          <LanguageSelector />
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className='text-neutral-800 dark:text-neutral-200 p-2 rounded-md bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 cursor-pointer transition-colors active:scale-95'
            aria-label='Toggle Menu'
          >
            {mobileMenuOpen ? <X className='h-5 w-5' /> : <Menu className='h-5 w-5' />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className='lg:hidden border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black px-6 py-6 space-y-3 animate-in slide-in-from-top-2 duration-200 shadow-xl'>
          <a
            href='#comparison'
            onClick={() => setMobileMenuOpen(false)}
            className='block px-3 py-2 text-base font-semibold text-neutral-800 dark:text-neutral-200 hover:text-blue-600 dark:hover:text-blue-400 rounded-md transition-colors'
          >
            {t.whyUs}
          </a>
          <a
            href='#features'
            onClick={() => setMobileMenuOpen(false)}
            className='block px-3 py-2 text-base font-semibold text-neutral-800 dark:text-neutral-200 hover:text-blue-600 dark:hover:text-blue-400 rounded-md transition-colors'
          >
            {t.modules}
          </a>
          <a
            href='#tour'
            onClick={() => setMobileMenuOpen(false)}
            className='block px-3 py-2 text-base font-semibold text-neutral-800 dark:text-neutral-200 hover:text-blue-600 dark:hover:text-blue-400 rounded-md transition-colors'
          >
            {t.tour}
          </a>
          <a
            href='#team'
            onClick={() => setMobileMenuOpen(false)}
            className='block px-3 py-2 text-base font-semibold text-neutral-800 dark:text-neutral-200 hover:text-blue-600 dark:hover:text-blue-400 rounded-md transition-colors'
          >
            {t.team}
          </a>
          <a
            href='#faq'
            onClick={() => setMobileMenuOpen(false)}
            className='block px-3 py-2 text-base font-semibold text-neutral-800 dark:text-neutral-200 hover:text-blue-600 dark:hover:text-blue-400 rounded-md transition-colors'
          >
            {t.faq}
          </a>
          <div className='pt-4 border-t border-neutral-200 dark:border-neutral-800 flex flex-col gap-3'>
            <button
              onClick={() => {
                setMobileMenuOpen(false)
                openDemoModal()
              }}
              className='w-full rounded-md border border-neutral-300 dark:border-neutral-800 py-3 text-center text-sm font-semibold text-neutral-900 dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-all cursor-pointer whitespace-nowrap'
            >
              {t.login}
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false)
                openDemoModal()
              }}
              className='w-full rounded-md bg-blue-600 hover:bg-blue-700 py-3 text-center text-sm font-semibold text-white transition-all cursor-pointer whitespace-nowrap flex items-center justify-center gap-2'
            >
              <span>{t.bookDemo}</span>
              <ArrowRight className='h-4 w-4' />
            </button>
          </div>
        </div>
      )}
    </header>
  )
}
