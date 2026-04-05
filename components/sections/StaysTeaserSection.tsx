'use client'

import { useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { gsap } from 'gsap'
import { PolaroidCard } from '@/components/ui/scrapbook'
import { registerGSAP } from '@/lib/animations'
import { cn } from '@/lib/utils'
import { STAY_PHOTOS, STAYS_HERO } from '@/lib/images'

export function StaysTeaserSection() {
  const sectionRef    = useRef<HTMLElement>(null)
  const bgImgRef      = useRef<HTMLDivElement>(null)
  const headlineRef   = useRef<HTMLHeadingElement>(null)
  const polaroid0Ref  = useRef<HTMLDivElement>(null)
  const polaroid1Ref  = useRef<HTMLDivElement>(null)
  const polaroid2Ref  = useRef<HTMLDivElement>(null)
  const philosophyRef = useRef<HTMLParagraphElement>(null)
  const ctaRef        = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    registerGSAP()
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const ctx = gsap.context(() => {
      // 1. Background image parallax (subtle)
      if (bgImgRef.current && sectionRef.current) {
        gsap.to(bgImgRef.current, {
          yPercent: 18,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5,
          },
        })
      }

      const st = { trigger: sectionRef.current, start: 'top bottom', once: true }

      // 2. Headline: word-by-word reveal
      if (headlineRef.current) {
        gsap.from(headlineRef.current.querySelectorAll('.stays-word'), {
          y: '110%', stagger: 0.07, duration: 0.75, ease: 'power3.out', immediateRender: false, scrollTrigger: st,
        })
      }

      // 3. Polaroids: each enters from different angle
      const polaroidRefs = [polaroid0Ref, polaroid1Ref, polaroid2Ref]
      const polaroidFrom = [
        { x: -70, y: 40, rotation: -15, opacity: 0 },
        { y: 80,          rotation: 5,  opacity: 0 },
        { x: 70,  y: 40, rotation: 15,  opacity: 0 },
      ]
      polaroidRefs.forEach((ref, i) => {
        if (ref.current) {
          gsap.from(ref.current, {
            ...polaroidFrom[i],
            duration: 0.9, ease: 'back.out(1.2)',
            delay: 0.15 + i * 0.18,
            immediateRender: false,
            scrollTrigger: st,
          })
        }
      })

      // 4. Philosophy text + CTA
      const textItems = [philosophyRef.current, ctaRef.current].filter(Boolean)
      if (textItems.length) {
        gsap.from(textItems, {
          y: 28, opacity: 0, stagger: 0.18, duration: 0.6, ease: 'power2.out',
          delay: 0.7, immediateRender: false, scrollTrigger: st,
        })
      }

      // 5. CTA gentle float after entrance
      if (ctaRef.current) {
        gsap.to(ctaRef.current, {
          y: -6,
          duration: 2.2,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          delay: 1.8,
        })
      }
    })

    return () => ctx.revert()
  }, [])

  const polaroidRefs = [polaroid0Ref, polaroid1Ref, polaroid2Ref]

  return (
    <section ref={sectionRef} className="relative py-24 md:py-36 bg-dark overflow-hidden">
      {/* Parallax bg wrapper */}
      <div ref={bgImgRef} className="absolute inset-[-12%] will-change-transform">
        <Image
          src={STAYS_HERO}
          alt="OffMap stays"
          fill
          priority={false}
          className="object-cover opacity-30"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-dark/95 via-dark/60 to-dark/30" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
        <h2
          ref={headlineRef}
          className="font-display font-bold text-white text-4xl md:text-5xl mb-6 max-w-3xl mx-auto leading-tight"
        >
          {['Where', 'you', 'stay', 'decides', 'how', 'deeply', 'you', 'experience', 'a', 'place.'].map((w, index) => (
            <span key={w + index} className="inline-block overflow-hidden align-bottom mr-[0.22em] last:mr-0">
              <span className="stays-word inline-block">{w}</span>
            </span>
          ))}
        </h2>

        {/* 3 polaroid cards */}
        <div className="flex items-end justify-center gap-2 md:gap-4 my-10 flex-wrap">
          {STAY_PHOTOS.map((photo, i) => (
            <div key={i} ref={polaroidRefs[i]}>
              <PolaroidCard
                src={photo.src}
                alt={photo.alt}
                caption={photo.caption}
                rotation={photo.rotation}
                size="sm"
                className="flex-none"
              />
            </div>
          ))}
        </div>

        <p ref={philosophyRef} className="font-handwriting text-white/70 text-lg md:text-xl mb-10">
          Fewer stays, better ones · Locally rooted · Experience-first
        </p>

        <Link
          ref={ctaRef}
          href="/stays"
          className={cn(
            'font-display italic font-bold text-xl text-yellow',
            'transition-colors duration-200 hover:text-yellow/70',
            'inline-block will-change-transform'
          )}
        >
          Come Stay With Us →
        </Link>
      </div>
    </section>
  )
}
