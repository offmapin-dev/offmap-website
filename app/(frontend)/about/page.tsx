'use client'

import { useRef, useEffect } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { WavyDivider } from '@/components/ui/WavyDivider'
import { PolaroidCard, WashiTape, SectionLabel } from '@/components/ui/scrapbook'
import { registerGSAP } from '@/lib/animations'
import { cn } from '@/lib/utils'

const POLAROIDS = [
  {
    src: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=80',
    alt: 'Historic landscape in Karnataka',
    caption: 'Hampi, where it all started',
    rotation: -5,
    className: 'absolute left-0 top-0 md:left-[4%]',
  },
  {
    src: 'https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?w=800&q=80',
    alt: 'Desert landscape in Rajasthan',
    caption: 'somewhere in Rajasthan',
    rotation: 4,
    className: 'absolute right-0 top-12 md:right-[8%] md:top-16',
  },
  {
    src: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80',
    alt: 'Team outdoors',
    caption: 'the team, Bir 2023',
    rotation: -3,
    className: 'absolute left-[12%] bottom-0 md:left-[20%]',
  },
] as const

const HOW_TILES = [
  {
    n: '01',
    title: 'We explore first',
    body: 'We go to every destination ourselves before designing a trip there.',
  },
  {
    n: '02',
    title: 'Then we design',
    body: 'Itineraries built around experience, not sightseeing.',
  },
  {
    n: '03',
    title: 'Then we invite you',
    body: 'Small groups of like-minded travelers who get it.',
  },
] as const

const CAPTAINS = [
  {
    name: 'Rohan',
    role: 'Trip Captain, Himachal',
    bio: 'Leads slow trails and village routes across the valleys.',
  },
  {
    name: 'OffMap Team',
    role: 'Rajasthan Guides',
    bio: 'Local partners for desert, culture, and community-led days.',
  },
] as const

export default function AboutPage() {
  const s1Ref = useRef<HTMLDivElement>(null)
  const s2Ref = useRef<HTMLElement>(null)
  const s3Ref = useRef<HTMLElement>(null)
  const s4Ref = useRef<HTMLElement>(null)
  const s5Ref = useRef<HTMLElement>(null)

  useEffect(() => {
    registerGSAP()
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const ctx = gsap.context(() => {
      const blocks = [s1Ref.current, s2Ref.current, s3Ref.current, s4Ref.current, s5Ref.current].filter(
        Boolean
      ) as HTMLElement[]

      blocks.forEach((el) => {
        gsap.from(el.querySelectorAll(':scope > *'), {
          y: 32,
          opacity: 0,
          stagger: 0.06,
          duration: 0.55,
          ease: 'power2.out',
          immediateRender: false,
          scrollTrigger: { trigger: el, start: 'top bottom', once: true },
        })
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <main>
      <section className="relative h-[50vh] min-h-[360px] flex items-center justify-center bg-[#2D6A4F]">
        <div ref={s1Ref} className="text-center px-4 max-w-3xl">
          <p className="font-handwriting text-white/60 text-xl mb-3">our story</p>
          <h1 className="font-display font-black text-white text-5xl md:text-7xl leading-tight">
            Why OffMap?
          </h1>
          <p className="font-body text-white/70 text-lg mt-6">
            We started with slow travel. Real experiences. Deeper connections.
          </p>
        </div>
      </section>

      <WavyDivider fill="#FFF8E7" />

      <section ref={s2Ref} className="bg-[#FFF8E7] py-14 md:py-24">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <div className="paper-lines rounded-2xl p-6 md:p-10 bg-white/60">
            <div className="relative inline-block mb-6">
              <WashiTape color="yellow" rotation={-2} width="w-44" />
              <span className="absolute inset-0 flex items-center justify-center font-handwriting text-dark/80 text-sm pointer-events-none">
                how it started →
              </span>
            </div>
            <h2 className="font-display font-black text-dark text-2xl md:text-3xl leading-tight">
              We started with slow travel. Real experiences. Deeper connections.
            </h2>
            <p className="font-body text-dark/70 mt-5 leading-relaxed">
              OffMap was born from a dusty diary and a missed train in Hampi. We believe the best way
              to see India is through the cracks of the mainstream.
            </p>
            <p className="font-body text-dark/70 mt-4 leading-relaxed">
              Our itineraries are not checklists — they are curated chapters of an unfolding story. We
              work with local artisans, quiet homestays, and indigenous historians to ensure your
              journey leaves a mark on you, not the environment.
            </p>
          </div>

          <div className="relative min-h-[320px] md:min-h-[400px]">
            {POLAROIDS.map((p) => (
              <div key={p.caption} className={cn(p.className, 'z-10')}>
                <PolaroidCard
                  src={p.src}
                  alt={p.alt}
                  caption={p.caption}
                  rotation={p.rotation}
                  size="sm"
                  washiColor="yellow"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <WavyDivider fill="#E8F4F0" />

      <section ref={s3Ref} className="bg-[#E8F4F0] py-14 md:py-24">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
          {HOW_TILES.map((t) => (
            <div
              key={t.n}
              className="bg-white rounded-2xl p-6 shadow-[var(--shadow-card)] border border-gray-100"
            >
              <span className="font-display font-black text-[#2D6A4F] text-4xl block mb-3">{t.n}</span>
              <h3 className="font-heading font-semibold text-dark text-lg mb-2">{t.title}</h3>
              <p className="font-body text-gray-500 text-sm leading-relaxed">{t.body}</p>
            </div>
          ))}
        </div>
      </section>

      <WavyDivider fill="#FFF8E7" />

      <section ref={s4Ref} className="bg-[#FFF8E7] py-14 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <SectionLabel text="The Team" style="handwritten" className="block mb-3" />
          <h2 className="font-display font-bold text-dark text-2xl md:text-3xl mb-10">
            Leaders who shape your journey.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {CAPTAINS.map((c) => (
              <div
                key={c.name}
                className="bg-white rounded-2xl p-6 shadow-[var(--shadow-card)] text-center"
              >
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="font-handwriting text-gray-500 text-sm">Photo coming</span>
                </div>
                <p className="font-heading font-semibold text-dark">{c.name}</p>
                <p className="font-handwriting text-gray-400 text-base mt-1">{c.role}</p>
                <p className="font-body text-sm text-gray-600 mt-3 leading-relaxed">{c.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <WavyDivider fill="#FFD60A" />

      <section ref={s5Ref} className="bg-yellow py-16 md:py-24 text-center px-4">
        <h2 className="font-display font-black text-dark text-4xl md:text-5xl mb-8">Travel with us.</h2>
        <Link
          href="/contact"
          className="inline-block font-display italic font-bold text-xl text-white bg-dark border-2 border-dark px-10 py-4 rounded-none hover:bg-dark/90 transition-colors"
        >
          Plan Your Journey →
        </Link>
      </section>
    </main>
  )
}
