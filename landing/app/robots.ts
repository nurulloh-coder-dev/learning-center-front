import type { MetadataRoute } from 'next'

// Statik eksport (output: 'export') uchun build vaqtida bir marta yoziladi.
export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://alia.uz'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Ilova sahifalari shu domenda — qidiruvga faqat landing chiqsin.
        disallow: ['/api/', '/login', '/admin', '/teacher', '/student', '/super-admin', '/developer', '/dashboard', '/attendance', '/payments', '/group-levels', '/leads', '/settings', '/f/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}
