'use client'

import { useRef, useEffect, useState, useMemo } from 'react'
import { useParams } from 'next/navigation'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { gsap } from 'gsap'
import {
  ChevronLeft,
  Minus,
  Plus,
  MapPin,
  Wifi,
  Flame,
  TreePine,
  Mountain,
  Car,
  UtensilsCrossed,
  Droplets,
  Eye,
  Tent,
  Map,
  BookOpen,
} from 'lucide-react'
import {
  PolaroidCard,
  PostageStamp,
  StampBadge,
  WashiTape,
} from '@/components/ui/scrapbook'
import { StayBookingModal } from '@/components/ui/StayBookingModal'
import { registerGSAP } from '@/lib/animations'
import { getStayBySlug } from '@/lib/stay-details'
import { calculateStayBookingAmounts } from '@/lib/booking-utils'
import { formatPrice } from '@/lib/utils'
import { REGION_THEMES, type RegionThemeKey } from '@/lib/constants'
import { cn } from '@/lib/utils'

// ── Region accent map (Tailwind-only, no inline styles) ──────────
const REGION_ACCENT: Record<
  RegionThemeKey,
  { price: string; btn: string; highlight: string; badge: string }
> = {
  'himachal-pradesh': {
    price: 'text-[#2D6A4F]',
    btn: 'bg-yellow text-dark hover:bg-yellow/90',
    highlight: 'bg-[#F0F7F4] text-[#2D6A4F]',
    badge: 'bg-[#F0F7F4] text-[#2D6A4F]',
  },
  rajasthan: {
    price: 'text-[#C1440E]',
    btn: 'bg-yellow text-dark hover:bg-yellow/90',
    highlight: 'bg-[#FDF6F0] text-[#C1440E]',
    badge: 'bg-[#FDF6F0] text-[#C1440E]',
  },
  kashmir: {
    price: 'text-[#C1121F]',
    btn: 'bg-yellow text-dark hover:bg-yellow/90',
    highlight: 'bg-[#FFF5F5] text-[#C1121F]',
    badge: 'bg-[#FFF5F5] text-[#C1121F]',
  },
  uttarakhand: {
    price: 'text-[#6B4226]',
    btn: 'bg-yellow text-dark hover:bg-yellow/90',
    highlight: 'bg-[#F5F0EB] text-[#6B4226]',
    badge: 'bg-[#F5F0EB] text-[#6B4226]',
  },
}

// ── Amenity icon lookup ──────────────────────────────────────────
const AMENITY_ICONS: Record<string, React.ReactNode> = {
  'Wi-Fi': <Wifi className="size-4 shrink-0" />,
  Kitchen: <UtensilsCrossed className="size-4 shrink-0" />,
  'Hot water': <Droplets className="size-4 shrink-0" />,
  'Hot water (bucket)': <Droplets className="size-4 shrink-0" />,
  'Mountain view': <Mountain className="size-4 shrink-0" />,
  'Valley view room': <Eye className="size-4 shrink-0" />,
  Parking: <Car className="size-4 shrink-0" />,
  'Home-cooked meals': <UtensilsCrossed className="size-4 shrink-0" />,
  'Camp meals': <UtensilsCrossed className="size-4 shrink-0" />,
  'Courtyard seating': <TreePine className="size-4 shrink-0" />,
  'Garden seating': <TreePine className="size-4 shrink-0" />,
  'Bonfire area': <Flame className="size-4 shrink-0" />,
  'Campfire area': <Flame className="size-4 shrink-0" />,
  'Local guide': <MapPin className="size-4 shrink-0" />,
  'Sleeping bags': <Tent className="size-4 shrink-0" />,
  'Trail maps': <Map className="size-4 shrink-0" />,
}

// ── Activity icon lookup ─────────────────────────────────────────
const ACTIVITY_ICONS: Record<string, React.ReactNode> = {
  Paragliding: <Mountain className="size-4 shrink-0" />,
  Hiking: <Mountain className="size-4 shrink-0" />,
  'Village walks': <MapPin className="size-4 shrink-0" />,
  'Monastery visits': <BookOpen className="size-4 shrink-0" />,
  'Leopard safari': <Eye className="size-4 shrink-0" />,
  'Temple walks': <BookOpen className="size-4 shrink-0" />,
  'Village tour': <MapPin className="size-4 shrink-0" />,
  Stargazing: <Eye className="size-4 shrink-0" />,
  'Forest treks': <TreePine className="size-4 shrink-0" />,
  'Bird watching': <Eye className="size-4 shrink-0" />,
  'Night walks': <TreePine className="size-4 shrink-0" />,
  'Campfire stories': <Flame className="size-4 shrink-0" />,
  'Meadow walks': <TreePine className="size-4 shrink-0" />,
  'Raghupur Fort hike': <Mountain className="size-4 shrink-0" />,
  'Sacred forest visit': <TreePine className="size-4 shrink-0" />,
  Photography: <Eye className="size-4 shrink-0" />,
}

