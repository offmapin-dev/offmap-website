'use client'

import { useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Users } from 'lucide-react'
import { gsap } from 'gsap'
import { WavyDivider } from '@/components/ui/WavyDivider'
import {
  PolaroidCard,
  WashiTape,
  SectionLabel,
  TornEdge,
  PostageStamp,
  StampBadge,
} from '@/components/ui/scrapbook'
import { registerGSAP } from '@/lib/animations'
import { REGION_THEMES, type RegionThemeKey } from '@/lib/constants'
import { EXPERIENCE_ICONS } from '@/lib/icons'
import { cn } from '@/lib/utils'

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1920&q=80'

interface Stay {
  slug: string
  name: string
  region: string
  regionSlug: RegionThemeKey
  type: string
  description: string
  highlights: string[]
  pricePerNight: string
  capacity: string
  image: string
}

const STAYS: Stay[] = [
  {
    slug: 'offmap-cottage-bir',
    name: 'OffMap Cottage, Bir',
    region: 'Himachal Pradesh',
    regionSlug: 'himachal-pradesh',
    type: 'Cottage',
    description:
      'A quiet cottage above the paragliding village of Bir. Wake up to mountain views, eat farm-fresh meals, and do absolutely nothing at speed.',
    highlights: [
      'Mountain views',
      'Farm-fresh meals',
      '5 min from Bir village',
      'Paragliding nearby',
    ],
    pricePerNight: '₹2,500',
    capacity: '2-4 guests',
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=80',
  },
  {
    slug: 'desert-homestay-jawai',
    name: 'Desert Homestay, Jawai',
    region: 'Rajasthan',
    regionSlug: 'rajasthan',
    type: 'Homestay',
    description:
      'Stay with a local family in leopard country. Nights around the fire, days exploring ancient temples and granite hills.',
    highlights: [
      'Leopard safari nearby',
      'Home-cooked meals',
      'Local family hosts',
      'Ancient temple walks',
    ],
    pricePerNight: '₹3,200',
    capacity: '2-6 guests',
    image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800&q=80',
  },
  {
    slug: 'forest-camp-uttarakhand',
    name: 'Forest Camp, Uttarakhand',
    region: 'Uttarakhand',
    regionSlug: 'uttarakhand',
    type: 'Camp',
    description:
      'Tents under oak trees in the Kumaon hills. Complete silence except for birds. The kind of sleep you forget is possible.',
    highlights: [
      'Dense oak forest',
      'Himalayan bird watching',
      'Stargazing nights',
      'Trail access',
    ],
    pricePerNight: '₹1,800',
    capacity: '2-8 guests',
    image: 'https://images.unsplash.com/photo-1504851149312-7a075b496cc7?w=800&q=80',
  },
  {
    slug: 'valley-view-shangarh',
    name: 'Valley View Stay, Shangarh',
    region: 'Himachal Pradesh',
    regionSlug: 'himachal-pradesh',
    type: 'Guesthouse',
    description:
      'A small guesthouse above the Shangarh meadow. One of the most peaceful places we\'ve ever stayed.',
    highlights: [
      'Meadow views',
      'Sacred forest nearby',
      'Local cuisine',
      'Complete quiet',
    ],
    pricePerNight: '₹2,200',
    capacity: '2-4 guests',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&q=80',
  },
]

/** Tailwind region accents for borders, tags, buttons (no inline styles). */
const REGION_CARD_ACCENT: Record<
  RegionThemeKey,
  { border: string; tag: string; price: string; btn: string }
