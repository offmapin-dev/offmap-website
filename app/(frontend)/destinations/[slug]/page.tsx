'use client'

import { use, useRef, useState, useCallback, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MapPin, ChevronLeft, ChevronRight } from 'lucide-react'
import { gsap } from 'gsap'
import { REGION_THEMES, LOCATIONS, type RegionThemeKey } from '@/lib/constants'
import {
  PostageStamp,
  PolaroidCard,
  WashiTape,
  StampBadge,
  JournalNote,
  SectionLabel,
} from '@/components/ui/scrapbook'
import { REGION_EXPERIENCES } from '@/components/sections/RegionSection'
import type { Experience } from '@/components/sections/RegionSection'
import { cn } from '@/lib/utils'
import { HERO_IMAGES, POLAROID_IMAGES, EXPERIENCE_IMAGES, FALLBACK_IMAGE } from '@/lib/images'
import { getExperienceIcon } from '@/lib/icons'
import { registerGSAP } from '@/lib/animations'

// ─── Per-region intro subtitles ───────────────────────────────────────────────
const INTRO_SUBTITLES: Record<string, string> = {
  'himachal-pradesh': 'Quiet villages, forest trails, slow mornings.',
  rajasthan: 'Beyond forts — desert, villages, adventure.',
  kashmir: 'Snow-capped peaks, shikara lakes, saffron fields.',
  uttarakhand: 'Quieter, raw, spacious.',
}

// ─── Per-region intro body copy ───────────────────────────────────────────────
const INTRO_BODY: Record<string, string> = {
  'himachal-pradesh':
    'Himachal is less about the postcard views and more about the pace. Villages where time slows, forests you walk through without a plan, and mornings that feel like they belong to you. We explore valleys that don\'t make it to the top of Google results — and that\'s exactly the point.',
  rajasthan:
    'Beyond the forts and palaces lies a Rajasthan most tourists never see. Leopards at dusk in Jawai, desert sunsets with no crowd, and craft villages where artisans still work the old way. We\'ve walked it before we ever guided anyone through it.',
  kashmir:
    'Kashmir is a place you don\'t just visit — you carry it with you long after. Shikara rides at dawn, meadows that stretch into the horizon, and a warmth in the people that no travel guide can capture. We\'re still exploring, and soon we\'ll take you there.',
  uttarakhand:
    'Uttarakhand doesn\'t announce itself. It unfolds slowly — dense oak forests, a leopard track on a quiet trail, the sound of a river around a bend. Less touristy than Himachal, just as beautiful. We love it for the space it gives you to think.',
}

// ─── Per-region activities ────────────────────────────────────────────────────
interface Activity {
  label: string
  icon: string
}

const ACTIVITIES: Record<string, Activity[]> = {
  'himachal-pradesh': [
    { label: 'Paragliding',      icon: '/icons/adventure.png'  },
    { label: 'Cycling',          icon: '/icons/activities.png' },
    { label: 'Day Hikes',        icon: '/icons/hiking.png'     },
    { label: 'Learn Paragliding',icon: '/icons/learning.png'   },
  ],
  rajasthan: [
    { label: 'Miniature Painting', icon: '/icons/cultural.png'   },
    { label: 'Horse Riding',       icon: '/icons/activities.png' },
    { label: 'Cooking Workshop',   icon: '/icons/cultural.png'   },
    { label: 'Yoga',               icon: '/icons/stays.png'      },
    { label: 'Run + Hike',         icon: '/icons/hiking.png'     },
  ],
  kashmir: [],
  uttarakhand: [],
}

