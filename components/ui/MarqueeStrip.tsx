'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

const ITEMS = [
  { text: 'Slow Travel', emoji: '🌄' },
  { text: 'Himachal Pradesh', emoji: '🌲' },
  { text: 'Rajasthan', emoji: '🐪' },
  { text: 'Offbeat Routes', emoji: '⛺' },
  { text: 'Kashmir', emoji: '🏔️' },
  { text: 'Real Experiences', emoji: '🌿' },
  { text: 'Uttarakhand', emoji: '🎒' },
  { text: 'Go Offmap', emoji: '✨' },
]

function MarqueeContent() {
  return (
    <>
      {ITEMS.map((item) => (
        <span key={item.text} className="inline-flex items-center gap-3 flex-none">
          <span className="font-display font-bold text-dark text-lg uppercase tracking-wide">
            {item.text}
          </span>
          <span className="text-2xl">{item.emoji}</span>
          <span className="font-display font-bold text-dark/40 text-lg mx-1">·</span>
        </span>
      ))}
    </>
  )
}

export function MarqueeStrip() {
  const trackRef = useRef<HTMLDivElement>(null)
  const animRef = useRef<gsap.core.Tween | null>(null)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    animRef.current = gsap.to(track, {
      xPercent: -50,
      ease: 'none',
      repeat: -1,
      duration: 30,
    })

    return () => {
      animRef.current?.kill()
    }
  }, [])

  return (
    <div
      className="bg-yellow border-y-2 border-dashed border-dark overflow-hidden py-3 select-none cursor-default"
      onMouseEnter={() => animRef.current?.pause()}
      onMouseLeave={() => animRef.current?.resume()}
    >
      <div
        ref={trackRef}
        className="flex items-center whitespace-nowrap w-max"
      >
        <span className="inline-flex items-center">
          <MarqueeContent />
        </span>
        <span className="inline-flex items-center">
          <MarqueeContent />
        </span>
      </div>
    </div>
  )
}
