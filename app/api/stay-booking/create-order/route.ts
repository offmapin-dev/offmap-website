import { NextResponse } from 'next/server'
import { createStayOrderSchema } from '@/lib/schemas/stay-booking'
import { getStayBySlug } from '@/lib/stay-details'
import { calculateStayBookingAmounts, generateBookingId } from '@/lib/booking-utils'
import { getRazorpay } from '@/lib/razorpay'

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = createStayOrderSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: 'Validation failed', issues: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const data = parsed.data

  // Look up stay details
  const stay = getStayBySlug(data.staySlug)
  if (!stay) {
    return NextResponse.json(
      { ok: false, error: 'Stay not found' },
      { status: 404 }
    )
  }

  // Validate guest count against max
  if (data.numberOfGuests > stay.maxGuests) {
    return NextResponse.json(
      { ok: false, error: `Maximum ${stay.maxGuests} guests allowed for this stay` },
      { status: 400 }
    )
  }

  // Calculate number of nights from date diff
  const checkInDate = new Date(data.checkIn)
  const checkOutDate = new Date(data.checkOut)
  const diffMs = checkOutDate.getTime() - checkInDate.getTime()
  const numberOfNights = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

  if (numberOfNights < 1) {
    return NextResponse.json(
      { ok: false, error: 'Check-out must be after check-in' },
      { status: 400 }
    )
  }

  // Calculate amounts
  const amounts = calculateStayBookingAmounts({
    pricePerNight: stay.pricePerNight,
    numberOfNights,
    numberOfGuests: data.numberOfGuests,
  })

  try {
    const razorpay = getRazorpay()
    const bookingId = generateBookingId('SM')

    // Amount in PAISE for Razorpay
    const order = await razorpay.orders.create({
      amount: amounts.advanceAmount * 100,
      currency: 'INR',
      receipt: bookingId,
      notes: {
        bookingId,
        staySlug: data.staySlug,
        stayName: stay.name,
        checkIn: data.checkIn,
        checkOut: data.checkOut,
        numberOfGuests: String(data.numberOfGuests),
        numberOfNights: String(numberOfNights),
        guestName: data.guestName,
        guestEmail: data.guestEmail,
        guestPhone: data.guestPhone,
      },
    })

    return NextResponse.json({
      ok: true,
      orderId: order.id,
      bookingId,
      amount: amounts.advanceAmount,
      currency: 'INR',
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    })
  } catch (err) {
    console.error('Razorpay order creation failed:', err)
    return NextResponse.json(
      { ok: false, error: 'Failed to create payment order' },
      { status: 500 }
    )
  }
}
