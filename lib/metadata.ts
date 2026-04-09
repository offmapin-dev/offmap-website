import type { Metadata } from 'next'

const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://offmap.in'

export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'OffMap India — Travel Slow, Go OffMap',
    template: '%s | OffMap India',
  },
  description: 'Curated slow travel experiences across Himachal Pradesh, Rajasthan, Kashmir and Uttarakhand. Group trips, stays, day experiences, and school programs.',
  keywords: [
    'slow travel India',
    'offbeat India travel',
    'Himachal Pradesh trips',
    'Rajasthan travel experiences',
    'group trips India',
    'adventure travel India',
    'OffMap India',
  ],
  authors: [{ name: 'OffMap India' }],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: siteUrl,
    siteName: 'OffMap India',
    title: 'OffMap India — Travel Slow, Go OffMap',
    description: 'Curated slow travel experiences across Himachal Pradesh, Rajasthan, Kashmir and Uttarakhand.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OffMap India',
    description: 'Curated slow travel experiences across India.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export function createPageMetadata(overrides: Partial<Metadata>): Metadata {
  return {
    ...defaultMetadata,
    ...overrides,
  }
}
