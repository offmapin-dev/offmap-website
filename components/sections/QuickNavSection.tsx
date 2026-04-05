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
  { label: 'Group Trips',     href: '/experiences/group-trips', icon: '/icons/hiking.png',     borderColor: '#1B4FD8' },
  { label: 'Day Trips',       href: '/experiences/day-trips',   icon: '/icons/adventure.png',  borderColor: '#FFD60A' },
  { label: 'Activities',      href: '/experiences/activities',  icon: '/icons/activities.png', borderColor: '#2D6A4F' },
  { label: 'Student Program', href: '/student-program',         icon: '/icons/learning.png',   borderColor: '#F59E0B' },
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
    <section ref={sectionRef} className="bg-dark py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4">
        <span ref={labelRef} className="block mb-5">
          <SectionLabel
            text="done with tourist traps?"
            style="handwritten"
            className="text-yellow"
          />
        </span>

        <h2
          ref={headlineRef}
          className="font-display font-black text-white text-4xl md:text-5xl mb-12 overflow-hidden"
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

        <div ref={cardsRef} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {TILES.map((tile) => {
            return (
              <Link
                key={tile.label}
                href={tile.href}
                style={{ '--tc': tile.borderColor } as React.CSSProperties}
                className={cn(
                  'qn-tile group block border-2 border-[var(--tc)] rounded-none p-6',
                  'bg-transparent transition-colors duration-200',
                  'hover:bg-white/5 hover:-translate-y-1',
                  'transition-all duration-200'
                )}
              >
                <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center mb-4 transition-transform duration-200 group-hover:scale-110">
                  <Image
                    src={tile.icon}
                    alt={tile.label}
                    width={40}
                    height={40}
                    className="object-contain mix-blend-multiply"
                  />
                </div>
                <p className="font-heading font-semibold text-white text-base mb-4">{tile.label}</p>
                <span className="text-yellow text-lg group-hover:translate-x-2 inline-block transition-transform duration-200">→</span>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
