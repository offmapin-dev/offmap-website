'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { gsap } from 'gsap'
import { REGION_THEMES, type RegionThemeKey } from '@/lib/constants'
import { registerGSAP } from '@/lib/animations'
import { StackedTripCard, type TripCardData } from '@/components/ui/StackedTripCard'
import { cn } from '@/lib/utils'

const FEATURED_TRIPS: TripCardData[] = [
  {
    name: 'SHANGARH',
    subtitle: 'Hidden Himalayan Meadow',
    region: 'Himachal Pradesh',
    regionSlug: 'himachal-pradesh',
    image: 'https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?w=600&q=80',
    date: '15 May',
    duration: '3N/4D',
    originalPrice: '\u20B99,999',
    price: '\u20B98,999',
    badge: 'Popular',
    departure: 'Delhi to Delhi',
    slug: 'shangarh-raghupur-fort',
  },
  {
    name: 'BIR',
    subtitle: 'Fly High This Weekend',
    region: 'Himachal Pradesh',
    regionSlug: 'himachal-pradesh',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',
    date: '22 May',
    duration: '2N/3D',
    originalPrice: '\u20B97,499',
    price: '\u20B96,999',
    badge: 'Just Added',
    departure: 'Delhi to Delhi',
    slug: 'bir-barot',
  },
  {
    name: 'JAWAI',
    subtitle: 'Land of Leopards',
    region: 'Rajasthan',
    regionSlug: 'rajasthan',
    image: 'https://images.unsplash.com/photo-1549366021-9f761d450615?w=600&q=80',
    date: '1 June',
    duration: '3N/4D',
    originalPrice: '\u20B912,999',
    price: '\u20B911,999',
    badge: 'Limited Seats',
    departure: 'Delhi to Delhi',
    slug: 'jawai',
  },
  {
    name: 'UDAIPUR',
    subtitle: 'Lakes & Desert Trails',
    region: 'Rajasthan',
    regionSlug: 'rajasthan',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600&q=80',
    date: '8 June',
    duration: '4N/5D',
    originalPrice: '\u20B913,999',
    price: '\u20B911,999',
    departure: 'Delhi to Delhi',
    slug: 'jawai',
  },
  {
    name: 'KASAR DEVI',
    subtitle: 'The Quiet Hills',
    region: 'Uttarakhand',
    regionSlug: 'uttarakhand',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&q=80',
    date: '15 June',
    duration: '4N/5D',
    originalPrice: '\u20B913,999',
    price: '\u20B912,999',
    departure: 'Delhi to Delhi',
    slug: 'kasar-devi-khaliya-top',
  },
  {
    name: 'RAJGUNDHA',
    subtitle: 'Valley Above the World',
    region: 'Himachal Pradesh',
    regionSlug: 'himachal-pradesh',
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600&q=80',
    date: '20 June',
    duration: '3N/4D',
    originalPrice: '\u20B98,999',
    price: '\u20B97,999',
    badge: 'New',
    departure: 'Delhi to Delhi',
    slug: 'rajgundha-valley',
  },
]

const PAIRS: [TripCardData, TripCardData][] = [
  [FEATURED_TRIPS[0], FEATURED_TRIPS[1]],
  [FEATURED_TRIPS[2], FEATURED_TRIPS[3]],
  [FEATURED_TRIPS[4], FEATURED_TRIPS[5]],
]

export function FeaturedExperiencesSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const carouselRef = useRef<HTMLDivElement>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const isAnimatingRef = useRef(false)
  const touchStartRef = useRef(0)

  const goTo = useCallback((index: number) => {
    if (isAnimatingRef.current || index === currentIndex) return
    const clamped = ((index % PAIRS.length) + PAIRS.length) % PAIRS.length
    setCurrentIndex(clamped)
  }, [currentIndex])

  const goNext = useCallback(() => {
    goTo((currentIndex + 1) % PAIRS.length)
  }, [currentIndex, goTo])

  const goPrev = useCallback(() => {
    goTo((currentIndex - 1 + PAIRS.length) % PAIRS.length)
  }, [currentIndex, goTo])

  useEffect(() => {
    if (!carouselRef.current) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    isAnimatingRef.current = true
    gsap.fromTo(
      carouselRef.current,
      { opacity: 0, x: 30 },
      {
        opacity: 1,
        x: 0,
        duration: 0.5,
        ease: 'power2.out',
        onComplete: () => { isAnimatingRef.current = false },
      },
    )
  }, [currentIndex])

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

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartRef.current = e.touches[0].clientX
  }, [])

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const diff = touchStartRef.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) {
      if (diff > 0) goNext()
      else goPrev()
    }
  }, [goNext, goPrev])

  const pair = PAIRS[currentIndex]
  const frontRegion = REGION_THEMES[pair[0].regionSlug as RegionThemeKey]

  return (
    <section ref={sectionRef} className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section heading */}
        <div className="mb-10 md:mb-12">
          <h2 className="font-display font-black text-3xl md:text-4xl text-[#0D78A8]">
            Stories For Weekends
          </h2>
          <p className="font-handwriting text-gray-400 text-xl mt-2">
            routes we&apos;ve fallen in love with &rarr;
          </p>
        </div>

        {/* Carousel area */}
        <div className="relative">
          {/* Desktop arrows */}
          <button
            onClick={goPrev}
            className={cn(
              'hidden md:flex absolute -left-5 top-1/2 -translate-y-1/2 z-30',
              'w-12 h-12 rounded-full bg-white shadow-[var(--shadow-card)]',
              'items-center justify-center',
              'hover:shadow-[var(--shadow-card-hover)] transition-shadow duration-200',
            )}
            aria-label="Previous trips"
          >
            <ChevronLeft size={22} className="text-[#0D78A8]" />
          </button>
          <button
            onClick={goNext}
            className={cn(
              'hidden md:flex absolute -right-5 top-1/2 -translate-y-1/2 z-30',
              'w-12 h-12 rounded-full bg-white shadow-[var(--shadow-card)]',
              'items-center justify-center',
              'hover:shadow-[var(--shadow-card-hover)] transition-shadow duration-200',
            )}
            aria-label="Next trips"
          >
            <ChevronRight size={22} className="text-[#0D78A8]" />
          </button>

          {/* Cards container */}
          <div
            ref={carouselRef}
            key={currentIndex}
            className="flex justify-center gap-8 md:gap-16 py-6"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Mobile: show only first card of pair */}
            <div className="block md:hidden">
              <StackedTripCard
                frontCard={pair[0]}
                backCard={pair[1]}
                regionColor={frontRegion?.primary ?? '#0D78A8'}
              />
            </div>

            {/* Desktop: show both card stacks side by side */}
            <div className="hidden md:flex gap-16">
              <StackedTripCard
                frontCard={pair[0]}
                backCard={pair[1]}
                regionColor={
                  REGION_THEMES[pair[0].regionSlug as RegionThemeKey]?.primary ?? '#0D78A8'
                }
              />
              <StackedTripCard
                frontCard={pair[1]}
                backCard={pair[0]}
                regionColor={
                  REGION_THEMES[pair[1].regionSlug as RegionThemeKey]?.primary ?? '#0D78A8'
                }
              />
            </div>
          </div>
        </div>

        {/* Navigation dots */}
        <div className="flex items-center justify-center gap-3 mt-8">
          {PAIRS.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to trip pair ${i + 1}`}
              className={cn(
                'rounded-full transition-all duration-300',
                i === currentIndex
                  ? 'w-6 h-2 bg-[#0D78A8]'
                  : 'w-2 h-2 bg-gray-300 hover:bg-gray-400',
              )}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
