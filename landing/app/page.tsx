import { DemoModalProvider } from '@/context/DemoModalContext'
import { Navbar } from '@/components/landing/Navbar'
import { HeroSection } from '@/components/landing/HeroSection'
import { ComparisonSection } from '@/components/landing/ComparisonSection'
import { FeatureModulesSection } from '@/components/landing/FeatureModulesSection'
import { PlatformTourSection } from '@/components/landing/PlatformTourSection'
import { TeamSection } from '@/components/landing/TeamSection'
import { PricingSection } from '@/components/landing/PricingSection'
import { FaqSection } from '@/components/landing/FaqSection'
import { CtaSection } from '@/components/landing/CtaSection'
import { Footer } from '@/components/landing/Footer'
import { DemoModal } from '@/components/landing/DemoModal'
import { TRANSLATIONS } from '@/data/translations'

export default function Home() {
  // Google uchun tuzilgan ma'lumot. Faqat haqiqat: ilgari bu yerda soxta
  // reyting (4.9, 350 ta baho) va narxlar bor edi — Google buning uchun
  // saytni jazolashi mumkin.
  const faqs = TRANSLATIONS.uz.faq.faqs

  const jsonLdSoftwareApp = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'A.L.I.A - Academic Lead & Intelligence Assistant',
    operatingSystem: 'Web',
    applicationCategory: 'BusinessApplication',
    description:
      "O'quv markazlari uchun boshqaruv tizimi: lidlar, o'quvchilar, guruhlar, davomat va to'lovlar bir joyda.",
    url: 'https://alia.uz',
  }

  const jsonLdOrganization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'A.L.I.A',
    url: 'https://alia.uz',
    description: "O'quv markazlari uchun boshqaruv tizimi.",
  }

  const jsonLdFaq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  }

  return (
    <DemoModalProvider>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSoftwareApp) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrganization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
      />
      <div className='min-h-screen bg-white dark:bg-black text-neutral-900 dark:text-neutral-100 font-sans selection:bg-blue-600 selection:text-white relative overflow-x-hidden transition-colors duration-200'>
        <Navbar />
        <main>
          <HeroSection />
          <ComparisonSection />
          <FeatureModulesSection />
          <PlatformTourSection />
          <TeamSection />
          <PricingSection />
          <FaqSection />
          <CtaSection />
        </main>
        <Footer />
        <DemoModal />
      </div>
    </DemoModalProvider>
  )
}
