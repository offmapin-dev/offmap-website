'use client'

import { useEffect, RefObject } from 'react'
import { gsap } from 'gsap'
import { registerGSAP, EASE_OUT, DURATION_DEFAULT } from '@/lib/animations'

interface ScrollAnimationOptions {
  delay?: number
  duration?: number
  stagger?: number
}

export function useScrollAnimation(
  ref: RefObject<Element | null>,
  options: ScrollAnimationOptions = {}
): void {
  const { delay = 0, duration = 0.5 } = options

  useEffect(() => {
    registerGSAP()

    const element = ref.current
    if (!element) return

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    if (prefersReducedMotion) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        element,
        { opacity: 0, y: 20, immediateRender: false },
        {
          opacity: 1,
          y: 0,
          duration,
          delay,
          ease: EASE_OUT,
          scrollTrigger: {
            trigger: element,
            start: 'top bottom',
            once: true,
          },
        }
      )
    })

    return () => ctx.revert()
  }, [ref, delay, duration])
}
