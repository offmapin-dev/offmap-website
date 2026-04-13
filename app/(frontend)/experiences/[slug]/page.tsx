'use client'

import { use, useRef, useEffect, useState, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Calendar, Users, Mountain, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import { gsap } from 'gsap'
import { REGION_THEMES, type RegionThemeKey } from '@/lib/constants'
import { ROUTE_IMAGES, FALLBACK_IMAGE } from '@/lib/images'
import { PostageStamp, SectionLabel, JournalNote } from '@/components/ui/scrapbook'
import { registerGSAP } from '@/lib/animations'
import { cn } from '@/lib/utils'

// ── Trip Detail Interface ────────────────────────────────────────
interface TripDetail {
  name: string
  region: string
  heroImage: string
  duration: string
  groupSize: string
  difficulty: string
  price: string
  description: string
  itinerary: {
    day: number
    title: string
    location: string
    description: string
    image: string
    tip: string
  }[]
  reviews: {
    name: string
    rating: number
    text: string
  }[]
}

// ── Hardcoded Trip Data ──────────────────────────────────────────
const TRIP_DATA: Record<string, TripDetail> = {
  'bir-barot': {
    name: 'Bir\u2013Barot Trek',
    region: 'himachal-pradesh',
    heroImage: '',
    duration: '4 Days \u00B7 3 Nights',
    groupSize: '8-15 people',
    difficulty: 'Easy-Moderate',
    price: '\u20B98,999',
    description:
      'A journey through the paragliding capital of India into the raw, untouched Barot Valley. Forests, river crossings, and nights under open skies.',
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Bir',
        location: 'Bir, Himachal Pradesh',
        description:
          'Arrive in Bir and settle into your homestay. Evening walk through the Tibetan colony, chai at a local cafe, and briefing for the days ahead.',
        image: '',
        tip: 'Try the thukpa at the monastery cafe',
      },
      {
        day: 2,
        title: 'Bir to Billing & Trek Start',
        location: 'Billing \u2192 Rajgundha Trail',
        description:
          'Drive up to Billing, the paragliding launch site. Begin the trek through dense oak and rhododendron forests. Camp overnight in a meadow.',
        image: '',
        tip: 'The sunrise from Billing is unreal \u2014 wake up early',
      },
      {
        day: 3,
        title: 'Trek to Barot Valley',
        location: 'Forest Trail \u2192 Barot',
        description:
          'Continue through forest trails, cross a river, and descend into the beautiful Barot Valley. Evening bonfire by the Uhl river.',
        image: '',
        tip: 'Carry a refillable bottle \u2014 fresh springs along the way',
      },
      {
        day: 4,
        title: 'Barot Exploration & Departure',
        location: 'Barot Valley',
        description:
          'Morning walk along the Barot dam, explore the trout farm and local village. Depart by afternoon with memories and tired legs.',
        image: '',
        tip: 'The fish from the trout farm is incredible',
      },
    ],
    reviews: [
      {
        name: 'Deepika Hada',
        rating: 5,
        text: "This was my very first trip with strangers and one of the best decisions I've ever made. The trails, the stays, the people \u2014 everything felt intentional and real.",
      },
      {
        name: 'Sachin Kumar',
        rating: 5,
        text: "OFFMAP truly lives up to their name. They took us off the beaten path to places I didn't know existed. No tourist traps, no rush.",
      },
      {
        name: 'Sumit Chaudhary',
        rating: 5,
        text: 'The planning was seamless, the stay was beautiful, and the route felt like it was designed for people who actually want to feel a place.',
      },
    ],
  },
  'rajgundha-valley': {
    name: 'Rajgundha Valley',
    region: 'himachal-pradesh',
    heroImage: '',
    duration: '3 Days \u00B7 2 Nights',
    groupSize: '8-15 people',
    difficulty: 'Easy',
    price: '\u20B97,499',
    description:
      'A hidden valley accessible only on foot. Rajgundha is where the mountains feel personal \u2014 no roads, no shops, just you and the Himalayas.',
    itinerary: [
      {
        day: 1,
        title: 'Arrive at Billing',
        location: 'Billing, Himachal Pradesh',
        description:
          'Drive to Billing and begin the trek to Rajgundha. 4-hour walk through oak forests with views that keep getting better.',
        image: '',
        tip: 'Pack light \u2014 the trail is easy but long',
      },
      {
        day: 2,
        title: 'Rajgundha Valley Day',
        location: 'Rajgundha Valley',
        description:
          'Explore the valley, visit local homes, walk to the nearby ridge for panoramic views. Afternoon nap in the meadow is encouraged.',
        image: '',
        tip: 'Ask the locals about the legend of the valley',
      },
      {
        day: 3,
        title: 'Trek Back & Departure',
        location: 'Rajgundha \u2192 Billing',
        description:
          'Morning chai with views, then trek back to Billing. Depart with a quieter mind.',
        image: '',
        tip: "The morning light in the valley is magical \u2014 don't sleep in",
      },
    ],
    reviews: [
      {
        name: 'Sumit Chaudhary',
        rating: 5,
        text: 'The Rajgundha trip was an unforgettable experience. The planning was seamless, the stay was beautiful.',
      },
      {
        name: 'Sachin Kumar',
        rating: 5,
        text: 'No tourist traps, no rush \u2014 just genuine experiences with a group of like-minded people.',
      },
      {
        name: 'Deepika Hada',
        rating: 5,
        text: "I came back feeling like I'd actually been somewhere. Not just visited, but experienced.",
      },
    ],
  },
  'shangarh-raghupur-fort': {
    name: 'Shangarh\u2013Raghupur Fort',
    region: 'himachal-pradesh',
    heroImage: '',
    duration: '3 Days \u00B7 2 Nights',
    groupSize: '8-15 people',
    difficulty: 'Easy',
    price: '\u20B97,999',
    description:
      'A walk through the Great Himalayan National Park buffer zone to one of the most scenic meadows in Himachal and a forgotten hilltop fort.',
    itinerary: [
      {
        day: 1,
        title: 'Arrive in Shangarh',
        location: 'Shangarh, Tirthan Valley',
        description:
          'Drive to Shangarh and explore the vast meadow surrounded by deodar forests. Settle into a local homestay.',
        image: '',
        tip: 'The meadow at sunset is one of the best views in Himachal',
      },
      {
        day: 2,
        title: 'Trek to Raghupur Fort',
        location: 'Shangarh \u2192 Raghupur Fort',
        description:
          'Trek through dense forest to the ruins of Raghupur Fort. Panoramic views of the Dhauladhar and Pir Panjal ranges from the top.',
        image: '',
        tip: 'Carry snacks \u2014 there are no shops on the trail',
      },
      {
        day: 3,
        title: 'Village Walk & Departure',
        location: 'Shangarh Village',
        description:
          'Morning walk through the village, interact with locals, and depart with stories from the hills.',
        image: '',
        tip: 'The local rajma-chawal here is legendary',
      },
    ],
    reviews: [
      {
        name: 'Deepika Hada',
        rating: 5,
        text: 'Shangarh felt like a secret. The meadow, the forest, the fort \u2014 everything was quietly stunning.',
      },
      {
        name: 'Sachin Kumar',
        rating: 5,
        text: 'Raghupur Fort was the highlight. Standing on those ruins with 360-degree mountain views \u2014 unforgettable.',
      },
      {
        name: 'Sumit Chaudhary',
        rating: 5,
        text: 'A perfectly paced trip. Not too intense, not too lazy. Just right for a weekend escape.',
      },
    ],
  },
  jawai: {
    name: 'Jawai',
    region: 'rajasthan',
    heroImage: '',
    duration: '3 Days \u00B7 2 Nights',
    groupSize: '8-12 people',
    difficulty: 'Easy',
    price: '\u20B99,999',
    description:
      'Leopards, granite hills, and a Rajasthan most people never see. Jawai is where wildlife meets raw desert beauty.',
    itinerary: [
      {
        day: 1,
        title: 'Arrive in Jawai',
        location: 'Jawai, Rajasthan',
        description:
          'Arrive at the camp near the Jawai dam. Evening safari to spot leopards on the granite hills as the sun sets.',
        image: '',
        tip: 'Keep your camera ready \u2014 leopards appear when you least expect',
      },
      {
        day: 2,
        title: 'Safari & Village Visit',
        location: 'Jawai Hills & Rabari Village',
        description:
          'Morning leopard safari followed by a visit to a Rabari village. Experience their traditional way of life and craftsmanship.',
        image: '',
        tip: 'The Rabari people are incredibly welcoming \u2014 ask about their embroidery',
      },
      {
        day: 3,
        title: 'Sunrise Safari & Departure',
        location: 'Jawai Dam',
        description:
          'Early morning safari for one last chance to see the leopards. Breakfast by the dam and departure.',
        image: '',
        tip: 'The sunrise over the dam with flamingos is pure magic',
      },
    ],
    reviews: [
      {
        name: 'Riya Sharma',
        rating: 5,
        text: 'Jawai was unlike anything I expected from Rajasthan. Leopards at dusk, quiet villages, and a pace that let me actually enjoy it all.',
      },
      {
        name: 'Arjun Verma',
        rating: 5,
        text: 'The team knew every corner of the place. It felt like traveling with a friend who lives there, not a tour guide.',
      },
      {
        name: 'Priya Desai',
        rating: 5,
        text: "I've been to Rajasthan before, but this trip showed me a completely different side. Off the tourist trail, exactly as promised.",
      },
    ],
  },
  'kasar-devi-khaliya-top': {
    name: 'Kasar Devi\u2013Khaliya Top',
    region: 'uttarakhand',
    heroImage: '',
    duration: '4 Days \u00B7 3 Nights',
    groupSize: '8-12 people',
    difficulty: 'Moderate',
    price: '\u20B98,499',
    description:
      'From the cosmic energy of Kasar Devi to the panoramic summit of Khaliya Top \u2014 a trek that balances spiritual calm with mountain adventure.',
    itinerary: [
      {
        day: 1,
        title: 'Arrive in Kasar Devi',
        location: 'Kasar Devi, Almora',
        description:
          'Arrive in the quiet hilltop village of Kasar Devi. Visit the ancient temple known for its geomagnetic properties. Evening walk through pine forests.',
        image: '',
        tip: 'The Kasar Devi temple has a unique energy \u2014 sit quietly for a while',
      },
      {
        day: 2,
        title: 'Drive to Munsiyari & Trek Start',
        location: 'Munsiyari, Uttarakhand',
        description:
          'Drive through the Kumaon hills to Munsiyari. Begin the trek towards Khaliya Top through bugyals and rhododendron forests.',
        image: '',
        tip: 'The drive itself is half the experience \u2014 keep the windows down',
      },
      {
        day: 3,
        title: 'Summit Khaliya Top',
        location: 'Khaliya Top (3,500m)',
        description:
          'Early morning push to the summit for 360-degree views of the Panchachuli peaks. Descend back to base camp.',
        image: '',
        tip: 'Layer up \u2014 it gets cold at the top even in summer',
      },
      {
        day: 4,
        title: 'Return & Departure',
        location: 'Munsiyari \u2192 Almora',
        description:
          'Trek down, drive back through the hills. Stop for chai and pakoras at a roadside dhaba. Depart with mountain memories.',
        image: '',
        tip: 'The dhaba near Birthi Falls serves the best maggi in Kumaon',
      },
    ],
    reviews: [
      {
        name: 'Ankur Mehta',
        rating: 5,
        text: 'The quietness of Uttarakhand is something else. No crowds, no noise \u2014 just mountains and good company.',
      },
      {
        name: 'Sneha Reddy',
        rating: 5,
        text: 'Uttarakhand with OffMap felt like a secret only a few people know about. I hope it stays that way.',
      },
      {
        name: 'Vikram Rao',
        rating: 5,
        text: 'The trek was exactly the right level of challenge. And the views from Khaliya Top \u2014 absolutely worth every step.',
      },
    ],
  },
}

