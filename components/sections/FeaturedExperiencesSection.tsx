'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight, Clock, MapPin, Calendar } from 'lucide-react'
import { gsap } from 'gsap'
import { REGION_THEMES, type RegionThemeKey } from '@/lib/constants'
import { registerGSAP } from '@/lib/animations'
import { StackedTripCard, type TripCardData } from '@/components/ui/StackedTripCard'
import { JournalNote } from '@/components/ui/scrapbook'
import { cn } from '@/lib/utils'

// ── Dynamic month/date generation ─────────────────────────────────
const now = new Date()
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function getMonthData(offset: number) {
  const d = new Date(now.getFullYear(), now.getMonth() + offset, 1)
  return { month: d.getMonth(), year: d.getFullYear(), name: MONTH_NAMES[d.getMonth()] }
}

const m0 = getMonthData(0)
const m1 = getMonthData(1)
const m2 = getMonthData(2)

const MONTHS = Array.from({ length: 6 }, (_, i) => {
  const d = new Date(now.getFullYear(), now.getMonth() + i, 1)
  return {
    label: d.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' }).toUpperCase(),
    value: d.getMonth(),
    year: d.getFullYear(),
  }
})

// ── Trips data ────────────────────────────────────────────────────
const FEATURED_TRIPS: TripCardData[] = [
  {
    name: 'Shangarh & Shoja',
    subtitle: 'Hidden Himalayan Meadow',
    region: 'Himachal Pradesh',
    regionSlug: 'himachal-pradesh',
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600&q=80',
    month: m0.month,
    year: m0.year,
    date: `15 ${m0.name}`,
    duration: '3N/4D',
    departure: 'Delhi to Delhi',
    originalPrice: '\u20B99,999/-',
    price: '\u20B98,999/- Onwards',
    badge: 'Popular',
    slug: 'shangarh-raghupur-fort',
  },
  {
    name: 'Bir Billing',
    subtitle: 'Fly High This Weekend',
    region: 'Himachal Pradesh',
    regionSlug: 'himachal-pradesh',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',
    month: m0.month,
    year: m0.year,
    date: `22 ${m0.name}`,
    duration: '2N/3D',
    departure: 'Delhi to Delhi',
    originalPrice: '\u20B97,499/-',
    price: '\u20B96,999/- Onwards',
    badge: 'Just Added',
    slug: 'bir-barot',
  },
  {
    name: 'Jawai Safari',
    subtitle: 'Land of Leopards',
    region: 'Rajasthan',
    regionSlug: 'rajasthan',
    image: 'https://images.unsplash.com/photo-1549366021-9f761d450615?w=600&q=80',
    month: m1.month,
    year: m1.year,
    date: `1 ${m1.name}`,
    duration: '3N/4D',
    departure: 'Delhi to Delhi',
    originalPrice: '\u20B912,999/-',
    price: '\u20B911,999/- Onwards',
    badge: 'Limited Seats',
    slug: 'jawai',
  },
  {
    name: 'Udaipur & Mount Abu',
    subtitle: 'Lakes & Desert Trails',
    region: 'Rajasthan',
    regionSlug: 'rajasthan',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600&q=80',
    month: m1.month,
    year: m1.year,
    date: `8 ${m1.name}`,
    duration: '4N/5D',
    departure: 'Delhi to Delhi',
    originalPrice: '\u20B913,999/-',
    price: '\u20B911,999/- Onwards',
    slug: 'jawai',
  },
  {
    name: 'Kasar Devi',
    subtitle: 'The Quiet Hills',
    region: 'Uttarakhand',
    regionSlug: 'uttarakhand',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&q=80',
    month: m2.month,
    year: m2.year,
    date: `15 ${m2.name}`,
    duration: '4N/5D',
    departure: 'Delhi to Delhi',
    originalPrice: '\u20B913,999/-',
    price: '\u20B912,999/- Onwards',
    slug: 'kasar-devi-khaliya-top',
  },
  {
    name: 'Rajgundha Valley',
    subtitle: 'Valley Above the World',
    region: 'Himachal Pradesh',
    regionSlug: 'himachal-pradesh',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&q=80',
    month: m2.month,
    year: m2.year,
    date: `20 ${m2.name}`,
    duration: '3N/4D',
    departure: 'Delhi to Delhi',
    originalPrice: '\u20B98,999/-',
    price: '\u20B97,999/- Onwards',
    badge: 'New',
    slug: 'rajgundha-valley',
  },
]

