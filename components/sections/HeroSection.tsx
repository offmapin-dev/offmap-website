'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Search } from 'lucide-react'
import { SearchModal } from '@/components/ui/SearchModal'
import { TornEdge } from '@/components/ui/scrapbook'
import { cn } from '@/lib/utils'
import { registerGSAP, EASE_OUT } from '@/lib/animations'
import { HOMEPAGE_HERO } from '@/lib/images'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface Stat {
  target: number
  suffix: string
  label: string
  decimals?: number
}

const STATS: Stat[] = [
  { target: 500, suffix: '+', label: 'Travelers' },
  { target: 20, suffix: '+', label: 'Destinations' },
  { target: 4.9, suffix: '★', label: 'Rating', decimals: 1 },
]

// Words for the clip reveal
const HEADLINE_LINE1 = ['Travel', 'slow,', 'go']
const HEADLINE_LINE2 = ['Offmap!']
const ALL_WORDS = [...HEADLINE_LINE1, ...HEADLINE_LINE2]

export function HeroSection() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const imgWrapperRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)
  const subtextRef = useRef<HTMLParagraphElement>(null)
  const searchRef = useRef<HTMLDivElement>(null)
  const separatorRef = useRef<HTMLParagraphElement>(null)
  const buttonsRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)

  // Refs for each word's inner span (clip reveal target)
  const wordInnerRefs = useRef<(HTMLSpanElement | null)[]>([])

  const stat0Ref = useRef<HTMLSpanElement>(null)
  const stat1Ref = useRef<HTMLSpanElement>(null)
  const stat2Ref = useRef<HTMLSpanElement>(null)
  const statRefs = [stat0Ref, stat1Ref, stat2Ref]

  useEffect(() => {
    registerGSAP()

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (!reduced) {
      const tl = gsap.timeline()

      // 1. Label fade in
      if (labelRef.current) {
        tl.fromTo(
          labelRef.current,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.5, ease: EASE_OUT },
          0.2
        )
      }

      // 2. Word-by-word clip reveal
      const innerSpans = wordInnerRefs.current.filter(Boolean)
      if (innerSpans.length > 0) {
        tl.fromTo(
          innerSpans,
          { y: '105%' },
          { y: '0%', duration: 0.7, ease: EASE_OUT, stagger: 0.09 },
          0.5
        )
      }

      // 3. Subtext fade up
      if (subtextRef.current) {
        tl.fromTo(
          subtextRef.current,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.6, ease: EASE_OUT },
          0.85
        )
      }

      // 4. SearchBar fade up
      if (searchRef.current) {
        tl.fromTo(
          searchRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: EASE_OUT },
          1.0
        )
      }

      // 5. Separator + buttons
      if (separatorRef.current) {
        tl.fromTo(
          separatorRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.4, ease: EASE_OUT },
          1.2
        )
      }
      if (buttonsRef.current) {
        tl.fromTo(
          buttonsRef.current,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.5, ease: EASE_OUT },
          1.25
        )
      }
    }

    // Hero parallax
    if (!reduced && imgWrapperRef.current && sectionRef.current) {
      gsap.to(imgWrapperRef.current, {
        yPercent: 20,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })
    }

    // Counter animation
    if (!reduced && statsRef.current) {
      STATS.forEach((stat, i) => {
        const el = statRefs[i].current
        if (!el) return

        const obj = { val: 0 }
        gsap.to(obj, {
          val: stat.target,
          duration: 1.8,
          ease: EASE_OUT,
          scrollTrigger: {
            trigger: statsRef.current,
            start: 'top 90%',
            once: true,
          },
          onUpdate() {
            el.textContent = stat.decimals
              ? obj.val.toFixed(stat.decimals)
              : Math.round(obj.val).toString()
          },
        })
      })
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen min-h-[600px] flex flex-col overflow-hidden"
    >
      {/* Parallax image wrapper */}
      <div
        ref={imgWrapperRef}
        className="absolute inset-0 scale-[1.3] will-change-transform"
      >
        <Image
          src={HOMEPAGE_HERO}
          alt="Mountain landscape in Himachal Pradesh"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
      </div>

      {/* Gradient overlay — bottom to top */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/20" />

      {/* Main content — left-aligned */}
      <div className="relative z-10 flex-1 flex items-center">
        <div className="max-w-7xl mx-auto px-4 md:px-8 w-full">
          <div className="max-w-3xl relative">
            <span className="hidden md:block absolute -top-2 -right-8 font-handwriting text-white/50 text-lg rotate-[3deg] select-none pointer-events-none">✈ since 2023</span>

            {/* a) Handwriting label */}
            <span
              ref={labelRef}
              className="inline-block font-handwriting text-yellow text-xl mb-3"
            >
              travel differently ✈
            </span>

            {/* b) Headline — word-by-word clip reveal */}
            <h1 className="font-display font-black text-white text-5xl md:text-7xl lg:text-8xl leading-tight mb-0">
              {/* Line 1 */}
              <span className="block">
                {HEADLINE_LINE1.map((word, i) => (
                  <span
                    key={word}
                    className="inline-block overflow-hidden mr-[0.22em] last:mr-0"
                  >
                    <span
                      ref={(el) => { wordInnerRefs.current[i] = el }}
                      className="inline-block"
                    >
                      {word}
                    </span>
                  </span>
                ))}
              </span>
              {/* Line 2 — yellow */}
              <span className="relative inline-block">
                <span className="block text-yellow">
                  {HEADLINE_LINE2.map((word, i) => (
                    <span
                      key={word}
                      className="inline-block overflow-hidden mr-[0.22em] last:mr-0"
                    >
                      <span
                        ref={(el) => { wordInnerRefs.current[HEADLINE_LINE1.length + i] = el }}
                        className="inline-block"
                      >
                        {word}
                      </span>
                    </span>
                  ))}
                </span>
                <svg className="hidden md:block absolute -inset-3 w-[calc(100%+24px)] h-[calc(100%+24px)] pointer-events-none" viewBox="0 0 200 80" fill="none" aria-hidden>
                  <path d="M30,40 C30,15 170,10 175,40 C180,70 25,75 30,40" stroke="#FFD60A" strokeWidth="2.5" opacity="0.7" strokeLinecap="round" />
                </svg>
              </span>
            </h1>

            {/* c) Subtext */}
            <p
              ref={subtextRef}
              className="font-body text-white/80 text-lg max-w-xl mt-4 leading-relaxed"
            >
              OffMap is for people who want to travel slower. To hike without
              rushing, sit with a view longer, and experience places deeply.
            </p>

            {/* d) Search pill */}
            <div ref={searchRef} className="mt-8">
              <div
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-3 gap-3 border border-white/30 max-w-sm cursor-pointer hover:bg-white/30 transition"
              >
                <Search className="w-4 h-4 text-white/70" />
                <span className="text-white/70 text-sm font-body flex-1">Where to next?</span>
                <div className="bg-yellow px-3 py-1 rounded-full text-dark text-xs font-heading font-bold">Search</div>
              </div>
              <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
            </div>

            {/* e) Separator */}
            <p
              ref={separatorRef}
              className="font-handwriting text-white/50 text-sm mt-4 mb-3"
            >
              — or —
            </p>

            {/* Curved arrow doodle */}
            <div className="hidden md:block relative -mb-1">
              <svg width="40" height="30" viewBox="0 0 40 30" fill="none" className="rotate-[8deg]" aria-hidden>
                <path d="M5,25 C10,5 25,5 35,12" stroke="#FFD60A" strokeWidth="2" strokeLinecap="round" fill="none" />
                <path d="M30,6 L35,12 L28,14" stroke="#FFD60A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg>
            </div>

            {/* f) Outline CTAs */}
            <div ref={buttonsRef} className="flex flex-wrap gap-3">
              <Link
                href="/destinations"
                className={cn(
                  'font-body text-sm text-white border border-white px-5 py-2',
                  'rounded-none transition-colors duration-200',
                  'hover:bg-white hover:text-dark'
                )}
              >
                Explore Destinations
              </Link>
              <Link
                href="/about"
                className={cn(
                  'font-body text-sm text-white/80 border border-white/40 px-5 py-2',
                  'rounded-none transition-colors duration-200',
                  'hover:border-white hover:text-white'
                )}
              >
                Our Philosophy
              </Link>
            </div>

          </div>
        </div>
      </div>

      {/* g) Stats bar */}
      <div className="relative z-10 w-full">
        <div ref={statsRef} className="max-w-7xl mx-auto px-4 md:px-8 pb-16 md:pb-20">
          <div className="inline-flex items-center gap-0 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 overflow-hidden">
            {STATS.map((stat, i) => (
              <div key={stat.label} className="flex items-center">
                {i > 0 && <div className="w-px h-8 bg-white/30" />}
                <div className="px-6 py-3 text-center">
                  <div className="text-white font-heading font-bold text-xl md:text-2xl leading-none">
                    <span ref={statRefs[i]}>
                      {stat.decimals ? stat.target.toFixed(stat.decimals) : stat.target}
                    </span>
                    {stat.suffix}
                  </div>
                  <div className="font-handwriting text-white/70 text-sm mt-0.5">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Torn paper edge at bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <TornEdge position="bottom" color="#E8F4F0" />
      </div>
    </section>
  )
}
