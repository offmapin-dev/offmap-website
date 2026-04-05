'use client'

import { useRef, useState, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, ChevronLeft, ChevronRight } from 'lucide-react'
import { REGION_THEMES, type RegionThemeKey } from '@/lib/constants'
import { EXPERIENCE_IMAGES, FALLBACK_IMAGE } from '@/lib/images'
import { PostageStamp, StampBadge, JournalNote } from '@/components/ui/scrapbook'
import { cn } from '@/lib/utils'

// ─── Types ────────────────────────────────────────────────────────────────────
export interface Experience {
  name: string
  type: string
  days: string
  price: string
  image?: string
  comingSoon?: boolean
}

interface RegionSectionProps {
  region: RegionThemeKey
  experiences: Experience[]
}

// ─── Hardcoded experiences per region (exported for slug page reuse) ──────────
export const REGION_EXPERIENCES: Record<RegionThemeKey, Experience[]> = {
  'himachal-pradesh': [
    { name: 'Bir–Barot Trek', type: 'Trekking', days: '4 days', price: '₹8,999' },
    { name: 'Rajgundha Valley', type: 'Camping', days: '3 days', price: '₹7,499' },
    { name: 'Shangarh–Raghupur Fort', type: 'Cultural', days: '2 days', price: '₹5,999' },
    { name: 'Barot Valley', type: 'Trekking', days: '4 days', price: '₹8,999' },
  ],
  rajasthan: [
    { name: 'Jawai Safari', type: 'Wildlife', days: '3 days', price: '₹11,999' },
    { name: 'Udaipur–Mount Abu', type: 'Cultural', days: '4 days', price: '₹10,999' },
    { name: 'Jaisalmer Dunes', type: 'Adventure', days: '3 days', price: '₹9,499' },
  ],
  kashmir: [
    { name: 'Coming Soon', type: 'Stay Tuned', days: '—', price: '—', comingSoon: true },
  ],
  uttarakhand: [
    { name: 'Kasar Devi–Khaliya Top', type: 'Trekking', days: '5 days', price: '₹12,999' },
    { name: 'Binsar Wildlife', type: 'Wildlife', days: '3 days', price: '₹8,499' },
  ],
}

// ─── Individual experience card ───────────────────────────────────────────────
function ExperienceCard({
  exp,
  theme,
  region,
}: {
  exp: Experience
  theme: (typeof REGION_THEMES)[RegionThemeKey]
  region: RegionThemeKey
}) {
  if (exp.comingSoon) {
    return (
      <div
        className="flex-shrink-0 w-64 md:w-72 rounded-2xl overflow-hidden bg-white shadow-[var(--shadow-card)] opacity-60"
        style={{ scrollSnapAlign: 'start' } as React.CSSProperties}
      >
        <div className="relative h-48 bg-gray-100 flex items-center justify-center">
          <span className="text-5xl opacity-20">🗺️</span>
          <div className="absolute top-3 left-3">
            <StampBadge text="Stay Tuned" color="#94A3B8" rotation={-3} />
          </div>
        </div>
        <div className="bg-white p-4">
          <p className="font-heading font-semibold text-dark text-base mb-3">
            {exp.name}
          </p>
          <JournalNote text="we're exploring this one 🗺️" type="sticky" />
        </div>
      </div>
    )
  }

  const imgSrc =
    exp.image ?? EXPERIENCE_IMAGES[exp.name] ?? FALLBACK_IMAGE

  return (
    <Link
      href={`/destinations/${region}`}
      style={{ scrollSnapAlign: 'start' } as React.CSSProperties}
      className={cn(
        'flex-shrink-0 w-64 md:w-72 rounded-2xl overflow-hidden bg-white',
        'shadow-[var(--shadow-card)]',
        'hover:-translate-y-1 hover:shadow-[var(--shadow-polaroid)]',
        'transition-all duration-200 cursor-pointer group block'
      )}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={imgSrc}
          alt={exp.name}
          fill
          sizes="(max-width: 768px) 256px, 288px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />

        {/* Type stamp badge */}
        <div className="absolute top-3 left-3">
          <StampBadge text={exp.type} color={theme.primary} rotation={-3} />
        </div>

        {/* Duration pill */}
        <div className="absolute top-3 right-3">
          <span className="bg-dark/60 text-white font-handwriting text-xs px-2 py-1 rounded-full">
            {exp.days}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white p-4">
        <p className="font-heading font-semibold text-dark text-base leading-snug">
          {exp.name}
        </p>
        <p className="font-handwriting text-gray-400 text-sm flex items-center gap-1 mt-1">
          <MapPin size={12} className="flex-none" />
          {REGION_THEMES[region].name}
        </p>

        <div className="flex items-center justify-between mt-3">
          <p
            style={{ color: theme.primary }}
            className="font-body text-sm font-bold"
          >
            From {exp.price}
          </p>
          <p
            style={{ color: theme.primary }}
            className="font-handwriting text-base"
          >
            View →
          </p>
        </div>
      </div>
    </Link>
  )
}

