'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { LOCATIONS, REGION_THEMES, type RegionThemeKey } from '@/lib/constants'
import { getExperienceIcon } from '@/lib/icons'
import { WashiTape, SectionLabel, PostageStamp } from '@/components/ui/scrapbook'
import { IndiaMap } from '@/components/ui/IndiaMap'
import { registerGSAP } from '@/lib/animations'
import { cn } from '@/lib/utils'
import { RegionSection, REGION_EXPERIENCES } from '@/components/sections/RegionSection'
import { HERO_IMAGES } from '@/lib/images'

// ─── Wavy SVG divider ────────────────────────────────────────────────────────
// position="bottom": honey fill appears at BOTTOM of SVG (fills below waveline)
// position="top": visually flipped so honey fill appears at TOP of SVG

function WavyDivider({
  fill,
  position = 'bottom',
}: {
  fill: string
  position?: 'top' | 'bottom'
}) {
  // Bottom path: waveline in middle, fill below → bottom of SVG
  const bottomPath =
    'M0,40 C180,80 360,0 540,40 C720,80 900,0 1080,40 C1260,80 1350,20 1440,40 L1440,80 L0,80 Z'
  // Top path: waveline in middle, fill above → top of SVG
  const topPath =
    'M0,40 C180,0 360,80 540,40 C720,0 900,80 1080,40 C1260,0 1350,60 1440,40 L1440,0 L0,0 Z'

  return (
    <div className="w-full overflow-hidden leading-none">
      <svg
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-14 md:h-20 block"
      >
        <path d={position === 'top' ? topPath : bottomPath} fill={fill} />
      </svg>
    </div>
  )
}

// ─── Experience categories ────────────────────────────────────────────────────
interface Category {
  label: string
  iconKey: string
  color: string
  href: string
}

const CATEGORIES: Category[] = [
  { label: 'Trekking',   iconKey: 'trekking',   color: '#2D6A4F', href: '/experiences?type=trekking' },
  { label: 'Camping',    iconKey: 'camping',     color: '#6B4226', href: '/experiences?type=camping' },
  { label: 'Culture',    iconKey: 'culture',     color: '#C1440E', href: '/experiences?type=culture' },
  { label: 'Stays',      iconKey: 'stays',       color: '#1B4FD8', href: '/stays' },
  { label: 'Activities', iconKey: 'activities',  color: '#F59E0B', href: '/experiences?type=activities' },
  { label: 'Learning',   iconKey: 'learning',    color: '#7C3AED', href: '/student-program' },
]