// ── Shared review helpers ─────────────────────────────────────────
function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  const first = parts[0]?.[0] ?? ''
  const last = parts.length > 1 ? parts[parts.length - 1][0] : ''
  return (first + last).toUpperCase()
}

function TripReviewsSection({ reviews }: { reviews: { name: string; rating: number; text: string }[] }) {
  const sectionRef = useRef<HTMLElement>(null)
  const reviewContentRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const isAnimatingRef = useRef(false)

  const resetAutoAdvance = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % reviews.length)
    }, 5000)
  }, [reviews.length])

  const goTo = useCallback((index: number) => {
    if (isAnimatingRef.current) return
    setActive(index)
    resetAutoAdvance()
  }, [resetAutoAdvance])

  useEffect(() => {
    resetAutoAdvance()
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [resetAutoAdvance])

  useEffect(() => {
    if (!reviewContentRef.current) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return
    isAnimatingRef.current = true
    gsap.fromTo(
      reviewContentRef.current,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out', onComplete: () => { isAnimatingRef.current = false } },
    )
  }, [active])

  useEffect(() => {
    registerGSAP()
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return
    const ctx = gsap.context(() => {
      if (sectionRef.current) {
        gsap.from(sectionRef.current.querySelector('.review-card-wrapper'), {
          y: 40, opacity: 0, duration: 0.7, ease: 'power2.out', delay: 0.15, immediateRender: false,
          scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', once: true },
        })
      }
    })
    return () => ctx.revert()
  }, [])

  const review = reviews[active]

  return (
    <section ref={sectionRef} className="bg-white py-10 md:py-14">
      <div className="max-w-3xl mx-auto px-4">
        <SectionLabel text="What Travelers Say" style="handwritten" className="block mb-3" />
        <h2 className="font-display font-bold text-dark text-3xl mb-6">Reviews</h2>

        <div className="review-card-wrapper bg-white rounded-3xl p-4 md:p-5 shadow-[var(--shadow-card)]">
          <div className="bg-[#0D78A8] rounded-2xl p-5 md:p-6 relative overflow-hidden">
            <span className="absolute top-1 left-3 font-display font-black text-6xl text-white/30 leading-none select-none pointer-events-none">
              &ldquo;
            </span>

            <div ref={reviewContentRef} key={active}>
              <div className="flex items-center gap-0.5 mb-3">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <span key={i} className="text-yellow text-xl leading-none">&#9733;</span>
                ))}
              </div>

              <p className="font-body text-white text-base text-center leading-relaxed italic px-6 md:px-10 mb-5">
                {review.text}
              </p>

              <div className="flex items-center justify-between px-2">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <span className="font-display font-bold text-white text-base">{getInitials(review.name)}</span>
                </div>
                <p className="font-display italic font-bold text-white text-base flex-1 text-center mx-3">{review.name}</p>
                <span className="font-display font-black text-4xl text-white/30 leading-none select-none pointer-events-none flex-shrink-0">&rdquo;</span>
              </div>
            </div>

            {reviews.length > 1 && (
              <>
                <button
                  onClick={() => goTo((active - 1 + reviews.length) % reviews.length)}
                  className="absolute left-1.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors duration-200"
                  aria-label="Previous review"
                >
                  <ChevronLeft size={16} className="text-white" />
                </button>
                <button
                  onClick={() => goTo((active + 1) % reviews.length)}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors duration-200"
                  aria-label="Next review"
                >
                  <ChevronRight size={16} className="text-white" />
                </button>
              </>
            )}
          </div>
        </div>

        {reviews.length > 1 && (
          <div className="flex items-center justify-center gap-2.5 mt-5">
            {reviews.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Go to review ${i + 1}`}
                className={cn(
                  'rounded-full transition-all duration-300',
                  i === active ? 'w-3 h-3 bg-[#0D78A8]' : 'w-2 h-2 bg-[#0D78A8]/30 hover:bg-[#0D78A8]/50',
                )}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

// ── Page Component ───────────────────────────────────────────────
export default function TripDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)
  const trip = TRIP_DATA[slug]
  if (!trip) notFound()

  const theme = REGION_THEMES[trip.region as RegionThemeKey]
  if (!theme) notFound()

  const heroImage = ROUTE_IMAGES[slug] ?? FALLBACK_IMAGE

  return (
    <main>
      {/* ═══ HERO ══════════════════════════════════════════════════════ */}
      <section className="relative h-[45vh] min-h-[400px] overflow-hidden">
        <Image
          src={heroImage}
          alt={trip.name}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        <div className="absolute top-6 right-6 z-10">
          <PostageStamp region={trip.region as RegionThemeKey} />
        </div>
        <div className="absolute bottom-0 left-0 right-0 z-10 pb-10 px-6 md:px-12 max-w-3xl">
          <p
            className="font-handwriting text-lg mb-2"
            style={{ color: theme.accent }}
          >
            {theme.label}
          </p>
          <h1 className="font-display font-black text-white text-4xl md:text-6xl leading-none mb-3">
            {trip.name}
          </h1>
          <p className="font-body text-white/80 text-base max-w-xl">
            {trip.description}
          </p>
        </div>
      </section>

      {/* ═══ QUICK FACTS BAR ═══════════════════════════════════════════ */}
      <section className="bg-white border-b border-gray-100 py-4">
        <div className="max-w-5xl mx-auto px-4 flex flex-wrap justify-center gap-0">
          {[
            {
              icon: <Calendar size={18} />,
              label: 'Duration',
              value: trip.duration,
            },
            {
              icon: <Users size={18} />,
              label: 'Group Size',
              value: trip.groupSize,
            },
            {
              icon: <Mountain size={18} />,
              label: 'Difficulty',
              value: trip.difficulty,
            },
            {
              icon: <CheckCircle size={18} />,
              label: 'From',
              value: trip.price,
            },
          ].map((fact, i) => (
            <div
              key={fact.label}
              className={cn(
                'flex-1 min-w-[140px] text-center px-6 py-2',
                i < 3 && 'border-r border-gray-100'
              )}
            >
              <div className="flex items-center justify-center gap-1.5 text-gray-400 mb-1">
                {fact.icon}
                <span className="font-handwriting text-sm">{fact.label}</span>
              </div>
              <p className="font-heading font-semibold text-dark text-sm">
                {fact.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ DAY-WISE ITINERARY ════════════════════════════════════════ */}
      <section
        className="py-10 md:py-14"
        style={{ backgroundColor: theme.bg }}
      >
        <div className="max-w-4xl mx-auto px-4">
          <SectionLabel
            text="How It Unfolds"
            style="handwritten"
            className="block mb-3"
          />
          <h2 className="font-display font-bold text-dark text-3xl mb-2">
            The Flow, Not a Checklist
          </h2>
          <p className="font-body text-gray-500 text-sm mb-6">
            This is a rough flow of how your days might look — not a fixed schedule. We leave room to explore, slow down, or change plans based on the weather, the group, and the moment.
          </p>

          <div className="space-y-8">
            {trip.itinerary.map((day) => (
              <div key={day.day} className="flex gap-4 md:gap-6">
                {/* Day number circle */}
                <div
                  className="flex-none w-10 h-10 rounded-full flex items-center justify-center font-display font-bold text-white text-sm"
                  style={{ backgroundColor: theme.primary }}
                >
                  {day.day}
                </div>

                {/* Content */}
                <div
                  className="flex-1 pb-8 border-l-2 border-dashed pl-6 -ml-[21px] mt-5"
                  style={{ borderColor: `${theme.primary}33` }}
                >
                  <h3 className="font-heading font-semibold text-dark text-lg">
                    {day.title}
                  </h3>
                  <p className="font-handwriting text-gray-400 text-sm mt-0.5">
                    {day.location}
                  </p>
                  <p className="font-body text-gray-600 text-sm mt-2 leading-relaxed">
                    {day.description}
                  </p>

                  {/* Insider tip */}
                  <div className="mt-3">
                    <JournalNote
                      text={`insider tip: ${day.tip}`}
                      type="torn"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ REVIEWS ═══════════════════════════════════════════════════ */}
      <TripReviewsSection reviews={trip.reviews} />

      {/* ═══ CTA ═══════════════════════════════════════════════════════ */}
      <section
        className="py-10 md:py-14"
        style={{ backgroundColor: theme.primary }}
      >
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-display font-black text-white text-3xl md:text-4xl mb-3">
            Ready for {trip.name}?
          </h2>
          <p className="font-handwriting text-white/80 text-xl mb-8">
            let&apos;s make it happen &rarr;
          </p>
          <Link
            href="/contact"
            className="font-body font-semibold bg-white text-dark px-8 py-4 inline-block hover:bg-white/90 transition-colors duration-200"
          >
            Enquire Now
          </Link>
        </div>
      </section>
    </main>
  )
}
