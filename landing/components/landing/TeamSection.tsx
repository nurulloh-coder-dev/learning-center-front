'use client'

import React from 'react'
import Image from 'next/image'
import { BadgeCheck, Users } from 'lucide-react'
import { FaGithub, FaLinkedinIn } from 'react-icons/fa6'
import { useLanguage } from '@/context/LanguageContext'
import { TRANSLATIONS } from '@/data/translations'
import { AnimateOnScroll } from '@/components/ui/AnimateOnScroll'

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}

export function TeamSection() {
  const { language } = useLanguage()
  const t = TRANSLATIONS[language].team

  return (
    <section
      id='team'
      className='relative overflow-hidden bg-white dark:bg-black py-24 transition-colors duration-200 sm:py-28 scroll-mt-28 sm:scroll-mt-32 border-b border-neutral-200 dark:border-neutral-800'
    >
      <div className='relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <AnimateOnScroll variant='fade-up' delay={0}>
          <div className='mx-auto mb-14 max-w-3xl space-y-4 text-center sm:mb-16'>
            <div className='inline-flex items-center gap-2 rounded-full border border-neutral-300 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 px-4 py-1.5 text-xs font-bold text-neutral-800 dark:text-neutral-200'>
              <Users className='h-3.5 w-3.5 text-blue-600 dark:text-blue-400' aria-hidden='true' />
              <span>{t.badge}</span>
            </div>
            <h2 className='text-3xl font-black leading-tight tracking-tight text-neutral-900 dark:text-white sm:text-4xl lg:text-5xl'>
              {t.heading}
            </h2>
            <p className='text-base leading-relaxed text-neutral-600 dark:text-neutral-400 sm:text-lg'>
              {t.subheading}
            </p>
          </div>
        </AnimateOnScroll>

        <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          {t.members.map((member, idx) => (
            <AnimateOnScroll
              key={member.id}
              variant='fade-up'
              delay={idx * 150}
              className='h-full'
            >
              <article
                className='group relative flex min-h-[28rem] flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white p-2 shadow-xs transition-all duration-300 hover:border-blue-600 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:border-blue-600 hover:shadow-xl hover:-translate-y-1 h-full'
              >
                <div className='relative h-64 overflow-hidden rounded-xl bg-neutral-900 sm:h-72'>
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
                    className='object-cover object-center opacity-90 transition duration-500 group-hover:scale-105 group-hover:opacity-100'
                  />
                  <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent' />

                  <div
                    className='absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-md bg-blue-600 font-mono text-xs font-bold text-white shadow-md'
                    aria-hidden='true'
                  >
                    {getInitials(member.name)}
                  </div>

                  <div className='absolute inset-x-4 bottom-4'>
                    <p className='text-xs font-bold uppercase tracking-wider text-blue-400'>
                      {member.role}
                    </p>
                  </div>
                </div>

                <div className='relative flex flex-1 flex-col px-4 pb-4 pt-4'>
                  <h3 className='flex items-center gap-1.5 text-lg font-black leading-tight text-neutral-900 dark:text-white'>
                    {member.name}
                    <BadgeCheck
                      className='h-4.5 w-4.5 shrink-0 text-blue-600 dark:text-blue-400'
                      aria-label={`${member.name} is a verified team member`}
                    />
                  </h3>

                  <div className='mt-auto flex items-center justify-between border-t border-neutral-100 pt-4 dark:border-neutral-800'>
                    <span className='inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400'>
                      <span className='inline-flex h-1.5 w-1.5 rounded-full bg-blue-600' />
                      Active
                    </span>
                    <div className='flex items-center gap-2'>
                      {member.github && (
                        <a
                          href={member.github}
                          target='_blank'
                          rel='noopener noreferrer'
                          aria-label={`${member.name}'s GitHub`}
                          className='flex h-8 w-8 items-center justify-center rounded-md border border-neutral-200 bg-neutral-50 text-neutral-600 transition-all hover:bg-blue-600 hover:text-white dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:bg-blue-600 dark:hover:text-white active:scale-95'
                        >
                          <FaGithub className='h-3.5 w-3.5' aria-hidden='true' />
                        </a>
                      )}
                      {member.linkedin && (
                        <a
                          href={member.linkedin}
                          target='_blank'
                          rel='noopener noreferrer'
                          aria-label={`${member.name}'s LinkedIn`}
                          className='flex h-8 w-8 items-center justify-center rounded-md border border-neutral-200 bg-neutral-50 text-neutral-600 transition-all hover:bg-blue-600 hover:text-white dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:bg-blue-600 dark:hover:text-white active:scale-95'
                        >
                          <FaLinkedinIn className='h-3.5 w-3.5' aria-hidden='true' />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  )
}
