'use client'

import { useRef, useEffect } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import {
  PolaroidCard,
  WashiTape,
  SectionLabel,
  JournalNote,
} from '@/components/ui/scrapbook'
import { registerGSAP } from '@/lib/animations'
import { ABOUT_IMAGES } from '@/lib/images'

export function AboutSection() {
  const sectionRef    = useRef<HTMLElement>(null)
  const journalRef    = useRef<HTMLDivElement>(null)
  const washiRef      = useRef<HTMLDivElement>(null)
  const labelRef      = useRef<HTMLSpanElement>(null)
  const headlineRef   = useRef<HTMLHeadingElement>(null)
  const para1Ref      = useRef<HTMLParagraphElement>(null)
  const para2Ref      = useRef<HTMLParagraphElement>(null)
  const noteRef       = useRef<HTMLDivElement>(null)
  const ctaRef        = useRef<HTMLAnchorElement>(null)
  const polaroidLgRef = useRef<HTMLDivElement>(null)
  const polaroidMdRef = useRef<HTMLDivElement>(null)
  const polaroidSmRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    registerGSAP()
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const ctx = gsap.context(() => {
      const st = { trigger: sectionRef.current, start: 'top bottom', once: true }

      // 1. Journal panel: clip-path wipe from left
      if (journalRef.current) {
        gsap.fromTo(
          journalRef.current,
          { clipPath: 'inset(0 100% 0 0 round 12px)' },
          { clipPath: 'inset(0 0% 0 0 round 12px)', duration: 1.0, ease: 'power3.inOut', scrollTrigger: st }
        )
      }

      // 2. WashiTape: scaleX from 0
      if (washiRef.current) {
        gsap.from(washiRef.current, {
          scaleX: 0, transformOrigin: 'left center', duration: 0.45, ease: 'power2.out', delay: 0.5, immediateRender: false, scrollTrigger: st,
        })
      }

      // 3-7. Content stagger inside panel
      const items = [labelRef.current, para1Ref.current, para2Ref.current, noteRef.current, ctaRef.current].filter(Boolean)
      if (items.length) {
        gsap.from(items, { y: 30, opacity: 0, stagger: 0.14, duration: 0.65, ease: 'power2.out', delay: 0.55, immediateRender: false, scrollTrigger: st })
      }

      // 4. Headline: word-by-word clip reveal
      if (headlineRef.current) {
        gsap.from(headlineRef.current.querySelectorAll('.about-word'), {
          y: '110%', stagger: 0.08, duration: 0.7, ease: 'power3.out', delay: 0.6, immediateRender: false, scrollTrigger: st,
        })
      }

      // 8-10. Polaroid cards: each enters from different direction
      const polSt = { trigger: sectionRef.current, start: 'top bottom', once: true }
      if (polaroidLgRef.current) {
        gsap.from(polaroidLgRef.current, { x: -50, y: 70, rotation: -12, opacity: 0, duration: 0.95, ease: 'back.out(1.2)', delay: 0.35, immediateRender: false, scrollTrigger: polSt })
      }
      if (polaroidMdRef.current) {
        gsap.from(polaroidMdRef.current, { x: 50, y: 40, rotation: 12, opacity: 0, duration: 0.95, ease: 'back.out(1.2)', delay: 0.6, immediateRender: false, scrollTrigger: polSt })
      }
      if (polaroidSmRef.current) {
        gsap.from(polaroidSmRef.current, { y: 90, rotation: 8, opacity: 0, duration: 0.95, ease: 'back.out(1.2)', delay: 0.85, immediateRender: false, scrollTrigger: polSt })
      }
    })

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="bg-[#E8F4F0] py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4">
        <div className="lg:grid lg:grid-cols-12 gap-16 items-start">

          {/* Left column — journal page */}
          <div className="lg:col-span-7 mb-14 lg:mb-0">
            <div ref={journalRef} className="paper-lines bg-[#D4EDE6] rounded-xl p-6 md:p-10 relative will-change-[clip-path]">
              {/* Washi tape decoration */}
              <div ref={washiRef} className="absolute top-3 left-8">
                <WashiTape color="yellow" rotation={-2} width="w-28" />
                <span className="absolute inset-0 flex items-center justify-center font-handwriting text-dark/80 text-sm pointer-events-none">
                  our story →
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
                  Plan Your Journey →
                </Link>
              </div>
            </div>
          </div>

          {/* Right column — photo collage (desktop only) */}
          <div className="lg:col-span-5 hidden lg:block">
            <div className="relative h-[460px]">
              <div ref={polaroidLgRef} className="absolute top-0 right-8 z-[2]">
                <PolaroidCard
                  src={ABOUT_IMAGES.large}
                  alt="Himalayan landscape"
                  caption="lost in Himachal"
                  rotation={-3}
                  size="lg"
                  washiColor="yellow"
                />
              </div>
              <div ref={polaroidMdRef} className="absolute top-12 right-0 z-[3]">
                <PolaroidCard
                  src={ABOUT_IMAGES.medium}
                  alt="Local village scene"
                  caption="chai stop, Rajasthan"
                  rotation={4}
                  size="md"
                  washiColor="blue"
                />
              </div>
              <div ref={polaroidSmRef} className="absolute bottom-0 left-8 z-[1]">
                <PolaroidCard
                  src={ABOUT_IMAGES.small}
                  alt="Forest trail"
                  caption="the trail less taken"
                  rotation={-1}
                  size="sm"
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