// Gallery rotations for the polaroid effect
const GALLERY_ROTATIONS = [-3, 2, -1]

export default function StayDetailPage() {
  const params = useParams()
  const slug = typeof params.slug === 'string' ? params.slug : ''
  const stay = getStayBySlug(slug)

  // ── Refs for animations ────────────────────────────────────────
  const heroRef = useRef<HTMLDivElement>(null)
  const galleryRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  // ── Booking state ──────────────────────────────────────────────
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // ── Date helpers ───────────────────────────────────────────────
  const today = new Date().toISOString().split('T')[0]
  const minCheckOut = checkIn
    ? new Date(new Date(checkIn).getTime() + 86400000).toISOString().split('T')[0]
    : today

  // ── Calculate nights & amounts ─────────────────────────────────
  const numberOfNights = useMemo(() => {
    if (!checkIn || !checkOut) return 0
    const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime()
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
  }, [checkIn, checkOut])

  const amounts = useMemo(() => {
    if (!stay || numberOfNights < 1) {
      return { totalAmount: 0, advanceBase: 0, gstAmount: 0, advanceAmount: 0, remainingAmount: 0 }
    }
    return calculateStayBookingAmounts({
      pricePerNight: stay.pricePerNight,
      numberOfNights,
      numberOfGuests: guests,
    })
  }, [stay, numberOfNights, guests])

  const isBookingValid = numberOfNights >= 1 && guests >= 1

  // ── Animations ─────────────────────────────────────────────────
  useEffect(() => {
    registerGSAP()
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const ctx = gsap.context(() => {
      // Hero text fade in
      if (heroRef.current) {
        gsap.from(heroRef.current.querySelectorAll('.stay-hero-animate'), {
          y: 28,
          opacity: 0,
          stagger: 0.1,
          duration: 0.6,
          ease: 'power2.out',
          immediateRender: false,
        })
      }

      // Gallery polaroids scale in
      if (galleryRef.current) {
        const polaroids = galleryRef.current.querySelectorAll('.stay-gallery-item')
        if (polaroids.length) {
          gsap.from(polaroids, {
            scale: 0.92,
            opacity: 0,
            stagger: 0.1,
            duration: 0.55,
            ease: 'back.out(1.2)',
            immediateRender: false,
            scrollTrigger: {
              trigger: galleryRef.current,
              start: 'top bottom',
              once: true,
            },
          })
        }
      }

      // Content fade in
      if (contentRef.current) {
        const items = contentRef.current.querySelectorAll('.stay-fade-child')
        if (items.length) {
          gsap.from(items, {
            y: 32,
            opacity: 0,
            stagger: 0.08,
            duration: 0.55,
            ease: 'power2.out',
            immediateRender: false,
            scrollTrigger: {
              trigger: contentRef.current,
              start: 'top bottom',
              once: true,
            },
          })
        }
      }
    })

    return () => ctx.revert()
  }, [])

  // Reset check-out if check-in changes to later date
  useEffect(() => {
    if (checkIn && checkOut && checkOut <= checkIn) {
      setCheckOut('')
    }
  }, [checkIn, checkOut])

  // ── Not found ──────────────────────────────────────────────────
  if (!stay) {
    notFound()
  }

  const theme = REGION_THEMES[stay.regionSlug]
  const accent = REGION_ACCENT[stay.regionSlug]

  return (
    <main className="bg-[#FAF8F5] min-h-screen">
      {/* ── Hero Section ── */}
      <section className="relative h-[55vh] min-h-[380px] flex flex-col justify-end overflow-hidden">
        <Image
          src={stay.image}
          alt={stay.name}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/10" />

        {/* PostageStamp — top right */}
        <div className="absolute top-4 right-4 z-10">
          <PostageStamp region={stay.regionSlug} text={theme.label} />
        </div>

        {/* Back link */}
        <Link
          href="/stays"
          className="absolute top-4 left-4 z-10 flex items-center gap-1 font-body text-sm text-white/80 hover:text-white transition-colors"
        >
          <ChevronLeft className="size-4" />
          All Stays
        </Link>

        <div
          ref={heroRef}
          className="relative z-10 max-w-7xl mx-auto px-4 pb-10 md:pb-14 w-full"
        >
          <div className="stay-hero-animate mb-3">
            <StampBadge text={stay.type} color={theme.primary} rotation={-4} />
          </div>
          <h1 className="stay-hero-animate font-display font-black text-white text-4xl md:text-5xl leading-tight max-w-2xl">
            {stay.name}
          </h1>
          <div className="stay-hero-animate flex items-center gap-2 mt-3">
            <span
              className={cn(
                'rounded-full px-3 py-1 text-xs font-handwriting font-semibold backdrop-blur-sm',
                'bg-white/15 text-white'
              )}
            >
              {stay.region}
            </span>
            <span className="text-white/60 font-body text-sm">
              Up to {stay.maxGuests} guests
            </span>
          </div>
        </div>
      </section>

      {/* ── Image Gallery ── */}
      <section className="py-8 md:py-12">
        <div
          ref={galleryRef}
          className="max-w-7xl mx-auto px-4"
        >
          {/* Mobile: horizontal scroll */}
          <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory md:hidden -mx-4 px-4">
            {stay.gallery.map((src, i) => (
              <div
                key={src}
                className="stay-gallery-item snap-center shrink-0"
              >
                <PolaroidCard
                  src={src}
                  alt={`${stay.name} - photo ${i + 1}`}
                  caption={stay.highlights[i] ?? ''}
                  rotation={GALLERY_ROTATIONS[i % GALLERY_ROTATIONS.length]}
                  size="md"
                  washiColor={(['yellow', 'blue', 'pink'] as const)[i % 3]}
                />
              </div>
            ))}
          </div>

          {/* Desktop: 3-column grid */}
          <div className="hidden md:grid md:grid-cols-3 md:gap-8 md:justify-items-center">
            {stay.gallery.map((src, i) => (
              <div
                key={src}
                className="stay-gallery-item"
              >
                <PolaroidCard
                  src={src}
                  alt={`${stay.name} - photo ${i + 1}`}
                  caption={stay.highlights[i] ?? ''}
                  rotation={GALLERY_ROTATIONS[i % GALLERY_ROTATIONS.length]}
                  size="lg"
                  washiColor={(['yellow', 'blue', 'pink'] as const)[i % 3]}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Content + Booking Card ── */}
      <section className="pb-16 md:pb-24">
        <div
          ref={contentRef}
          className="max-w-7xl mx-auto px-4 lg:grid lg:grid-cols-[1fr_380px] lg:gap-8"
        >
          {/* ── Left Column: Details ── */}
          <div className="space-y-10">
            {/* Description */}
            <div className="stay-fade-child relative bg-white rounded-2xl p-6 md:p-8 shadow-[var(--shadow-card)]">
              <WashiTape
                color="yellow"
                rotation={-2}
                width="w-24"
                className="absolute -top-3 left-6"
              />
              <p className="font-handwriting text-gray-400 text-lg mb-2">
                about this place
              </p>
              <p className="font-body text-gray-600 leading-relaxed">
                {stay.description}
              </p>
            </div>

            {/* Highlights */}
            <div className="stay-fade-child">
              <h2 className="font-display font-bold text-xl text-dark mb-4">
                What You&apos;ll Find
              </h2>
              <div className="flex flex-wrap gap-2">
                {stay.highlights.map((h) => (
                  <span
                    key={h}
                    className="bg-white rounded-full shadow-sm px-4 py-2 font-body text-sm text-gray-700"
                  >
                    {h}
                  </span>
                ))}
              </div>
            </div>

            {/* Activities */}
            <div className="stay-fade-child">
              <h2 className="font-display font-bold text-xl text-dark mb-4">
                Activities Nearby
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {stay.activities.map((a) => (
                  <div
                    key={a}
                    className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-sm"
                  >
                    <span
                      style={{ color: theme.primary }}
                    >
                      {ACTIVITY_ICONS[a] ?? <MapPin className="size-4 shrink-0" />}
                    </span>
                    <span className="font-body text-sm text-gray-700">{a}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Amenities */}
            <div className="stay-fade-child">
              <h2 className="font-display font-bold text-xl text-dark mb-4">
                Amenities
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {stay.amenities.map((a) => (
                  <div
                    key={a}
                    className="flex items-center gap-3 font-body text-sm text-gray-700"
                  >
                    <span
                      style={{ color: theme.primary }}
                    >
                      {AMENITY_ICONS[a] ?? (
                        <span className="text-sm">&#10003;</span>
                      )}
                    </span>
                    {a}
                  </div>
                ))}
              </div>
            </div>

            {/* House Rules */}
            <div className="stay-fade-child">
              <h2 className="font-display font-bold text-xl text-dark mb-4">
                House Rules
              </h2>
              <ul className="space-y-2">
                {stay.houseRules.map((rule) => (
                  <li
                    key={rule}
                    className="flex items-start gap-2 font-body text-sm text-gray-600"
                  >
                    <span className="text-gray-400 mt-0.5 shrink-0">&#8226;</span>
                    {rule}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ── Right Column: Booking Card ── */}
          <div className="mt-10 lg:mt-0">
            <div className="sticky top-24 bg-white rounded-2xl shadow-[var(--shadow-polaroid)] p-6 space-y-5">
              {/* Price */}
              <div>
                <span
                  style={{ color: theme.primary }}
                  className="font-display font-black text-3xl"
                >
                  {formatPrice(stay.pricePerNight)}
                </span>
                <span className="font-body text-sm text-gray-400"> /night</span>
              </div>

              <div className="border-t border-gray-100" />

              {/* Check-in */}
              <div>
                <label
                  htmlFor="checkIn"
                  className="block font-body text-sm font-medium text-gray-700 mb-1"
                >
                  Check-in
                </label>
                <input
                  id="checkIn"
                  type="date"
                  min={today}
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 font-body text-sm text-dark focus:border-yellow focus:ring-2 focus:ring-yellow/30 outline-none transition-all"
                />
              </div>

              {/* Check-out */}
              <div>
                <label
                  htmlFor="checkOut"
                  className="block font-body text-sm font-medium text-gray-700 mb-1"
                >
                  Check-out
                </label>
                <input
                  id="checkOut"
                  type="date"
                  min={minCheckOut}
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 font-body text-sm text-dark focus:border-yellow focus:ring-2 focus:ring-yellow/30 outline-none transition-all"
                />
              </div>

              {/* Guests stepper */}
              <div>
                <label className="block font-body text-sm font-medium text-gray-700 mb-1">
                  Guests
                </label>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setGuests((g) => Math.max(1, g - 1))}
                    disabled={guests <= 1}
                    className="size-10 flex items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    aria-label="Decrease guests"
                  >
                    <Minus className="size-4" />
                  </button>
                  <span className="font-body text-lg font-semibold text-dark min-w-[2ch] text-center">
                    {guests}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setGuests((g) => Math.min(stay.maxGuests, g + 1))
                    }
                    disabled={guests >= stay.maxGuests}
                    className="size-10 flex items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    aria-label="Increase guests"
                  >
                    <Plus className="size-4" />
                  </button>
                  <span className="font-body text-xs text-gray-400">
                    max {stay.maxGuests}
                  </span>
                </div>
              </div>

              {/* Price breakdown */}
              {isBookingValid && (
                <div className="space-y-2 pt-2 border-t border-gray-100">
                  <div className="flex justify-between font-body text-sm text-gray-500">
                    <span>
                      {numberOfNights} night{numberOfNights > 1 ? 's' : ''} x{' '}
                      {formatPrice(stay.pricePerNight)} x {guests} guest
                      {guests > 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="flex justify-between font-body text-sm text-gray-500">
                    <span>Subtotal</span>
                    <span>{formatPrice(amounts.totalAmount)}</span>
                  </div>
                  <div className="flex justify-between font-body text-sm text-gray-500">
                    <span>30% Advance</span>
                    <span>{formatPrice(amounts.advanceBase)}</span>
                  </div>
                  <div className="flex justify-between font-body text-sm text-gray-500">
                    <span>GST (5%)</span>
                    <span>{formatPrice(amounts.gstAmount)}</span>
                  </div>
                  <div className="border-t border-dashed border-gray-200 pt-2" />
                  <div className="flex justify-between font-body font-semibold text-dark">
                    <span>Pay now</span>
                    <span
                      style={{ color: theme.primary }}
                      className="font-display font-bold"
                    >
                      {formatPrice(amounts.advanceAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between font-body text-xs text-gray-400">
                    <span>Remaining (pay at stay)</span>
                    <span>{formatPrice(amounts.remainingAmount)}</span>
                  </div>
                </div>
              )}

              {/* Book button */}
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                disabled={!isBookingValid}
                className={cn(
                  'w-full font-display italic font-bold px-6 py-3.5 rounded-xl transition-colors',
                  accent.btn,
                  'disabled:opacity-40 disabled:cursor-not-allowed'
                )}
              >
                Book This Stay
              </button>

              <p className="text-center font-body text-xs text-gray-400">
                Secure payment via Razorpay
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Booking Modal ── */}
      <StayBookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        stayName={stay.name}
        staySlug={stay.slug}
        checkIn={checkIn}
        checkOut={checkOut}
        numberOfGuests={guests}
        numberOfNights={numberOfNights}
        pricePerNight={stay.pricePerNight}
        totalAmount={amounts.totalAmount}
        advanceAmount={amounts.advanceAmount}
        gstAmount={amounts.gstAmount}
        remainingAmount={amounts.remainingAmount}
        regionSlug={stay.regionSlug}
      />
    </main>
  )
}
