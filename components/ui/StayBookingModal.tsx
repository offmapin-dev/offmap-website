'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { X, ChevronRight, ChevronLeft, Check, Loader2 } from 'lucide-react'
import {
  stayGuestDetailsSchema,
  type StayGuestDetailsInput,
} from '@/lib/schemas/stay-booking'
import { useRazorpay, type RazorpayOptions, type RazorpayResponse } from '@/hooks/useRazorpay'
import { formatPrice } from '@/lib/utils'
import { REGION_THEMES, type RegionThemeKey } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface StayBookingModalProps {
  isOpen: boolean
  onClose: () => void
  stayName: string
  staySlug: string
  checkIn: string
  checkOut: string
  numberOfGuests: number
  numberOfNights: number
  pricePerNight: number
  totalAmount: number
  advanceAmount: number
  gstAmount: number
  remainingAmount: number
  regionSlug: RegionThemeKey
}

type SubmitState = 'idle' | 'loading' | 'error'

export function StayBookingModal({
  isOpen,
  onClose,
  stayName,
  staySlug,
  checkIn,
  checkOut,
  numberOfGuests,
  numberOfNights,
  pricePerNight,
  totalAmount,
  advanceAmount,
  gstAmount,
  remainingAmount,
  regionSlug,
}: StayBookingModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [submitState, setSubmitState] = useState<SubmitState>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [bookingId, setBookingId] = useState('')

  const { loaded: razorpayLoaded } = useRazorpay()
  const theme = REGION_THEMES[regionSlug]

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    getValues,
  } = useForm<StayGuestDetailsInput>({
    resolver: zodResolver(stayGuestDetailsSchema),
    mode: 'onBlur',
  })

  if (!isOpen) return null

  const handleGuestDetailsSubmit = () => {
    handleSubmit(() => {
      setStep(2)
    })()
  }

  const handlePayment = async () => {
    if (!razorpayLoaded) {
      setErrorMessage('Payment gateway is loading. Please try again.')
      setSubmitState('error')
      return
    }

    setSubmitState('loading')
    setErrorMessage('')

    const guestData = getValues()

    try {
      // Step 1: Create Razorpay order via our API
      const res = await fetch('/api/stay-booking/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          staySlug,
          checkIn,
          checkOut,
          numberOfGuests,
          guestName: guestData.guestName,
          guestEmail: guestData.guestEmail,
          guestPhone: guestData.guestPhone,
          specialRequests: guestData.specialRequests ?? '',
        }),
      })

      const orderData = await res.json()
      if (!orderData.ok) {
        throw new Error(orderData.error || 'Failed to create order')
      }

      // Step 2: Open Razorpay checkout
      const options: RazorpayOptions = {
        key: orderData.key,
        amount: orderData.amount * 100,
        currency: orderData.currency,
        name: 'OffMap India',
        description: `Stay Booking: ${stayName}`,
        order_id: orderData.orderId,
        prefill: {
          name: guestData.guestName,
          email: guestData.guestEmail,
          contact: guestData.guestPhone,
        },
        theme: {
          color: theme.primary,
        },
        handler: async (response: RazorpayResponse) => {
          // Step 3: Verify payment
          try {
            const verifyRes = await fetch('/api/stay-booking/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                bookingId: orderData.bookingId,
              }),
            })

            const verifyData = await verifyRes.json()
            if (!verifyData.ok) {
              throw new Error(verifyData.error || 'Verification failed')
            }

            setBookingId(verifyData.bookingId)
            setSubmitState('idle')
            setStep(3)
          } catch (err) {
            setErrorMessage(
              err instanceof Error ? err.message : 'Payment verification failed'
            )
            setSubmitState('error')
          }
        },
        modal: {
          ondismiss: () => {
            setSubmitState('idle')
          },
        },
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Something went wrong'
      )
      setSubmitState('error')
    }
  }

  const handleClose = () => {
    if (submitState === 'loading') return
    setStep(1)
    setSubmitState('idle')
    setErrorMessage('')
    setBookingId('')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white rounded-t-2xl border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <p className="font-handwriting text-sm text-gray-400">
              {step === 1 && 'step 1 of 3 — your details'}
              {step === 2 && 'step 2 of 3 — confirm & pay'}
              {step === 3 && 'booking confirmed!'}
            </p>
            <h2 className="font-display font-bold text-lg text-dark">
              {stayName}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="size-5 text-gray-500" />
          </button>
        </div>

        {/* Step indicator */}
        <div className="px-6 pt-4">
          <div className="flex gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={cn(
                  'h-1 flex-1 rounded-full transition-colors duration-300',
                  s <= step ? 'bg-yellow' : 'bg-gray-200'
                )}
              />
            ))}
          </div>
        </div>

        <div className="px-6 py-6">
          {/* ── Step 1: Guest Details ── */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="guestName"
                  className="block font-body text-sm font-medium text-gray-700 mb-1"
                >
                  Full Name *
                </label>
                <input
                  id="guestName"
                  type="text"
                  {...register('guestName')}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 font-body text-sm text-dark placeholder:text-gray-400 focus:border-yellow focus:ring-2 focus:ring-yellow/30 outline-none transition-all"
                  placeholder="Your full name"
                />
                {errors.guestName && (
                  <p className="mt-1 font-body text-xs text-red-500">
                    {errors.guestName.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="guestEmail"
                  className="block font-body text-sm font-medium text-gray-700 mb-1"
                >
                  Email *
                </label>
                <input
                  id="guestEmail"
                  type="email"
                  {...register('guestEmail')}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 font-body text-sm text-dark placeholder:text-gray-400 focus:border-yellow focus:ring-2 focus:ring-yellow/30 outline-none transition-all"
                  placeholder="you@example.com"
                />
                {errors.guestEmail && (
                  <p className="mt-1 font-body text-xs text-red-500">
                    {errors.guestEmail.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="guestPhone"
                  className="block font-body text-sm font-medium text-gray-700 mb-1"
                >
                  Phone *
                </label>
                <input
                  id="guestPhone"
                  type="tel"
                  {...register('guestPhone')}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 font-body text-sm text-dark placeholder:text-gray-400 focus:border-yellow focus:ring-2 focus:ring-yellow/30 outline-none transition-all"
                  placeholder="+91 98765 43210"
                />
                {errors.guestPhone && (
                  <p className="mt-1 font-body text-xs text-red-500">
                    {errors.guestPhone.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="specialRequests"
                  className="block font-body text-sm font-medium text-gray-700 mb-1"
                >
                  Special Requests
                </label>
                <textarea
                  id="specialRequests"
                  rows={3}
                  {...register('specialRequests')}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 font-body text-sm text-dark placeholder:text-gray-400 focus:border-yellow focus:ring-2 focus:ring-yellow/30 outline-none transition-all resize-none"
                  placeholder="Dietary requirements, late check-in, etc."
                />
              </div>

              <button
                type="button"
                onClick={handleGuestDetailsSubmit}
                className="w-full flex items-center justify-center gap-2 bg-yellow text-dark font-display italic font-bold px-6 py-3 rounded-xl hover:bg-yellow/90 transition-colors"
              >
                Continue to Payment
                <ChevronRight className="size-4" />
              </button>
            </div>
          )}

          {/* ── Step 2: Payment Summary ── */}
          {step === 2 && (
            <div className="space-y-5">
              {/* Booking summary */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <h3 className="font-heading font-semibold text-sm text-dark">
                  Booking Summary
                </h3>
                <div className="space-y-2 font-body text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Check-in</span>
                    <span className="font-medium text-dark">{checkIn}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Check-out</span>
                    <span className="font-medium text-dark">{checkOut}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Guests</span>
                    <span className="font-medium text-dark">
                      {numberOfGuests}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Nights</span>
                    <span className="font-medium text-dark">
                      {numberOfNights}
                    </span>
                  </div>
                </div>
              </div>

              {/* Price breakdown */}
              <div className="space-y-2 font-body text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>
                    {numberOfNights} nights x {formatPrice(pricePerNight)} x{' '}
                    {numberOfGuests} guest{numberOfGuests > 1 ? 's' : ''}
                  </span>
                  <span>{formatPrice(totalAmount)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>30% Advance</span>
                  <span>
                    {formatPrice(Math.round(totalAmount * 0.3))}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>GST (5%)</span>
                  <span>{formatPrice(gstAmount)}</span>
                </div>
                <div className="border-t border-gray-200 pt-2 flex justify-between font-semibold text-dark">
                  <span>Pay now</span>
                  <span
                    style={{ color: theme.primary }}
                    className="font-display font-bold text-lg"
                  >
                    {formatPrice(advanceAmount)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-400 text-xs">
                  <span>Remaining (pay at stay)</span>
                  <span>{formatPrice(remainingAmount)}</span>
                </div>
              </div>

              {/* Guest info preview */}
              <div className="bg-gray-50 rounded-xl p-4 font-body text-sm">
                <p className="text-gray-500 mb-1">Booking for:</p>
                <p className="font-medium text-dark">{getValues('guestName')}</p>
                <p className="text-gray-500">
                  {getValues('guestEmail')} | {getValues('guestPhone')}
                </p>
              </div>

              {/* Error message */}
              {submitState === 'error' && errorMessage && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 font-body text-sm text-red-600">
                  {errorMessage}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  disabled={submitState === 'loading'}
                  className="flex items-center gap-1 px-4 py-3 rounded-xl border border-gray-200 font-body text-sm text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  <ChevronLeft className="size-4" />
                  Back
                </button>
                <button
                  type="button"
                  onClick={handlePayment}
                  disabled={submitState === 'loading' || !razorpayLoaded}
                  className="flex-1 flex items-center justify-center gap-2 bg-yellow text-dark font-display italic font-bold px-6 py-3 rounded-xl hover:bg-yellow/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitState === 'loading' ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>Pay {formatPrice(advanceAmount)}</>
                  )}
                </button>
              </div>

              <p className="text-center font-body text-xs text-gray-400">
                Secure payment via Razorpay
              </p>
            </div>
          )}

          {/* ── Step 3: Confirmation ── */}
          {step === 3 && (
            <div className="text-center space-y-5">
              <div className="mx-auto size-16 rounded-full bg-green-100 flex items-center justify-center">
                <Check className="size-8 text-green-600" />
              </div>

              <div>
                <h3 className="font-display font-bold text-xl text-dark">
                  Booking Confirmed!
                </h3>
                <p className="font-handwriting text-gray-500 text-lg mt-1">
                  your adventure awaits
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 space-y-2 font-body text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Booking ID</span>
                  <span className="font-mono font-semibold text-dark">
                    {bookingId}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Stay</span>
                  <span className="text-dark">{stayName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Check-in</span>
                  <span className="text-dark">{checkIn}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Check-out</span>
                  <span className="text-dark">{checkOut}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Guests</span>
                  <span className="text-dark">{numberOfGuests}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Amount Paid</span>
                  <span className="font-semibold text-dark">
                    {formatPrice(advanceAmount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Remaining</span>
                  <span className="text-dark">
                    {formatPrice(remainingAmount)}
                  </span>
                </div>
              </div>

              <p className="font-body text-sm text-gray-500">
                A confirmation email has been sent to{' '}
                <span className="font-medium text-dark">
                  {getValues('guestEmail')}
                </span>
                . We will reach out with host details and directions before your
                check-in.
              </p>

              <button
                type="button"
                onClick={handleClose}
                className="w-full bg-dark text-white font-display italic font-bold px-6 py-3 rounded-xl hover:bg-dark/90 transition-colors"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
