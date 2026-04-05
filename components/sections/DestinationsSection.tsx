'use client'

import { useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { gsap } from 'gsap'
import { LOCATIONS, REGION_THEMES, type RegionThemeKey } from '@/lib/constants'
import { TornEdge, WashiTape, SectionLabel } from '@/components/ui/scrapbook'
import { PostageStamp } from '@/components/ui/scrapbook'
import { registerGSAP } from '@/lib/animations'
import { cn } from '@/lib/utils'
import { DESTINATION_CARD_IMAGES } from '@/lib/images'

const CARD_ROTATIONS: Record<string, string> = {
  'himachal-pradesh': '-2deg',
  rajasthan: '2deg',
  kashmir: '-1deg',
  uttarakhand: '1.5deg',
}

const CARD_OFFSETS: Record<string, string> = {
  'himachal-pradesh': '',
  rajasthan: 'mt-12',
  kashmir: 'mt-6',
  uttarakhand: 'mt-16',
}

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
    <section ref={sectionRef} className="bg-[#FFF8E7] diagonal-stripes">
      <TornEdge position="top" color="#FFF8E7" />

      <div className="max-w-7xl mx-auto px-4 pt-4 pb-20 md:pb-28">
        {/* Header */}
        <div ref={headerRef} className="mb-12">
          <div ref={washiRef} className="relative inline-block mb-6">
            <WashiTape color="yellow" rotation={-2} width="w-44" />
            <span className="absolute inset-0 flex items-center justify-center font-handwriting text-dark/80 text-sm pointer-events-none">
              Unmapped awaits
            </span>
          </div>

          <span ref={stampRef} className="inline-block mb-4">
            <SectionLabel text="WANDERLUST" style="stamp" className="block" />
          </span>

          <h2 ref={headlineRef} className="font-display font-black text-dark text-4xl md:text-5xl mt-5">
            {['Pick', 'your', 'direction'].map((w) => (
              <span key={w} className="inline-block overflow-hidden align-bottom mr-[0.22em] last:mr-0">
                <span className="dest-word inline-block">{w}</span>
              </span>
            ))}
          </h2>
        </div>

        {/* Scattered destination cards */}
        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
          {LOCATIONS.map((location) => {
            const theme = REGION_THEMES[location.slug as RegionThemeKey]
            if (!theme) return null
            const rotation = CARD_ROTATIONS[location.slug] ?? '0deg'
            const offset = CARD_OFFSETS[location.slug] ?? ''

            return (
              <Link
                key={location.slug}
                href={`/destinations/${location.slug}`}
                style={{
                  '--card-r': rotation,
                  '--border-c': theme.primary,
                  '--card-bg': theme.cardBg,
                  '--shadow-h': theme.primary + '40',
                } as React.CSSProperties}
                className={cn(
                  'dest-card group block bg-[var(--card-bg)]',
                  'border-2 border-[var(--border-c)]',
                  'rotate-[var(--card-r)] hover:rotate-0 hover:scale-[1.02]',
                  'transition-all duration-300',
                  'shadow-[2px_2px_8px_rgba(0,0,0,0.08)] hover:shadow-[4px_4px_20px_var(--shadow-h)]',
                  offset
                )}
              >
                <div className="relative h-52 overflow-hidden">
                  <Image
                    src={DESTINATION_CARD_IMAGES[location.slug] ?? ''}
                    alt={location.name}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 right-3 z-10">
                    <PostageStamp region={location.slug as RegionThemeKey} />
                  </div>
                </div>
                <div className="p-5">
                  <p className="font-handwriting text-[var(--border-c)] text-xs uppercase tracking-wider mb-1">{theme.label}</p>
                  <p className="font-display font-bold text-[var(--border-c)] text-2xl mb-2">{location.name}</p>
                  <p className="font-body text-gray-500 text-sm leading-relaxed mb-4">{theme.description}</p>
                  <p className="font-handwriting text-[var(--border-c)] text-base">Explore →</p>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
