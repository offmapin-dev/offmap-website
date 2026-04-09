import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://offmap.in'

  const staticRoutes = [
    '',
    '/destinations',
    '/experiences',
    '/stays',
    '/blogs',
    '/contact',
    '/about',
    '/faq',
    '/student-program',
    '/work-with-us',
  ]

  return staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1.0 : 0.8,
  }))
}
