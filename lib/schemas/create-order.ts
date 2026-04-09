import { z } from 'zod'

export const createOrderSchema = z.object({
  batchId: z.string().min(1, 'Batch is required'),
  travelers: z.number().int().min(1).max(15),
  travelerName: z.string().min(2),
  travelerEmail: z.string().email(),
  travelerPhone: z.string().min(10),
  specialRequirements: z.string().optional(),
})

export type CreateOrderInput = z.infer<typeof createOrderSchema>

export const verifyPaymentSchema = z.object({
  razorpayOrderId: z.string().min(1),
  razorpayPaymentId: z.string().min(1),
  razorpaySignature: z.string().min(1),
  bookingId: z.string().min(1),
})

export type VerifyPaymentInput = z.infer<typeof verifyPaymentSchema>
