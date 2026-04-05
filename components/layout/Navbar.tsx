'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { NAV_LINKS } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { DURATION_FAST, EASE_OUT } from '@/lib/animations'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function Navbar() {
  const pathname = usePathname()
  const navRef = useRef<HTMLElement>(null)
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  // Scroll detection via ScrollTrigger
  useEffect(() => {
    if (typeof window === 'undefined') return

    const trigger = ScrollTrigger.create({
      start: 'top -72',
      onEnter: () => setIsScrolled(true),
      onLeaveBack: () => setIsScrolled(false),
    })

    return () => trigger.kill()
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileOpen])

  // Animate mobile menu in/out
  useEffect(() => {
    const menu = mobileMenuRef.current
    if (!menu) return

    if (isMobileOpen) {
      gsap.fromTo(
        menu,
        { x: '100%' },
        { x: '0%', duration: DURATION_FAST, ease: EASE_OUT }
      )
    } else {
      gsap.to(menu, { x: '100%', duration: DURATION_FAST, ease: EASE_OUT })
    }
  }, [isMobileOpen])

  function closeMobileMenu() {
    setIsMobileOpen(false)
  }

  function isActive(href: string) {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <>
      <header
        ref={navRef}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          'bg-paper border-b border-dashed border-[#D4C9B0]',
          isScrolled && 'shadow-[0_2px_16px_rgba(0,0,0,0.08)]'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-14">
          {/* Logo */}
          <Link
            href="/"
            className="font-display italic font-bold text-xl text-dark hover:opacity-75 transition-opacity duration-200"
            onClick={closeMobileMenu}
          >
            OffMap India
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-7" aria-label="Main navigation">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'font-body text-sm transition-colors duration-200 relative pb-0.5',
                  isActive(link.href)
                    ? 'text-dark after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-yellow after:rounded-none'
                    : 'text-dark/60 hover:text-blue'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:block">
            <Link
              href="/contact"
              className="font-heading font-semibold text-sm bg-yellow text-dark border-2 border-dark px-4 py-2 rounded-none transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] inline-block"
            >
              Plan Your Trip
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden flex items-center justify-center w-11 h-11 text-dark"
            onClick={() => setIsMobileOpen((prev) => !prev)}
            aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileOpen}
          >
            {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-dark/30 z-40 md:hidden"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu Panel */}
      <div
        ref={mobileMenuRef}
        className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-cream z-50 md:hidden flex flex-col translate-x-full"
        aria-hidden={!isMobileOpen}
      >
        {/* Close button */}
        <div className="flex items-center justify-between px-5 h-14 border-b border-dashed border-[#D4C9B0]">
          <span className="font-display italic font-bold text-lg text-dark">Menu</span>
          <button
            className="flex items-center justify-center w-11 h-11 text-dark"
            onClick={closeMobileMenu}
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>

        {/* Mobile Nav Links */}
        <nav className="flex-1 overflow-y-auto px-5 py-8 flex flex-col gap-2" aria-label="Mobile navigation">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeMobileMenu}
              className={cn(
                'font-display text-2xl font-bold py-2 border-b border-dashed border-[#D4C9B0] transition-colors duration-200',
                isActive(link.href)
                  ? 'text-blue'
                  : 'text-dark hover:text-blue'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile CTA + Tagline */}
        <div className="px-5 py-6 flex flex-col gap-4">
          <Link
            href="/contact"
            onClick={closeMobileMenu}
            className="font-heading font-semibold text-base bg-yellow text-dark border-2 border-dark px-6 py-3 rounded-none text-center transition-transform duration-200 hover:-translate-y-0.5 block"
          >
            Plan Your Trip
          </Link>
          <p className="font-handwriting text-dark/50 text-lg text-center">
            go somewhere different ✈
          </p>
        </div>
      </div>
    </>
  )
}
