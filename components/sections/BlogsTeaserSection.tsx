'use client'

import { useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { gsap } from 'gsap'
import { StampBadge, WashiTape, SectionLabel } from '@/components/ui/scrapbook'
import { registerGSAP } from '@/lib/animations'
import { cn } from '@/lib/utils'
import { BLOG_IMAGES } from '@/lib/images'

interface BlogPost {
  title: string
  category: string
  categoryColor: string
  date: string
  image: string
  href: string
  rotation: number
  washiColor: 'yellow' | 'blue' | 'pink'
}

const BLOG_POSTS: BlogPost[] = [
  {
    title: 'A 4-Day Slow Trek Through Bir to Barot Valley',
    category: 'Himachal Pradesh',
    categoryColor: '#2D6A4F',
    date: 'March 2025',
    image: BLOG_IMAGES.birBarotTrek,
    href: '/blogs/bir-barot-trek',
    rotation: -2,
    washiColor: 'yellow',
  },
  {
    title: "Why Jawai is Rajasthan's Best Kept Secret",
    category: 'Rajasthan',
    categoryColor: '#C1440E',
    date: 'February 2025',
    image: BLOG_IMAGES.jawaiSecret,
    href: '/blogs/jawai-rajasthan',
    rotation: 1,
    washiColor: 'pink',
  },
  {
    title: 'Traveling Slow: What It Actually Means',
    category: 'Travel Philosophy',
    categoryColor: '#1B4FD8',
    date: 'January 2025',
    image: BLOG_IMAGES.slowTravel,
    href: '/blogs/slow-travel',
    rotation: -1,
    washiColor: 'blue',
  },
]

// Entry amplification — each card enters with MORE rotation than its resting state
const CARD_FROM = [
  { x: -60, y: 60, opacity: 0, scale: 0.9 },
  { y: 80,         opacity: 0, scale: 0.9 },
  { x: 60,  y: 60, opacity: 0, scale: 0.9 },
]

export function BlogsTeaserSection() {
  const sectionRef  = useRef<HTMLElement>(null)
  const headerRef   = useRef<HTMLDivElement>(null)
  const stampRef    = useRef<HTMLSpanElement>(null)
  const captionRef  = useRef<HTMLParagraphElement>(null)
  // Declare each ref individually — arrays of useRef() break Rules of Hooks
  const card0Ref    = useRef<HTMLAnchorElement>(null)
  const card1Ref    = useRef<HTMLAnchorElement>(null)
  const card2Ref    = useRef<HTMLAnchorElement>(null)
  const cardRefs    = [card0Ref, card1Ref, card2Ref]

  useEffect(() => {
    registerGSAP()
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const ctx = gsap.context(() => {
      const st = { trigger: sectionRef.current, start: 'top bottom', once: true }

      // 1. StampBadge: rubber-band spin
      if (stampRef.current) {
        gsap.from(stampRef.current, {
          scale: 0, rotation: -25, opacity: 0,
          duration: 0.65, ease: 'back.out(1.8)', immediateRender: false, scrollTrigger: st,
        })
      }

      // 2. Caption slide up
      if (captionRef.current) {
        gsap.from(captionRef.current, {
          y: 22, opacity: 0, duration: 0.5, ease: 'power2.out', delay: 0.25, immediateRender: false, scrollTrigger: st,
        })
      }

      // 3. Blog cards: stagger from their unique origins, settle to natural rotation
      cardRefs.forEach((ref, i) => {
        if (!ref.current) return
        gsap.from(ref.current, {
          ...CARD_FROM[i],
          duration: 0.85,
          ease: 'back.out(1.1)',
          delay: 0.15 + i * 0.15,
          immediateRender: false,
          scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', once: true },
        })
      })
    })

    return () => ctx.revert()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section ref={sectionRef} className="bg-[#FFF0F3] py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div ref={headerRef} className="mb-12">
          <span ref={stampRef} className="inline-block mb-3">
            <SectionLabel text="The Chronicle" style="stamp" />
          </span>
          <p ref={captionRef} className="font-handwriting text-blue text-xl mt-4">
            stories from the road →
          </p>
        </div>

        {/* Blog cards — corkboard scattered */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 items-start">
          {BLOG_POSTS.map((post, i) => (
            <Link
              key={post.href}
              ref={cardRefs[i]}
              href={post.href}
              style={{ '--post-r': `${post.rotation}deg` } as React.CSSProperties}
              className={cn(
                'group block bg-white',
                'rotate-[var(--post-r)] hover:rotate-0 hover:scale-[1.02]',
                'transition-all duration-300',
                'shadow-[2px_2px_10px_rgba(0,0,0,0.1)] hover:shadow-[4px_4px_18px_rgba(0,0,0,0.15)]',
                'will-change-transform'
              )}
            >
              {/* Washi tape at top */}
              <div className="relative flex justify-center -mb-1 z-10">
                <WashiTape color={post.washiColor} rotation={0} width="w-16" />
              </div>

              {/* Image */}
              <div className="relative h-44 overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-2 right-2 z-10">
                  <StampBadge text={post.category} color={post.categoryColor} rotation={3} className="text-[9px]" />
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <p className="font-handwriting text-gray-400 text-sm mb-2">{post.date}</p>
                <p className="font-display font-bold text-dark text-lg leading-snug mb-3 line-clamp-2">{post.title}</p>
                <p className="font-handwriting text-blue text-base group-hover:translate-x-1 transition-transform duration-200">Read Journal →</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
