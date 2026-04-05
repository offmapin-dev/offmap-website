'use client'

import { useRef, useEffect } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { registerGSAP } from '@/lib/animations'
import { cn } from '@/lib/utils'

export function FinalCtaSection() {
  const sectionRef  = useRef<HTMLElement>(null)
  const line1Ref    = useRef<HTMLHeadingElement>(null)
  const line2Ref    = useRef<HTMLParagraphElement>(null)
  const subRef      = useRef<HTMLParagraphElement>(null)
  const btnRef      = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    registerGSAP()
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const ctx = gsap.context(() => {
      const st = { trigger: sectionRef.current, start: 'top bottom', once: true }

      // 1. Line 1: 3D word flip (rotateX 90 → 0)
      if (line1Ref.current) {
        gsap.from(line1Ref.current.querySelectorAll('.cta-word-h'), {
          rotateX: 90, y: 28, opacity: 0,
          stagger: 0.09, duration: 0.65, ease: 'back.out(1.2)',
          transformOrigin: '50% 50% -30px',
          immediateRender: false,
          scrollTrigger: st,
        })
      }

      // 2. Line 2: 3D word flip, slight delay
      if (line2Ref.current) {
        gsap.from(line2Ref.current.querySelectorAll('.cta-word-h'), {
          rotateX: 90, y: 28, opacity: 0,
          stagger: 0.09, duration: 0.65, ease: 'back.out(1.2)',
          transformOrigin: '50% 50% -30px',
          delay: 0.3,
          immediateRender: false,
          scrollTrigger: st,
        })
      }

      // 3. Subtext fade up
      if (subRef.current) {
        gsap.from(subRef.current, {
          y: 20, opacity: 0, duration: 0.55, ease: 'power2.out', delay: 0.65, immediateRender: false, scrollTrigger: st,
        })
      }

      // 4. Button scale in with bounce
      if (btnRef.current) {
        gsap.from(btnRef.current, {
          scale: 0.75, opacity: 0, duration: 0.55, ease: 'back.out(1.7)', delay: 0.85, immediateRender: false, scrollTrigger: st,
        })
      }
    })

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="bg-yellow py-20 md:py-28 overflow-hidden perspective-[800px]">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2
          ref={line1Ref}
          className="font-display font-black text-dark text-4xl md:text-5xl leading-tight"
        >
          {["You", "don't", "need", "a", "fixed", "plan."].map((w) => (
            <span key={w} className="inline-block overflow-hidden align-bottom mr-[0.22em] last:mr-0">
              <span className="cta-word-h inline-block will-change-transform">{w}</span>
            </span>
          ))}
        </h2>

        <p
          ref={line2Ref}
          className="font-display font-black text-dark text-4xl md:text-5xl leading-tight mt-2 mb-5"
        >
          {["Just", "the", "intention", "to", "go", "somewhere", "different."].map((w) => (
            <span key={w} className="inline-block overflow-hidden align-bottom mr-[0.22em] last:mr-0">
              <span className="cta-word-h inline-block will-change-transform">{w}</span>
            </span>
          ))}
        </p>

        <p ref={subRef} className="font-handwriting text-dark/60 text-xl mb-10">
          no itineraries, no pressure :)
        </p>

        <Link
          ref={btnRef}
          href="/contact"
          className={cn(
            'font-display italic font-bold text-xl text-white',
            'bg-dark border-2 border-dark px-10 py-4 rounded-none',
            'inline-block transition-all duration-200',
            'hover:bg-transparent hover:text-dark hover:scale-105 active:scale-100',
            'will-change-transform'
          )}
        >
          Plan Your Journey
        </Link>
      </div>
    </section>
  )
}
