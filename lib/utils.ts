import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { REGION_THEMES, type RegionThemeKey } from '@/lib/constants'

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date))
}

interface LocationAccent {
  primary: string
  light: string
  bg: string
  tailwind: {
    primary: string
    light: string
    bg: string
  }
}

const LOCATION_ACCENTS: Record<string, LocationAccent> = {
  'himachal-pradesh': {
    primary: '#1B4FD8',
    light: '#93C5FD',
    bg: '#EFF6FF',
    tailwind: {
      primary: 'himachal-primary',
      light: 'himachal-light',
      bg: 'himachal-bg',
    },
  },
  rajasthan: {
    primary: '#F59E0B',
    light: '#FCD34D',
    bg: '#FFFBEB',
    tailwind: {
      primary: 'rajasthan-primary',
      light: 'rajasthan-light',
      bg: 'rajasthan-bg',
    },
  },
}

const DEFAULT_ACCENT: LocationAccent = LOCATION_ACCENTS['himachal-pradesh']

export function getLocationAccent(slug: string): LocationAccent {
  return LOCATION_ACCENTS[slug] ?? DEFAULT_ACCENT
}

export function getRegionTheme(slug: string) {
  return REGION_THEMES[slug as RegionThemeKey] ?? REGION_THEMES['himachal-pradesh']
}