// ─── Per-region reviews ──────────────────────────────────────────────────────
const REGION_REVIEWS: Record<string, { name: string; trip: string; rating: number; text: string }[]> = {
  'himachal-pradesh': [
    { name: 'Deepika Hada', trip: 'Bir-Barot Trek', rating: 5, text: "This was my very first trip with strangers and one of the best decisions I've ever made. The trails, the stays, the people — everything felt intentional and real." },
    { name: 'Sachin Kumar', trip: 'Rajgundha Valley', rating: 5, text: "OFFMAP truly lives up to their name. They took us off the beaten path to places I didn't know existed." },
    { name: 'Sumit Chaudhary', trip: 'Rajgundha Valley', rating: 5, text: 'The Rajgundha trip was an unforgettable experience. The planning was seamless, the stay was beautiful.' },
  ],
  rajasthan: [
    { name: 'Riya Sharma', trip: 'Jawai Safari', rating: 5, text: 'Jawai was unlike anything I expected from Rajasthan. Leopards at dusk, quiet villages, and a pace that let me actually enjoy it all.' },
    { name: 'Arjun Verma', trip: 'Jawai Safari', rating: 5, text: 'The team knew every corner of the place. It felt like traveling with a friend who lives there, not a tour guide.' },
    { name: 'Priya Desai', trip: 'Udaipur\u2013Mount Abu', rating: 5, text: "I've been to Rajasthan before, but this trip showed me a completely different side. Off the tourist trail, exactly as promised." },
  ],
  kashmir: [],
  uttarakhand: [
    { name: 'Ankur Mehta', trip: 'Kasar Devi\u2013Khaliya Top', rating: 5, text: 'The quietness of Uttarakhand is something else. No crowds, no noise — just mountains and good company.' },
    { name: 'Sneha Reddy', trip: 'Binsar Wildlife', rating: 5, text: 'Uttarakhand with OffMap felt like a secret only a few people know about. I hope it stays that way.' },
    { name: 'Vikram Rao', trip: 'Kasar Devi\u2013Khaliya Top', rating: 5, text: 'The trek was exactly the right level of challenge. And the views from Khaliya Top — absolutely worth every step.' },
  ],
}

// ─── Review helpers ───────────────────────────────────────────────────────────
function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  const first = parts[0]?.[0] ?? ''
  const last = parts.length > 1 ? parts[parts.length - 1][0] : ''
  return (first + last).toUpperCase()
}

