'use client'

import { useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { gsap } from 'gsap'
import { SectionLabel } from '@/components/ui/scrapbook'
import { registerGSAP } from '@/lib/animations'
import { cn } from '@/lib/utils'

interface NavTile {
  label: string
  href: string
  icon: string
  borderColor: string
}

const TILES: NavTile[] = [
  { label: 'Group Trips',     href: '/experiences/group-trips', icon: '/icons/hiking.png',     borderColor: '#39A2B8' },
  { label: 'Day Trips',       href: '/experiences/day-trips',   icon: '/icons/adventure.png',  borderColor: '#39A2B8' },
  { label: 'Activities',      href: '/experiences/activities',  icon: '/icons/activities.png', borderColor: '#39A2B8' },
  { label: 'Student Program', href: '/student-program',         icon: '/icons/learning.png',   borderColor: '#39A2B8' },
]

export function QuickNavSection() {
  const sectionRef  = useRef<HTMLElement>(null)
  const labelRef    = useRef<HTMLSpanElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const cardsRef    = useRef<HTMLDivElement>(null)

  useEffect(() => {
    registerGSAP()
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const ctx = gsap.context(() => {
      const st = { trigger: sectionRef.current, start: 'top bottom', once: true }

      // 1. Label: fade up
      if (labelRef.current) {
        gsap.from(labelRef.current, { y: 20, opacity: 0, duration: 0.5, ease: 'power2.out', immediateRender: false, scrollTrigger: st })
      }

      // 2. Headline: word-by-word reveal
      if (headlineRef.current) {
        gsap.from(headlineRef.current.querySelectorAll('.qn-word'), {
          y: '110%', stagger: 0.09, duration: 0.7, ease: 'power3.out', delay: 0.2, immediateRender: false, scrollTrigger: st,
        })
      }

      // 3. Tiles: stagger from below with scale + bounce
      if (cardsRef.current) {
        gsap.from(cardsRef.current.querySelectorAll('.qn-tile'), {
          y: 60, opacity: 0, scale: 0.88,
          stagger: 0.1, duration: 0.65, ease: 'back.out(1.3)',
          delay: 0.35,
          immediateRender: false,
          scrollTrigger: st,
        })
      }
    })

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="bg-[#0D78A8] py-10 md:py-14">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:gap-10 mb-6">
          <span ref={labelRef} className="block mb-2 md:mb-0">
            <SectionLabel
              text="done with tourist traps?"
              style="handwritten"
              className="text-yellow"
            />
          </span>

          <h2
            ref={headlineRef}
            className="font-display font-black text-white text-2xl md:text-3xl overflow-hidden"
          >
            {["Let's", 'Travel'].map((w) => (
              <span key={w} className="inline-block overflow-hidden align-bottom mr-[0.22em]">
                <span className="qn-word inline-block">{w}</span>
              </span>
            ))}
            {' '}
            <span className="inline-block overflow-hidden align-bottom">
              <span className="qn-word italic inline-block">OFFMAP</span>
            </span>
          </h2>
        </div>

        <div ref={cardsRef} className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {TILES.map((tile) => {
            return (
              <Link
                key={tile.label}
                href={tile.href}
                className={cn(
                  'qn-tile group flex items-center gap-3 border border-[#39A2B8] rounded-lg px-4 py-3',
                  'bg-white transition-all duration-200',
                  'hover:bg-[#E0F4F8] hover:-translate-y-0.5'
                )}
              >
                <div className="w-10 h-10 rounded-full bg-[#E0F4F8] flex items-center justify-center flex-none transition-transform duration-200 group-hover:scale-110">
                  <Image
                    src={tile.icon}
                    alt={tile.label}
                    width={28}
                    height={28}
                    className="object-contain"
                  />
                </div>
                <p className="font-heading font-semibold text-[#0D78A8] text-sm flex-1">{tile.label}</p>
                <span className="text-yellow text-sm group-hover:translate-x-1 inline-block transition-transform duration-200">→</span>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
