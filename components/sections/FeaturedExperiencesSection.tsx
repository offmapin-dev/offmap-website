'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { MapPin } from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FEATURED_ROUTES, REGION_THEMES, type RegionThemeKey } from '@/lib/constants'
import { PostageStamp, SectionLabel } from '@/components/ui/scrapbook'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { registerGSAP } from '@/lib/animations'
import { ROUTE_IMAGES } from '@/lib/images'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const ROUTE_DETAILS: Record<string, {
  days: string
  nights: string
  type: string
  price: string
  highlights: [string, string, string]
}> = {
  'bir-barot': {
    days: '4 Days', nights: '3 Nights', type: 'Trek',
    price: '₹8,999',
    highlights: ['Group', 'Moderate', 'All inclusive'],
  },
  'rajgundha-valley': {
    days: '3 Days', nights: '2 Nights', type: 'Valley Trek',
    price: '₹7,499',
    highlights: ['Group', 'Easy', 'All inclusive'],
  },
  'shangarh-raghupur-fort': {
    days: '2 Days', nights: '1 Night', type: 'Heritage Walk',
    price: '₹4,999',
    highlights: ['Group', 'Easy', 'Guided'],
  },
  jawai: {
    days: '3 Days', nights: '2 Nights', type: 'Wildlife',
    price: '₹12,999',
    highlights: ['Group', 'Easy', 'Safari included'],
  },
  'kasar-devi-khaliya-top': {
    days: '4 Days', nights: '3 Nights', type: 'Himalayan Trek',
    price: '₹9,499',
    highlights: ['Group', 'Moderate', 'All inclusive'],
  },
}

export function FeaturedExperiencesSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useScrollAnimation(headingRef)

  useEffect(() => {
    registerGSAP()

    const section = sectionRef.current
    const track = trackRef.current
    if (!section || !track) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    // Mobile: fall back to CSS overflow-x scroll
    if (window.innerWidth < 768) return

    const ctx = gsap.context(() => {
      gsap.to(track, {
        x: () => -(track.scrollWidth - window.innerWidth + 64),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${track.scrollWidth - window.innerWidth + 64}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="bg-[#FDF0E8]">
      {/* Heading — always in normal flow */}
      <div className="max-w-7xl mx-auto px-4 pt-10 md:pt-14 pb-6">
        <div ref={headingRef}>
          <SectionLabel text="Featured Routes" style="handwritten" className="mb-3 block" />
          <p className="font-handwriting text-dark/50 text-xl mt-2">
            grab a postcard &amp; go
          </p>
        </div>
      </div>

      {/* Mobile: CSS overflow scroll. Desktop: GSAP animates this track */}
      <div className="overflow-x-auto md:overflow-visible pb-0">
        <div
          ref={trackRef}
          className="flex gap-10 px-4 md:px-16 pb-10 pt-4 w-max items-start"
        >
          {FEATURED_ROUTES.map((route) => {
            const theme = REGION_THEMES[route.location as RegionThemeKey]
            const details = ROUTE_DETAILS[route.slug]
            return (
              <Link
                key={route.slug}
                href={`/experiences/${route.slug}`}
                className="flex-none w-72 block group"
              >
                <div className="rounded-2xl overflow-hidden bg-white shadow-[var(--shadow-card)] hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(0,0,0,0.15)] transition-all duration-300">
                  {/* Image area */}
                  <div className="relative h-52 overflow-hidden">
                    <Image
                      src={ROUTE_IMAGES[route.slug] ?? ''}
                      alt={route.name}
                      fill
                      sizes="288px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Dark gradient at bottom */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    {/* PostageStamp top-left */}
                    <div className="absolute top-3 left-3">
                      <PostageStamp region={route.location as RegionThemeKey} />
                    </div>
                    {/* Duration badge top-right */}
                    {details && (
                      <div className="absolute top-3 right-3 bg-dark/70 backdrop-blur-sm text-white font-handwriting text-xs px-2.5 py-1 rounded-full">
                        {details.days} · {details.nights}
                      </div>
                    )}
                  </div>

                  {/* Content area */}
                  <div className="p-4">
                    {/* Route name */}
                    <h3 className="font-display font-bold text-lg text-dark leading-snug">
                      {route.name}
                    </h3>

                    {/* Region + type row */}
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="flex items-center gap-1 font-handwriting text-gray-400 text-sm">
                        <MapPin size={12} className="flex-none" />
                        {theme?.name}
                      </span>
                      <span className="text-gray-300">&middot;</span>
                      <span className="font-body text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                        {details?.type}
                      </span>
                    </div>

                    {/* Highlights row */}
                    {details && (
                      <div className="flex items-center gap-3 mt-3 text-xs font-body text-gray-500">
                        <span className="flex items-center gap-1">
                          <span aria-hidden="true">👥</span> {details.highlights[0]}
                        </span>
                        <span className="flex items-center gap-1">
                          <span aria-hidden="true">🥾</span> {details.highlights[1]}
                        </span>
                        <span className="flex items-center gap-1">
                          <span aria-hidden="true">✓</span> {details.highlights[2]}
                        </span>
                      </div>
                    )}

                    {/* Price row */}
                    {details && theme && (
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                        <div>
                          <span className="font-handwriting text-gray-400 text-xs">From</span>
                          <span
                            className="font-display font-bold text-base ml-1"
                            style={{ color: theme.primary }}
                          >
                            {details.price}
                          </span>
                        </div>
                        <span
                          className="font-handwriting text-base"
                          style={{ color: theme.primary }}
                        >
                          View Trip &rarr;
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