> = {
  'himachal-pradesh': {
    border: 'border-l-[#2D6A4F]',
    tag: 'bg-[#F0F7F4] text-[#2D6A4F]',
    price: 'text-[#2D6A4F]',
    btn: 'border-[#2D6A4F] text-[#2D6A4F] hover:bg-[#2D6A4F]/10',
  },
  rajasthan: {
    border: 'border-l-[#C1440E]',
    tag: 'bg-[#FDF6F0] text-[#C1440E]',
    price: 'text-[#C1440E]',
    btn: 'border-[#C1440E] text-[#C1440E] hover:bg-[#C1440E]/10',
  },
  kashmir: {
    border: 'border-l-[#C1121F]',
    tag: 'bg-[#FFF5F5] text-[#C1121F]',
    price: 'text-[#C1121F]',
    btn: 'border-[#C1121F] text-[#C1121F] hover:bg-[#C1121F]/10',
  },
  uttarakhand: {
    border: 'border-l-[#6B4226]',
    tag: 'bg-[#F5F0EB] text-[#6B4226]',
    price: 'text-[#6B4226]',
    btn: 'border-[#6B4226] text-[#6B4226] hover:bg-[#6B4226]/10',
  },
}

const PHILOSOPHY_POLAROIDS: {
  stayIndex: number
  rotation: number
  size: 'sm' | 'md'
  washi?: 'yellow' | 'blue' | 'pink'
  desktopSlot: string
}[] = [
  {
    stayIndex: 0,
    rotation: -5,
    size: 'sm',
    washi: 'yellow',
    desktopSlot: 'md:absolute md:left-[14%] md:top-4 md:z-10 md:-translate-x-1/2',
  },
  {
    stayIndex: 1,
    rotation: 4,
    size: 'md',
    washi: 'blue',
    desktopSlot: 'md:absolute md:left-[48%] md:top-14 md:z-20 md:-translate-x-1/2',
  },
  {
    stayIndex: 2,
    rotation: -3,
    size: 'sm',
    washi: 'pink',
    desktopSlot: 'md:absolute md:left-[82%] md:top-6 md:z-10 md:-translate-x-1/2',
  },
]

const HOW_STEPS: {
  icon: string
  title: string
  description: string
  alt: string
}[] = [
  {
    icon: EXPERIENCE_ICONS.stays,
    title: 'Browse Our Stays',
    description:
      'Each place has been personally visited and verified by the OffMap team.',
    alt: 'Stays icon',
  },
  {
    icon: EXPERIENCE_ICONS.activities,
    title: 'Pick Your Dates',
    description:
      'Tell us when you want to come and how many of you. We\'ll check availability.',
    alt: 'Activities icon',
  },
  {
    icon: EXPERIENCE_ICONS.hiking,
    title: 'We Handle the Rest',
    description:
      'Local host introduction, directions, what to bring — we take care of everything.',
    alt: 'Hiking icon',
  },
]

