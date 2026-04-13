'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X } from 'lucide-react'
import { gsap } from 'gsap'
import { cn } from '@/lib/utils'
import { EASE_OUT, DURATION_FAST } from '@/lib/animations'

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

const DESTINATIONS = [
  { label: 'Himachal Pradesh', value: 'himachal-pradesh' },
  { label: 'Rajasthan', value: 'rajasthan' },
  { label: 'Kashmir', value: 'kashmir' },
  { label: 'Uttarakhand', value: 'uttarakhand' },
]

const EXPERIENCE_TYPES = [
  { label: 'Group Trips', value: 'group-trips' },
  { label: 'Day Trips', value: 'day-trips' },
  { label: 'Stays', value: 'stays' },
  { label: 'Activities', value: 'activities' },
]

const TRIP_DURATIONS = [
  { label: '1–2 Days', value: '1-2' },
  { label: '3–4 Days', value: '3-4' },
  { label: '5–7 Days', value: '5-7' },
  { label: '7+ Days', value: '7+' },
]

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [selectedDuration, setSelectedDuration] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const backdropRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [shouldRender, setShouldRender] = useState(false)

  const prefersReducedMotion =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false

  // Filtered destinations based on query
  const filteredDestinations = query.trim()
    ? DESTINATIONS.filter((d) =>
        d.label.toLowerCase().includes(query.toLowerCase())
      )
    : []

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
      // Auto-focus the search input
      setTimeout(() => inputRef.current?.focus(), 100)
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

  function selectDestination(value: string) {
    const dest = DESTINATIONS.find((d) => d.value === value)
    setQuery(dest?.label ?? '')
  }

  function handleSearch() {
    const params = new URLSearchParams()
    // Match query to a destination
    const matchedDest = DESTINATIONS.find(
      (d) => d.label.toLowerCase() === query.toLowerCase()
    )
    if (matchedDest) params.set('location', matchedDest.value)
    if (selectedType) params.set('type', selectedType)
    if (selectedDuration) params.set('duration', selectedDuration)
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
        {/* Close button */}
        <div className="flex items-center justify-end mb-4">
          <button
            onClick={onClose}
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close search"
          >
            <X size={20} className="text-dark" />
          </button>
        </div>

        {/* Search input */}
        <div className="relative mb-6">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search for destinations.."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl font-body text-sm text-dark placeholder:text-gray-400 focus:outline-none focus:border-blue/50 focus:ring-2 focus:ring-blue/10 transition-all"
          />
          {/* Destination suggestions dropdown */}
          {filteredDestinations.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-10">
              {filteredDestinations.map((dest) => (
                <button
                  key={dest.value}
                  onClick={() => selectDestination(dest.value)}
                  className="w-full text-left px-4 py-3 font-body text-sm text-dark hover:bg-gray-50 transition-colors"
                >
                  {dest.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Experience Type */}
        <div className="mb-6">
          <h3 className="font-heading font-semibold text-dark text-sm mb-3">Experience Type</h3>
          <div className="flex flex-wrap gap-2">
            {EXPERIENCE_TYPES.map((t) => (
              <button
                key={t.value}
                onClick={() => setSelectedType(selectedType === t.value ? '' : t.value)}
                className={cn(
                  'px-4 py-2 rounded-full font-body text-sm border transition-all duration-200',
                  selectedType === t.value
                    ? 'bg-dark text-white border-dark'
                    : 'bg-white text-dark border-gray-200 hover:border-gray-400'
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Trip Duration */}
        <div className="mb-8">
          <h3 className="font-heading font-semibold text-dark text-sm mb-3">Trip Duration</h3>
          <div className="flex flex-wrap gap-2">
            {TRIP_DURATIONS.map((d) => (
              <button
                key={d.value}
                onClick={() => setSelectedDuration(selectedDuration === d.value ? '' : d.value)}
                className={cn(
                  'px-4 py-2 rounded-full font-body text-sm border transition-all duration-200',
                  selectedDuration === d.value
                    ? 'bg-dark text-white border-dark'
                    : 'bg-white text-dark border-gray-200 hover:border-gray-400'
                )}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search button */}
        <button
          onClick={handleSearch}
          className="w-full bg-yellow text-dark font-heading font-bold rounded-xl px-6 py-3.5 border-2 border-dark flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform duration-200"
          aria-label="Search experiences"
        >
          <Search size={18} />
          Search Experiences
        </button>
      </div>
    </div>
  )
}