// ── Stacked card pairs for mobile ─────────────────────────────────
const PAIRS: [TripCardData, TripCardData][] = [
  [FEATURED_TRIPS[0], FEATURED_TRIPS[1]],
  [FEATURED_TRIPS[2], FEATURED_TRIPS[3]],
  [FEATURED_TRIPS[4], FEATURED_TRIPS[5]],
]

// ── Desktop: horizontal scroll trip card ──────────────────────────
function TripScrollCard({ trip }: { trip: TripCardData }) {
  return (
    <Link
      href={`/experiences/${trip.slug}`}
      className={cn(
        'flex-shrink-0 w-[280px] md:w-[320px] rounded-2xl overflow-hidden group block',
        'shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-polaroid)]',
        'hover:-translate-y-1 transition-all duration-300',
      )}
      style={{ scrollSnapAlign: 'start' } as React.CSSProperties}
    >
      {/* Image area */}
      <div className="relative h-56 md:h-64 overflow-hidden">
        <Image
          src={trip.image}
          alt={trip.name}
          fill
          sizes="(max-width: 768px) 280px, 320px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Price badge */}
        <div className="absolute top-3 left-3 bg-[#FFE927] rounded-full px-3 py-1.5 flex items-center gap-2">
          <span className="text-gray-500 text-xs line-through">{trip.originalPrice}</span>
          <span className="font-heading font-bold text-sm text-[#0D78A8]">{trip.price}</span>
        </div>
      </div>

      {/* Content area */}
      <div className="bg-white p-4">
        <h3 className="font-heading font-bold text-base text-dark leading-tight line-clamp-2 mb-3">
          {trip.name}
        </h3>

        {/* Info row 1 */}
        <div className="flex gap-4">
          <span className="flex items-center gap-1">
            <Clock size={14} className="text-[#39A2B8] flex-shrink-0" />
            <span className="font-heading text-xs text-gray-500">{trip.duration}</span>
          </span>
          <span className="flex items-center gap-1 min-w-0">
            <MapPin size={14} className="text-[#39A2B8] flex-shrink-0" />
            <span className="font-heading text-xs text-gray-500 truncate max-w-[120px]">
              {trip.departure}
            </span>
          </span>
        </div>

        {/* Info row 2 */}
        <div className="flex gap-4 mt-1">
          <span className="flex items-center gap-1">
            <Calendar size={14} className="text-[#39A2B8] flex-shrink-0" />
            <span className="font-heading text-xs text-gray-500">{trip.date}</span>
          </span>
        </div>
      </div>
    </Link>
  )
}

