'use client'

import { useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { gsap } from 'gsap'
import {
  WashiTape,
  SectionLabel,
  JournalNote,
} from '@/components/ui/scrapbook'
import { registerGSAP } from '@/lib/animations'
import { ABOUT_STRIP_IMAGES, ABOUT_GRID_IMAGES } from '@/lib/images'

export function AboutSection() {
  const sectionRef  = useRef<HTMLElement>(null)
  const journalRef  = useRef<HTMLDivElement>(null)
  const washiRef    = useRef<HTMLDivElement>(null)
  const labelRef    = useRef<HTMLSpanElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const para1Ref    = useRef<HTMLParagraphElement>(null)
  const para2Ref    = useRef<HTMLParagraphElement>(null)
  const noteRef     = useRef<HTMLDivElement>(null)
  const ctaRef      = useRef<HTMLAnchorElement>(null)

  // Photo strip refs
  const stripLeftRef   = useRef<HTMLDivElement>(null)
  const stripMiddleRef = useRef<HTMLDivElement>(null)
  const stripRightRef  = useRef<HTMLDivElement>(null)

  // Grid & quote refs
  const gridRef  = useRef<HTMLDivElement>(null)
  const quoteRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    registerGSAP()
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const ctx = gsap.context(() => {
      const st = { trigger: sectionRef.current, start: 'top bottom', once: true }

      // ── Photo strip: each slides in from a different direction ──
      if (stripLeftRef.current) {
        gsap.from(stripLeftRef.current, {
          x: -60, opacity: 0, duration: 0.8, ease: 'power2.out', delay: 0.1,
          immediateRender: false, scrollTrigger: st,
        })
      }
      if (stripMiddleRef.current) {
        gsap.from(stripMiddleRef.current, {
          y: 60, opacity: 0, duration: 0.8, ease: 'power2.out', delay: 0.2,
          immediateRender: false, scrollTrigger: st,
        })
      }
      if (stripRightRef.current) {
        gsap.from(stripRightRef.current, {
          x: 60, opacity: 0, duration: 0.8, ease: 'power2.out', delay: 0.3,
          immediateRender: false, scrollTrigger: st,
        })
      }

      // ── Journal panel: clip-path wipe from left ──
      if (journalRef.current) {
        gsap.fromTo(
          journalRef.current,
          { clipPath: 'inset(0 100% 0 0 round 12px)' },
          { clipPath: 'inset(0 0% 0 0 round 12px)', duration: 1.0, ease: 'power3.inOut', scrollTrigger: st }
        )
      }

      // ── WashiTape: scaleX from 0 ──
      if (washiRef.current) {
        gsap.from(washiRef.current, {
          scaleX: 0, transformOrigin: 'left center', duration: 0.45, ease: 'power2.out', delay: 0.5,
          immediateRender: false, scrollTrigger: st,
        })
      }

      // ── Content stagger inside panel ──
      const items = [labelRef.current, para1Ref.current, para2Ref.current, noteRef.current, ctaRef.current].filter(Boolean)
      if (items.length) {
        gsap.from(items, {
          y: 30, opacity: 0, stagger: 0.14, duration: 0.65, ease: 'power2.out', delay: 0.55,
          immediateRender: false, scrollTrigger: st,
        })
      }

      // ── Headline: word-by-word clip reveal ──
      if (headlineRef.current) {
        gsap.from(headlineRef.current.querySelectorAll('.about-word'), {
          y: '110%', stagger: 0.08, duration: 0.7, ease: 'power3.out', delay: 0.6,
          immediateRender: false, scrollTrigger: st,
        })
      }

      // ── Photo grid: stagger in ──
      if (gridRef.current) {
        gsap.from(gridRef.current.children, {
          opacity: 0, y: 40, stagger: 0.12, duration: 0.7, ease: 'power2.out', delay: 0.4,
          immediateRender: false, scrollTrigger: st,
        })
      }

      // ── Quote strip: fade in ──
      if (quoteRef.current) {
        gsap.from(quoteRef.current, {
          opacity: 0, y: 20, duration: 0.8, ease: 'power2.out',
          immediateRender: false,
          scrollTrigger: { trigger: quoteRef.current, start: 'top bottom', once: true },
        })
      }
    })

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="bg-white pt-10 md:pt-12">
      <div className="max-w-7xl mx-auto px-4">

        {/* A) Photo strip */}
        <div className="flex gap-3 mb-10">
          <div ref={stripLeftRef} className="flex-[2] h-48 rounded-xl overflow-hidden relative">
            <Image src={ABOUT_STRIP_IMAGES.landscape} alt="Group of travelers" fill className="object-cover" sizes="50vw" />
          </div>
          <div ref={stripMiddleRef} className="flex-[1] h-48 rounded-xl overflow-hidden relative">
            <Image src={ABOUT_STRIP_IMAGES.portrait} alt="Desert sunset" fill className="object-cover" sizes="25vw" />
          </div>
          <div ref={stripRightRef} className="flex-[1] h-48 rounded-xl overflow-hidden relative">
            <Image src={ABOUT_STRIP_IMAGES.square} alt="Forest trail" fill className="object-cover" sizes="25vw" />
          </div>
        </div>

        {/* B) Two columns */}
        <div className="lg:grid lg:grid-cols-12 gap-16 items-start">

          {/* Left column -- journal page */}
          <div className="lg:col-span-7 mb-14 lg:mb-0">
            <div ref={journalRef} className="paper-lines bg-[#39A2B8]/20 rounded-xl p-6 md:p-10 relative will-change-[clip-path] border-l-4 border-red-300">
              {/* Washi tape decoration */}
              <div ref={washiRef} className="absolute top-3 left-8">
                <WashiTape color="yellow" rotation={-2} width="w-28" />
                <span className="absolute inset-0 flex items-center justify-center font-handwriting text-dark/80 text-sm pointer-events-none">
                  our story &rarr;
                </span>
              </div>

              <div className="mt-4">
                <span ref={labelRef} className="inline-block mb-5">
                  <SectionLabel text="a note from us" style="handwritten" />
                </span>

                <h2
                  ref={headlineRef}
                  className="font-display font-bold text-dark text-4xl md:text-5xl leading-tight mb-6"
                >
                  {/* Line 1 */}
                  <span className="block">
                    {['We', "Don't", 'Sell', 'Tours.'].map((w) => (
                      <span key={w} className="inline-block overflow-hidden align-bottom mr-[0.22em] last:mr-0">
                        <span className="about-word inline-block">{w}</span>
                      </span>
                    ))}
                  </span>
                  {/* Line 2 */}
                  <span className="block">
                    {['We', 'Map', 'Memories.'].map((w) => (
                      <span key={w} className="inline-block overflow-hidden align-bottom mr-[0.22em] last:mr-0">
                        <span className="about-word inline-block">{w}</span>
                      </span>
                    ))}
                  </span>
                </h2>

                <p ref={para1Ref} className="font-body text-dark/70 text-base leading-relaxed mb-4">
                  We believe the best stories aren&apos;t found in guidebooks. They&apos;re
                  written in the margins of worn notebooks, shared over roadside chai, and
                  discovered when you stop rushing.
                </p>

                <p ref={para2Ref} className="font-body text-dark/70 text-base leading-relaxed mb-8">
                  We spend more time in fewer places, connect with locals, and discover
                  experiences before creating trips.
                </p>

                <div ref={noteRef}>
                  <JournalNote text="No itineraries, just flow 🌊" type="sticky" className="mb-6" />
                </div>

                <Link
                  ref={ctaRef}
                  href="/contact"
                  className="font-handwriting text-blue text-lg font-semibold hover:text-blue/70 transition-colors duration-200 inline-block mt-4"
                >
                  Plan Your Journey &rarr;
                </Link>
              </div>
            </div>
          </div>

          {/* Right column -- asymmetric photo grid (desktop only) */}
          <div className="lg:col-span-5 hidden lg:block">
            <div ref={gridRef} className="grid grid-cols-3 gap-3">
              {/* Large - top left, spans 2 cols */}
              <div className="col-span-2 h-56 rounded-xl overflow-hidden relative">
                <Image src={ABOUT_GRID_IMAGES.large} alt="Himalayan landscape" fill className="object-cover" sizes="400px" />
                <div className="absolute top-2 left-2">
                  <WashiTape color="yellow" rotation={-2} width="w-16" />
                </div>
              </div>
              {/* Medium - top right */}
              <div className="col-span-1 h-56 rounded-xl overflow-hidden relative">
                <Image src={ABOUT_GRID_IMAGES.mediumTop} alt="Village scene" fill className="object-cover" sizes="200px" />
              </div>
              {/* Small - bottom left */}
              <div className="col-span-1 h-40 rounded-xl overflow-hidden relative">
                <Image src={ABOUT_GRID_IMAGES.smallBottom} alt="Kashmir landscape" fill className="object-cover" sizes="200px" />
                <div className="absolute top-2 right-2">
                  <WashiTape color="blue" rotation={3} width="w-14" />
                </div>
              </div>
              {/* Medium - bottom right, spans 2 cols */}
              <div className="col-span-2 h-40 rounded-xl overflow-hidden relative">
                <Image src={ABOUT_GRID_IMAGES.mediumBottom} alt="Forest landscape" fill className="object-cover" sizes="400px" />
                <div className="absolute bottom-3 right-3 z-10">
                  <JournalNote text="this is why we do it 🏔️" type="sticky" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* C) Quote strip -- full width */}
      <div ref={quoteRef} className="bg-[#0D78A8] py-8 mt-10">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="font-display text-white text-2xl md:text-3xl italic leading-relaxed">{'\u201C'}We believe the best stories aren{'\u2019'}t found in guidebooks.{'\u201D'}</p>
          <p className="font-handwriting text-white/50 text-lg mt-3">{'\u2014'} the OffMap team</p>
        </div>
      </div>
    </section>
  )
}
