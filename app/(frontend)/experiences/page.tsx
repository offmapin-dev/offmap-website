'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { getExperienceIcon } from '@/lib/icons'
import { REGION_THEMES, LOCATIONS, type RegionThemeKey } from '@/lib/constants'
import { registerGSAP } from '@/lib/animations'
import {
  PostageStamp,
  WashiTape,
  StampBadge,
  JournalNote,
  SectionLabel,
} from '@/components/ui/scrapbook'
import { ExperienceCard, type ExperienceCardData } from '@/components/ui/ExperienceCard'
import { cn } from '@/lib/utils'
import { EXPERIENCE_CARD_IMAGES, EXPERIENCES_HERO } from '@/lib/images'

// ─── Wavy SVG divider ────────────────────────────────────────────────────────
function WavyDivider({ fill }: { fill: string }) {
  return (
    <div className="w-full overflow-hidden leading-none -mb-px">
      <svg
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-14 md:h-20 block"
      >
        <path
          d="M0,40 C180,80 360,0 540,40 C720,80 900,0 1080,40 C1260,80 1350,20 1440,40 L1440,80 L0,80 Z"
          fill={fill}
        />
      </svg>
    </div>
  )
}

// ─── Experiences data ────────────────────────────────────────────────────────
const EXPERIENCES: ExperienceCardData[] = [
  {
    name: 'Bir–Barot Trek',
    region: 'Himachal Pradesh',
    regionSlug: 'himachal-pradesh',
    type: 'Trekking',
    days: '4 days',
    price: '₹8,999',
    description: 'Apple orchards, pine forests and shepherd villages that most maps don\'t show.',
    image: EXPERIENCE_CARD_IMAGES.birBarot,
    featured: true,
  },
  {
    name: 'Rajgundha Valley',
    region: 'Himachal Pradesh',
    regionSlug: 'himachal-pradesh',
    type: 'Camping',
    days: '3 days',
    price: '₹7,499',
    description: 'Remote valley camping with local shepherd families under open Himalayan skies.',
    image: EXPERIENCE_CARD_IMAGES.rajgundhaValley,
  },
  {
    name: 'Shangarh–Raghupur Fort',
    region: 'Himachal Pradesh',
    regionSlug: 'himachal-pradesh',
    type: 'Cultural',
    days: '2 days',
    price: '₹5,999',
    description: 'Ancient fort ruins perched above a sacred meadow with Himalayan valley views.',
    image: EXPERIENCE_CARD_IMAGES.shangarhRaghupur,
  },
  {
    name: 'Paragliding in Bir',
    region: 'Himachal Pradesh',
    regionSlug: 'himachal-pradesh',
    type: 'Activities',
    days: '1 day',
    price: '₹3,499',
    description: 'Tandem paragliding from the world\'s best launch site above the Kangra Valley.',
    image: EXPERIENCE_CARD_IMAGES.paraglidingBir,
  },
  {
    name: 'Jawai Safari',
    region: 'Rajasthan',
    regionSlug: 'rajasthan',
    type: 'Wildlife',
    days: '3 days',
    price: '₹11,999',
    description: 'Leopard territory, ancient temples and tribal villages off the tourist trail.',
    image: EXPERIENCE_CARD_IMAGES.jawaiSafari,
  },
  {
    name: 'Udaipur–Mount Abu',
    region: 'Rajasthan',
    regionSlug: 'rajasthan',
    type: 'Cultural',
    days: '4 days',
    price: '₹10,999',
    description: 'Lakes, palaces and the only hill station in Rajasthan — slow and real.',
    image: EXPERIENCE_CARD_IMAGES.udaipurMountAbu,
  },
  {
    name: 'Jaisalmer Dunes',
    region: 'Rajasthan',
    regionSlug: 'rajasthan',
    type: 'Adventure',
    days: '3 days',
    price: '₹9,499',
    description: 'Desert camping under a billion stars in the golden heart of the Thar.',
    image: EXPERIENCE_CARD_IMAGES.jaisalmerDunes,
  },
  {
    name: 'Horse Riding Workshop',
    region: 'Rajasthan',
    regionSlug: 'rajasthan',
    type: 'Activities',
    days: '1 day',
    price: '₹2,999',
    description: 'Traditional Marwari horse riding with local trainers in the desert heartland.',
    image: EXPERIENCE_CARD_IMAGES.horseRiding,
  },
  {
    name: 'Kasar Devi–Khaliya Top',
    region: 'Uttarakhand',
    regionSlug: 'uttarakhand',
    type: 'Trekking',
    days: '5 days',
    price: '₹12,999',
    description: 'Through rhododendron forests to high meadows with sweeping Himalayan panoramas.',
    image: EXPERIENCE_CARD_IMAGES.kasarDeviKhaliya,
  },
  {
    name: 'Binsar Wildlife Sanctuary',
    region: 'Uttarakhand',
    regionSlug: 'uttarakhand',
    type: 'Wildlife',
    days: '3 days',
    price: '₹8,499',
    description: 'Dense oak forests, Himalayan birds and the quiet chance of spotting a leopard.',
    image: EXPERIENCE_CARD_IMAGES.binsarWildlife,
  },
  {
    name: 'Dal Lake Experience',
    region: 'Kashmir',
    regionSlug: 'kashmir',
    type: 'Stays',
    days: '4 days',
    price: 'Coming Soon',
    description: 'Shikara rides through floating gardens, saffron fields and silent mornings.',
    image: EXPERIENCE_CARD_IMAGES.dalLake,
    comingSoon: true,
  },
  {
    name: 'Gulmarg in Snow',
    region: 'Kashmir',
    regionSlug: 'kashmir',
    type: 'Adventure',
    days: '3 days',
    price: 'Coming Soon',
    description: 'Asia\'s highest gondola and winter trails through untouched snowfields.',
    image: EXPERIENCE_CARD_IMAGES.gulmargSnow,
    comingSoon: true,
  },
]

