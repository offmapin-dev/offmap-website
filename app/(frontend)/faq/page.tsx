'use client'

import { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ChevronDown } from 'lucide-react'
import { WavyDivider } from '@/components/ui/WavyDivider'
import { SectionLabel } from '@/components/ui/scrapbook'
import { FAQ_DATA } from '@/lib/constants'
import { registerGSAP } from '@/lib/animations'
import { cn } from '@/lib/utils'

const GROUPS = [
  { title: 'Before You Book', slice: [0, 6] as const },
  { title: 'On The Trip', slice: [6, 12] as const },
  { title: 'Practical Stuff', slice: [12, 18] as const },
] as const

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const heroRef = useRef<HTMLDivElement>(null)
  const faqRef = useRef<HTMLElement>(null)
  const ctaRef = useRef<HTMLElement>(null)

  useEffect(() => {
    registerGSAP()
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const ctx = gsap.context(() => {
      ;[heroRef.current, faqRef.current, ctaRef.current].forEach((el) => {
        if (!el) return
        gsap.from(el.querySelectorAll(':scope > *'), {
          y: 24,
          opacity: 0,
          stagger: 0.05,
          duration: 0.5,
          ease: 'power2.out',
          immediateRender: false,
          scrollTrigger: { trigger: el, start: 'top bottom', once: true },
        })
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <main>
      <section className="relative h-[40vh] min-h-[260px] flex items-center justify-center bg-[#6B4226]">
        <div ref={heroRef} className="text-center px-4">
          <h1 className="font-display font-black text-white text-4xl md:text-5xl">Questions? Good.</h1>
          <p className="font-handwriting text-white/70 text-xl mt-4">we like curious travelers</p>
        </div>
      </section>

      <WavyDivider fill="#FFF8E7" />

      <section ref={faqRef} className="bg-[#FFF8E7] py-14 md:py-20">
        <div className="max-w-3xl mx-auto px-4 paper-lines rounded-2xl py-10 md:py-14 bg-[#FFF8E7]/95">
          <SectionLabel text="Frequently Asked" style="stamp" className="block mb-2" />
          <p className="font-handwriting text-dark/50 text-lg mb-10">the things people always ask us</p>

          {GROUPS.map((group) => {
            const items = FAQ_DATA.slice(group.slice[0], group.slice[1])
            return (
              <div key={group.title} className="mb-12 last:mb-0">
                <h2 className="font-heading font-semibold text-dark text-sm uppercase tracking-widest mb-4">
                  {group.title}
                </h2>
                <ul className="border-t border-gray-200">
                  {items.map((item, i) => {
                    const idx = group.slice[0] + i
                    const isOpen = openIndex === idx
                    return (
                      <li key={item.question} className="border-b border-gray-200">
                        <button
                          type="button"
                          onClick={() => setOpenIndex(isOpen ? null : idx)}
                          className={cn(
                            'w-full flex justify-between items-center gap-4 text-left py-4 pl-0 pr-2 transition-colors',
                            'font-heading font-semibold text-dark hover:text-blue',
                            isOpen && 'border-l-4 border-yellow pl-4'
                          )}
                        >
                          <span>{item.question}</span>
                          <ChevronDown
                            className={cn(
                              'w-5 h-5 shrink-0 transition-transform duration-200',
                              isOpen && 'rotate-180'
                            )}
                            aria-hidden
                          />
                        </button>
                        <div
                          className={cn(
                            'overflow-hidden transition-[max-height] duration-300 ease-out',
                            isOpen ? 'max-h-[480px]' : 'max-h-0'
                          )}
                        >
                          <p className="font-body text-gray-600 text-sm leading-relaxed pb-4 pr-2">
                            {item.answer}
                          </p>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )
          })}
        </div>
      </section>

      <WavyDivider fill="#FFD60A" />

      <section ref={ctaRef} className="bg-yellow py-16 md:py-24 text-center px-4">
        <h2 className="font-display font-black text-dark text-3xl md:text-4xl mb-8">Still have questions?</h2>
        <Link
          href="/contact"
          className="inline-block font-body font-semibold bg-dark text-white px-8 py-4 rounded-none border-2 border-dark hover:bg-dark/90 transition-colors"
        >
          Talk to Us →
        </Link>
      </section>
    </main>
  )
}
