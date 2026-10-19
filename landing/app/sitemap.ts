import type { MetadataRoute } from 'next'

// Statik eksport (output: 'export') uchun build vaqtida bir marta yoziladi.
export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://alia.uz'
  const currentDate = new Date()

  return [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 1.0,
      alternates: {
        languages: {
          uz: `${baseUrl}/?lang=uz`,
          ru: `${baseUrl}/?lang=ru`,
          en: `${baseUrl}/?lang=en`,
        },
      },
    },
  ]
}
