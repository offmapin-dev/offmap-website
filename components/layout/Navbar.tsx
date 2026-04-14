'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Search, Phone } from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { NAV_LINKS } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { DURATION_FAST, EASE_OUT } from '@/lib/animations'
import { SearchModal } from '@/components/ui/SearchModal'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function Navbar() {
  const pathname = usePathname()
  const navRef = useRef<HTMLElement>(null)
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

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
          'bg-white border-b border-dashed border-[#39A2B8]/40',
          isScrolled && 'shadow-[0_2px_16px_rgba(0,0,0,0.08)]'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1.5 hover:opacity-75 transition-opacity duration-200" onClick={closeMobileMenu}>
            {/* Hand-drawn compass SVG */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-dark" aria-hidden>
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="12" cy="12" r="2" fill="currentColor" />
              <path d="M12 2v3M12 19v3M2 12h3M19 12h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M12 7l-2 5 2 5 2-5-2-5z" fill="currentColor" opacity="0.6" />
            </svg>
            <span className="text-xl text-[#0D78A8]">
              <span className="font-body font-normal">Off</span>
              <span className="font-display font-bold italic">Map</span>
            </span>
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

          {/* Desktop: Phone + Search icon + CTA */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href="tel:+919211471385"
              className="flex items-center gap-2 text-sm transition-colors duration-200 hover:opacity-80"
            >
              <Phone className="w-4 h-4 text-[#0D78A8]" />
              <span className="font-medium text-[#0D78A8]">+91 92114 71385</span>
            </a>
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 hover:bg-gray-100 transition-colors duration-200"
              aria-label="Search"
            >
              <Search size={16} className="text-dark" />
            </button>
            <Link
              href="/contact"
              className="font-heading font-semibold text-sm bg-yellow text-[#0D78A8] border-2 border-[#0D78A8] px-4 py-2 rounded-none transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(13,120,168,1)] inline-block"
            >
              Plan Your Trip
            </Link>
          </div>

          {/* Mobile: Search icon + Hamburger */}
          <div className="md:hidden flex items-center gap-1">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center justify-center w-10 h-10 text-dark"
              aria-label="Search"
            >
              <Search size={20} />
            </button>
            <button
              className="flex items-center justify-center w-11 h-11 text-dark"
              onClick={() => setIsMobileOpen((prev) => !prev)}
              aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileOpen}
            >
              {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
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
        className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-white z-50 md:hidden flex flex-col translate-x-full"
        aria-hidden={!isMobileOpen}
      >
        {/* Close button */}
        <div className="flex items-center justify-between px-5 h-14 border-b border-dashed border-[#39A2B8]/40">
          <span className="font-display italic font-bold text-lg text-[#0D78A8]">Menu</span>
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
                'font-display text-2xl font-bold py-2 border-b border-dashed border-[#39A2B8]/40 transition-colors duration-200',
                isActive(link.href)
                  ? 'text-blue'
                  : 'text-dark hover:text-blue'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile: Phone + CTA + Tagline */}
        <div className="px-5 py-6 flex flex-col gap-4">
          <a
            href="tel:+919211471385"
            className="flex items-center justify-center gap-2 bg-[#E0F4F8] rounded-xl p-3 transition-colors duration-200"
          >
            <Phone className="w-4 h-4 text-[#0D78A8]" />
            <span className="font-medium text-sm text-[#0D78A8]">+91 92114 71385</span>
          </a>
          <Link
            href="/contact"
            onClick={closeMobileMenu}
            className="font-heading font-semibold text-base bg-yellow text-[#0D78A8] border-2 border-[#0D78A8] px-6 py-3 rounded-none text-center transition-transform duration-200 hover:-translate-y-0.5 block"
          >
            Plan Your Trip
          </Link>
          <p className="font-handwriting text-dark/50 text-lg text-center">
            go somewhere different ✈
          </p>
        </div>
      </div>

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  )
}
