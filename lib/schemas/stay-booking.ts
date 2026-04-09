import { z } from 'zod'

// ── Guest details (form validation in modal step 1) ──────────────
export const stayGuestDetailsSchema = z.object({
  guestName: z.string().min(2, 'Name is required'),
  guestEmail: z.string().email('Valid email is required'),
  guestPhone: z.string().min(10, 'Valid phone number is required'),
  specialRequests: z.string().optional(),
})

export type StayGuestDetailsInput = z.infer<typeof stayGuestDetailsSchema>

// ── Create order (server-side validation) ────────────────────────
export const createStayOrderSchema = z.object({
  staySlug: z.string().min(1),
  checkIn: z.string().min(1, 'Check-in date is required'),
  checkOut: z.string().min(1, 'Check-out date is required'),
  numberOfGuests: z.number().int().min(1).max(20),
  guestName: z.string().min(2),
  guestEmail: z.string().email(),
  guestPhone: z.string().min(10),
  specialRequests: z.string().optional(),
})

export type CreateStayOrderInput = z.infer<typeof createStayOrderSchema>

// ── Verify payment (server-side validation) ──────────────────────
export const verifyStayPaymentSchema = z.object({
  razorpayOrderId: z.string().min(1),
  razorpayPaymentId: z.string().min(1),
  razorpaySignature: z.string().min(1),
  bookingId: z.string().min(1),
})

export type VerifyStayPaymentInput = z.infer<typeof verifyStayPaymentSchema>
