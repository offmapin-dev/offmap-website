import { NextResponse } from 'next/server'
import { getRazorpay } from '@/lib/razorpay'
import { generateBookingId, calculateBookingAmounts } from '@/lib/booking-utils'
import { createOrderSchema } from '@/lib/schemas/create-order'
import { EXPERIENCE_DETAILS } from '@/lib/experience-details'

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json()
    const result = createOrderSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { ok: false, error: 'Invalid request', details: result.error.flatten() },
        { status: 400 }
      )
    }

    const data = result.data

    // ── Look up the batch from hardcoded data ──────────────────────
    // In production, this would fetch from Payload CMS
    let matchedBatch: { price: number; seatsTotal: number; seatsBooked: number } | null = null

    for (const experience of EXPERIENCE_DETAILS) {
      const batch = experience.batches.find((b) => b.id === data.batchId)
      if (batch) {
        matchedBatch = batch
        break
      }
    }

    if (!matchedBatch) {
      return NextResponse.json(
        { ok: false, error: 'Batch not found' },
        { status: 404 }
      )
    }

    // ── Verify seat availability (server-side check) ───────────────
    const seatsLeft = matchedBatch.seatsTotal - matchedBatch.seatsBooked
    if (data.travelers > seatsLeft) {
      return NextResponse.json(
        {
          ok: false,
          error: `Only ${seatsLeft} seat${seatsLeft === 1 ? '' : 's'} remaining`,
        },
        { status: 400 }
      )
    }

    // ── Calculate amounts ──────────────────────────────────────────
    const amounts = calculateBookingAmounts({
      pricePerPerson: matchedBatch.price,
      travelers: data.travelers,
      advancePercent: 30,
      gstPercent: 5,
    })

    // ── Create Razorpay order (amount in PAISE) ────────────────────
    const razorpay = getRazorpay()
    const order = await razorpay.orders.create({
      amount: amounts.advanceAmount * 100,
      currency: 'INR',
      receipt: `booking_${Date.now()}`,
      notes: {
        batchId: data.batchId,
        travelers: String(data.travelers),
        travelerName: data.travelerName,
        travelerEmail: data.travelerEmail,
        travelerPhone: data.travelerPhone,
      },
    })

    // ── Generate booking ID ────────────────────────────────────────
    const bookingId = generateBookingId('OM')

    // TODO: In production, create a Booking record in Payload CMS here
    // await payload.create({
    //   collection: 'bookings',
    //   data: {
    //     bookingId,
    //     batch: data.batchId,
    //     travelers: data.travelers,
    //     travelerName: data.travelerName,
    //     travelerEmail: data.travelerEmail,
    //     travelerPhone: data.travelerPhone,
    //     specialRequirements: data.specialRequirements,
    //     razorpayOrderId: order.id,
    //     totalAmount: amounts.totalAmount,
    //     advanceAmount: amounts.advanceAmount,
    //     gstAmount: amounts.gstAmount,
    //     remainingAmount: amounts.remainingAmount,
    //     status: 'pending',
    //   },
    // })

    return NextResponse.json({
      ok: true,
      orderId: order.id,
      bookingId,
      amount: order.amount,
      currency: order.currency,
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    })
  } catch (error) {
    console.error('Create order error:', error)
    return NextResponse.json(
      { ok: false, error: 'Failed to create order' },
      { status: 500 }
    )
  }
}
