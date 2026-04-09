'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { MapPin, Calendar, Compass, Search, X } from 'lucide-react'
import { gsap } from 'gsap'
import { cn } from '@/lib/utils'
import { EASE_OUT, DURATION_FAST } from '@/lib/animations'

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter()
  const [location, setLocation] = useState('')
  const [date, setDate] = useState('')
  const [type, setType] = useState('')

  const backdropRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [shouldRender, setShouldRender] = useState(false)

  const prefersReducedMotion =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false

  // Animate in when isOpen becomes true
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true)
    }
  }, [isOpen])

  // Run entrance/exit animations after render
  useEffect(() => {
    if (!shouldRender) return

    const backdrop = backdropRef.current
    const content = contentRef.current
    if (!backdrop || !content) return

    if (isOpen) {
      if (prefersReducedMotion) {
        gsap.set(backdrop, { opacity: 1 })
        gsap.set(content, { opacity: 1, y: 0 })
      } else {
        gsap.fromTo(
          backdrop,
          { opacity: 0 },
          { opacity: 1, duration: DURATION_FAST, ease: EASE_OUT }
        )
        gsap.fromTo(
          content,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: DURATION_FAST, ease: EASE_OUT, delay: 0.05 }
        )
      }
    } else {
      if (prefersReducedMotion) {
        gsap.set(backdrop, { opacity: 0 })
        gsap.set(content, { opacity: 0 })
        setShouldRender(false)
      } else {
        gsap.to(content, {
          opacity: 0,
          y: 20,
          duration: 0.25,
          ease: EASE_OUT,
        })
        gsap.to(backdrop, {
          opacity: 0,
          duration: 0.3,
          ease: EASE_OUT,
          onComplete: () => setShouldRender(false),
        })
      }
    }
  }, [isOpen, shouldRender, prefersReducedMotion])

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Close on Escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    },
    [onClose]
  )

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, handleKeyDown])

  function handleSearch() {
    const params = new URLSearchParams()
    if (location) params.set('location', location)
    if (date) params.set('date', date)
    if (type) params.set('type', type)
    router.push(`/experiences?${params.toString()}`)
    onClose()
  }

  function handleBackdropClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  if (!shouldRender) return null

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-[60] bg-dark/60 backdrop-blur-sm flex items-start md:items-center justify-center"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label="Search experiences"
    >
      {/* Mobile: full screen, Desktop: centered modal */}
      <div
        ref={contentRef}
        className={cn(
          'bg-white w-full min-h-screen p-6',
          'md:min-h-0 md:max-w-lg md:rounded-2xl md:p-8 md:mx-4 md:mt-0'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading font-bold text-lg text-dark">
            Find your next adventure
          </h2>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close search"
          >
            <X size={20} className="text-dark" />
          </button>
        </div>

        {/* Fields */}
        <div className="flex flex-col gap-4">
          {/* Field 1 — Location */}
          <div className="flex items-center gap-3 px-4 py-3 border border-gray-200 rounded-xl hover:border-blue/40 transition-colors">
            <MapPin size={18} className="text-blue flex-none" />
            <div className="flex flex-col min-w-0 w-full">
              <label className="font-handwriting text-xs text-gray-400 leading-none mb-0.5">
                where to?
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="bg-transparent text-dark text-sm font-body focus:outline-none cursor-pointer w-full"
              >
                <option value="">All Destinations</option>
                <option value="himachal-pradesh">Himachal Pradesh</option>
                <option value="rajasthan">Rajasthan</option>
                <option value="kashmir">Kashmir</option>
                <option value="uttarakhand">Uttarakhand</option>
              </select>
            </div>
          </div>

          {/* Field 2 — Date */}
          <div className="flex items-center gap-3 px-4 py-3 border border-gray-200 rounded-xl hover:border-blue/40 transition-colors">
            <Calendar size={18} className="text-blue flex-none" />
            <div className="flex flex-col min-w-0 w-full">
              <label className="font-handwriting text-xs text-gray-400 leading-none mb-0.5">
                when?
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-transparent text-dark text-sm font-body focus:outline-none cursor-pointer w-full"
              />
            </div>
          </div>

          {/* Field 3 — Experience type */}
          <div className="flex items-center gap-3 px-4 py-3 border border-gray-200 rounded-xl hover:border-blue/40 transition-colors">
            <Compass size={18} className="text-blue flex-none" />
            <div className="flex flex-col min-w-0 w-full">
              <label className="font-handwriting text-xs text-gray-400 leading-none mb-0.5">
                what?
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="bg-transparent text-dark text-sm font-body focus:outline-none cursor-pointer w-full"
              >
                <option value="">All Experiences</option>
                <option value="group-trips">Group Trips</option>
                <option value="day-trips">Day Trips</option>
                <option value="stays">Stays</option>
                <option value="activities">Activities</option>
              </select>
            </div>
          </div>

          {/* Search button */}
          <button
            onClick={handleSearch}
            className="mt-2 bg-yellow text-dark font-heading font-bold rounded-xl px-6 py-3.5 border-2 border-dark flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform duration-200 w-full"
            aria-label="Search experiences"
          >
            <Search size={18} />
            Search Experiences
          </button>
        </div>
      </div>
    </div>
  )
}
