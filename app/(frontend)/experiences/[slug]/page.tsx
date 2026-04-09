'use client'

import { useState, useRef, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { gsap } from 'gsap'
import { Minus, Plus, Lock } from 'lucide-react'
import { getExperienceBySlug, type ExperienceBatch } from '@/lib/experience-details'
import { REGION_THEMES, type RegionThemeKey } from '@/lib/constants'
import { cn, formatPrice } from '@/lib/utils'
import { calculateBookingAmounts } from '@/lib/booking-utils'
import { registerGSAP } from '@/lib/animations'
import { PostageStamp, StampBadge } from '@/components/ui/scrapbook'
import { BookingModal } from '@/components/ui/BookingModal'

// ── Date range formatter ─────────────────────────────────────────

function formatDateRange(startDate: string, endDate: string): string {
  const start = new Date(startDate)
  const end = new Date(endDate)

  const startDay = start.getDate()
  const endDay = end.getDate()

  const startMonth = start.toLocaleString('en-IN', { month: 'short' })
  const endMonth = end.toLocaleString('en-IN', { month: 'short' })
  const year = end.getFullYear()

  if (startMonth === endMonth) {
    return `${startMonth} ${startDay} – ${endDay}, ${year}`
  }
  return `${startMonth} ${startDay} – ${endMonth} ${endDay}, ${year}`
}

// ── Seats badge ──────────────────────────────────────────────────

function SeatsBadge({ batch }: { batch: ExperienceBatch }) {
  const seatsLeft = batch.seatsTotal - batch.seatsBooked

  if (batch.status === 'full' || seatsLeft <= 0) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-gray-100 text-gray-400 font-body text-xs font-medium">
        Sold out
      </span>
    )
  }

  if (seatsLeft === 1) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-red-50 text-red-600 font-body text-xs font-medium animate-pulse">
        Last seat!
      </span>
    )
  }

  if (seatsLeft <= 5) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 font-body text-xs font-medium">
        Only {seatsLeft} left!
      </span>
    )
  }

  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-green-50 text-green-600 font-body text-xs font-medium">
      {seatsLeft} seats left
    </span>
  )
}

// ── Tab types ────────────────────────────────────────────────────

type TabId = 'overview' | 'itinerary' | 'inclusions'

const TABS: { id: TabId; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'itinerary', label: 'Itinerary' },
  { id: 'inclusions', label: 'Inclusions' },
]

// ── Page ─────────────────────────────────────────────────────────

