'use client'

import { useRef, useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { gsap } from 'gsap'
import { WavyDivider } from '@/components/ui/WavyDivider'
import { PolaroidCard, WashiTape, JournalNote } from '@/components/ui/scrapbook'
import { registerGSAP } from '@/lib/animations'
import {
  studentEnquirySchema,
  type StudentEnquiryInput,
  STUDENT_GRADE_GROUPS,
  STUDENT_DESTINATIONS,
} from '@/lib/schemas/student-enquiry'
import { buildWhatsAppUrl } from '@/lib/whatsapp'

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1920&q=80'
const POLAROID_A =
  'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=80'
const POLAROID_B =
  'https://images.unsplash.com/photo-1598091383021-15ddea10925d?w=800&q=80'

const GRADE_LABELS: Record<(typeof STUDENT_GRADE_GROUPS)[number], string> = {
  primary: 'Primary (6–10)',
  middle: 'Middle (11–14)',
  'high-school': 'High School (15–17)',
  college: 'College (18+)',
}

const DEST_LABELS: Record<(typeof STUDENT_DESTINATIONS)[number], string> = {
  himachal: 'Himachal Pradesh',
  rajasthan: 'Rajasthan',
  uttarakhand: 'Uttarakhand',
  kashmir: 'Kashmir',
  flexible: 'Flexible',
}

const STEPS = [
  {
    title: 'Share your requirements',
    body: 'Tell us about your school, group size, age group and preferred dates.',
  },
  {
    title: 'We design the program',
    body: 'Custom itinerary built around your learning objectives.',
  },
  {
    title: 'We handle everything',
    body: 'Transport, stays, guides, activities — fully managed.',
  },
]

const WHY_POINTS = [
  'Builds confidence and curiosity',
  'Real-world learning outside classrooms',
  'Cultural sensitivity and empathy',
]

function studentWhatsAppBody(data: StudentEnquiryInput): string {
  return [
    'Hi OffMap — school trip enquiry',
    '',
    `School: ${data.school}`,
    `Contact: ${data.contactName}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone}`,
    `Grade: ${GRADE_LABELS[data.gradeGroup]}`,
    `Students: ${data.studentCount}`,
    `Destination: ${DEST_LABELS[data.destination]}`,
    `Dates: ${data.preferredDates}`,
    '',
    data.message,
  ].join('\n')
}

export default function StudentProgramPage() {
  const [submitState, setSubmitState] = useState<'idle' | 'loading' | 'error'>('idle')
  const [showSuccessNote, setShowSuccessNote] = useState(false)

  const heroContentRef = useRef<HTMLDivElement>(null)
  const s2Ref = useRef<HTMLElement>(null)
  const s3Ref = useRef<HTMLElement>(null)
  const formRef = useRef<HTMLElement>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<StudentEnquiryInput>({
    resolver: zodResolver(studentEnquirySchema),
    defaultValues: {
      school: '',
      contactName: '',
      email: '',
      phone: '',
      gradeGroup: 'middle',
      studentCount: 20,
      destination: 'himachal',
      preferredDates: '',
      message: '',
    },
  })

  useEffect(() => {
    registerGSAP()
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const ctx = gsap.context(() => {
      const fadeUp = (el: HTMLElement | null, delay = 0) => {
        if (!el) return
        gsap.from(el.children, {
          y: 28,
          opacity: 0,
          stagger: 0.08,
          duration: 0.55,
          ease: 'power2.out',
          delay,
          immediateRender: false,
          scrollTrigger: { trigger: el, start: 'top bottom', once: true },
        })
      }

      fadeUp(heroContentRef.current, 0)
      fadeUp(s2Ref.current, 0)
      fadeUp(s3Ref.current, 0)
      fadeUp(formRef.current, 0)
    })

    return () => ctx.revert()
  }, [])

  const onSubmit = async (data: StudentEnquiryInput) => {
    setSubmitState('loading')
    setShowSuccessNote(false)
    try {
      const res = await fetch('/api/enquiry/student-program', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = (await res.json()) as { ok?: boolean; error?: string }

      if (res.ok && json.ok) {
        setShowSuccessNote(true)
        reset()
        window.open(buildWhatsAppUrl(studentWhatsAppBody(data)), '_blank', 'noopener,noreferrer')
        setSubmitState('idle')
        return
      }

      setSubmitState('error')
      if (res.status === 503) {
        window.open(buildWhatsAppUrl(studentWhatsAppBody(data)), '_blank', 'noopener,noreferrer')
      }
    } catch {
      setSubmitState('error')
    }
  }

  return (
    <main>
      <section className="relative h-[55vh] min-h-[380px] flex items-end overflow-hidden">
        <Image
          src={HERO_IMAGE}
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/45 to-black/30" />
        <div
          ref={heroContentRef}
          className="relative z-10 max-w-7xl mx-auto px-4 pb-12 md:pb-16 w-full"
        >
          <p className="font-handwriting text-yellow-300 text-xl mb-2">beyond the classroom</p>
          <h1 className="font-display font-black text-white text-4xl md:text-6xl max-w-3xl leading-tight">
            Learning hits different outside.
          </h1>
          <p className="font-body text-white/70 text-lg mt-4 max-w-xl">
            Experiential learning through nature and culture.
          </p>
          <Link
            href="#enquiry"
            className="inline-block mt-8 font-body font-semibold bg-yellow text-dark px-6 py-3 border-2 border-dark rounded-none hover:bg-yellow-dark transition-colors"
          >
            Plan a School Trip →
          </Link>
        </div>
      </section>

      <WavyDivider fill="#FFF8E7" />

      <section ref={s2Ref} className="bg-[#FFF8E7] py-14 md:py-24">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="relative inline-block mb-6">
              <WashiTape color="yellow" rotation={-2} width="w-48" />
              <span className="absolute inset-0 flex items-center justify-center font-handwriting text-dark/80 text-sm pointer-events-none">
                for schools &amp; colleges
              </span>
            </div>
            <h2 className="font-display font-black text-dark text-3xl md:text-4xl leading-tight">
              Real terrain. Real communities. Real learning.
            </h2>
            <p className="font-body text-dark/70 text-base leading-relaxed mt-5">
              We design school and college programs that go beyond textbooks. Students trek, interact
              with local communities, understand ecosystems, and come back changed.
            </p>
            <h3 className="font-heading font-semibold text-dark mt-8 mb-4">Why It Matters</h3>
            <ul className="space-y-4">
              {WHY_POINTS.map((text) => (
                <li key={text} className="flex gap-3 items-start">
                  <Image
                    src="/icons/learning.png"
                    alt=""
                    width={40}
                    height={40}
                    className="shrink-0 object-contain mix-blend-multiply"
                  />
                  <span className="font-body text-dark/80 text-base pt-1">{text}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            <PolaroidCard
              src={POLAROID_A}
              alt="Students outdoors in the mountains"
              caption="field day, Himachal"
              rotation={-4}
              size="md"
              washiColor="blue"
            />
            <PolaroidCard
              src={POLAROID_B}
              alt="Group learning outdoors"
              caption="learning by doing"
              rotation={5}
              size="sm"
              washiColor="pink"
            />
          </div>
        </div>
      </section>

      <WavyDivider fill="#FEF3C7" />

      <section ref={s3Ref} className="bg-[#FEF3C7] py-14 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="font-display font-bold text-dark text-2xl md:text-3xl text-center mb-12">
            How it works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STEPS.map((step, i) => (
              <div
                key={step.title}
                className="bg-white/80 rounded-2xl p-6 md:p-8 shadow-[var(--shadow-card)] border border-amber-200/60"
              >
                <span className="font-display font-black text-amber-600 text-4xl block mb-3">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="font-heading font-semibold text-dark text-lg mb-2">{step.title}</h3>
                <p className="font-body text-gray-600 text-sm leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <WavyDivider fill="#F59E0B" />

      <section ref={formRef} id="enquiry" className="bg-[#F59E0B] py-14 md:py-24 scroll-mt-20">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="font-display font-black text-dark text-3xl md:text-4xl text-center">
            Plan a School Trip
          </h2>
          <p className="font-handwriting text-dark/70 text-xl text-center mt-2 mb-10">
            tell us about your school
          </p>

          {showSuccessNote ? (
            <div className="flex justify-center mb-8">
              <JournalNote
                text="We'll get back to you within 24 hours 🎒"
                type="sticky"
                className="text-center"
              />
            </div>
          ) : null}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label htmlFor="school" className="font-heading text-sm font-medium text-dark block mb-1">
                School / Institution
              </label>
              <input
                id="school"
                className="w-full rounded-xl border-2 border-dark/20 bg-white px-4 py-3 font-body text-dark focus:outline-none focus:ring-2 focus:ring-dark/30"
                {...register('school')}
              />
              {errors.school ? (
                <p className="text-sm text-red-800 mt-1">{errors.school.message}</p>
              ) : null}
            </div>

            <div>
              <label htmlFor="contactName" className="font-heading text-sm font-medium text-dark block mb-1">
                Contact person
              </label>
              <input
                id="contactName"
                className="w-full rounded-xl border-2 border-dark/20 bg-white px-4 py-3 font-body"
                {...register('contactName')}
              />
              {errors.contactName ? (
                <p className="text-sm text-red-800 mt-1">{errors.contactName.message}</p>
              ) : null}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="email" className="font-heading text-sm font-medium text-dark block mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className="w-full rounded-xl border-2 border-dark/20 bg-white px-4 py-3 font-body"
                  {...register('email')}
                />
                {errors.email ? <p className="text-sm text-red-800 mt-1">{errors.email.message}</p> : null}
              </div>
              <div>
                <label htmlFor="phone" className="font-heading text-sm font-medium text-dark block mb-1">
                  Phone
                </label>
                <input
                  id="phone"
                  type="tel"
                  className="w-full rounded-xl border-2 border-dark/20 bg-white px-4 py-3 font-body"
                  {...register('phone')}
                />
                {errors.phone ? <p className="text-sm text-red-800 mt-1">{errors.phone.message}</p> : null}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="gradeGroup" className="font-heading text-sm font-medium text-dark block mb-1">
                  Grade / age group
                </label>
                <select
                  id="gradeGroup"
                  className="w-full rounded-xl border-2 border-dark/20 bg-white px-4 py-3 font-body"
                  {...register('gradeGroup')}
                >
                  {STUDENT_GRADE_GROUPS.map((g) => (
                    <option key={g} value={g}>
                      {GRADE_LABELS[g]}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="studentCount" className="font-heading text-sm font-medium text-dark block mb-1">
                  Number of students
                </label>
                <input
                  id="studentCount"
                  type="number"
                  min={1}
                  className="w-full rounded-xl border-2 border-dark/20 bg-white px-4 py-3 font-body"
                  {...register('studentCount', { valueAsNumber: true })}
                />
                {errors.studentCount ? (
                  <p className="text-sm text-red-800 mt-1">{errors.studentCount.message}</p>
                ) : null}
              </div>
            </div>

            <div>
              <label htmlFor="destination" className="font-heading text-sm font-medium text-dark block mb-1">
                Preferred destination
              </label>
              <select
                id="destination"
                className="w-full rounded-xl border-2 border-dark/20 bg-white px-4 py-3 font-body"
                {...register('destination')}
              >
                {STUDENT_DESTINATIONS.map((d) => (
                  <option key={d} value={d}>
                    {DEST_LABELS[d]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="preferredDates" className="font-heading text-sm font-medium text-dark block mb-1">
                Preferred dates
              </label>
              <input
                id="preferredDates"
                placeholder="e.g. March 2026 or flexible"
                className="w-full rounded-xl border-2 border-dark/20 bg-white px-4 py-3 font-body"
                {...register('preferredDates')}
              />
              {errors.preferredDates ? (
                <p className="text-sm text-red-800 mt-1">{errors.preferredDates.message}</p>
              ) : null}
            </div>

            <div>
              <label htmlFor="message" className="font-heading text-sm font-medium text-dark block mb-1">
                Message / requirements
              </label>
              <textarea
                id="message"
                rows={4}
                className="w-full rounded-xl border-2 border-dark/20 bg-white px-4 py-3 font-body resize-y"
                {...register('message')}
              />
              {errors.message ? (
                <p className="text-sm text-red-800 mt-1">{errors.message.message}</p>
              ) : null}
            </div>

            {submitState === 'error' ? (
              <p className="font-body text-sm text-red-900 bg-white/50 rounded-lg px-3 py-2">
                Something went wrong sending the email. If WhatsApp opened, you&apos;re all set — otherwise
                reach us at info@offmap.in.
              </p>
            ) : null}

            <button
              type="submit"
              disabled={submitState === 'loading'}
              className="w-full sm:w-auto font-display italic font-bold text-lg text-white bg-dark border-2 border-dark px-8 py-4 rounded-none hover:bg-dark/90 transition-colors disabled:opacity-60"
            >
              {submitState === 'loading' ? 'Sending…' : 'Send Enquiry →'}
            </button>
          </form>
        </div>
      </section>
    </main>
  )
}