// ─── RegionSection ────────────────────────────────────────────────────────────
export function RegionSection({ region, experiences }: RegionSectionProps) {
  const theme = REGION_THEMES[region]
  const scrollRef = useRef<HTMLDivElement>(null)
  const [scrollPos, setScrollPos] = useState(0)

  const handleScroll = useCallback(() => {
    if (scrollRef.current) setScrollPos(scrollRef.current.scrollLeft)
  }, [])

  const scrollBy = (dir: 'left' | 'right') => {
    scrollRef.current?.scrollBy({
      left: dir === 'left' ? -288 : 288,
      behavior: 'smooth',
    })
  }

  const isAtStart = scrollPos <= 8
  const isAtEnd = scrollRef.current
    ? scrollPos >= scrollRef.current.scrollWidth - scrollRef.current.clientWidth - 8
    : false

  return (
    <div className="mb-16 last:mb-0">
      {/* ── Region Header Bar ── */}
      <div
        style={{ backgroundColor: theme.bg }}
        className="px-6 py-8 rounded-2xl mb-6 flex items-center justify-between flex-wrap gap-4"
      >
        <div className="flex items-center gap-4">
          <span className="text-6xl leading-none" role="img" aria-label={theme.name}>
            {theme.emoji}
          </span>
          <div>
            <h2
              style={{ color: theme.primary }}
              className="font-display font-black text-4xl leading-none"
            >
              {theme.name}
            </h2>
            <p className="font-handwriting text-lg mt-1" style={{ color: theme.primary }}>
              {theme.label}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <PostageStamp region={region} />
          <Link
            href={`/destinations/${region}`}
            style={{ color: theme.primary }}
            className="font-handwriting text-lg hover:underline whitespace-nowrap"
          >
            Explore All →
          </Link>
        </div>
      </div>

      {/* ── Scrollable Cards ── */}
      <div className="relative">
        {/* Left arrow */}
        {!isAtStart && (
          <button
            onClick={() => scrollBy('left')}
            className="absolute left-0 top-[96px] -translate-x-4 z-10 w-10 h-10 rounded-full bg-white shadow-[var(--shadow-card)] flex items-center justify-center hover:shadow-[var(--shadow-polaroid)] transition-shadow duration-200"
            aria-label="Scroll left"
          >
            <ChevronLeft size={18} className="text-dark" />
          </button>
        )}

        {/* Right arrow */}
        {!isAtEnd && experiences.length > 2 && (
          <button
            onClick={() => scrollBy('right')}
            className="absolute right-0 top-[96px] translate-x-4 z-10 w-10 h-10 rounded-full bg-white shadow-[var(--shadow-card)] flex items-center justify-center hover:shadow-[var(--shadow-polaroid)] transition-shadow duration-200"
            aria-label="Scroll right"
          >
            <ChevronRight size={18} className="text-dark" />
          </button>
        )}

        {/* Cards track */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-4 overflow-x-auto pb-4"
          style={
            {
              scrollSnapType: 'x mandatory',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            } as React.CSSProperties
          }
        >
          {experiences.map((exp) => (
            <ExperienceCard
              key={exp.name}
              exp={exp}
              theme={theme}
              region={region}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
