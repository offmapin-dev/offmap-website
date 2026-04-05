'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { registerGSAP } from '@/lib/animations'

export function ScrollProgressBar() {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    registerGSAP()

    const bar = barRef.current
    if (!bar) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const st = ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        gsap.set(bar, { scaleX: self.progress })
      },
    })

    return () => st.kill()
  }, [])

  return (
    <div
      ref={barRef}
      className="fixed top-0 left-0 right-0 h-[3px] bg-yellow z-[100] origin-left scale-x-0"
      aria-hidden="true"
    />
  )
}
