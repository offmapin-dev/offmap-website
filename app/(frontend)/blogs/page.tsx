'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { gsap } from 'gsap'
import { BLOG_POSTS, CATEGORIES, type BlogCategoryFilter } from '@/lib/blog-data'
import { registerGSAP } from '@/lib/animations'
import type { RegionThemeKey } from '@/lib/constants'
import {
  PolaroidCard,
  TornEdge,
  WashiTape,
  SectionLabel,
  StampBadge,
  JournalNote,
  PostageStamp,
} from '@/components/ui/scrapbook'
import { BlogCard } from '@/components/ui/BlogCard'
import { cn } from '@/lib/utils'

/** Wrappers center each card on a lane across the row (no empty middle). Polaroid rotation stays on the card. */
const POLAROID_LAYOUT: {
  i: number
  rotation: number
  size: 'sm' | 'md'
  washi?: 'yellow' | 'blue' | 'pink'
  wrapperClassName: string
}[] = [
  { i: 0, rotation: -6, size: 'sm', washi: 'yellow', wrapperClassName: 'absolute left-[6%] top-7 z-10 -translate-x-1/2' },
  { i: 1, rotation: 3, size: 'md', washi: 'blue', wrapperClassName: 'absolute left-[26%] top-0 z-20 -translate-x-1/2' },
  { i: 2, rotation: -2, size: 'md', wrapperClassName: 'absolute left-[48%] top-14 z-[15] -translate-x-1/2' },
  { i: 3, rotation: 5, size: 'sm', washi: 'pink', wrapperClassName: 'absolute left-[68%] bottom-0 z-30 -translate-x-1/2' },
  { i: 4, rotation: -3, size: 'sm', wrapperClassName: 'absolute left-[82%] top-7 z-20 -translate-x-1/2' },
]

const POLAROID_CAPTIONS = [
  'Bir to Barot — slow days',
  'Jawai, off the map',
  'What slow travel means',
  'Rajgundha meadow',
  'Quiet Uttarakhand hills',
]

function categoryWashi(category: string): 'green' | 'blue' | 'yellow' {
  if (category === 'Destinations') return 'green'
  if (category === 'Travel Guides') return 'blue'
  return 'yellow'
}

