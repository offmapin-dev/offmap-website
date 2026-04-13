'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface TripCardData {
  name: string
  subtitle: string
  region: string
  regionSlug: string
  image: string
  month: number
  year: number
  date: string
  duration: string
  originalPrice: string
  price: string
  badge?: string
  departure?: string
  slug: string
}

interface StackedTripCardProps {
  frontCard: TripCardData
  backCard: TripCardData
  regionColor: string
  className?: string
}

export function StackedTripCard({
  frontCard,
  backCard,
  regionColor,
  className,
}: StackedTripCardProps) {
  return (
    <div
      className={cn('relative w-72 md:w-80 mx-auto', className)}
      style={{ '--region-color': regionColor } as React.CSSProperties}
    >
      {/* Back card — rotated, slightly behind */}
      <div
        className="absolute inset-0 z-[1] scale-95 rotate-[-4deg] translate-x-[-20px] translate-y-[8px] rounded-3xl overflow-hidden opacity-85"
        aria-hidden="true"
      >
        <div className="relative h-full w-full rounded-3xl overflow-hidden">
          <Image
            src={backCard.image}
            alt={backCard.name}
            fill
            sizes="320px"
            className="object-cover"
          />
          <div
            className="absolute inset-0"
            style={{ backgroundColor: regionColor, opacity: 0.75 }}
          />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <p className="font-display font-black text-white/60 text-xl uppercase leading-none">
              {backCard.name}
            </p>
          </div>
        </div>
      </div>

      {/* Front card — main visible card */}
      <div className="relative z-[2] rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.2)]">
        {/* Photo area */}
        <div className="relative h-64 overflow-hidden">
          <Image
            src={frontCard.image}
            alt={frontCard.name}
            fill
            sizes="(max-width: 768px) 288px, 320px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

          {/* Badge */}
          {frontCard.badge && (
            <div className="absolute top-4 left-4">
              <span className="bg-[#FFE927] text-[#0D78A8] rounded-full px-3 py-1 font-heading font-bold text-xs">
                {frontCard.badge}
              </span>
            </div>
          )}

          {/* Destination name overlay */}
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="font-display font-black text-white text-3xl uppercase leading-none">
              {frontCard.name}
            </h3>
            <p className="font-handwriting italic text-white/80 text-lg mt-1">
              {frontCard.subtitle}
            </p>
          </div>
        </div>

        {/* Bottom section */}
        <div className="bg-white p-4">
          {/* Date + Price row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Calendar size={14} className="text-[#0D78A8]" />
              <span className="font-heading text-sm text-gray-500">
                {frontCard.date} &middot; {frontCard.duration}
              </span>
            </div>
            <div className="text-right">
              <span className="text-gray-400 text-sm line-through mr-1.5">
                {frontCard.originalPrice}
              </span>
              <span className="font-display font-black text-2xl text-[#0D78A8]">
                {frontCard.price}
              </span>
            </div>
          </div>

          {/* Departure route */}
          {frontCard.departure && (
            <p className="font-handwriting text-gray-400 text-sm mt-1">
              {frontCard.departure}
            </p>
          )}

          {/* Book Now button */}
          <Link
            href={`/experiences/${frontCard.slug}`}
            className={cn(
              'block w-full text-center mt-3 py-3 rounded-full',
              'bg-[#0D78A8] text-white font-heading font-bold uppercase text-sm',
              'hover:bg-[#0A5F85] transition-colors duration-200',
            )}
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  )
}
