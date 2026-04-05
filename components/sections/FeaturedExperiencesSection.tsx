'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FEATURED_ROUTES, REGION_THEMES, type RegionThemeKey } from '@/lib/constants'
import { PolaroidCard, StampBadge, SectionLabel } from '@/components/ui/scrapbook'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { registerGSAP } from '@/lib/animations'
import { ROUTE_IMAGES } from '@/lib/images'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const ROUTE_DETAILS: Record<string, { days: string; type: string }> = {
  'bir-barot': { days: '4 days', type: 'Trek' },
  'rajgundha-valley': { days: '3 days', type: 'Valley Trek' },
  'shangarh-raghupur-fort': { days: '2 days', type: 'Heritage Walk' },
  jawai: { days: '3 days', type: 'Wildlife' },
  'kasar-devi-khaliya-top': { days: '4 days', type: 'Himalayan Trek' },
}

const ROTATIONS = [-3, 2, -1, 3, -2]
const WASHI_COLORS: Array<'yellow' | 'blue' | undefined> = [
  'yellow',
  undefined,
  'blue',
  undefined,
  'yellow',
]

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
      <div className="max-w-7xl mx-auto px-4 pt-16 md:pt-24 pb-8">
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
          className="flex gap-10 px-4 md:px-16 pb-16 pt-6 w-max items-start"
        >
          {FEATURED_ROUTES.map((route, i) => {
            const theme = REGION_THEMES[route.location as RegionThemeKey]
            const details = ROUTE_DETAILS[route.slug]
            return (
              <Link
                key={route.slug}
                href={`/experiences/${route.slug}`}
                className="flex-none block"
              >
                <div className="relative">
                  <PolaroidCard
                    src={ROUTE_IMAGES[route.slug] ?? ''}
                    alt={route.name}
                    caption={route.name}
                    rotation={ROTATIONS[i] ?? 0}
                    size="md"
                    washiColor={WASHI_COLORS[i]}
                  />
                  {/* Location stamp — bottom right of polaroid */}
                  {theme && (
                    <div className="absolute -bottom-3 -right-3 z-20">
                      <StampBadge
                        text={theme.label}
                        color={theme.primary}
                        rotation={4}
                      />
                    </div>
                  )}
                </div>

                {/* Route info below card */}
                {details && (
                  <div className="mt-6 px-1">
                    <p className="font-body text-gray-500 text-xs">
                      {details.days} · {details.type}
                    </p>
                  </div>
                )}
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
