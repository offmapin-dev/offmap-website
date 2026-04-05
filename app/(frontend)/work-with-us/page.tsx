'use client'

import { useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { gsap } from 'gsap'
import { WavyDivider } from '@/components/ui/WavyDivider'
import { registerGSAP } from '@/lib/animations'
import { EXPERIENCE_ICONS } from '@/lib/icons'

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1920&q=80'

const ROLES: {
  icon: (typeof EXPERIENCE_ICONS)[keyof typeof EXPERIENCE_ICONS]
  title: string
  description: string
}[] = [
  {
    icon: EXPERIENCE_ICONS.hiking,
    title: 'Trip Leaders',
    description: 'Guide groups through your home terrain',
  },
  {
    icon: EXPERIENCE_ICONS.cultural,
    title: 'Content Creators',
    description: 'Tell stories from the road',
  },
  {
    icon: EXPERIENCE_ICONS.stays,
    title: 'Homestay Owners',
    description: 'Host travelers the right way',
  },
  {
    icon: EXPERIENCE_ICONS.activities,
    title: 'Experience Hosts',
    description: 'Paragliding, horses, cooking',
  },
  {
    icon: EXPERIENCE_ICONS.learning,
    title: 'Community Managers',
    description: 'Help build local connections',
  },
  {
    icon: EXPERIENCE_ICONS.adventure,
    title: 'Trail Experts',
    description: 'Know a route nobody else does',
  },
]

export default function WorkWithUsPage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const s2Ref = useRef<HTMLElement>(null)
  const s3Ref = useRef<HTMLElement>(null)

  useEffect(() => {
    registerGSAP()
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const ctx = gsap.context(() => {
      ;[heroRef.current, s2Ref.current, s3Ref.current].forEach((el) => {
        if (!el) return
        gsap.from(el.querySelectorAll(':scope > *'), {
          y: 28,
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
      <section className="relative h-[50vh] min-h-[360px] flex items-end overflow-hidden">
        <Image
          src={HERO_IMAGE}
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-black/25" />
        <div
          ref={heroRef}
          className="relative z-10 max-w-7xl mx-auto px-4 pb-12 md:pb-16 w-full"
        >
          <p className="font-handwriting text-yellow-300 text-xl mb-2">join the team</p>
          <h1 className="font-display font-black text-white text-4xl md:text-6xl max-w-3xl leading-tight">
            Build something OffMap with us.
          </h1>
          <p className="font-body text-white/70 text-lg mt-4 max-w-xl">
            OffMap isn&apos;t built alone. It&apos;s shaped by the people, places and communities we work
            with.
          </p>
        </div>
      </section>

      <WavyDivider fill="#FFF8E7" />

      <section ref={s2Ref} className="bg-[#FFF8E7] py-14 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="font-display font-bold text-dark text-2xl md:text-4xl text-center max-w-2xl mx-auto leading-tight">
            If you care about honest travel...
          </h2>
          <p className="font-body text-dark/70 text-center max-w-2xl mx-auto mt-6 leading-relaxed">
            If you run a homestay, host experiences, guide trails, create content, or simply know a
            place deeply, we&apos;d love to hear from you.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-14">
            {ROLES.map((role) => (
              <div
                key={role.title}
                className="bg-white rounded-2xl p-5 shadow-[var(--shadow-card)] text-center border border-gray-100"
              >
                <div className="w-14 h-14 mx-auto mb-3 flex items-center justify-center">
                  <Image
                    src={role.icon}
                    alt=""
                    width={48}
                    height={48}
                    className="object-contain mix-blend-multiply"
                  />
                </div>
                <h3 className="font-heading font-semibold text-dark">{role.title}</h3>
                <p className="font-body text-sm text-gray-500 mt-2 leading-relaxed">{role.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <WavyDivider fill="#E8F4F0" />

      <section ref={s3Ref} className="bg-[#E8F4F0] py-16 md:py-24 text-center px-4">
        <h2 className="font-display font-bold text-dark text-3xl md:text-4xl">Let&apos;s work together</h2>
        <p className="font-handwriting text-dark/50 text-xl mt-2 mb-10">tell us about yourself →</p>

        {/* TODO: Replace href with actual Google Form URL from client */}
        <Link
          href="#"
          className="inline-block font-display italic font-bold text-xl text-dark bg-yellow px-10 py-4 rounded-none border-2 border-dark hover:bg-yellow-dark transition-colors"
        >
          Apply to Work With Us →
        </Link>

        <p className="font-handwriting text-gray-400 text-sm mt-8 max-w-md mx-auto">
          we review applications personally. no ghosting, we promise.
        </p>
      </section>
    </main>
  )
}