// ── Main section ──────────────────────────────────────────────────
export function FeaturedExperiencesSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [activeMonth, setActiveMonth] = useState(0)

  // Mobile stacked card state
  const [mobileIndex, setMobileIndex] = useState(0)
  const mobileCarouselRef = useRef<HTMLDivElement>(null)
  const mobileAnimatingRef = useRef(false)
  const touchStartRef = useRef(0)

  const filteredTrips = FEATURED_TRIPS.filter(
    (t) => t.month === MONTHS[activeMonth].value && t.year === MONTHS[activeMonth].year,
  )

  const mobileGoTo = useCallback((index: number) => {
    if (mobileAnimatingRef.current || index === mobileIndex) return
    const clamped = ((index % PAIRS.length) + PAIRS.length) % PAIRS.length
    setMobileIndex(clamped)
  }, [mobileIndex])

  const mobileGoNext = useCallback(() => {
    mobileGoTo((mobileIndex + 1) % PAIRS.length)
  }, [mobileIndex, mobileGoTo])

  const mobileGoPrev = useCallback(() => {
    mobileGoTo((mobileIndex - 1 + PAIRS.length) % PAIRS.length)
  }, [mobileIndex, mobileGoTo])

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartRef.current = e.touches[0].clientX
  }, [])

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const diff = touchStartRef.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) {
      if (diff > 0) mobileGoNext()
      else mobileGoPrev()
    }
  }, [mobileGoNext, mobileGoPrev])

  // Mobile carousel GSAP fade
  useEffect(() => {
    if (!mobileCarouselRef.current) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    mobileAnimatingRef.current = true
    gsap.fromTo(
      mobileCarouselRef.current,
      { opacity: 0, x: 30 },
      {
        opacity: 1,
        x: 0,
        duration: 0.5,
        ease: 'power2.out',
        onComplete: () => { mobileAnimatingRef.current = false },
      },
    )
  }, [mobileIndex])

  // Section entry animation
  useEffect(() => {
    registerGSAP()
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const ctx = gsap.context(() => {
      if (sectionRef.current) {
        gsap.from(sectionRef.current, {
          y: 40,
          opacity: 0,
          duration: 0.7,
          ease: 'power2.out',
          immediateRender: false,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            once: true,
          },
        })
      }
    })

    return () => ctx.revert()
  }, [])

  const mobilePair = PAIRS[mobileIndex]
  const mobileRegionColor =
    REGION_THEMES[mobilePair[0].regionSlug as RegionThemeKey]?.primary ?? '#0D78A8'

  return (
    <section ref={sectionRef} className="bg-white py-10 md:py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* ── Section heading (both layouts) ───────────────────────── */}
        <div className="flex items-start justify-between mb-8 md:mb-10">
          <div>
            <h2 className="font-display font-black text-3xl md:text-4xl text-[#0D78A8]">
              Upcoming Trips
            </h2>
            <p className="font-handwriting text-gray-400 text-xl mt-2">
              routes we&apos;ve fallen in love with
            </p>
          </div>
          <Link
            href="/experiences"
            className="hidden md:flex items-center gap-1 font-handwriting font-bold text-[#0D78A8] text-lg hover:underline"
          >
            View All
            <ChevronRight size={18} />
          </Link>
        </div>

        {/* ══════════════════════════════════════════════════════════ */}
        {/* DESKTOP: WanderOn-style month tabs + horizontal scroll   */}
        {/* ══════════════════════════════════════════════════════════ */}
        <div className="hidden md:block">
          {/* Month filter tabs */}
          <div className="flex gap-3 pb-2 mb-8 overflow-x-auto scrollbar-none">
            {MONTHS.map((m, i) => (
              <button
                key={m.label}
                onClick={() => setActiveMonth(i)}
                className={cn(
                  'flex-shrink-0 rounded-full px-5 py-2 border-2 font-heading font-medium text-sm transition-all duration-200',
                  i === activeMonth
                    ? 'bg-[#0D78A8] border-[#0D78A8] text-white'
                    : 'bg-white border-gray-200 text-gray-500 hover:border-[#0D78A8] hover:text-[#0D78A8]',
                )}
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* Horizontal scroll cards */}
          {filteredTrips.length > 0 ? (
            <div
              className="flex gap-4 overflow-x-auto scrollbar-none pb-4"
              style={{ scrollSnapType: 'x mandatory' } as React.CSSProperties}
            >
              {filteredTrips.map((trip) => (
                <TripScrollCard key={trip.slug + trip.date} trip={trip} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <JournalNote
                text="no trips this month — check back soon 🗺️"
                type="sticky"
                className="inline-block"
              />
            </div>
          )}
        </div>

        {/* ══════════════════════════════════════════════════════════ */}
        {/* MOBILE: Stacked card carousel with swipe                 */}
        {/* ══════════════════════════════════════════════════════════ */}
        <div className="block md:hidden">
          <div
            ref={mobileCarouselRef}
            key={mobileIndex}
            className="flex justify-center py-6"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <StackedTripCard
              frontCard={mobilePair[0]}
              backCard={mobilePair[1]}
              regionColor={mobileRegionColor}
              className="w-full max-w-xs"
            />
          </div>

          {/* Navigation dots */}
          <div className="flex items-center justify-center gap-3 mt-4">
            {PAIRS.map((_, i) => (
              <button
                key={i}
                onClick={() => mobileGoTo(i)}
                aria-label={`Go to trip pair ${i + 1}`}
                className={cn(
                  'rounded-full transition-all duration-300',
                  i === mobileIndex
                    ? 'w-6 h-2 bg-[#0D78A8]'
                    : 'w-2 h-2 bg-gray-300 hover:bg-gray-400',
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