export default function BlogsPage() {
  const [activeCategory, setActiveCategory] = useState<BlogCategoryFilter>('All')

  const heroCollageRef = useRef<HTMLDivElement>(null)
  const heroTextRef = useRef<HTMLDivElement>(null)
  const featuredRef = useRef<HTMLElement>(null)
  const filtersRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLElement>(null)
  const newsletterRef = useRef<HTMLElement>(null)
  const ctaRef = useRef<HTMLElement>(null)

  const featured = BLOG_POSTS.find((p) => p.featured)
  if (!featured) {
    throw new Error('BLOG_POSTS must include one featured post')
  }

  const filteredPosts =
    activeCategory === 'All'
      ? BLOG_POSTS
      : BLOG_POSTS.filter((p) => p.category === activeCategory)

  const storyBadgeText =
    filteredPosts.length === 1 ? '1 story' : `${filteredPosts.length} stories`

  useEffect(() => {
    registerGSAP()
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const ctx = gsap.context(() => {
      const polaroids = heroCollageRef.current?.querySelectorAll('.blog-polaroid')
      if (polaroids?.length) {
        gsap.from(polaroids, {
          scale: 0,
          opacity: 0,
          stagger: 0.08,
          duration: 0.55,
          ease: 'back.out(1.4)',
          immediateRender: false,
          scrollTrigger: {
            trigger: heroCollageRef.current,
            start: 'top bottom',
            once: true,
          },
        })
      }

      if (heroTextRef.current) {
        gsap.from(heroTextRef.current.children, {
          y: 28,
          opacity: 0,
          stagger: 0.1,
          duration: 0.55,
          ease: 'power2.out',
          delay: 0.15,
          immediateRender: false,
          scrollTrigger: {
            trigger: heroTextRef.current,
            start: 'top bottom',
            once: true,
          },
        })
      }

      if (featuredRef.current) {
        const items = featuredRef.current.querySelectorAll('.featured-animate')
        gsap.from(items, {
          y: 40,
          opacity: 0,
          stagger: 0.1,
          duration: 0.65,
          ease: 'power2.out',
          immediateRender: false,
          scrollTrigger: {
            trigger: featuredRef.current,
            start: 'top bottom',
            once: true,
          },
        })
      }

      if (filtersRef.current) {
        gsap.from(filtersRef.current.querySelectorAll('.filter-animate'), {
          y: 20,
          opacity: 0,
          stagger: 0.06,
          duration: 0.45,
          ease: 'power2.out',
          immediateRender: false,
          scrollTrigger: {
            trigger: filtersRef.current,
            start: 'top bottom',
            once: true,
          },
        })
      }

      if (gridRef.current) {
        const cards = gridRef.current.querySelectorAll('.blog-grid-card')
        gsap.from(cards, {
          y: 32,
          opacity: 0,
          stagger: 0.08,
          duration: 0.5,
          ease: 'power2.out',
          immediateRender: false,
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top bottom',
            once: true,
          },
        })
      }

      if (newsletterRef.current) {
        gsap.from(newsletterRef.current.querySelectorAll('.news-animate'), {
          y: 24,
          opacity: 0,
          stagger: 0.1,
          duration: 0.55,
          ease: 'power2.out',
          immediateRender: false,
          scrollTrigger: {
            trigger: newsletterRef.current,
            start: 'top bottom',
            once: true,
          },
        })
      }

      if (ctaRef.current) {
        gsap.from(ctaRef.current.querySelectorAll('.cta-animate'), {
          y: 22,
          opacity: 0,
          stagger: 0.12,
          duration: 0.55,
          ease: 'back.out(1.2)',
          immediateRender: false,
          scrollTrigger: {
            trigger: ctaRef.current,
            start: 'top bottom',
            once: true,
          },
        })
      }
    })

    return () => ctx.revert()
  }, [])

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return
    const cards = gridRef.current?.querySelectorAll<HTMLElement>('.blog-grid-card')
    if (!cards?.length) return
    gsap.fromTo(
      Array.from(cards),
      { y: 20, opacity: 0, scale: 0.98 },
      { y: 0, opacity: 1, scale: 1, stagger: 0.06, duration: 0.35, ease: 'power2.out' }
    )
  }, [activeCategory])

  return (
    <main>
      {/* SECTION 1 — Corkboard hero */}
      <section className="bg-[#F5F0E8] overflow-x-hidden overflow-y-visible">
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
          <div
            ref={heroCollageRef}
            className="relative min-h-[17rem] h-[17rem] md:min-h-[22rem] md:h-[22rem] mb-12 md:mb-16 mx-auto max-w-5xl"
          >
            {POLAROID_LAYOUT.map((cfg) => {
              const post = BLOG_POSTS[cfg.i]
              if (!post) return null
              return (
                <div key={post.slug} className={cfg.wrapperClassName}>
                  <PolaroidCard
                    src={post.image}
                    alt={post.title}
                    caption={POLAROID_CAPTIONS[cfg.i] ?? post.title}
                    rotation={cfg.rotation}
                    size={cfg.size}
                    washiColor={cfg.washi}
                    className="blog-polaroid"
                  />
                </div>
              )
            })}
          </div>

          <div ref={heroTextRef} className="text-center max-w-3xl mx-auto">
            <div className="relative inline-block mb-6">
              <WashiTape color="yellow" rotation={-2} width="w-36" />
              <span className="absolute inset-0 flex items-center justify-center font-handwriting text-dark/80 text-sm pointer-events-none">
                field notes →
              </span>
            </div>
            <h1 className="font-display font-black text-dark text-6xl md:text-8xl leading-none">
              The Chronicle
            </h1>
            <p className="font-handwriting text-gray-500 text-xl mt-4">
              stories from the road, the trail and the table
            </p>
          </div>
        </div>
        <TornEdge position="bottom" color="#EFF6FF" />
      </section>

      {/* SECTION 2 — Featured */}
      <section ref={featuredRef} className="bg-[#EFF6FF] py-12 md:py-20 relative">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="relative grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-10 lg:items-start">
            <div className="featured-animate lg:col-span-3 relative h-80 rounded-2xl overflow-hidden shadow-[var(--shadow-card)]">
              <Image
                src={featured.image}
                alt={featured.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 60vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none" />
              {featured.regionSlug != null ? (
                <div className="absolute top-4 left-4 z-10">
                  <PostageStamp region={featured.regionSlug as RegionThemeKey} />
                </div>
              ) : null}
              <div className="absolute bottom-4 left-4 z-10">
                <StampBadge text="Featured Story" color="#0F172A" rotation={-2} />
              </div>
              <div className="hidden md:block absolute top-4 right-4 z-20 max-w-[9rem]">
                <JournalNote
                  text="our favourite one this month 📌"
                  type="sticky"
                  className="rotate-[5deg] shadow-[var(--shadow-polaroid)] w-auto min-w-0"
                />
              </div>
            </div>

            <div className="lg:col-span-2 flex flex-col gap-3 lg:pt-1">
              <div className="featured-animate">
                <SectionLabel text="Editor's Pick" style="stamp" />
              </div>
              <div className="featured-animate relative inline-block w-fit">
                <WashiTape color={categoryWashi(featured.category)} rotation={-2} width="w-40" />
                <span className="absolute inset-0 flex items-center justify-center font-handwriting text-dark/85 text-sm pointer-events-none px-2 text-center leading-tight">
                  {featured.category}
                </span>
              </div>
              <h2 className="featured-animate font-display font-black text-dark text-3xl leading-tight">
                {featured.title}
              </h2>
              <p className="featured-animate font-body text-gray-600 text-base mt-1 line-clamp-3">
                {featured.excerpt}
              </p>
              <div className="featured-animate flex flex-wrap items-center gap-3 font-handwriting text-gray-400 text-sm mt-2">
                {featured.region != null ? (
                  <span>{featured.region}</span>
                ) : null}
                {featured.region != null ? <span aria-hidden>·</span> : null}
                <span>{featured.date}</span>
                <span aria-hidden>·</span>
                <span>{featured.readTime}</span>
              </div>
              <Link
                href={`/blogs/${featured.slug}`}
                className={cn(
                  'featured-animate inline-block mt-4 w-fit',
                  'font-display italic font-bold text-base text-white',
                  'bg-dark border-2 border-dark px-6 py-3 rounded-none',
                  'transition-colors duration-200',
                  'hover:bg-yellow hover:text-dark'
                )}
              >
                Read the Story →
              </Link>
              <div className="featured-animate md:hidden mt-6 flex justify-center">
                <JournalNote
                  text="our favourite one this month 📌"
                  type="sticky"
                  className="rotate-[3deg] shadow-[var(--shadow-polaroid)]"
                />
              </div>
            </div>
          </div>
        </div>
        <TornEdge position="bottom" color="#FFF8E7" />
      </section>

      {/* SECTION 3 — Filters */}
      <section className="bg-[#FFF8E7] py-8">
        <div
          ref={filtersRef}
          className="max-w-7xl mx-auto px-4 flex flex-col items-center text-center md:flex-row md:items-center md:justify-between md:text-left gap-6"
        >
          <div className="filter-animate flex flex-wrap items-center justify-center md:justify-start gap-3">
            <h2 className="font-display font-bold text-dark text-xl md:text-2xl">
              From the journal
            </h2>
            <StampBadge text={storyBadgeText} color="#0F172A" rotation={-2} />
          </div>
          <div className="filter-animate flex flex-wrap justify-center gap-2">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    'font-heading text-sm px-5 py-2 rounded-full border-2 transition-colors duration-150',
                    isActive
                      ? 'bg-dark text-white border-dark'
                      : 'bg-white border-gray-200 text-dark hover:bg-gray-50'
                  )}
                >
                  {cat}
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* SECTION 4 — Grid */}
      <section ref={gridRef} className="bg-[#FFF8E7] pb-16 md:pb-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {filteredPosts.length === 0 ? (
            <div className="py-16 flex justify-center">
              <JournalNote
                text="nothing here yet — more stories coming soon 🗺️"
                type="sticky"
                className="text-center"
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
              {filteredPosts.map((post, index) => (
                <BlogCard
                  key={post.slug}
                  post={post}
                  large={index === 0}
                  tilt={index === 0 ? undefined : index % 2 === 1 ? 'left' : 'right'}
                  className={cn(
                    'blog-grid-card',
                    index === 0 && 'md:col-span-2 lg:col-span-2'
                  )}
                />
              ))}
            </div>
          )}
        </div>
        <TornEdge position="bottom" color="#0F172A" />
      </section>

      {/* SECTION 5 — Newsletter */}
      <section ref={newsletterRef} className="bg-dark py-16 md:py-24">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <span className="news-animate text-6xl block mb-4" role="img" aria-label="">
            📬
          </span>
          <h2 className="news-animate font-display font-black text-white text-4xl">
            Write Your Own Story
          </h2>
          <p className="news-animate font-handwriting text-white/60 text-xl max-w-lg mx-auto mt-4 leading-relaxed">
            subscribe to our monthly dispatch of hidden trails and cultural curiosities. no spam, just
            pure wanderlust.
          </p>
          <form
            className="news-animate mt-10 flex flex-col sm:flex-row gap-3 justify-center items-stretch sm:items-center"
            onSubmit={(e) => e.preventDefault()}
          >
            <label htmlFor="blog-dispatch-email" className="sr-only">
              Email for dispatch
            </label>
            <input
              id="blog-dispatch-email"
              type="email"
              name="email"
              autoComplete="email"
              placeholder="your dispatch address..."
              className={cn(
                'font-body w-full sm:max-w-sm rounded-xl px-4 py-3',
                'bg-white/10 border border-white/20 text-white placeholder:text-white/40',
                'focus:outline-none focus:ring-2 focus:ring-yellow/80'
              )}
            />
            <button
              type="submit"
              className={cn(
                'font-heading font-bold text-dark bg-yellow px-6 py-3 rounded-xl',
                'border-2 border-dark shrink-0',
                'hover:bg-yellow-dark transition-colors'
              )}
            >
              Join the Club →
            </button>
          </form>
          <p className="news-animate font-handwriting text-white/30 text-sm mt-8 max-w-md mx-auto">
            we write when we have something real to say. which is not that often.
          </p>
        </div>
        <TornEdge position="bottom" color="#FFD60A" />
      </section>

      {/* SECTION 6 — Final CTA */}
      <section ref={ctaRef} className="bg-yellow py-20 md:py-28">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="cta-animate font-display font-black text-dark text-4xl">
            Ready to write your own story?
          </h2>
          <p className="cta-animate font-handwriting text-dark/60 text-xl mt-4 mb-10">
            stop reading, start going
          </p>
          <Link
            href="/contact"
            className={cn(
              'cta-animate inline-block font-body font-semibold',
              'bg-dark text-white px-8 py-4 rounded-none border-2 border-dark',
              'hover:bg-dark/90 transition-colors duration-200'
            )}
          >
            Plan Your Journey →
          </Link>
        </div>
      </section>
    </main>
  )
}
