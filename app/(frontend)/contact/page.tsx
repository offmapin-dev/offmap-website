'use client'

import { useRef, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { gsap } from 'gsap'
import { Phone, Mail, Instagram } from 'lucide-react'
import { WavyDivider } from '@/components/ui/WavyDivider'
import { WashiTape, SectionLabel, JournalNote } from '@/components/ui/scrapbook'
import { registerGSAP } from '@/lib/animations'
import { SITE_CONFIG } from '@/lib/constants'
import {
  contactEnquirySchema,
  type ContactEnquiryInput,
  CONTACT_DESTINATIONS,
  CONTACT_EXPERIENCE_TYPES,
} from '@/lib/schemas/contact-enquiry'
import { buildWhatsAppUrl } from '@/lib/whatsapp'
import { cn } from '@/lib/utils'

const DEST_LABELS: Record<(typeof CONTACT_DESTINATIONS)[number], string> = {
  himachal: 'Himachal Pradesh',
  rajasthan: 'Rajasthan',
  uttarakhand: 'Uttarakhand',
  kashmir: 'Kashmir',
  'not-sure': 'Not sure yet',
}

const EXP_LABELS: Record<(typeof CONTACT_EXPERIENCE_TYPES)[number], string> = {
  'group-trip': 'Group Trip',
  'day-trip': 'Day Trip',
  stay: 'Stay',
  'school-trip': 'School Trip',
  retreat: 'Retreat',
  exploring: 'Just exploring',
}

function contactWhatsAppBody(data: ContactEnquiryInput): string {
  return [
    'Hi OffMap — contact form',
    '',
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone}`,
    `Destination: ${DEST_LABELS[data.destination]}`,
    `Experience: ${EXP_LABELS[data.experienceType]}`,
    '',
    data.message,
  ].join('\n')
}

export default function ContactPage() {
  const [submitState, setSubmitState] = useState<'idle' | 'loading' | 'error'>('idle')
  const [success, setSuccess] = useState(false)

  const heroRef = useRef<HTMLDivElement>(null)
  const mainRef = useRef<HTMLElement>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactEnquiryInput>({
    resolver: zodResolver(contactEnquirySchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      destination: 'not-sure',
      experienceType: 'exploring',
      message: '',
    },
  })

  useEffect(() => {
    registerGSAP()
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const ctx = gsap.context(() => {
      ;[heroRef.current, mainRef.current].forEach((el) => {
        if (!el) return
        gsap.from(el.querySelectorAll(':scope > *'), {
          y: 26,
          opacity: 0,
          stagger: 0.07,
          duration: 0.5,
          ease: 'power2.out',
          immediateRender: false,
          scrollTrigger: { trigger: el, start: 'top bottom', once: true },
        })
      })
    })

    return () => ctx.revert()
  }, [])

  const onSubmit = async (data: ContactEnquiryInput) => {
    setSubmitState('loading')
    setSuccess(false)
    try {
      const res = await fetch('/api/enquiry/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = (await res.json()) as { ok?: boolean }

      if (res.ok && json.ok) {
        setSuccess(true)
        reset()
        window.open(buildWhatsAppUrl(contactWhatsAppBody(data)), '_blank', 'noopener,noreferrer')
        setSubmitState('idle')
        return
      }

      setSubmitState('error')
      if (res.status === 503) {
        window.open(buildWhatsAppUrl(contactWhatsAppBody(data)), '_blank', 'noopener,noreferrer')
      }
    } catch {
      setSubmitState('error')
    }
  }

  return (
    <main>
      <section className="relative h-[40vh] min-h-[280px] flex items-center justify-center bg-[#1B4FD8]">
        <div ref={heroRef} className="text-center px-4 max-w-2xl">
          <p className="font-handwriting text-white/60 text-xl mb-2">get in touch</p>
          <h1 className="font-display font-black text-white text-4xl md:text-5xl leading-tight">
            Tell us what you&apos;re feeling.
          </h1>
          <p className="font-body text-white/70 text-lg mt-4">We&apos;ll help you plan.</p>
        </div>
      </section>

      <WavyDivider fill="#F5F0E8" />

      <section ref={mainRef} className="bg-[#F5F0E8] py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 relative">
          <div>
            <SectionLabel text="Send us a message" style="handwritten" className="block mb-6" />

            {success ? (
              <div className="mb-8">
                <JournalNote
                  text="Message sent! We'll be in touch within 24 hours ✉️"
                  type="sticky"
                />
              </div>
            ) : null}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label htmlFor="name" className="font-heading text-sm font-medium text-dark block mb-1">
                  Name
                </label>
                <input
                  id="name"
                  className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 font-body"
                  {...register('name')}
                />
                {errors.name ? <p className="text-sm text-red-700 mt-1">{errors.name.message}</p> : null}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="email" className="font-heading text-sm font-medium text-dark block mb-1">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 font-body"
                    {...register('email')}
                  />
                  {errors.email ? (
                    <p className="text-sm text-red-700 mt-1">{errors.email.message}</p>
                  ) : null}
                </div>
                <div>
                  <label htmlFor="phone" className="font-heading text-sm font-medium text-dark block mb-1">
                    Phone
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 font-body"
                    {...register('phone')}
                  />
                  {errors.phone ? (
                    <p className="text-sm text-red-700 mt-1">{errors.phone.message}</p>
                  ) : null}
                </div>
              </div>
              <div>
                <label htmlFor="destination" className="font-heading text-sm font-medium text-dark block mb-1">
                  Destination interest
                </label>
                <select
                  id="destination"
                  className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 font-body"
                  {...register('destination')}
                >
                  {CONTACT_DESTINATIONS.map((d) => (
                    <option key={d} value={d}>
                      {DEST_LABELS[d]}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="experienceType" className="font-heading text-sm font-medium text-dark block mb-1">
                  Experience type
                </label>
                <select
                  id="experienceType"
                  className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 font-body"
                  {...register('experienceType')}
                >
                  {CONTACT_EXPERIENCE_TYPES.map((e) => (
                    <option key={e} value={e}>
                      {EXP_LABELS[e]}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="message" className="font-heading text-sm font-medium text-dark block mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 font-body resize-y"
                  {...register('message')}
                />
                {errors.message ? (
                  <p className="text-sm text-red-700 mt-1">{errors.message.message}</p>
                ) : null}
              </div>

              {submitState === 'error' ? (
                <p className="text-sm text-red-800 bg-white rounded-lg px-3 py-2">
                  Could not send email. Try WhatsApp below or write to info@offmap.in.
                </p>
              ) : null}

              <button
                type="submit"
                disabled={submitState === 'loading'}
                className="font-display italic font-bold text-lg bg-yellow text-dark px-8 py-4 rounded-none border-2 border-dark hover:bg-yellow-dark transition-colors disabled:opacity-60"
              >
                {submitState === 'loading' ? 'Sending…' : 'Send Message →'}
              </button>
            </form>
          </div>

          <div className="relative">
            <div className="relative inline-block mb-6">
              <WashiTape color="blue" rotation={-2} width="w-40" />
              <span className="absolute inset-0 flex items-center justify-center font-handwriting text-dark/80 text-sm pointer-events-none">
                find us here →
              </span>
            </div>
            <h2 className="font-display font-bold text-dark text-2xl mb-8">Or reach out directly</h2>

            <div className="space-y-4">
              <div className="bg-white rounded-xl p-4 shadow-[var(--shadow-card)] flex items-center gap-3">
                <Phone className="w-8 h-8 text-blue shrink-0" aria-hidden />
                <div>
                  <p className="font-heading font-semibold text-dark">{SITE_CONFIG.phone}</p>
                  <p className="font-handwriting text-gray-400 text-sm">call us any time :-)</p>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-[var(--shadow-card)] flex items-center gap-3">
                <Mail className="w-8 h-8 text-blue shrink-0" aria-hidden />
                <div>
                  <p className="font-heading font-semibold text-dark">{SITE_CONFIG.email}</p>
                  <p className="font-handwriting text-gray-400 text-sm">we reply fast</p>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-[var(--shadow-card)] flex items-center gap-3">
                <Instagram className="w-8 h-8 text-blue shrink-0" aria-hidden />
                <div>
                  <p className="font-heading font-semibold text-dark">@offmap.in</p>
                  <p className="font-handwriting text-gray-400 text-sm">follow our stories</p>
                </div>
              </div>
            </div>

            <a
              href={SITE_CONFIG.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'mt-8 w-full flex items-center justify-center gap-2 font-heading font-bold text-white rounded-xl py-4 px-4',
                'bg-[#25D366] hover:opacity-95 transition-opacity'
              )}
            >
              <span aria-hidden>💬</span>
              Chat on WhatsApp
            </a>

            <div className="absolute -right-2 top-32 hidden lg:block">
              <JournalNote
                text="no bots, no long waits. we'll help you personally 📬"
                type="sticky"
                className="rotate-[2deg] max-w-[11rem]"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
