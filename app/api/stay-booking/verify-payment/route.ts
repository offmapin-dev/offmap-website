import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { verifyStayPaymentSchema } from '@/lib/schemas/stay-booking'

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = verifyStayPaymentSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: 'Validation failed', issues: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const { razorpayOrderId, razorpayPaymentId, razorpaySignature, bookingId } =
    parsed.data

  const secret = process.env.RAZORPAY_KEY_SECRET
  if (!secret) {
    console.error('RAZORPAY_KEY_SECRET is not set')
    return NextResponse.json(
      { ok: false, error: 'Payment verification is not configured' },
      { status: 503 }
    )
  }

  // Verify HMAC-SHA256 signature
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest('hex')

  if (expectedSignature !== razorpaySignature) {
    return NextResponse.json(
      { ok: false, error: 'Payment verification failed — invalid signature' },
      { status: 400 }
    )
  }

  // Payment is verified. In production, update booking status in database here.
  return NextResponse.json({ ok: true, bookingId })
}