export default function StaysPage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const philosophyRef = useRef<HTMLElement>(null)
  const polaroidCollageRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLElement>(null)
  const howRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLElement>(null)

  useEffect(() => {
    registerGSAP()
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const ctx = gsap.context(() => {
      const fadeSection = (el: HTMLElement | null) => {
        if (!el) return
        const items = el.querySelectorAll('.stays-fade-child')
        if (!items.length) return
        gsap.from(items, {
          y: 32,
          opacity: 0,
          stagger: 0.08,
          duration: 0.55,
          ease: 'power2.out',
          immediateRender: false,
          scrollTrigger: { trigger: el, start: 'top bottom', once: true },
        })
      }

      if (heroRef.current) {
        gsap.from(heroRef.current.querySelectorAll('.stays-hero-animate'), {
          y: 28,
          opacity: 0,
          stagger: 0.1,
          duration: 0.6,
          ease: 'power2.out',
          immediateRender: false,
        })
      }

      const polaroids = polaroidCollageRef.current?.querySelectorAll('.stays-polaroid')
      if (polaroids?.length) {
        gsap.from(polaroids, {
          scale: 0.92,
          opacity: 0,
          stagger: 0.1,
          duration: 0.55,
          ease: 'back.out(1.2)',
          immediateRender: false,
          scrollTrigger: {
            trigger: polaroidCollageRef.current,
            start: 'top bottom',
            once: true,
          },
        })
      }

      fadeSection(philosophyRef.current)
      fadeSection(gridRef.current)
      fadeSection(howRef.current)
      fadeSection(ctaRef.current)
    })

    return () => ctx.revert()
  }, [])

  return (
    <main>
      {/* —— Hero —— */}
      <section className="relative h-[65vh] min-h-[420px] flex flex-col justify-end overflow-hidden">
        <Image
          src={HERO_IMAGE}
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
        <div
          ref={heroRef}
          className="relative z-10 max-w-7xl mx-auto px-4 pb-12 md:pb-16 w-full text-center"
        >
          <p className="stays-hero-animate font-handwriting text-yellow-400 text-xl mb-2">
            not just a bed for the night
          </p>
          <h1 className="stays-hero-animate font-display font-black text-white text-4xl md:text-5xl max-w-3xl mx-auto leading-tight">
            Where you stay decides how deeply you experience a place.
          </h1>
          <p className="stays-hero-animate font-body text-white/70 max-w-xl mx-auto mt-4">
            We don&apos;t pick stays from booking sites. Every place we recommend, we&apos;ve stayed in.
            Small, soulful, and connected to the place.
          </p>
          <ul className="stays-hero-animate flex flex-wrap justify-center gap-3 mt-8">
            {['Fewer stays, better ones', 'Locally rooted', 'Experience-first'].map((label) => (
              <li
                key={label}
                className="rounded-full bg-white/10 px-4 py-2 font-body text-sm text-white backdrop-blur-sm"
              >
                {label}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <WavyDivider fill="#FFF8E7" />

      {/* —— Philosophy —— */}
      <section ref={philosophyRef} className="bg-[#FFF8E7] py-14 md:py-24">
        <div className="max-w-7xl mx-auto px-4 grid gap-12 lg:grid-cols-2 lg:gap-16 lg:items-center">
          <div className="stays-fade-child relative paper-lines rounded-2xl p-8 max-w-sm mx-auto lg:mx-0">
            <WashiTape
              color="yellow"
              rotation={-2}
              width="w-28"
              className="absolute -top-3 left-6"
            />
            <p className="font-handwriting text-gray-500 text-lg mb-2">our philosophy</p>
            <h2 className="font-display font-bold text-2xl leading-snug text-dark">
              Different stories.
              <br />
              Different reasons.
              <br />
              Same feeling.
            </h2>
            <p className="font-body text-gray-600 mt-3">
              A sense of slowing down. Of belonging, even if it&apos;s just for a few days.
            </p>
          </div>

          <div
            ref={polaroidCollageRef}
            className="relative w-full min-h-[480px] md:min-h-[400px] flex flex-col items-center gap-10 py-6 md:block md:py-0"
          >
            {PHILOSOPHY_POLAROIDS.map((slot) => {
              const stay = STAYS[slot.stayIndex]
              return (
                <div
                  key={stay.slug}
                  className={cn('stays-polaroid w-max shrink-0', slot.desktopSlot)}
                >
                  <PolaroidCard
                    src={stay.image}
                    alt=""
                    caption={stay.name}
                    rotation={slot.rotation}
                    size={slot.size}
                    washiColor={slot.washi}
                  />
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <WavyDivider fill="#F0F7F4" />

      {/* —— Stays grid —— */}
      <section ref={gridRef} className="bg-[#F0F7F4] py-14 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="stays-fade-child text-center mb-10 md:mb-14">
            <SectionLabel text="Our Stays" style="handwritten" className="justify-center" />
            <p className="font-handwriting text-gray-500 text-lg mt-2">
              every one of these we&apos;ve slept in
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            {STAYS.map((stay) => {
              const accent = REGION_CARD_ACCENT[stay.regionSlug]
              const theme = REGION_THEMES[stay.regionSlug]
              return (
                <article
                  key={stay.slug}
                  className={cn(
                    'stays-fade-child group bg-white rounded-2xl overflow-hidden border-l-4 shadow-[var(--shadow-card)] transition-all duration-300',
                    'hover:shadow-[var(--shadow-polaroid)] hover:-translate-y-1',
                    accent.border
                  )}
                >
                  <div className="relative h-56">
                    <Image
                      src={stay.image}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute top-3 right-3 z-10">
                      <PostageStamp region={stay.regionSlug} text={theme.label} />
                    </div>
                    <div className="absolute bottom-3 left-3 z-10">
                      <StampBadge text={stay.type} color={theme.primary} rotation={-4} />
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span
                        className={cn(
                          'rounded-full px-3 py-1 text-xs font-handwriting font-semibold',
                          accent.tag
                        )}
                      >
                        {stay.region}
                      </span>
                      <span className="flex items-center gap-1 font-body text-xs text-gray-400">
                        <Users className="size-3.5 shrink-0" aria-hidden />
                        {stay.capacity}
                      </span>
                    </div>
                    <h3 className="font-heading font-semibold text-lg text-dark mt-1">{stay.name}</h3>
                    <p className="font-body text-sm text-gray-500 mt-2 line-clamp-2">
                      {stay.description}
                    </p>
                    <ul className="grid grid-cols-2 gap-2 mt-4">
                      {stay.highlights.map((h) => (
                        <li
                          key={h}
                          className="rounded-full bg-gray-50 px-2 py-1 text-center font-body text-xs text-gray-600"
                        >
                          ✓ {h}
                        </li>
                      ))}
                    </ul>
                    <div className="flex flex-wrap items-center justify-between gap-4 mt-4 pt-4 border-t border-gray-100">
                      <p>
                        <span className={cn('font-display font-bold text-xl', accent.price)}>
                          {stay.pricePerNight}
                        </span>
                        <span className="font-body text-sm text-gray-400"> /night</span>
                      </p>
                      <Link
                        href={`/contact?type=stay&stay=${stay.slug}`}
                        className={cn(
                          'inline-flex items-center rounded-xl border-2 px-4 py-2 text-sm font-body font-semibold transition-colors',
                          accent.btn
                        )}
                      >
                        View Stay →
                      </Link>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      {/* —— How it works —— */}
      <section className="relative bg-[#FFF8E7] py-14 md:py-24">
        <TornEdge position="top" color="#FFF8E7" />
        <div ref={howRef} className="max-w-7xl mx-auto px-4">
          <div className="stays-fade-child text-center mb-12 md:mb-16">
            <SectionLabel text="How It Works" style="stamp" className="justify-center" />
          </div>
          <div className="grid gap-12 md:grid-cols-3 md:gap-8">
            {HOW_STEPS.map((step, index) => (
              <div key={step.title} className="stays-fade-child text-center px-2">
                <p className="font-display font-black text-6xl text-yellow opacity-40 leading-none">
                  {String(index + 1).padStart(2, '0')}
                </p>
                <div className="relative mx-auto mt-4 mb-4 size-14">
                  <Image
                    src={step.icon}
                    alt={step.alt}
                    width={56}
                    height={56}
                    className="object-contain mx-auto"
                  />
                </div>
                <h3 className="font-heading font-semibold text-base text-dark">{step.title}</h3>
                <p className="font-body text-sm text-gray-500 mt-2 max-w-xs mx-auto">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* —— CTA —— */}
      <section ref={ctaRef} className="bg-yellow py-14 md:py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="stays-fade-child font-display font-black text-dark text-4xl">
            Come Stay With Us
          </h2>
          <p className="stays-fade-child font-handwriting text-gray-600 text-lg mt-2">
            no booking sites, no middlemen, just us
          </p>
          <div className="stays-fade-child flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <Link
              href="/contact?type=stay"
              className="inline-flex items-center justify-center font-body font-semibold bg-dark text-white px-8 py-3 rounded-none border-2 border-dark hover:bg-dark/90 transition-colors"
            >
              Enquire About a Stay
            </Link>
            <Link
              href="/destinations"
              className="inline-flex items-center justify-center font-body font-semibold text-dark px-8 py-3 rounded-none border-2 border-dark hover:bg-dark/5 transition-colors"
            >
              View All Destinations
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