export default function ExperienceDetailPage() {
  const params = useParams<{ slug: string }>()
  const experience = getExperienceBySlug(params.slug)

  const [activeTab, setActiveTab] = useState<TabId>('overview')
  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null)
  const [travelers, setTravelers] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Refs for animations
  const heroRef = useRef<HTMLElement>(null)
  const heroImgRef = useRef<HTMLDivElement>(null)
  const heroContentRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLElement>(null)
  const bookingCardRef = useRef<HTMLDivElement>(null)

  // ── Animations ───────────────────────────────────────────────────
  useEffect(() => {
    registerGSAP()

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const ctx = gsap.context(() => {
      // Hero image parallax
      if (heroImgRef.current && heroRef.current) {
        gsap.to(heroImgRef.current, {
          yPercent: 20,
          ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1.2,
          },
        })
      }

      // Hero content stagger reveal
      if (heroContentRef.current) {
        gsap.from(heroContentRef.current.children, {
          y: 30,
          opacity: 0,
          stagger: 0.12,
          duration: 0.6,
          ease: 'power2.out',
          delay: 0.2,
        })
      }

      // Content section fade in
      if (contentRef.current) {
        gsap.from(contentRef.current, {
          y: 40,
          opacity: 0,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: contentRef.current,
            start: 'top bottom-=100',
            once: true,
          },
        })
      }
    })

    return () => ctx.revert()
  }, [])

  if (!experience) {
    notFound()
  }

  const theme = REGION_THEMES[experience.regionSlug as RegionThemeKey]
  const primary = theme?.primary ?? '#1B4FD8'
  const bg = theme?.bg ?? '#F8F9FA'
  const emoji = theme?.emoji ?? '📍'

  // Available batches (non-cancelled)
  const availableBatches = experience.batches.filter((b) => b.status !== 'cancelled')

  // Selected batch
  const selectedBatch = availableBatches.find((b) => b.id === selectedBatchId)
  const seatsLeft = selectedBatch
    ? selectedBatch.seatsTotal - selectedBatch.seatsBooked
    : 0
  const maxTravelers = selectedBatch ? Math.min(6, seatsLeft) : 1

  // Amounts
  const selectedPrice = selectedBatch?.price ?? experience.price
  const amounts = calculateBookingAmounts({
    pricePerPerson: selectedPrice,
    travelers,
    advancePercent: 30,
    gstPercent: 5,
  })

  // Reset travelers when batch changes
  const handleBatchSelect = (batchId: string) => {
    setSelectedBatchId(batchId)
    setTravelers(1)
  }

  const handleTravelersChange = (delta: number) => {
    setTravelers((prev) => Math.max(1, Math.min(maxTravelers, prev + delta)))
  }

  const handleBookNow = () => {
    if (!selectedBatch) return
    setIsModalOpen(true)
  }

  const scrollToBooking = () => {
    bookingCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <main>
      {/* ── HERO ── */}
      <section
        ref={heroRef}
        className="relative h-[60vh] min-h-[400px] flex items-end overflow-hidden"
      >
        {/* Background image */}
        <div ref={heroImgRef} className="absolute inset-0 -top-12">
          <Image
            src={experience.image}
            alt={experience.name}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>

        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />

        {/* PostageStamp - top right */}
        <div className="absolute top-6 right-6 z-10">
          <PostageStamp
            region={experience.regionSlug as RegionThemeKey}
            text={experience.type}
          />
        </div>

        {/* Hero content */}
        <div ref={heroContentRef} className="relative z-10 w-full max-w-7xl mx-auto px-4 pb-10 md:pb-14">
          {/* Region + type tags */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <div
              style={
                {
                  '--tag-bg': `${primary}30`,
                  '--tag-color': '#fff',
                } as React.CSSProperties
              }
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[var(--tag-bg)] border border-white/20"
            >
              <span className="text-xs leading-none">{emoji}</span>
              <span className="font-body text-xs font-medium text-white">
                {experience.region}
              </span>
            </div>
            <StampBadge
              text={experience.type}
              color="#fff"
              rotation={-2}
              className="!border-white/60 !outline-white/20 !text-white !bg-white/5"
            />
          </div>

          {/* Title */}
          <h1 className="font-display font-black text-white text-4xl md:text-5xl lg:text-6xl leading-tight mb-4">
            {experience.name}
          </h1>

          {/* Duration + price pills */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-sm text-white font-body text-sm">
              {experience.days}
            </span>
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-sm font-display font-bold text-sm"
              style={{ backgroundColor: `${primary}CC`, color: '#fff' }}
            >
              From {formatPrice(experience.price)}
            </span>
          </div>
        </div>
      </section>

      {/* ── CONTENT ── */}
      <section ref={contentRef} className="bg-[#F5F0E8] py-10 md:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">
            {/* ── Left Column: Tabs ── */}
            <div>
              {/* Tab bar */}
              <div className="flex gap-0 border-b-2 border-gray-200 mb-8">
                {TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      'relative px-5 py-3 font-heading font-semibold text-sm transition-colors',
                      activeTab === tab.id
                        ? 'text-dark'
                        : 'text-gray-400 hover:text-gray-600'
                    )}
                  >
                    {tab.label}
                    {activeTab === tab.id && (
                      <span
                        className="absolute bottom-0 left-0 right-0 h-0.5 -mb-px"
                        style={{ backgroundColor: primary }}
                      />
                    )}
                  </button>
                ))}
              </div>

              {/* ── Overview Tab ── */}
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  <p className="font-body text-gray-600 text-base leading-relaxed">
                    {experience.description}
                  </p>

                  <div>
                    <h3 className="font-heading font-semibold text-dark text-lg mb-4">
                      Highlights
                    </h3>
                    <ul className="space-y-3">
                      {experience.highlights.map((highlight, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span
                            className="flex-none mt-0.5 text-lg"
                            style={{ color: primary }}
                          >
                            ✓
                          </span>
                          <span className="font-body text-gray-600 text-sm leading-relaxed">
                            {highlight}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* ── Itinerary Tab ── */}
              {activeTab === 'itinerary' && (
                <div className="space-y-0">
                  {experience.itinerary.map((item, i) => (
                    <div
                      key={item.day}
                      className={cn(
                        'relative pl-8 pb-8',
                        i < experience.itinerary.length - 1 && 'border-l-2'
                      )}
                      style={{
                        borderColor: i < experience.itinerary.length - 1 ? `${primary}30` : 'transparent',
                        marginLeft: '0.75rem',
                      }}
                    >
                      {/* Day circle */}
                      <div
                        className="absolute -left-5 top-0 w-10 h-10 rounded-full flex items-center justify-center border-2"
                        style={{
                          backgroundColor: bg,
                          borderColor: primary,
                          color: primary,
                        }}
                      >
                        <span className="font-display font-black text-sm">
                          {item.day}
                        </span>
                      </div>

                      <h4 className="font-heading font-semibold text-dark text-base mb-2 pt-1.5">
                        {item.title}
                      </h4>
                      <p className="font-body text-gray-600 text-sm leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* ── Inclusions Tab ── */}
              {activeTab === 'inclusions' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Inclusions */}
                  <div>
                    <h3 className="font-heading font-semibold text-dark text-lg mb-4 flex items-center gap-2">
                      <span className="text-green-600 text-xl">✓</span>
                      What&apos;s Included
                    </h3>
                    <ul className="space-y-3">
                      {experience.inclusions.map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="flex-none mt-0.5 text-green-600 text-sm font-bold">
                            ✓
                          </span>
                          <span className="font-body text-gray-600 text-sm leading-relaxed">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Exclusions */}
                  <div>
                    <h3 className="font-heading font-semibold text-dark text-lg mb-4 flex items-center gap-2">
                      <span className="text-red-500 text-xl">✗</span>
                      Not Included
                    </h3>
                    <ul className="space-y-3">
                      {experience.exclusions.map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="flex-none mt-0.5 text-red-500 text-sm font-bold">
                            ✗
                          </span>
                          <span className="font-body text-gray-600 text-sm leading-relaxed">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* ── Right Column: Booking Card ── */}
            <div ref={bookingCardRef} className="lg:sticky lg:top-24">
              <div className="bg-white rounded-2xl shadow-[var(--shadow-polaroid)] p-6 space-y-5">
                {/* Price display */}
                <div>
                  <span className="font-handwriting text-gray-400 text-base">From</span>
                  <div className="flex items-baseline gap-1">
                    <span
                      className="font-display font-black text-3xl"
                      style={{ color: primary }}
                    >
                      {formatPrice(experience.price)}
                    </span>
                    <span className="font-body text-gray-400 text-sm">per person</span>
                  </div>
                </div>

                <div className="border-t border-gray-100" />

                {/* Date selection */}
                <div>
                  <h3 className="font-heading font-semibold text-dark text-base mb-3">
                    Select a Date
                  </h3>

                  {availableBatches.length === 0 ? (
                    <p className="font-body text-gray-400 text-sm">
                      No upcoming dates available. Check back soon.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {availableBatches.map((batch) => {
                        const isFull = batch.status === 'full' || batch.seatsTotal - batch.seatsBooked <= 0
                        const isSelected = selectedBatchId === batch.id

                        return (
                          <button
                            key={batch.id}
                            onClick={() => !isFull && handleBatchSelect(batch.id)}
                            disabled={isFull}
                            className={cn(
                              'w-full text-left p-3 rounded-xl border-2 transition-all',
                              isSelected
                                ? 'border-current shadow-sm'
                                : 'border-gray-100 hover:border-gray-200',
                              isFull && 'opacity-50 cursor-not-allowed'
                            )}
                            style={isSelected ? { borderColor: primary } : undefined}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-heading font-semibold text-dark text-sm">
                                {formatDateRange(batch.startDate, batch.endDate)}
                              </span>
                              <SeatsBadge batch={batch} />
                            </div>
                            <span className="font-body text-gray-500 text-xs">
                              {formatPrice(batch.price)} per person
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>

                {/* Traveler count */}
                {selectedBatch && seatsLeft > 0 && (
                  <>
                    <div className="border-t border-gray-100" />

                    <div>
                      <h3 className="font-heading font-semibold text-dark text-sm mb-3">
                        Number of Travelers
                      </h3>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => handleTravelersChange(-1)}
                          disabled={travelers <= 1}
                          className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center hover:border-gray-300 transition-colors disabled:opacity-30"
                        >
                          <Minus size={16} className="text-gray-600" />
                        </button>
                        <span className="font-display font-bold text-dark text-xl w-8 text-center">
                          {travelers}
                        </span>
                        <button
                          onClick={() => handleTravelersChange(1)}
                          disabled={travelers >= maxTravelers}
                          className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center hover:border-gray-300 transition-colors disabled:opacity-30"
                        >
                          <Plus size={16} className="text-gray-600" />
                        </button>
                      </div>
                    </div>

                    {/* Price breakdown */}
                    <div className="border-t border-gray-100" />

                    <div className="space-y-2 font-body text-sm">
                      <div className="flex justify-between text-gray-500">
                        <span>
                          {formatPrice(selectedPrice)} x {travelers} traveler{travelers > 1 ? 's' : ''}
                        </span>
                        <span>{formatPrice(amounts.totalAmount)}</span>
                      </div>
                      <div className="flex justify-between text-gray-500">
                        <span>30% Advance</span>
                        <span>{formatPrice(amounts.advanceBase)}</span>
                      </div>
                      <div className="flex justify-between text-gray-500">
                        <span>GST (5%)</span>
                        <span>{formatPrice(amounts.gstAmount)}</span>
                      </div>
                      <div className="border-t border-dashed border-gray-200 my-1" />
                      <div className="flex justify-between font-heading font-semibold text-dark text-base">
                        <span>Pay now</span>
                        <span style={{ color: primary }}>
                          {formatPrice(amounts.advanceAmount)}
                        </span>
                      </div>
                      <div className="flex justify-between text-gray-400 text-xs">
                        <span>Remaining (pay later)</span>
                        <span>{formatPrice(amounts.remainingAmount)}</span>
                      </div>
                    </div>
                  </>
                )}

                {/* Book Now button */}
                <button
                  onClick={handleBookNow}
                  disabled={!selectedBatch || seatsLeft <= 0}
                  className="w-full bg-yellow text-dark font-display italic font-bold text-xl py-4 rounded-none border-2 border-dark hover:bg-yellow-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Book Now
                </button>

                {/* Secure payment note */}
                <p className="flex items-center justify-center gap-1.5 font-handwriting text-gray-400 text-xs">
                  <Lock size={12} />
                  Secure payment via Razorpay
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Mobile Fixed Bottom Bar ── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 px-4 py-3 flex items-center justify-between lg:hidden shadow-[0_-4px_16px_rgba(0,0,0,0.08)]">
        <div>
          <span className="font-handwriting text-gray-400 text-xs">From</span>
          <p
            className="font-display font-bold text-lg leading-tight"
            style={{ color: primary }}
          >
            {formatPrice(selectedPrice)}
          </p>
          <span className="font-body text-gray-400 text-xs">per person</span>
        </div>
        <button
          onClick={selectedBatch ? handleBookNow : scrollToBooking}
          className="bg-yellow text-dark font-display italic font-bold text-base px-6 py-3 rounded-none border-2 border-dark hover:bg-yellow-dark transition-colors"
        >
          {selectedBatch ? 'Book Now' : 'Select Date'}
        </button>
      </div>

      {/* Extra padding at bottom for mobile fixed bar */}
      <div className="h-20 lg:hidden bg-[#F5F0E8]" />

      {/* ── Booking Modal ── */}
      {selectedBatch && (
        <BookingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          tripName={experience.name}
          batchId={selectedBatch.id}
          batchDates={formatDateRange(selectedBatch.startDate, selectedBatch.endDate)}
          travelers={travelers}
          pricePerPerson={selectedPrice}
          totalAmount={amounts.totalAmount}
          advanceAmount={amounts.advanceAmount}
          gstAmount={amounts.gstAmount}
          remainingAmount={amounts.remainingAmount}
          regionSlug={experience.regionSlug}
        />
      )}
    </main>
  )
}
