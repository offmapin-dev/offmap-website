'use client'

import { useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight } from 'lucide-react'
import { gsap } from 'gsap'
import { LOCATIONS, REGION_THEMES, type RegionThemeKey } from '@/lib/constants'
import { TornEdge, WashiTape, SectionLabel, JournalNote } from '@/components/ui/scrapbook'
import { PostageStamp } from '@/components/ui/scrapbook'
import { registerGSAP } from '@/lib/animations'
import { cn } from '@/lib/utils'
import { DESTINATION_CARD_IMAGES } from '@/lib/images'

export function DestinationsSection() {
  const sectionRef  = useRef<HTMLElement>(null)
  const headerRef   = useRef<HTMLDivElement>(null)
  const washiRef    = useRef<HTMLDivElement>(null)
  const stampRef    = useRef<HTMLSpanElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const gridRef     = useRef<HTMLDivElement>(null)

  useEffect(() => {
    registerGSAP()
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const ctx = gsap.context(() => {
      const st = { trigger: sectionRef.current, start: 'top bottom', once: true }

      // 1. WashiTape: scaleX from 0
      if (washiRef.current) {
        gsap.from(washiRef.current, {
          scaleX: 0, transformOrigin: 'left center', duration: 0.5, ease: 'power2.out', immediateRender: false, scrollTrigger: st,
        })
      }

      // 2. StampBadge: rubber-band spin-in
      if (stampRef.current) {
        gsap.from(stampRef.current, {
          scale: 0, rotation: -20, opacity: 0, duration: 0.6, ease: 'back.out(1.7)', delay: 0.2, immediateRender: false, scrollTrigger: st,
        })
      }

      // 3. Headline: word-by-word clip reveal
      if (headlineRef.current) {
        gsap.from(headlineRef.current.querySelectorAll('.dest-word'), {
          y: '110%', stagger: 0.1, duration: 0.7, ease: 'power3.out', delay: 0.35, immediateRender: false, scrollTrigger: st,
        })
      }

      // 4. Cards: stagger from below
      if (gridRef.current) {
        gsap.from(gridRef.current.querySelectorAll('.dest-card'), {
          y: 80, opacity: 0, scale: 0.92, stagger: 0.13, duration: 0.7, ease: 'back.out(1.1)',
          immediateRender: false,
          scrollTrigger: { trigger: gridRef.current, start: 'top bottom', once: true },
        })
      }
    })

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="bg-white diagonal-stripes">
      <TornEdge position="top" color="#FFFFFF" />

      <div className="max-w-7xl mx-auto px-4 pt-4 pb-8 md:pb-12">
        {/* Header */}
        <div ref={headerRef} className="mb-8">
          <div ref={washiRef} className="relative inline-block mb-6">
            <WashiTape color="yellow" rotation={-2} width="w-44" />
            <span className="absolute inset-0 flex items-center justify-center font-handwriting text-dark/80 text-sm pointer-events-none">
              Unmapped awaits
            </span>
          </div>

          <span ref={stampRef} className="inline-block mb-4">
            <SectionLabel text="WANDERLUST" style="stamp" className="block" />
          </span>

          <svg className="hidden md:inline-block w-6 h-6 mb-2 opacity-30" viewBox="0 0 24 24" fill="none" aria-hidden>
            <circle cx="12" cy="4" r="1.5" fill="currentColor" />
            <circle cx="20" cy="12" r="1" fill="currentColor" />
            <circle cx="4" cy="10" r="1.2" fill="currentColor" />
            <circle cx="16" cy="20" r="0.8" fill="currentColor" />
          </svg>
          <h2 ref={headlineRef} className="font-display font-black text-dark text-4xl md:text-5xl mt-5">
            {['Pick', 'your', 'direction'].map((w) => (
              <span key={w} className="inline-block overflow-hidden align-bottom mr-[0.22em] last:mr-0">
                <span className="dest-word inline-block">{w}</span>
              </span>
            ))}
          </h2>
          <span className="hidden md:block font-handwriting text-gray-400 text-lg rotate-[2deg] mt-3 select-none pointer-events-none">
            our favourites →
          </span>
        </div>

        {/* Destination cards — full-bleed photo with text overlay */}
        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {LOCATIONS.map((location) => {
            const theme = REGION_THEMES[location.slug as RegionThemeKey]
            if (!theme) return null

            return (
              <Link
                key={location.slug}
                href={`/destinations/${location.slug}`}
                className={cn(
                  'dest-card group block relative rounded-2xl overflow-hidden cursor-pointer',
                  'hover:scale-[1.02] transition-transform duration-300'
                )}
              >
                {/* Full-bleed image */}
                <div className="relative h-64 md:h-80 overflow-hidden">
                  <Image
                    src={DESTINATION_CARD_IMAGES[location.slug] ?? ''}
                    alt={location.name}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/75 group-hover:to-black/80 transition-colors duration-300" />

                  {/* PostageStamp */}
                  <div className="absolute top-4 right-4 z-10">
                    <PostageStamp region={location.slug as RegionThemeKey} />
                  </div>

                  {/* Content overlay */}
                  <div className="absolute bottom-0 left-0 p-5">
                    <p className="font-handwriting text-xs font-semibold uppercase tracking-widest text-white/70 mb-1">
                      {theme.label}
                    </p>
                    <p className="font-display font-black text-2xl text-white">
                      {location.name}
                    </p>
                    <p className="font-body text-sm text-white/80 mt-1 line-clamp-2">
                      {theme.description}
                    </p>
                    <span className="inline-flex items-center gap-1 font-handwriting font-bold text-white mt-3 group-hover:gap-2 transition-all duration-200">
                      Explore <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
        <div className="hidden md:flex justify-end mt-8">
          <JournalNote text="4 locations & counting 📍" type="sticky" className="rotate-[3deg]" />
        </div>
      </div>
    </section>
  )
}
