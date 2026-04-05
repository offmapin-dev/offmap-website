'use client'

import { useRef, useEffect } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { TornEdge, StampBadge, JournalNote } from '@/components/ui/scrapbook'
import { registerGSAP } from '@/lib/animations'

export function StudentProgramSection() {
  const sectionRef  = useRef<HTMLElement>(null)
  const emojiRef    = useRef<HTMLSpanElement>(null)
  const stampRef    = useRef<HTMLDivElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const bodyRef     = useRef<HTMLParagraphElement>(null)
  const noteRef     = useRef<HTMLDivElement>(null)
  const btnRef      = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    registerGSAP()
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const ctx = gsap.context(() => {
      const st = { trigger: sectionRef.current, start: 'top bottom', once: true }

      // 1. Emoji: drop from top with bounce
      if (emojiRef.current) {
        gsap.from(emojiRef.current, {
          y: -120, opacity: 0, rotation: -20,
          duration: 1.0, ease: 'bounce.out', immediateRender: false, scrollTrigger: st,
        })
      }

      // 2. Stamp: spin-in rubber-band
      if (stampRef.current) {
        gsap.from(stampRef.current, {
          scale: 0, rotation: -200, opacity: 0,
          duration: 0.75, ease: 'back.out(1.7)', delay: 0.35, immediateRender: false, scrollTrigger: st,
        })
      }

      // 3. Headline: word-by-word reveal
      if (headlineRef.current) {
        gsap.from(headlineRef.current.querySelectorAll('.sp-word'), {
          y: '110%', stagger: 0.08, duration: 0.7, ease: 'power3.out', delay: 0.55, immediateRender: false, scrollTrigger: st,
        })
      }

      // 4. Body + note + button stagger
      const items = [bodyRef.current, noteRef.current, btnRef.current].filter(Boolean)
      if (items.length) {
        gsap.from(items, {
          y: 32, opacity: 0, stagger: 0.15, duration: 0.6, ease: 'power2.out', delay: 0.75, immediateRender: false, scrollTrigger: st,
        })
      }
    })

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="relative bg-[#F59E0B] overflow-hidden">
      <TornEdge position="top" color="#F59E0B" />

      {/* Decorative background emoji */}
      <span className="absolute top-8 right-4 md:right-8 text-9xl opacity-10 select-none pointer-events-none">
        🎒
      </span>

      <div className="max-w-7xl mx-auto px-4 pt-12 pb-20 md:pb-28">
        <div className="text-center max-w-2xl mx-auto">

          <span ref={emojiRef} className="inline-block text-5xl mb-4 will-change-transform" role="img" aria-label="backpack">
            🎒
          </span>

          <div ref={stampRef} className="inline-block mb-2 will-change-transform">
            <StampBadge text="Student Program" color="#0F172A" rotation={-2} className="mb-6" />
          </div>

          <h2
            ref={headlineRef}
            className="font-display font-black text-dark text-4xl md:text-5xl leading-tight mt-6"
          >
            <span className="block">
              {['Learning', 'hits', 'different'].map((w) => (
                <span key={w} className="inline-block overflow-hidden align-bottom mr-[0.22em] last:mr-0">
                  <span className="sp-word inline-block">{w}</span>
                </span>
              ))}
            </span>
            <span className="block">
              {['outside', 'classrooms.'].map((w) => (
                <span key={w} className="inline-block overflow-hidden align-bottom mr-[0.22em] last:mr-0">
                  <span className="sp-word inline-block">{w}</span>
                </span>
              ))}
            </span>
          </h2>

          <p ref={bodyRef} className="font-body text-dark/70 text-base mt-5 mb-8 leading-relaxed">
            We design purposeful travel programs for schools and colleges — combining real
            terrain, cultural immersion, and reflection. No textbook can replicate a
            Himalayan trail or a night under desert stars.
          </p>

          <div ref={noteRef} className="flex justify-center mb-8">
            <JournalNote text="real terrain, real learning 📚" type="sticky" />
          </div>

          <Link
            ref={btnRef}
            href="/student-program"
            className="font-heading font-semibold text-white bg-dark border-2 border-dark px-8 py-3 rounded-none inline-block transition-all duration-200 hover:bg-dark/85 hover:scale-105 active:scale-100"
          >
            Plan a School Trip →
          </Link>
        </div>
      </div>
    </section>
  )
}
