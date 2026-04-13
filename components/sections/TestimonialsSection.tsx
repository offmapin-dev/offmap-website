'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import Image from 'next/image'
import { gsap } from 'gsap'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { PolaroidCard } from '@/components/ui/scrapbook'
import { registerGSAP } from '@/lib/animations'
import { cn } from '@/lib/utils'

interface Review {
  name: string
  trip: string
  photo: string | null
  rating: number
  text: string
}

const REVIEWS: Review[] = [
  {
    name: 'Deepika Hada',
    trip: 'Himachal Pradesh Trip',
    photo: null,
    rating: 5,
    text: 'This was my very first trip with strangers, and I feel it was one of the best decisions I\u2019ve ever made. At every step, we enjoyed ourselves.',
  },
  {
    name: 'Sachin Kumar',
    trip: 'Himachal Pradesh Trip',
    photo: null,
    rating: 5,
    text: 'OFFMAP truly lives up to their name \u2014 they took us off the beaten path. No hidden fees, just pure joy. Can\u2019t wait for our next trip with them.',
  },
  {
    name: 'Sumit Chaudhary',
    trip: 'Rajgundha Valley Trip',
    photo: null,
    rating: 5,
    text: 'The Rajgundha trip was an unforgettable experience \u2014 one of those journeys that stays with you long after you\u2019re back home.',
  },
]

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  const first = parts[0]?.[0] ?? ''
  const last = parts.length > 1 ? parts[parts.length - 1][0] : ''
  return (first + last).toUpperCase()
}

function StarRating() {
  return (
    <div className="flex items-center gap-0.5 mb-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className="text-yellow text-2xl leading-none">&#9733;</span>
      ))}
    </div>
  )
}

function ReviewerAvatar({ review }: { review: Review }) {
  if (review.photo) {
    return (
      <div className="w-16 h-16 rounded-full border-3 border-white overflow-hidden flex-shrink-0">
        <Image
          src={review.photo}
          alt={review.name}
          width={64}
          height={64}
          className="object-cover w-full h-full"
        />
      </div>
    )
  }

  return (
    <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
      <span className="font-display font-bold text-white text-xl">
        {getInitials(review.name)}
      </span>
    </div>
  )
}

export function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const reviewContentRef = useRef<HTMLDivElement>(null)
  const [activeReview, setActiveReview] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const isAnimatingRef = useRef(false)

  const resetAutoAdvance = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setActiveReview((prev) => (prev + 1) % REVIEWS.length)
    }, 5000)
  }, [])

  const goTo = useCallback((index: number) => {
    if (isAnimatingRef.current) return
    setActiveReview(index)
    resetAutoAdvance()
  }, [resetAutoAdvance])

  const goNext = useCallback(() => {
    goTo((activeReview + 1) % REVIEWS.length)
  }, [activeReview, goTo])

  const goPrev = useCallback(() => {
    goTo((activeReview - 1 + REVIEWS.length) % REVIEWS.length)
  }, [activeReview, goTo])

  useEffect(() => {
    resetAutoAdvance()
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [resetAutoAdvance])

  useEffect(() => {
    if (!reviewContentRef.current) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    isAnimatingRef.current = true
    gsap.fromTo(
      reviewContentRef.current,
      { opacity: 0, y: 12 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'power2.out',
        onComplete: () => { isAnimatingRef.current = false },
      },
    )
  }, [activeReview])

  useEffect(() => {
    registerGSAP()
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const ctx = gsap.context(() => {
      const st = { trigger: sectionRef.current, start: 'top bottom', once: true }

      if (cardRef.current) {
        gsap.from(cardRef.current, {
          y: 60,
          opacity: 0,
          duration: 0.8,
          ease: 'power2.out',
          delay: 0.2,
          immediateRender: false,
          scrollTrigger: st,
        })
      }
    })

    return () => ctx.revert()
  }, [])

  const review = REVIEWS[activeReview]

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[600px] overflow-hidden"
    >
      {/* Full bleed background photo */}
      <Image
        src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1920&q=80"
        alt="Group travel"
        fill
        className="object-cover"
        sizes="100vw"
        priority={false}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40" />

      {/* Top left headline */}
      <div className="absolute top-8 left-6 md:top-12 md:left-12 z-10">
        <h2 className="font-display font-black text-white text-3xl md:text-5xl leading-tight">
          Real Travellers
          <br />
          Real Stories
        </h2>
      </div>

      {/* Polaroid photos — top right, hidden on mobile */}
      <div className="hidden md:block">
        <div className="absolute top-8 right-8 z-10">
          <PolaroidCard
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80"
            alt="Mountain peaks"
            caption="the view"
            rotation={6}
            size="sm"
            className="absolute top-0 right-0"
          />
        </div>
        <div className="absolute top-20 right-48 z-10">
          <PolaroidCard
            src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80"
            alt="Mountain ridges"
            caption="off the map"
            rotation={-3}
            size="sm"
            className="absolute top-0 right-0"
          />
        </div>
      </div>

      {/* Floating white card — bottom portion */}
      <div className="relative z-20 pt-44 md:pt-52 pb-8 md:pb-12 mx-4 md:mx-12">
        <div ref={cardRef} className="bg-white rounded-3xl p-4 md:p-6 shadow-2xl max-w-4xl mx-auto">

          {/* Azure review card inside */}
          <div className="bg-[#0D78A8] rounded-2xl p-6 md:p-8 relative overflow-hidden">
            {/* Opening quote mark */}
            <span className="absolute top-2 left-4 font-display font-black text-7xl text-white/30 leading-none select-none pointer-events-none">
              &ldquo;
            </span>

            <div ref={reviewContentRef} key={activeReview}>
              <StarRating />

              <p className="font-body text-white text-base md:text-lg text-center leading-relaxed italic px-4 md:px-12 mb-6">
                {review.text}
              </p>

              {/* Reviewer row */}
              <div className="flex items-center justify-between px-2 md:px-4">
                <ReviewerAvatar review={review} />

                <div className="text-center flex-1 mx-4">
                  <p className="font-display italic font-bold text-white text-lg">
                    {review.name}
                  </p>
                  <p className="font-body text-white/60 text-sm mt-0.5">
                    {review.trip}
                  </p>
                </div>

                {/* Closing quote */}
                <span className="font-display font-black text-5xl text-white/30 leading-none select-none pointer-events-none flex-shrink-0">
                  &rdquo;
                </span>
              </div>
            </div>

            {/* Prev/Next arrows */}
            <button
              onClick={goPrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors duration-200"
              aria-label="Previous review"
            >
              <ChevronLeft size={20} className="text-white" />
            </button>
            <button
              onClick={goNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors duration-200"
              aria-label="Next review"
            >
              <ChevronRight size={20} className="text-white" />
            </button>
          </div>
        </div>

        {/* Navigation dots */}
        <div className="flex items-center justify-center gap-3 mt-6">
          {REVIEWS.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to review ${i + 1}`}
              className={cn(
                'rounded-full transition-all duration-300',
                i === activeReview
                  ? 'w-3.5 h-3.5 bg-yellow'
                  : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/60',
              )}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
