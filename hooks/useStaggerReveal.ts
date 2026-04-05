'use client'

import { useEffect, RefObject } from 'react'
import { gsap } from 'gsap'
import { registerGSAP, EASE_OUT } from '@/lib/animations'

interface StaggerRevealOptions {
  stagger?: number
  y?: number
  duration?: number
  start?: string
}

export function useStaggerReveal(
  containerRef: RefObject<Element | null>,
  options: StaggerRevealOptions = {}
): void {
  const {
    stagger = 0.12,
    y = 24,
    duration = 0.5,
    start = 'top bottom',
  } = options

  useEffect(() => {
    registerGSAP()

    const container = containerRef.current
    if (!container) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const children = Array.from(container.children)
    if (children.length === 0) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        children,
        { opacity: 0, y, immediateRender: false },
        {
          opacity: 1,
          y: 0,
          duration,
          ease: EASE_OUT,
          stagger,
          scrollTrigger: {
            trigger: container,
            start,
            once: true,
          },
        }
      )
    })

    return () => ctx.revert()
  }, [containerRef, stagger, y, duration, start])
}