// ─── Main page ────────────────────────────────────────────────────────────────
export default function DestinationsPage() {
  const [activeRegion, setActiveRegion] = useState<string>('all')
  const cardsSectionRef = useRef<HTMLElement>(null)

  // Animation refs
  const heroRef         = useRef<HTMLElement>(null)
  const heroImgRef      = useRef<HTMLDivElement>(null)
  const heroLabelRef    = useRef<HTMLSpanElement>(null)
  const heroTitleRef    = useRef<HTMLHeadingElement>(null)
  const heroSubRef      = useRef<HTMLParagraphElement>(null)
  const filterBarRef    = useRef<HTMLDivElement>(null)
  const mapSectionRef   = useRef<HTMLElement>(null)
  const mapTextRef      = useRef<HTMLDivElement>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const catSectionRef   = useRef<HTMLElement>(null)
  const catTilesRef     = useRef<HTMLDivElement>(null)

  const filteredLocations =
    activeRegion === 'all'
      ? [...LOCATIONS]
      : LOCATIONS.filter((l) => l.slug === activeRegion)

  // Suppress unused variable warning — filteredLocations is available for future use
  void filteredLocations

  const handleRegionFilter = (slug: string) => {
    setActiveRegion(slug)
    setTimeout(() => {
      cardsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 80)
  }

  useEffect(() => {
    registerGSAP()
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const ctx = gsap.context(() => {

      // ── HERO: parallax ────────────────────────────────────────────────────
      if (heroImgRef.current && heroRef.current) {
        gsap.to(heroImgRef.current, {
          yPercent: 25,
          ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1.2,
          },
        })
      }

      // ── HERO: text entrance ───────────────────────────────────────────────
      const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      if (heroLabelRef.current) {
        heroTl.from(heroLabelRef.current, { y: 20, opacity: 0, duration: 0.5 }, 0.3)
      }
      if (heroTitleRef.current) {
        heroTl.from(
          heroTitleRef.current.querySelectorAll('.dest-hero-word'),
          { y: '110%', stagger: 0.1, duration: 0.75 },
          0.55
        )
      }
      if (heroSubRef.current) {
        heroTl.from(heroSubRef.current, { y: 18, opacity: 0, duration: 0.55 }, 1.05)
      }



      // ── MAP SECTION: text stagger ─────────────────────────────────────────
      if (mapTextRef.current) {
        gsap.from(mapTextRef.current.children, {
          y: 36,
          opacity: 0,
          stagger: 0.12,
          duration: 0.65,
          ease: 'power2.out',
          immediateRender: false, scrollTrigger: {
            trigger: mapSectionRef.current,
            start: 'top bottom',
            once: true,
          },
        })
      }

      // ── MAP: scale + fade in ──────────────────────────────────────────────
      if (mapContainerRef.current) {
        gsap.from(mapContainerRef.current, {
          scale: 0.88,
          opacity: 0,
          duration: 0.9,
          ease: 'back.out(1.2)',
          immediateRender: false, scrollTrigger: {
            trigger: mapSectionRef.current,
            start: 'top bottom',
            once: true,
          },
        })
      }

      // ── CATEGORY TILES: bounce scale in ──────────────────────────────────
      if (catTilesRef.current) {
        gsap.from(catTilesRef.current.querySelectorAll('.cat-tile'), {
          scale: 0,
          opacity: 0,
          stagger: 0.07,
          duration: 0.5,
          ease: 'back.out(1.5)',
          immediateRender: false,
          scrollTrigger: {
            trigger: catSectionRef.current,
            start: 'top bottom',
            once: true,
          },
        })
      }

    })

    return () => ctx.revert()
  }, [])

  return (
    <main>

      {/* ═══ SECTION 1: HERO ═══════════════════════════════════════════════════ */}
      <section ref={heroRef} className="relative h-[60vh] min-h-[400px] overflow-hidden">
        <div ref={heroImgRef} className="absolute inset-[-12%] will-change-transform">
          <Image
            src={HERO_IMAGES['himachal-pradesh']}
            alt="Himalayan landscape"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60" />

        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
          <span ref={heroLabelRef} className="font-handwriting text-yellow text-xl mb-3 block">
            explore india differently
          </span>
          <h1
            ref={heroTitleRef}
            className="font-display font-black text-white text-4xl md:text-6xl lg:text-7xl leading-tight"
          >
            {['Pick', 'Your', 'Direction'].map((w) => (
              <span
                key={w}
                className="inline-block overflow-hidden align-bottom mr-[0.22em] last:mr-0"
              >
                <span className="dest-hero-word inline-block">{w}</span>
              </span>
            ))}
          </h1>
          <p ref={heroSubRef} className="font-body text-white/80 text-lg max-w-2xl mx-auto mt-4">
            Destinations we&apos;ve lived and explored before offering them to you.
          </p>
        </div>

        {/* Wavy SVG divider into Section 2 (#FFF8E7) */}
        <div className="absolute bottom-[-1px] left-0 right-0 z-10">
          <svg
            viewBox="0 0 1440 80"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-14 md:h-20 block"
          >
            <path
              d="M0,40 C180,80 360,0 540,40 C720,80 900,0 1080,40 C1260,80 1350,20 1440,40 L1440,80 L0,80 Z"
              fill="#FFF8E7"
            />
          </svg>
        </div>
      </section>

      {/* ═══ SECTION 2: REGION FILTER TABS ════════════════════════════════════ */}
      <section className="bg-[#FFF8E7] py-4 md:py-8">
        <div ref={filterBarRef} className="max-w-7xl mx-auto px-4">
          <div className="flex gap-3 overflow-x-auto md:flex-wrap md:justify-center md:overflow-visible" style={{ scrollbarWidth: 'none' }}>
            <button
              onClick={() => setActiveRegion('all')}
              className={cn(
                'flex-none font-body text-sm px-5 py-2 rounded-full border-2 transition-all duration-200 hover:scale-105',
                activeRegion === 'all'
                  ? 'bg-dark text-white border-dark scale-105'
                  : 'bg-white text-dark border-gray-200 hover:bg-gray-50'
              )}
            >
              All Regions
            </button>

            {LOCATIONS.map((location) => {
              const theme = REGION_THEMES[location.slug as RegionThemeKey]
              if (!theme) return null
              const isActive = activeRegion === location.slug
              return (
                <button
                  key={location.slug}
                  onClick={() => setActiveRegion(location.slug)}
                  style={
                    isActive
                      ? ({ '--rb': theme.primary } as React.CSSProperties)
                      : undefined
                  }
                  className={cn(
                    'flex-none font-body text-sm px-5 py-2 rounded-full border-2 transition-all duration-200 hover:scale-105',
                    isActive
                      ? 'bg-[var(--rb)] text-white border-[var(--rb)] scale-105'
                      : 'bg-white text-dark border-gray-200 hover:bg-gray-50'
                  )}
                >
                  {theme.emoji} {location.name}
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* ═══ SECTION 3: MAP + INTRO ════════════════════════════════════════════ */}
      <section ref={mapSectionRef} className="bg-[#FFF8E7] py-10 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

            {/* LEFT — Text + Region pills */}
            <div ref={mapTextRef} className="relative">
              <div className="absolute -top-2 right-4 z-10 hidden lg:block">
                <PostageStamp region="himachal-pradesh" />
              </div>

              <div className="relative inline-block mb-6">
                <WashiTape color="yellow" rotation={-2} width="w-40" />
                <span className="absolute inset-0 flex items-center justify-center font-handwriting text-dark/80 text-sm pointer-events-none">
                  your next chapter →
                </span>
              </div>

              <SectionLabel
                text="Regions We've Explored"
                style="handwritten"
                className="block mb-5"
              />

              <h2 className="font-display font-bold text-dark text-3xl leading-tight mb-4">
                Every journey starts with a place.
              </h2>
              <p className="font-body text-dark/60 text-base leading-relaxed mb-8">
                These are destinations we&apos;ve lived and explored on foot, by road,
                and with local guides — before we ever took a group there.
              </p>

              <div className="flex flex-col gap-4">
                {LOCATIONS.map((location) => {
                  const theme = REGION_THEMES[location.slug as RegionThemeKey]
                  if (!theme) return null
                  return (
                    <Link
                      key={location.slug}
                      href={`/destinations/${location.slug}`}
                      style={{ '--rp': theme.primary } as React.CSSProperties}
                      className="flex items-center gap-3 group w-fit"
                    >
                      <span className="w-3 h-3 rounded-full flex-none bg-[var(--rp)]" />
                      <span className="font-body text-sm text-dark group-hover:text-[var(--rp)] transition-colors duration-200">
                        {location.name}
                      </span>
                      <span className="text-base">{theme.emoji}</span>
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* RIGHT — India map */}
            <div ref={mapContainerRef} className="will-change-transform">
              <IndiaMap
                activeRegion={activeRegion}
                onRegionClick={handleRegionFilter}
              />
            </div>

          </div>
        </div>
      </section>

      {/* ═══ SECTION 4: EXPERIENCE CATEGORIES ═════════════════════════════════ */}
      <section ref={catSectionRef} className="bg-[#E8F4F0]">
        <WavyDivider fill="#FFF8E7" position="top" />

        <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
          <div className="text-center mb-10">
            <h2 className="font-display font-bold text-dark text-3xl">
              What Would You Like To Do?
            </h2>
            <p className="font-handwriting text-blue text-xl mt-2">
              choose your vibe →
            </p>
          </div>

          <div ref={catTilesRef} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.label}
                href={cat.href}
                className={cn(
                  'cat-tile group bg-white rounded-2xl p-6 text-center block',
                  'shadow-[var(--shadow-card)]',
                  'hover:-translate-y-1.5 hover:shadow-[var(--shadow-polaroid)]',
                  'transition-all duration-200'
                )}
              >
                <div className="w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                  <Image
                    src={getExperienceIcon(cat.iconKey)}
                    alt={cat.label}
                    width={48}
                    height={48}
                    className="object-contain mix-blend-multiply"
                  />
                </div>
                <p className="font-heading font-semibold text-dark text-sm">
                  {cat.label}
                </p>
              </Link>
            ))}
          </div>
        </div>

        <WavyDivider fill="#FFF8E7" position="bottom" />
      </section>

      {/* ═══ SECTION 5: REGION SECTIONS ═══════════════════════════════════════ */}
      <section
        ref={cardsSectionRef}
        className="bg-[#FFF8E7] py-10 md:py-24 scroll-mt-16"
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-12">
            <SectionLabel text="Where We Go" style="handwritten" className="block mb-3" />
            <h2 className="font-display font-bold text-dark text-3xl">
              {activeRegion === 'all'
                ? 'All Destinations'
                : REGION_THEMES[activeRegion as RegionThemeKey]?.name ?? 'Destinations'}
            </h2>
          </div>

          {LOCATIONS.map((location) => (
            <div
              key={location.slug}
              className={activeRegion !== 'all' && activeRegion !== location.slug ? 'hidden' : ''}
            >
              <RegionSection
                region={location.slug as RegionThemeKey}
                experiences={REGION_EXPERIENCES[location.slug as RegionThemeKey]}
              />
            </div>
          ))}
        </div>
      </section>

    </main>
  )
}
