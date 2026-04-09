import { z } from 'zod'

export const travelerDetailsSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  specialRequirements: z.string().optional(),
})

export type TravelerDetailsInput = z.infer<typeof travelerDetailsSchema>
