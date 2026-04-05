import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// ── Easing constants ──────────────────────────────────────────────
export const EASE_OUT = 'power2.out'
export const EASE_IN_OUT = 'power2.inOut'

// ── Duration constants (seconds) ──────────────────────────────────
export const DURATION_FAST = 0.4
export const DURATION_DEFAULT = 0.6
export const DURATION_SLOW = 0.9

// ── Stagger constant (seconds) ────────────────────────────────────
export const STAGGER_DEFAULT = 0.15

// ── Plugin registration (safe to call multiple times) ─────────────
let registered = false

export function registerGSAP(): void {
  if (registered || typeof window === 'undefined') return
  gsap.registerPlugin(ScrollTrigger)
  registered = true
}

// ── Animation helpers ─────────────────────────────────────────────

interface FadeInUpOptions {
  delay?: number
  duration?: number
}

export function fadeInUp(
  element: Element | null,
  options: FadeInUpOptions = {}
): gsap.core.Tween | null {
  if (!element) return null
  return gsap.fromTo(
    element,
    { opacity: 0, y: 40 },
    {
      opacity: 1,
      y: 0,
      duration: options.duration ?? DURATION_DEFAULT,
      delay: options.delay ?? 0,
      ease: EASE_OUT,
    }
  )
}

interface StaggerFadeInOptions {
  delay?: number
  duration?: number
  stagger?: number
}

export function staggerFadeIn(
  elements: Element[] | NodeListOf<Element> | null,
  options: StaggerFadeInOptions = {}
): gsap.core.Tween | null {
  if (!elements) return null
  return gsap.fromTo(
    elements,
    { opacity: 0, y: 40 },
    {
      opacity: 1,
      y: 0,
      duration: options.duration ?? DURATION_DEFAULT,
      delay: options.delay ?? 0,
      ease: EASE_OUT,
      stagger: options.stagger ?? STAGGER_DEFAULT,
    }
  )
}
