import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { verifyPaymentSchema } from '@/lib/schemas/create-order'

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json()
    const result = verifyPaymentSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { ok: false, error: 'Invalid request', details: result.error.flatten() },
        { status: 400 }
      )
    }

    const data = result.data

    // ── Verify HMAC-SHA256 signature ───────────────────────────────
    const signatureBody = data.razorpayOrderId + '|' + data.razorpayPaymentId
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(signatureBody)
      .digest('hex')

    if (expectedSignature !== data.razorpaySignature) {
      return NextResponse.json(
        { ok: false, error: 'Invalid payment signature' },
        { status: 400 }
      )
    }

    // TODO: In production, update the Booking record in Payload CMS
    // await payload.update({
    //   collection: 'bookings',
    //   where: { bookingId: { equals: data.bookingId } },
    //   data: {
    //     status: 'confirmed',
    //     razorpayPaymentId: data.razorpayPaymentId,
    //     razorpaySignature: data.razorpaySignature,
    //     paidAt: new Date().toISOString(),
    //   },
    // })

    // TODO: In production, send confirmation email via Resend
    // await resend.emails.send({
    //   to: booking.travelerEmail,
    //   subject: `Booking Confirmed — ${booking.bookingId}`,
    //   ...
    // })

    return NextResponse.json({
      ok: true,
      bookingId: data.bookingId,
    })
  } catch (error) {
    console.error('Verify payment error:', error)
    return NextResponse.json(
      { ok: false, error: 'Failed to verify payment' },
      { status: 500 }
    )
  }
}
