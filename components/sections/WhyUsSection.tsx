'use client'

import { useRef, useEffect } from 'react'
import Image from 'next/image'
import { gsap } from 'gsap'
import { SectionLabel, JournalNote } from '@/components/ui/scrapbook'
import { registerGSAP } from '@/lib/animations'

const USP_ITEMS = [
  {
    icon: '/icons/hiking.png',
    title: 'No Fixed Itineraries',
    description: 'We plan the flow, not every minute. Space to explore freely.',
  },
  {
    icon: '/icons/cultural.png',
    title: 'Slow, Experiential Travel',
    description: 'More time in fewer places. Real connections over rushed sightseeing.',
  },
  {
    icon: '/icons/adventure.png',
    title: 'Unique Destinations',
    description: "Places we've discovered ourselves. Not from a Google search.",
  },
  {
    icon: '/icons/learning.png',
    title: 'Curated Journeys',
    description: 'Every trip is designed by us, for people like you.',
  },
  {
    icon: '/icons/stays.png',
    title: 'Community First',
    description: "Small groups of like-minded travelers. You won't feel alone.",
  },
  {
    icon: '/icons/wildlife.png',
    title: 'We Go First',
    description: 'Every destination explored by us before we take you there.',
  },
]

export function WhyUsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    registerGSAP()
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const ctx = gsap.context(() => {
      const st = { trigger: sectionRef.current, start: 'top bottom', once: true }

      // Label fade up
      if (labelRef.current) {
        gsap.from(labelRef.current, {
          y: 20, opacity: 0, duration: 0.5, ease: 'power2.out',
          immediateRender: false, scrollTrigger: st,
        })
      }

      // Headline fade up
      if (headlineRef.current) {
        gsap.from(headlineRef.current, {
          y: 30, opacity: 0, duration: 0.6, ease: 'power2.out', delay: 0.15,
          immediateRender: false, scrollTrigger: st,
        })
      }

      // Cards stagger
      if (cardsRef.current) {
        gsap.from(cardsRef.current.children, {
          y: 50, opacity: 0, scale: 0.95, stagger: 0.1, duration: 0.6,
          ease: 'back.out(1.2)', delay: 0.3,
          immediateRender: false, scrollTrigger: st,
        })
      }
    })

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="bg-dark py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4">
        <span ref={labelRef} className="block mb-4">
          <SectionLabel text="Why OffMap?" style="handwritten" className="!text-yellow" />
        </span>

        <h2
          ref={headlineRef}
          className="font-display font-black text-white text-4xl md:text-5xl leading-tight mb-8 max-w-lg"
        >
          Not your average travel company.
        </h2>

        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {USP_ITEMS.map((item) => (
            <div
              key={item.title}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
            >
              <div className="w-10 h-10 mb-4">
                <Image
                  src={item.icon}
                  alt=""
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
              <h3 className="font-heading font-semibold text-white text-base">
                {item.title}
              </h3>
              <p className="font-body text-white/60 text-sm mt-2">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* Decorative note */}
        <div className="relative mt-10 flex justify-end">
          <div className="-rotate-2 opacity-40">
            <JournalNote text="this is the real deal ✓" type="sticky" />
          </div>
        </div>
      </div>
    </section>
  )
}