function DestinationReviewsSection({
  reviews,
  regionName,
  bgColor,
  ctaColor,
}: {
  reviews: { name: string; trip: string; rating: number; text: string }[]
  regionName: string
  bgColor: string
  ctaColor: string
}) {
  const sectionRef = useRef<HTMLElement>(null)
  const reviewContentRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const isAnimatingRef = useRef(false)

  const resetAutoAdvance = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    if (reviews.length <= 1) return
    timerRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % reviews.length)
    }, 5000)
  }, [reviews.length])

  const goTo = useCallback((index: number) => {
    if (isAnimatingRef.current) return
    setActive(index)
    resetAutoAdvance()
  }, [resetAutoAdvance])

  useEffect(() => {
    resetAutoAdvance()
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [resetAutoAdvance])

  useEffect(() => {
    if (!reviewContentRef.current) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return
    isAnimatingRef.current = true
    gsap.fromTo(
      reviewContentRef.current,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out', onComplete: () => { isAnimatingRef.current = false } },
    )
  }, [active])

  useEffect(() => {
    registerGSAP()
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return
    const ctx = gsap.context(() => {
      if (sectionRef.current) {
        gsap.from(sectionRef.current.querySelector('.review-card-wrapper'), {
          y: 40, opacity: 0, duration: 0.7, ease: 'power2.out', delay: 0.15, immediateRender: false,
          scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', once: true },
        })
      }
    })
    return () => ctx.revert()
  }, [])

  if (!reviews.length) {
    return (
      <section style={{ backgroundColor: bgColor }} className="py-10 md:py-14">
        <div className="max-w-5xl mx-auto px-4 md:px-8">
          <SectionLabel text="Traveler Stories" style="handwritten" className="block mb-3" />
          <h2 className="font-display font-bold text-dark text-3xl mb-6">What people say about {regionName}</h2>
          <div className="text-center py-8">
            <JournalNote text="Reviews coming soon" type="sticky" className="inline-block" />
          </div>
        </div>
        <WavyDivider fill={ctaColor} position="bottom" />
      </section>
    )
  }

  const review = reviews[active]

  return (
    <section ref={sectionRef} className="bg-[#E0F4F8] py-10 md:py-14">
      <div className="max-w-3xl mx-auto px-4 md:px-8">
        <SectionLabel text="Traveler Stories" style="handwritten" className="block mb-3" />
        <h2 className="font-display font-bold text-dark text-3xl mb-6">What people say about {regionName}</h2>

        <div className="review-card-wrapper bg-white rounded-3xl p-4 md:p-5 shadow-[var(--shadow-card)]">
          <div className="bg-[#0D78A8] rounded-2xl p-5 md:p-6 relative overflow-hidden">
            <span className="absolute top-1 left-3 font-display font-black text-6xl text-white/30 leading-none select-none pointer-events-none">
              &ldquo;
            </span>

            <div ref={reviewContentRef} key={active}>
              <div className="flex items-center gap-0.5 mb-3">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <span key={i} className="text-yellow text-xl leading-none">&#9733;</span>
                ))}
              </div>

              <p className="font-body text-white text-base text-center leading-relaxed italic px-6 md:px-10 mb-5">
                {review.text}
              </p>

              <div className="flex items-center justify-between px-2">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <span className="font-display font-bold text-white text-base">{getInitials(review.name)}</span>
                </div>
                <div className="flex-1 text-center mx-3">
                  <p className="font-display italic font-bold text-white text-base">{review.name}</p>
                  <p className="font-body text-white/60 text-sm">{review.trip}</p>
                </div>
                <span className="font-display font-black text-4xl text-white/30 leading-none select-none pointer-events-none flex-shrink-0">&rdquo;</span>
              </div>
            </div>

            {reviews.length > 1 && (
              <>
                <button
                  onClick={() => goTo((active - 1 + reviews.length) % reviews.length)}
                  className="absolute left-1.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors duration-200"
                  aria-label="Previous review"
                >
                  <ChevronLeft size={16} className="text-white" />
                </button>
                <button
                  onClick={() => goTo((active + 1) % reviews.length)}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors duration-200"
                  aria-label="Next review"
                >
                  <ChevronRight size={16} className="text-white" />
                </button>
              </>
            )}
          </div>
        </div>

        {reviews.length > 1 && (
          <div className="flex items-center justify-center gap-2.5 mt-5">
            {reviews.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Go to review ${i + 1}`}
                className={cn(
                  'rounded-full transition-all duration-300',
                  i === active ? 'w-3 h-3 bg-[#0D78A8]' : 'w-2 h-2 bg-[#0D78A8]/30 hover:bg-[#0D78A8]/50',
                )}
              />
            ))}
          </div>
        )}
      </div>
      <WavyDivider fill={ctaColor} position="bottom" />
    </section>
  )
}

// ─── WavyDivider (local) ──────────────────────────────────────────────────────
function WavyDivider({ fill, position = 'bottom' }: { fill: string; position?: 'top' | 'bottom' }) {
  const bottomPath =
    'M0,40 C180,80 360,0 540,40 C720,80 900,0 1080,40 C1260,80 1350,20 1440,40 L1440,80 L0,80 Z'
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

function SlugExperienceCard({
  exp,
  region,
}: {
  exp: Experience
  region: RegionThemeKey
}) {
  const theme = REGION_THEMES[region]

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
          <p className="font-heading font-semibold text-dark text-base mb-3">{exp.name}</p>
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
      style={{ scrollSnapAlign: 'start', borderLeft: `4px solid ${theme.primary}` } as React.CSSProperties}
      className={cn(
        'flex-shrink-0 w-64 md:w-72 rounded-2xl overflow-hidden bg-white',
        'shadow-[var(--shadow-card)] hover:-translate-y-1 hover:shadow-[var(--shadow-polaroid)]',
        'transition-all duration-200 group block'
      )}
    >
      <div className="relative h-48 overflow-hidden">
        <Image
          src={imgSrc}
          alt={exp.name}
          fill
          sizes="288px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
        <div className="absolute top-3 left-3">
          <StampBadge text={exp.type} color={theme.primary} rotation={-3} />
        </div>
        <div className="absolute top-3 right-3">
          <span className="bg-dark/60 text-white font-handwriting text-xs px-2 py-1 rounded-full">
            {exp.days}
          </span>
        </div>
      </div>
      <div className="bg-white p-4">
        <p className="font-heading font-semibold text-dark text-base leading-snug">{exp.name}</p>
        <p className="font-handwriting text-gray-400 text-sm flex items-center gap-1 mt-1">
          <MapPin size={12} className="flex-none" />
          {theme.name}
        </p>
        <div className="flex items-center justify-between mt-3">
          <p style={{ color: theme.primary }} className="font-body text-sm font-bold">
            From {exp.price}
          </p>
          <p style={{ color: theme.primary }} className="font-handwriting text-base">
            View →
          </p>
        </div>
      </div>
    </Link>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function DestinationDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)

  const location = LOCATIONS.find((l) => l.slug === slug)
  if (!location) notFound()

  const regionKey = slug as RegionThemeKey
  const theme = REGION_THEMES[regionKey]
  if (!theme) notFound()

  const experiences = REGION_EXPERIENCES[regionKey] ?? []
  const heroImage = HERO_IMAGES[slug] ?? HERO_IMAGES['himachal-pradesh']
  const polaroids = POLAROID_IMAGES[slug] ?? POLAROID_IMAGES['himachal-pradesh']
  const introSubtitle = INTRO_SUBTITLES[slug] ?? theme.description
  const introBody = INTRO_BODY[slug] ?? ''
  const activities = ACTIVITIES[slug] ?? []

  // Scroll refs for experiences section
  const scrollRef = useRef<HTMLDivElement>(null)
  const [scrollPos, setScrollPos] = useState(0)
  const handleScroll = useCallback(() => {
    if (scrollRef.current) setScrollPos(scrollRef.current.scrollLeft)
  }, [])
  const scrollByAmount = (dir: 'left' | 'right') => {
    scrollRef.current?.scrollBy({ left: dir === 'left' ? -288 : 288, behavior: 'smooth' })
  }
  const isAtStart = scrollPos <= 8
  const isAtEnd = scrollRef.current
    ? scrollPos >= scrollRef.current.scrollWidth - scrollRef.current.clientWidth - 8
    : false

  return (
    <main>

      {/* ═══ SECTION 1: HERO ═══════════════════════════════════════════════════ */}
      <section className="relative h-[50vh] min-h-[400px] overflow-hidden">
        <Image
          src={heroImage}
          alt={theme.name}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to bottom, ${theme.primary}BB 0%, ${theme.primary}55 40%, rgba(0,0,0,0.72) 100%)`,
          }}
        />

        {/* PostageStamp top-right */}
        <div className="absolute top-6 right-6 z-10">
          <PostageStamp region={regionKey} />
        </div>

        {/* Content bottom-left */}
        <div className="absolute bottom-0 left-0 right-0 z-10 pb-16 px-6 md:px-12 max-w-3xl">
          <span className="text-7xl md:text-8xl block mb-3" role="img" aria-label={theme.name}>
            {theme.emoji}
          </span>
          <p style={{ color: theme.accent }} className="font-handwriting text-xl mb-2">
            {theme.label}
          </p>
          <h1 className="font-display font-black text-white text-5xl md:text-7xl leading-none mb-4">
            {theme.name}
          </h1>
          <p className="font-body text-white/80 text-lg max-w-xl mb-8">
            {introSubtitle}
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href={`#experiences`}
              className="font-body font-semibold px-6 py-3 border-2 inline-block transition-colors duration-200 hover:opacity-90"
              style={{ backgroundColor: theme.primary, borderColor: theme.primary, color: '#ffffff' }}
            >
              Explore Experiences
            </Link>
            <Link
              href="/contact"
              className="font-body font-semibold text-white px-6 py-3 border-2 border-white inline-block hover:bg-white/10 transition-colors duration-200"
            >
              Plan My Trip
            </Link>
          </div>
        </div>

        {/* Wavy divider into region.bg */}
        <div className="absolute bottom-[-1px] left-0 right-0 z-10">
          <WavyDivider fill={theme.bg} position="bottom" />
        </div>
      </section>

      {/* ═══ SECTION 2: REGION INTRO ═══════════════════════════════════════════ */}
      <section style={{ backgroundColor: theme.bg }} className="py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

            {/* LEFT — text */}
            <div>
              <SectionLabel text="about this region" style="handwritten" className="block mb-5" />
              <h2
                className="font-display font-bold text-3xl md:text-4xl leading-tight mb-5"
                style={{ color: theme.primary }}
              >
                {introSubtitle}
              </h2>
              <p className="font-body text-dark/60 text-base leading-relaxed mb-8">
                {introBody}
              </p>

              {/* Region map placeholder */}
              <div className="bg-white/60 rounded-xl p-6 mb-6 border border-dashed border-gray-300">
                <div className="flex items-center justify-center h-40">
                  <svg width="120" height="120" viewBox="0 0 120 120" fill="none" className="opacity-30" aria-hidden>
                    <circle cx="60" cy="60" r="50" stroke={theme.primary} strokeWidth="2" strokeDasharray="6 4" />
                    <circle cx="40" cy="45" r="4" fill={theme.primary} />
                    <circle cx="70" cy="35" r="4" fill={theme.primary} />
                    <circle cx="55" cy="65" r="4" fill={theme.primary} />
                    <circle cx="80" cy="60" r="4" fill={theme.primary} />
                    <path d="M40 45L70 35M70 35L80 60M55 65L40 45M55 65L80 60" stroke={theme.primary} strokeWidth="1" opacity="0.3" />
                  </svg>
                </div>
                <div className="text-center mt-2">
                  <JournalNote text="More detailed map coming soon" type="sticky" className="inline-block" />
                </div>
              </div>

              <JournalNote
                text={`${theme.emoji} ${theme.label} — OffMap India`}
                type="sticky"
                className="rotate-[2deg]"
              />
            </div>

            {/* RIGHT — overlapping polaroids */}
            <div className="relative flex justify-center items-start h-80 mt-8 lg:mt-0">
              <PolaroidCard
                src={polaroids[0]}
                alt={`${theme.name} landscape`}
                caption={`${theme.name}, India`}
                rotation={-5}
                size="md"
                washiColor="yellow"
                className="absolute left-4 top-0 z-10"
              />
              <PolaroidCard
                src={polaroids[1]}
                alt={`${theme.name} detail`}
                caption={theme.label}
                rotation={4}
                size="md"
                washiColor="blue"
                className="absolute right-4 top-8 z-20"
              />
            </div>
          </div>
        </div>

        {/* Wavy into white */}
        <WavyDivider fill="#FFFFFF" position="bottom" />
      </section>

      {/* ═══ SECTION 3: EXPERIENCES ════════════════════════════════════════════ */}
      <section id="experiences" className="bg-white py-10 md:py-14 scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="mb-6">
            <SectionLabel text="Experiences" style="handwritten" className="block mb-3" />
            <h2 className="font-display font-bold text-dark text-3xl">
              What to do in {theme.name}
            </h2>
          </div>

          {/* Horizontal scroll */}
          <div className="relative">
            {!isAtStart && (
              <button
                onClick={() => scrollByAmount('left')}
                className="absolute left-0 top-[96px] -translate-x-4 z-10 w-10 h-10 rounded-full bg-white shadow-[var(--shadow-card)] flex items-center justify-center hover:shadow-[var(--shadow-polaroid)] transition-shadow duration-200"
                aria-label="Scroll left"
              >
                <ChevronLeft size={18} className="text-dark" />
              </button>
            )}
            {!isAtEnd && experiences.length > 2 && (
              <button
                onClick={() => scrollByAmount('right')}
                className="absolute right-0 top-[96px] translate-x-4 z-10 w-10 h-10 rounded-full bg-white shadow-[var(--shadow-card)] flex items-center justify-center hover:shadow-[var(--shadow-polaroid)] transition-shadow duration-200"
                aria-label="Scroll right"
              >
                <ChevronRight size={18} className="text-dark" />
              </button>
            )}
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
                <SlugExperienceCard key={exp.name} exp={exp} region={regionKey} />
              ))}
            </div>
          </div>
        </div>

        {/* Wavy into region.bg */}
        <WavyDivider fill={theme.bg} position="bottom" />
      </section>

      {/* ═══ SECTION 4: ACTIVITIES GRID ════════════════════════════════════════ */}
      <section style={{ backgroundColor: theme.bg }} className="py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-6">
            <SectionLabel text="Things To Do" style="handwritten" className="block mb-3" />
            <h2 className="font-display font-bold text-dark text-3xl">
              Activities in {theme.name}
            </h2>
          </div>

          {activities.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-w-3xl mx-auto">
              {activities.map((act) => (
                <div
                  key={act.label}
                  style={
                    {
                      '--cat': theme.primary,
                      '--cat-bg': theme.cardBg,
                    } as React.CSSProperties
                  }
                  className={cn(
                    'bg-white rounded-2xl p-5 text-center',
                    'shadow-[var(--shadow-card)]',
                    'hover:-translate-y-1 hover:shadow-[var(--shadow-polaroid)]',
                    'transition-all duration-200'
                  )}
                >
                  <div className="w-14 h-14 mx-auto mb-3 flex items-center justify-center">
                    <Image
                      src={act.icon}
                      alt={act.label}
                      width={48}
                      height={48}
                      className="object-contain mix-blend-multiply"
                    />
                  </div>
                  <p className="font-heading font-semibold text-dark text-xs leading-tight">
                    {act.label}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <JournalNote
                text="Activities coming soon — we're still exploring! 🗺️"
                type="sticky"
                className="inline-block mx-auto"
              />
            </div>
          )}
        </div>

        {/* Wavy into reviews bg */}
        <WavyDivider fill={theme.bg} position="bottom" />
      </section>

      {/* ═══ SECTION 4.5: REVIEWS ════════════════════════════════════════ */}
      <DestinationReviewsSection
        reviews={REGION_REVIEWS[slug] ?? []}
        regionName={theme.name}
        bgColor={theme.bg}
        ctaColor={theme.primary}
      />

      {/* ═══ SECTION 5: CTA ════════════════════════════════════════════════════ */}
      <section style={{ backgroundColor: theme.primary }} className="py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="mb-4">
            <WashiTape color="yellow" rotation={-1} width="w-32" className="mx-auto mb-6" />
          </div>
          <h2 className="font-display font-black text-white text-4xl md:text-5xl leading-tight mb-3">
            Ready for {theme.name}?
          </h2>
          <p className="font-handwriting text-white/80 text-2xl mb-6">
            let&apos;s make it happen →
          </p>
          <Link
            href={`/contact?destination=${slug}`}
            className="font-body font-semibold bg-white px-8 py-4 border-2 border-white inline-block hover:bg-transparent hover:!text-white transition-colors duration-300 text-[var(--cta-c)]"
            style={{ '--cta-c': theme.primary } as React.CSSProperties}
          >
            Plan My {theme.name} Trip
          </Link>
        </div>
      </section>

    </main>
  )
}