// ─── Activity types carousel ──────────────────────────────────────────────────
const ACTIVITY_TYPES = [
  { label: 'Trekking',   value: 'trekking',   color: '#2D6A4F' },
  { label: 'Camping',    value: 'camping',    color: '#6B4226' },
  { label: 'Cultural',   value: 'cultural',   color: '#C1440E' },
  { label: 'Wildlife',   value: 'wildlife',   color: '#F59E0B' },
  { label: 'Adventure',  value: 'adventure',  color: '#1B4FD8' },
  { label: 'Stays',      value: 'stays',      color: '#7C3AED' },
  { label: 'Activities', value: 'activities', color: '#0D9488' },
  { label: 'Learning',   value: 'learning',   color: '#B45309' },
] as const

// ─── Region filter list ───────────────────────────────────────────────────────
const REGIONS = [
  { label: 'All', value: 'all', primary: '#0F172A' },
  ...LOCATIONS.map((l) => ({
    label: REGION_THEMES[l.slug as RegionThemeKey]?.name.split(' ')[0] ?? l.name,
    value: l.slug,
    primary: REGION_THEMES[l.slug as RegionThemeKey]?.primary ?? '#0F172A',
  })),
]

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ExperiencesPage() {
  const [activeRegion, setActiveRegion] = useState('all')
  const [activeType, setActiveType] = useState('all')

  // Section refs
  const heroRef       = useRef<HTMLElement>(null)
  const heroImgRef    = useRef<HTMLDivElement>(null)
  const heroLabelRef  = useRef<HTMLParagraphElement>(null)
  const heroTitleRef  = useRef<HTMLHeadingElement>(null)
  const heroSubRef    = useRef<HTMLParagraphElement>(null)
  const filterBarRef  = useRef<HTMLDivElement>(null)
  const featuredRef   = useRef<HTMLElement>(null)
  const featuredImgRef = useRef<HTMLDivElement>(null)
  const gridRef       = useRef<HTMLElement>(null)
  const gridHeaderRef = useRef<HTMLDivElement>(null)
  const carouselRef   = useRef<HTMLDivElement>(null)
  const carouselSectionRef = useRef<HTMLElement>(null)
  const studentRef    = useRef<HTMLElement>(null)
  const ctaRef        = useRef<HTMLElement>(null)

  const [carouselScroll, setCarouselScroll] = useState(0)
  const handleCarouselScroll = useCallback(() => {
    if (carouselRef.current) setCarouselScroll(carouselRef.current.scrollLeft)
  }, [])

  const scrollCarousel = (dir: 'left' | 'right') => {
    carouselRef.current?.scrollBy({ left: dir === 'left' ? -280 : 280, behavior: 'smooth' })
  }

  const handleActivityClick = (value: string) => {
    setActiveType(value === activeType ? 'all' : value)
    setTimeout(
      () => gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
      80
    )
  }

  const filteredExperiences = EXPERIENCES.filter((e) => {
    const regionMatch = activeRegion === 'all' || e.regionSlug === activeRegion
    const typeMatch   = activeType   === 'all' || e.type.toLowerCase() === activeType
    return regionMatch && typeMatch
  })

  const featured       = EXPERIENCES[0]
  const featuredTheme  = REGION_THEMES[featured.regionSlug as RegionThemeKey]

  const isCarouselAtStart = carouselScroll <= 8
  const isCarouselAtEnd   = carouselRef.current
    ? carouselScroll >= carouselRef.current.scrollWidth - carouselRef.current.clientWidth - 8
    : false

  // ─── 1. MOUNT ANIMATIONS ────────────────────────────────────────────────────
  useEffect(() => {
    registerGSAP()

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const ctx = gsap.context(() => {

      // ── HERO: image parallax (scrub) ──────────────────────────────────────
      if (heroImgRef.current && heroRef.current) {
        gsap.to(heroImgRef.current, {
          yPercent: 28,
          ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1.2,
          },
        })
      }

      // ── HERO: staggered text reveal ───────────────────────────────────────
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      if (heroLabelRef.current) {
        tl.from(heroLabelRef.current, { y: 24, opacity: 0, duration: 0.55 }, 0.25)
      }
      if (heroTitleRef.current) {
        const words = heroTitleRef.current.querySelectorAll('.hero-word')
        tl.from(words,
          { y: '110%', opacity: 0, stagger: 0.1, duration: 0.75 },
          0.5
        )
      }
      if (heroSubRef.current) {
        tl.from(heroSubRef.current, { y: 20, opacity: 0, duration: 0.55 }, 1.1)
      }



      // ── FEATURED: clip-path image wipe left → right ───────────────────────
      if (featuredImgRef.current && featuredRef.current) {
        gsap.fromTo(
          featuredImgRef.current,
          { clipPath: 'inset(0 100% 0 0 round 16px)' },
          {
            clipPath: 'inset(0 0% 0 0 round 16px)',
            duration: 1.1,
            ease: 'power3.inOut',
            scrollTrigger: {
              trigger: featuredRef.current,
              start: 'top bottom',
              once: true,
            },
          }
        )
        // PostageStamp spin-in after image wipe
        const stamp = featuredImgRef.current.querySelector('.featured-stamp-wrap')
        if (stamp) {
          gsap.from(stamp, {
            scale: 0,
            rotation: -200,
            opacity: 0,
            duration: 0.7,
            ease: 'back.out(1.7)',
            delay: 0.6,
            immediateRender: false, scrollTrigger: {
              trigger: featuredRef.current,
              start: 'top bottom',
              once: true,
            },
          })
        }
      }

      // ── FEATURED: content stagger slide up ───────────────────────────────
      if (featuredRef.current) {
        const items = featuredRef.current.querySelectorAll('.featured-item')
        gsap.from(items, {
          y: 44,
          opacity: 0,
          stagger: 0.11,
          duration: 0.65,
          ease: 'power2.out',
          immediateRender: false, scrollTrigger: {
            trigger: featuredRef.current,
            start: 'top bottom',
            once: true,
          },
        })
      }

      // ── GRID: header slides in ────────────────────────────────────────────
      if (gridHeaderRef.current) {
        gsap.from(gridHeaderRef.current.children, {
          y: 32,
          opacity: 0,
          stagger: 0.12,
          duration: 0.6,
          ease: 'power2.out',
          immediateRender: false, scrollTrigger: {
            trigger: gridHeaderRef.current,
            start: 'top bottom',
            once: true,
          },
        })
      }

      // ── ACTIVITY TILES: bounce scale in ──────────────────────────────────
      if (carouselSectionRef.current) {
        const tiles   = carouselSectionRef.current.querySelectorAll('.act-tile')
        const heading = carouselSectionRef.current.querySelector('.act-heading')
        if (heading) {
          gsap.from(heading.children, {
            y: 36,
            opacity: 0,
            stagger: 0.1,
            duration: 0.6,
            ease: 'power2.out',
            immediateRender: false, scrollTrigger: {
              trigger: heading,
              start: 'top bottom',
              once: true,
            },
          })
        }
        gsap.from(tiles, {
          scale: 0,
          opacity: 0,
          stagger: 0.07,
          duration: 0.5,
          ease: 'back.out(1.5)',
          immediateRender: false, scrollTrigger: {
            trigger: carouselRef.current,
            start: 'top bottom',
            once: true,
          },
        })
      }

      // ── STUDENT SECTION ───────────────────────────────────────────────────
      if (studentRef.current) {
        const emoji   = studentRef.current.querySelector('.student-emoji')
        const content = studentRef.current.querySelectorAll('.student-item')
        const tiles   = studentRef.current.querySelectorAll('.benefit-tile')

        if (emoji) {
          gsap.from(emoji, {
            y: -100,
            opacity: 0,
            rotation: -20,
            duration: 0.9,
            ease: 'bounce.out',
            immediateRender: false, scrollTrigger: {
              trigger: studentRef.current,
              start: 'top bottom',
              once: true,
            },
          })
        }
        if (content.length) {
          gsap.from(content, {
            y: 40,
            opacity: 0,
            stagger: 0.12,
            duration: 0.65,
            ease: 'power2.out',
            immediateRender: false, scrollTrigger: {
              trigger: studentRef.current,
              start: 'top bottom',
              once: true,
            },
          })
        }
        if (tiles.length) {
          gsap.from(tiles, {
            x: 60,
            opacity: 0,
            stagger: 0.13,
            duration: 0.6,
            ease: 'power2.out',
            immediateRender: false, scrollTrigger: {
              trigger: studentRef.current,
              start: 'top bottom',
              once: true,
            },
          })
        }
      }

      // ── CTA: 3D word flip reveal ──────────────────────────────────────────
      if (ctaRef.current) {
        const words   = ctaRef.current.querySelectorAll('.cta-word')
        const sub     = ctaRef.current.querySelector('.cta-sub')
        const buttons = ctaRef.current.querySelectorAll('.cta-btn')

        if (words.length) {
          gsap.from(words, {
            rotateX: 90,
            y: 30,
            opacity: 0,
            stagger: 0.09,
            duration: 0.65,
            ease: 'back.out(1.2)',
            transformOrigin: '50% 50% -30px',
            immediateRender: false, scrollTrigger: {
              trigger: ctaRef.current,
              start: 'top bottom',
              once: true,
            },
          })
        }
        if (sub) {
          gsap.from(sub, {
            y: 24,
            opacity: 0,
            duration: 0.55,
            delay: 0.35,
            ease: 'power2.out',
            immediateRender: false, scrollTrigger: {
              trigger: ctaRef.current,
              start: 'top bottom',
              once: true,
            },
          })
        }
        if (buttons.length) {
          gsap.from(buttons, {
            scale: 0.85,
            opacity: 0,
            stagger: 0.1,
            duration: 0.5,
            ease: 'back.out(1.6)',
            delay: 0.5,
            immediateRender: false, scrollTrigger: {
              trigger: ctaRef.current,
              start: 'top bottom',
              once: true,
            },
          })
        }
      }

    }) // end gsap.context

    return () => ctx.revert()
  }, []) // run once on mount

  // ─── 2. FILTER CHANGE ANIMATION ─────────────────────────────────────────────
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return
    const cards = gridRef.current?.querySelectorAll<HTMLElement>('.exp-card')
    if (!cards?.length) return
    gsap.fromTo(
      Array.from(cards),
      { y: 28, opacity: 0, scale: 0.96 },
      { y: 0, opacity: 1, scale: 1, stagger: 0.07, duration: 0.38, ease: 'power2.out' }
    )
  }, [activeRegion, activeType])

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <main>

      {/* ════════════════════════════════════════════════════════
          SECTION 1 — HERO
      ════════════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative h-[55vh] min-h-[420px] overflow-hidden flex items-center justify-center text-center"
      >
        {/* Parallax image wrapper — GSAP moves this independently */}
        <div ref={heroImgRef} className="absolute inset-[-15%] will-change-transform">
          <Image
            src={EXPERIENCES_HERO}
            alt="Experiences hero"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/20" />

        <div className="relative z-10 px-4 max-w-2xl mx-auto">
          <p ref={heroLabelRef} className="font-handwriting text-yellow-400 text-xl mb-3">
            not your usual trip
          </p>

          {/* Word-split headline for GSAP per-word reveal */}
          <h1 ref={heroTitleRef} className="font-display font-black text-white text-4xl md:text-6xl leading-tight mb-4 overflow-hidden">
            {['Experience', 'the', 'Unscripted'].map((word, i) => (
              <span key={i} className="inline-block overflow-hidden leading-tight align-bottom mr-[0.22em] last:mr-0">
                <span className="hero-word inline-block">{word}</span>
              </span>
            ))}
          </h1>

          <p ref={heroSubRef} className="font-body text-white/80 text-lg max-w-xl mx-auto">
            Every experience is something we&apos;ve done ourselves first. No packages. No
            checklists. Just real.
          </p>
        </div>

        <div className="absolute bottom-[-1px] left-0 right-0 z-10">
          <WavyDivider fill="#FFF8E7" />
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          SECTION 2 — FILTER BAR (sticky)
      ════════════════════════════════════════════════════════ */}
      <div className="md:sticky md:top-16 z-40 bg-[#FFF8E7] md:bg-[#FFF8E7]/95 md:backdrop-blur-sm border-b border-[#E2E8F0]/50">
        <div ref={filterBarRef} className="max-w-7xl mx-auto px-4 py-3">

          {/* Row 1 — Region */}
          <div className="flex gap-2 mb-2 overflow-x-auto md:flex-wrap md:overflow-visible" style={{ scrollbarWidth: 'none' }}>
            {REGIONS.map((r) => {
              const isActive = activeRegion === r.value
              return (
                <button
                  key={r.value}
                  onClick={() => setActiveRegion(r.value)}
                  style={isActive ? ({ '--rc': r.primary } as React.CSSProperties) : undefined}
                  className={cn(
                    'flex-none px-4 py-1.5 rounded-full font-body text-sm font-medium transition-all duration-150',
                    isActive
                      ? 'bg-[var(--rc)] text-white shadow-sm scale-105'
                      : 'bg-white border-2 border-gray-200 text-dark/70 hover:border-gray-300 hover:scale-105'
                  )}
                >
                  {r.label}
                </button>
              )
            })}
          </div>

          {/* Row 2 — Type */}
          <div className="flex gap-2 overflow-x-auto md:flex-wrap md:overflow-visible" style={{ scrollbarWidth: 'none' }}>
            {[{ label: 'All Types', value: 'all' }, ...ACTIVITY_TYPES.map((a) => ({ label: a.label, value: a.value }))].map(
              (t) => {
                const isActive = activeType === t.value
                return (
                  <button
                    key={t.value}
                    onClick={() => setActiveType(t.value)}
                    className={cn(
                      'flex-none px-3 py-1 rounded-full font-body text-xs font-medium border-2 transition-all duration-150',
                      isActive
                        ? 'bg-dark text-white border-dark scale-105'
                        : 'bg-white border-gray-200 text-dark/60 hover:border-gray-300 hover:scale-105'
                    )}
                  >
                    {t.label}
                  </button>
                )
              }
            )}
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════
          SECTION 3 — FEATURED EXPERIENCE
      ════════════════════════════════════════════════════════ */}
      <section ref={featuredRef} className="bg-[#FFF8E7] py-10 md:py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

            {/* LEFT — image with clip-path animation */}
            <div ref={featuredImgRef} className="relative h-72 md:h-80 rounded-2xl overflow-hidden">
              <Image
                src={featured.image}
                alt={featured.name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute top-4 left-4 featured-stamp-wrap">
                <PostageStamp region={featured.regionSlug as RegionThemeKey} />
              </div>
            </div>

            {/* RIGHT — staggered content items */}
            <div>
              <div className="featured-item">
                <WashiTape color="yellow" rotation={-2} width="w-28" className="mb-4" />
                <p className="font-handwriting text-dark/50 text-lg mb-2">our favourite →</p>
              </div>
              <div className="featured-item mb-3">
                <StampBadge text="Featured" color={featuredTheme.primary} rotation={-3} />
              </div>
              <h2 className="featured-item font-display font-black text-dark text-3xl md:text-4xl leading-tight mb-1">
                {featured.name}
              </h2>
              <p
                style={{ color: featuredTheme.primary }}
                className="featured-item font-handwriting text-lg mb-4"
              >
                {featured.region}
              </p>
              <p className="featured-item font-body text-gray-600 text-base leading-relaxed mb-6">
                A 4-day journey through apple orchards, pine forests and shepherd villages
                that most maps don&apos;t show.
              </p>

              {/* Detail pills */}
              <div className="featured-item flex flex-wrap gap-2 mb-6">
                {[
                  { emoji: '📅', label: '4 Days' },
                  { emoji: '👥', label: 'Group' },
                  { emoji: '💰', label: 'From ₹8,999' },
                ].map((pill) => (
                  <span
                    key={pill.label}
                    className="inline-flex items-center gap-1.5 bg-white border border-gray-200 rounded-full px-3 py-1 font-body text-sm text-dark/70"
                  >
                    <span>{pill.emoji}</span>
                    {pill.label}
                  </span>
                ))}
              </div>

              <div className="featured-item">
                <Link
                  href={`/destinations/${featured.regionSlug}`}
                  className="inline-block font-body font-semibold text-dark bg-yellow px-6 py-3 border-2 border-dark hover:bg-yellow/80 hover:scale-105 transition-all duration-200 active:scale-100"
                >
                  View Experience →
                </Link>
              </div>
            </div>
          </div>
        </div>

        <WavyDivider fill="#E8F4F0" />
      </section>

      {/* ════════════════════════════════════════════════════════
          SECTION 4 — ALL EXPERIENCES GRID
      ════════════════════════════════════════════════════════ */}
      <section ref={gridRef} className="bg-[#E8F4F0] py-10 md:py-20 scroll-mt-32">
        <div className="max-w-7xl mx-auto px-4 md:px-8">

          {/* Header */}
          <div ref={gridHeaderRef} className="flex flex-col sm:flex-row sm:items-end gap-4 mb-10">
            <div>
              <SectionLabel text="All Experiences" style="handwritten" className="block mb-2" />
              <p className="font-handwriting text-dark/50 text-lg">
                every one of these we&apos;ve done ourselves
              </p>
            </div>
            <div className="sm:ml-auto">
              <StampBadge
                text={`${filteredExperiences.length} experience${filteredExperiences.length !== 1 ? 's' : ''}`}
                color="#0F172A"
                rotation={-2}
              />
            </div>
          </div>

          {/* Grid */}
          {filteredExperiences.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredExperiences.map((exp) => (
                <ExperienceCard key={exp.name} {...exp} className="exp-card" />
              ))}
            </div>
          ) : (
            <div className="py-20 flex flex-col items-center gap-6">
              <JournalNote
                text="nothing here yet — check back soon 🗺️"
                type="sticky"
                className="text-center"
              />
              <button
                onClick={() => { setActiveRegion('all'); setActiveType('all') }}
                className="font-body text-sm text-dark/50 underline underline-offset-2 hover:text-dark transition-colors"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>

        <WavyDivider fill="#FFF8E7" />
      </section>

      {/* ════════════════════════════════════════════════════════
          SECTION 5 — ACTIVITY TYPES CAROUSEL
      ════════════════════════════════════════════════════════ */}
      <section ref={carouselSectionRef} className="bg-[#FFF8E7] py-10 md:py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8">

          <div className="act-heading mb-10">
            <h2 className="font-display font-bold text-dark text-3xl mb-1">
              Browse by Activity
            </h2>
            <p className="font-handwriting text-dark/50 text-xl">
              what kind of traveler are you?
            </p>
          </div>

          {/* Carousel with arrows */}
          <div className="relative">
            {!isCarouselAtStart && (
              <button
                onClick={() => scrollCarousel('left')}
                className="absolute left-0 top-[calc(50%-1rem)] -translate-y-1/2 -translate-x-4 z-10 w-11 h-11 rounded-full bg-white shadow-[var(--shadow-card)] flex items-center justify-center hover:shadow-[var(--shadow-polaroid)] hover:scale-110 active:scale-95 transition-all duration-200"
                aria-label="Scroll left"
              >
                <ChevronLeft size={20} className="text-dark" />
              </button>
            )}
            {!isCarouselAtEnd && (
              <button
                onClick={() => scrollCarousel('right')}
                className="absolute right-0 top-[calc(50%-1rem)] -translate-y-1/2 translate-x-4 z-10 w-11 h-11 rounded-full bg-white shadow-[var(--shadow-card)] flex items-center justify-center hover:shadow-[var(--shadow-polaroid)] hover:scale-110 active:scale-95 transition-all duration-200"
                aria-label="Scroll right"
              >
                <ChevronRight size={20} className="text-dark" />
              </button>
            )}

            <div
              ref={carouselRef}
              onScroll={handleCarouselScroll}
              className="flex gap-4 overflow-x-auto pb-2"
              style={
                {
                  scrollSnapType: 'x mandatory',
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                } as React.CSSProperties
              }
            >
              {ACTIVITY_TYPES.map((act) => {
                const isActive = activeType === act.value
                return (
                  <button
                    key={act.value}
                    onClick={() => handleActivityClick(act.value)}
                    style={
                      {
                        scrollSnapAlign: 'start',
                        '--act-color': act.color,
                      } as React.CSSProperties
                    }
                    className={cn(
                      'act-tile flex-shrink-0 w-32 bg-white rounded-2xl p-5 text-center',
                      'shadow-[var(--shadow-card)]',
                      'hover:-translate-y-1.5 hover:shadow-[var(--shadow-polaroid)]',
                      'active:scale-95',
                      'transition-all duration-200 cursor-pointer',
                      isActive && 'ring-2 ring-[var(--act-color)] ring-offset-2 -translate-y-1'
                    )}
                  >
                    <div className={cn(
                      'w-16 h-16 mx-auto rounded-2xl bg-white p-2 shadow-[var(--shadow-card)] mb-2',
                      'transition-transform duration-200',
                      isActive && 'scale-110'
                    )}>
                      <Image
                        src={getExperienceIcon(act.value)}
                        alt={act.label}
                        width={64}
                        height={64}
                        className="w-full h-full object-contain mix-blend-multiply"
                      />
                    </div>
                    <p
                      style={{ color: isActive ? act.color : undefined }}
                      className="font-heading font-semibold text-xs text-dark leading-tight transition-colors duration-200"
                    >
                      {act.label}
                    </p>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <WavyDivider fill="#F59E0B" />
      </section>

      {/* ════════════════════════════════════════════════════════
          SECTION 6 — STUDENT PROGRAM CALLOUT
      ════════════════════════════════════════════════════════ */}
      <section ref={studentRef} className="bg-[#F59E0B] py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

            {/* LEFT */}
            <div>
              <span className="student-emoji text-8xl block mb-5 will-change-transform" role="img" aria-label="School bag">
                🎒
              </span>
              <h2 className="student-item font-display font-black text-dark text-3xl md:text-4xl leading-tight mb-4">
                Schools &amp; Colleges
              </h2>
              <p className="student-item font-body text-dark/70 text-base leading-relaxed mb-8 max-w-md">
                Experiential learning through nature and culture. We design school and college
                programs that go beyond textbooks.
              </p>
              <div className="student-item">
                <Link
                  href="/student-program"
                  className="inline-block font-body font-semibold text-white bg-dark px-6 py-3 border-2 border-dark hover:bg-dark/90 hover:scale-105 active:scale-100 transition-all duration-200"
                >
                  Plan a School Trip →
                </Link>
              </div>
            </div>

            {/* RIGHT — benefit tiles */}
            <div className="flex flex-col gap-3">
              {[
                '✅ Real terrain, real learning',
                '✅ Confidence + curiosity building',
                '✅ Designed for Indian schools',
              ].map((benefit) => (
                <div key={benefit} className="benefit-tile bg-white/20 rounded-xl p-4">
                  <p className="font-handwriting text-dark text-lg">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <WavyDivider fill="#FFD60A" />
      </section>

      {/* ════════════════════════════════════════════════════════
          SECTION 7 — FINAL CTA
      ════════════════════════════════════════════════════════ */}
      <section ref={ctaRef} className="bg-yellow py-20 md:py-28 overflow-hidden">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <WashiTape color="blue" rotation={-1} width="w-24" className="mx-auto mb-6" />

          {/* 3D word-flip headline */}
          <h2 className="font-display font-black text-dark text-4xl md:text-5xl leading-tight mb-3 perspective-[600px]">
            {["Can't", 'decide?', "We'll", 'help.'].map((word, i) => (
              <span key={i} className="cta-word inline-block mr-[0.22em] last:mr-0 will-change-transform">
                {word}
              </span>
            ))}
          </h2>

          <p className="cta-sub font-handwriting text-dark/60 text-xl mb-10">
            no pressure, no fixed plans
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/contact"
              className="cta-btn font-body font-semibold text-white bg-dark px-8 py-4 border-2 border-dark hover:bg-dark/90 hover:scale-105 active:scale-100 transition-all duration-200"
            >
              Talk to Us
            </Link>
            <Link
              href="/destinations"
              className="cta-btn font-body font-semibold text-dark px-8 py-4 border-2 border-dark hover:bg-dark/10 hover:scale-105 active:scale-100 transition-all duration-200"
            >
              View All Destinations
            </Link>
          </div>
        </div>
      </section>

    </main>
  )
}
