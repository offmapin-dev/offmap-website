'use client'

import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { SectionLabel } from '@/components/ui/scrapbook'
import { registerGSAP } from '@/lib/animations'
import { cn } from '@/lib/utils'

interface Testimonial {
  name: string
  trip: string
  review: string
  rotation: number
}

const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Deepika Hada',
    trip: 'Himachal Pradesh',
    review: "This was my very first trip with strangers and one of the best decisions I've ever made. The trails, the stays, the people — everything felt intentional and real. I came back feeling like I'd actually been somewhere.",
    rotation: -2,
  },
  {
    name: 'Sachin Kumar',
    trip: 'Himachal Pradesh',
    review: "OFFMAP truly lives up to their name. They took us off the beaten path to places I didn't know existed. No tourist traps, no rush — just genuine experiences with a group of like-minded people.",
    rotation: 1,
  },
  {
    name: 'Sumit Chaudhary',
    trip: 'Rajgundha Valley',
    review: "The Rajgundha trip was an unforgettable experience. The planning was seamless, the stay was beautiful, and the route felt like it was designed for people who actually want to feel a place, not just see it.",
    rotation: -1,
  },
]

// Entry origins — each note enters from a different direction
const NOTE_FROM = [
  { x: -80, y: 40, rotation: -14, opacity: 0 },
  { y: 80,         rotation: 8,   opacity: 0 },
  { x: 80,  y: 40, rotation: -8,  opacity: 0 },
]

function StarRating() {
  return (
    <div className="flex items-center gap-0.5 mb-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className="text-yellow text-base">★</span>
      ))}
    </div>
  )
}

export function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const labelRef   = useRef<HTMLSpanElement>(null)
  // Declare each ref individually — arrays of useRef() break Rules of Hooks
  const note0Ref   = useRef<HTMLDivElement>(null)
  const note1Ref   = useRef<HTMLDivElement>(null)
  const note2Ref   = useRef<HTMLDivElement>(null)
  const noteRefs   = [note0Ref, note1Ref, note2Ref]

  useEffect(() => {
    registerGSAP()
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const ctx = gsap.context(() => {
      const st = { trigger: sectionRef.current, start: 'top bottom', once: true }

      // 1. Label fades up
      if (labelRef.current) {
        gsap.from(labelRef.current, { y: 24, opacity: 0, duration: 0.55, ease: 'power2.out', immediateRender: false, scrollTrigger: st })
      }

      // 2. Each note card enters from its unique origin, settles to its natural rotation
      noteRefs.forEach((ref, i) => {
        if (!ref.current) return
        gsap.from(ref.current, {
          ...NOTE_FROM[i],
          duration: 0.95,
          ease: 'back.out(1.15)',
          delay: 0.2 + i * 0.18,
          immediateRender: false,
          scrollTrigger: st,
        })
      })
    })

    return () => ctx.revert()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section ref={sectionRef} className="bg-[#EEF2FF] paper-lines py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4">
        <span ref={labelRef} className="block mb-10">
          <SectionLabel text="Whispers from the Path" style="handwritten" />
        </span>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={t.name}
              ref={noteRefs[i]}
              style={{ '--r': `${t.rotation}deg` } as React.CSSProperties}
              className={cn(
                'bg-[#FFFDE8] p-6 border-l-4 border-l-yellow',
                'rotate-[var(--r)]',
                'shadow-[2px_2px_12px_rgba(0,0,0,0.08)]',
                'will-change-transform'
              )}
            >
              <StarRating />
              <p className="font-body italic text-gray-700 text-base leading-relaxed mb-4">
                &ldquo;{t.review}&rdquo;
              </p>
              <p className="font-handwriting text-dark/60 text-base">
                — {t.name}, {t.trip}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
