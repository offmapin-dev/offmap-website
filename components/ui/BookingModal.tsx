'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { X, Check, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { travelerDetailsSchema, type TravelerDetailsInput } from '@/lib/schemas/booking'
import { useRazorpay, type RazorpayResponse } from '@/hooks/useRazorpay'
import { REGION_THEMES, type RegionThemeKey } from '@/lib/constants'
import { JournalNote } from '@/components/ui/scrapbook'
import { buildWhatsAppUrl } from '@/lib/whatsapp'
import { cn, formatPrice } from '@/lib/utils'

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  tripName: string
  batchId: string
  batchDates: string
  travelers: number
  pricePerPerson: number
  totalAmount: number
  advanceAmount: number
  gstAmount: number
  remainingAmount: number
  regionSlug: string
}

type BookingStep = 1 | 2 | 3

export function BookingModal({
  isOpen,
  onClose,
  tripName,
  batchId,
  batchDates,
  travelers,
  pricePerPerson,
  totalAmount,
  advanceAmount,
  gstAmount,
  remainingAmount,
  regionSlug,
}: BookingModalProps) {
  const [step, setStep] = useState<BookingStep>(1)
  const [isProcessing, setIsProcessing] = useState(false)
  const [bookingId, setBookingId] = useState('')
  const [error, setError] = useState('')

  const theme = REGION_THEMES[regionSlug as RegionThemeKey]
  const primary = theme?.primary ?? '#1B4FD8'

  const { loadScript } = useRazorpay()

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<TravelerDetailsInput>({
    resolver: zodResolver(travelerDetailsSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      specialRequirements: '',
    },
  })

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      setStep(1)
      setError('')
      setIsProcessing(false)
    }
  }, [isOpen])

  const onTravelerSubmit = () => {
    setStep(2)
  }

  const handlePayment = async () => {
    setIsProcessing(true)
    setError('')

    try {
      const travelerData = getValues()

      // 1. Load Razorpay script
      const scriptLoaded = await loadScript()
      if (!scriptLoaded) {
        setError('Failed to load payment gateway. Please try again.')
        setIsProcessing(false)
        return
      }

      // 2. Create order on server
      const res = await fetch('/api/booking/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          batchId,
          travelers,
          travelerName: travelerData.name,
          travelerEmail: travelerData.email,
          travelerPhone: travelerData.phone,
          specialRequirements: travelerData.specialRequirements,
        }),
      })

      const orderData = (await res.json()) as {
        ok: boolean
        orderId?: string
        bookingId?: string
        amount?: number
        currency?: string
        key?: string
        error?: string
      }

      if (!res.ok || !orderData.ok) {
        setError(orderData.error ?? 'Failed to create booking. Please try again.')
        setIsProcessing(false)
        return
      }

      // 3. Open Razorpay checkout
      const razorpay = new window.Razorpay({
        key: orderData.key!,
        amount: orderData.amount!,
        currency: orderData.currency!,
        name: 'OffMap India',
        description: `${tripName} — ${travelers} traveler${travelers > 1 ? 's' : ''}`,
        order_id: orderData.orderId!,
        handler: async (response: RazorpayResponse) => {
          // 4. Verify payment on server
          try {
            const verifyRes = await fetch('/api/booking/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                bookingId: orderData.bookingId,
              }),
            })

            const verifyData = (await verifyRes.json()) as {
              ok: boolean
              bookingId?: string
              error?: string
            }

            if (verifyRes.ok && verifyData.ok) {
              setBookingId(verifyData.bookingId ?? orderData.bookingId ?? '')
              setStep(3)
            } else {
              setError('Payment verification failed. Contact us if amount was deducted.')
            }
          } catch {
            setError('Payment verification failed. Contact us if amount was deducted.')
          }
          setIsProcessing(false)
        },
        prefill: {
          name: travelerData.name,
          email: travelerData.email,
          contact: travelerData.phone,
        },
        theme: { color: primary },
        modal: {
          ondismiss: () => {
            setIsProcessing(false)
          },
        },
      })

      razorpay.open()
    } catch {
      setError('Something went wrong. Please try again.')
      setIsProcessing(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={step !== 3 ? onClose : undefined}
      />

      {/* Modal */}
      <div
        className={cn(
          'relative z-10 w-full bg-white overflow-y-auto',
          // Full screen on mobile, centered modal on desktop
          'h-full md:h-auto md:max-h-[90vh]',
          'md:max-w-lg md:rounded-2xl md:shadow-[var(--shadow-polaroid)]'
        )}
      >
        {/* Header */}
        <div
          className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100"
        >
          <div>
            <p className="font-handwriting text-gray-400 text-sm">booking for</p>
            <h2 className="font-display font-bold text-dark text-lg leading-tight">
              {tripName}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close modal"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-2 py-3 bg-gray-50/50">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={cn(
                'w-2.5 h-2.5 rounded-full transition-colors',
                s === step ? 'bg-current' : s < step ? 'bg-current opacity-40' : 'bg-gray-200'
              )}
              style={s <= step ? { color: primary } : undefined}
            />
          ))}
          <span className="ml-2 font-body text-xs text-gray-400">
            Step {step} of 3
          </span>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          {/* ── Step 1: Traveler Details ── */}
          {step === 1 && (
            <form onSubmit={handleSubmit(onTravelerSubmit)} className="space-y-5">
              <div>
                <label
                  htmlFor="booking-name"
                  className="font-heading text-sm font-medium text-dark block mb-1"
                >
                  Full Name
                </label>
                <input
                  id="booking-name"
                  className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 font-body focus:border-gray-400 focus:outline-none transition-colors"
                  placeholder="Your full name"
                  {...register('name')}
                />
                {errors.name ? (
                  <p className="text-sm text-red-700 mt-1">{errors.name.message}</p>
                ) : null}
              </div>

              <div>
                <label
                  htmlFor="booking-email"
                  className="font-heading text-sm font-medium text-dark block mb-1"
                >
                  Email
                </label>
                <input
                  id="booking-email"
                  type="email"
                  className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 font-body focus:border-gray-400 focus:outline-none transition-colors"
                  placeholder="you@example.com"
                  {...register('email')}
                />
                {errors.email ? (
                  <p className="text-sm text-red-700 mt-1">{errors.email.message}</p>
                ) : null}
              </div>

              <div>
                <label
                  htmlFor="booking-phone"
                  className="font-heading text-sm font-medium text-dark block mb-1"
                >
                  Phone
                </label>
                <input
                  id="booking-phone"
                  type="tel"
                  className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 font-body focus:border-gray-400 focus:outline-none transition-colors"
                  placeholder="Your 10-digit number"
                  {...register('phone')}
                />
                {errors.phone ? (
                  <p className="text-sm text-red-700 mt-1">{errors.phone.message}</p>
                ) : null}
              </div>

              <div>
                <label
                  htmlFor="booking-special"
                  className="font-heading text-sm font-medium text-dark block mb-1"
                >
                  Special Requirements{' '}
                  <span className="font-body text-gray-400 text-xs">(optional)</span>
                </label>
                <textarea
                  id="booking-special"
                  rows={3}
                  className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 font-body resize-y focus:border-gray-400 focus:outline-none transition-colors"
                  placeholder="Dietary needs, allergies, accessibility..."
                  {...register('specialRequirements')}
                />
              </div>

              <button
                type="submit"
                style={{ backgroundColor: primary }}
                className="w-full text-white font-display italic font-bold text-lg py-4 rounded-none border-2 border-dark hover:opacity-90 transition-opacity"
              >
                Proceed to Payment &rarr;
              </button>
            </form>
          )}

          {/* ── Step 2: Payment ── */}
          {step === 2 && (
            <div className="space-y-6">
              {/* Summary card */}
              <div className="bg-gray-50 rounded-xl p-5 space-y-3">
                <h3 className="font-heading font-semibold text-dark text-base">
                  Booking Summary
                </h3>
                <div className="space-y-2 font-body text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Trip</span>
                    <span className="text-dark font-medium">{tripName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Dates</span>
                    <span className="text-dark font-medium">{batchDates}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Travelers</span>
                    <span className="text-dark font-medium">{travelers}</span>
                  </div>
                  <div className="border-t border-gray-200 my-2" />
                  <div className="flex justify-between">
                    <span className="text-gray-500">
                      {formatPrice(pricePerPerson)} x {travelers}
                    </span>
                    <span className="text-dark font-medium">{formatPrice(totalAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">30% Advance</span>
                    <span className="text-dark font-medium">
                      {formatPrice(Math.round(totalAmount * 0.3))}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">GST (5%)</span>
                    <span className="text-dark font-medium">{formatPrice(gstAmount)}</span>
                  </div>
                  <div className="border-t border-gray-200 my-2" />
                  <div className="flex justify-between text-base">
                    <span className="font-heading font-semibold text-dark">Pay now</span>
                    <span
                      className="font-display font-bold"
                      style={{ color: primary }}
                    >
                      {formatPrice(advanceAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Remaining (pay later)</span>
                    <span>{formatPrice(remainingAmount)}</span>
                  </div>
                </div>
              </div>

              <JournalNote
                text="You'll pay 30% now to confirm your spot. The remaining amount is collected before the trip."
                type="sticky"
                className="!w-full !max-w-none !rotate-0"
              />

              {error ? (
                <p className="text-sm text-red-800 bg-red-50 rounded-lg px-3 py-2">
                  {error}
                </p>
              ) : null}

              <div className="space-y-3">
                <button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="w-full bg-yellow text-dark font-display italic font-bold text-xl py-4 rounded-none border-2 border-dark hover:bg-yellow-dark transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>Pay {formatPrice(advanceAmount)}</>
                  )}
                </button>

                <button
                  onClick={() => setStep(1)}
                  disabled={isProcessing}
                  className="w-full font-body text-sm text-gray-400 hover:text-gray-600 transition-colors py-2 disabled:opacity-60"
                >
                  &larr; Back to details
                </button>
              </div>
            </div>
          )}

          {/* ── Step 3: Confirmation ── */}
          {step === 3 && (
            <div className="text-center space-y-6 py-4">
              {/* Success icon */}
              <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <Check size={40} className="text-green-600" strokeWidth={3} />
              </div>

              <div>
                <h3 className="font-display font-black text-dark text-2xl mb-1">
                  Booking Confirmed!
                </h3>
                <p className="font-handwriting text-gray-400 text-lg">
                  you're going on an adventure
                </p>
              </div>

              {/* Booking ID */}
              <div className="bg-gray-50 rounded-xl p-4 inline-block">
                <p className="font-body text-xs text-gray-400 mb-1">Booking ID</p>
                <p
                  className="font-display font-bold text-lg tracking-wide"
                  style={{ color: primary }}
                >
                  {bookingId}
                </p>
              </div>

              {/* Trip details */}
              <div className="bg-gray-50 rounded-xl p-4 text-left space-y-2 font-body text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Trip</span>
                  <span className="text-dark font-medium">{tripName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Dates</span>
                  <span className="text-dark font-medium">{batchDates}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Travelers</span>
                  <span className="text-dark font-medium">{travelers}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Amount Paid</span>
                  <span className="text-dark font-medium">{formatPrice(advanceAmount)}</span>
                </div>
              </div>

              <p className="font-body text-sm text-gray-500">
                Check your email for booking details and trip preparation guide.
              </p>

              {/* Actions */}
              <div className="space-y-3 pt-2">
                <a
                  href={buildWhatsAppUrl(
                    `Hi OffMap! I just booked ${tripName} (Booking ID: ${bookingId}). Looking forward to it!`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    'w-full flex items-center justify-center gap-2',
                    'font-heading font-bold text-white rounded-xl py-3 px-4',
                    'bg-[#25D366] hover:opacity-95 transition-opacity'
                  )}
                >
                  <span aria-hidden>💬</span>
                  Chat with us on WhatsApp
                </a>

                <Link
                  href="/experiences"
                  onClick={onClose}
                  className="block w-full font-body text-sm text-gray-400 hover:text-gray-600 transition-colors py-2"
                >
                  &larr; Back to Experiences
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
