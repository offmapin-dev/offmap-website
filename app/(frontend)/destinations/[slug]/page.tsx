'use client'

import { use } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MapPin, ChevronLeft, ChevronRight } from 'lucide-react'
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
import { useRef, useState, useCallback } from 'react'

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
      <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
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
      <section style={{ backgroundColor: theme.bg }} className="py-16 md:py-24">
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
      <section id="experiences" className="bg-white py-16 md:py-24 scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="mb-10">
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
      <section style={{ backgroundColor: theme.bg }} className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-10">
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

        {/* Wavy into region.primary */}
        <WavyDivider fill={theme.primary} position="bottom" />
      </section>

      {/* ═══ SECTION 5: CTA ════════════════════════════════════════════════════ */}
      <section style={{ backgroundColor: theme.primary }} className="py-20 md:py-28">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="mb-4">
            <WashiTape color="yellow" rotation={-1} width="w-32" className="mx-auto mb-6" />
          </div>
          <h2 className="font-display font-black text-white text-4xl md:text-5xl leading-tight mb-3">
            Ready for {theme.name}?
          </h2>
          <p className="font-handwriting text-white/80 text-2xl mb-10">
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
