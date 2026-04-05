import { z } from 'zod'

export const CONTACT_DESTINATIONS = [
  'himachal',
  'rajasthan',
  'uttarakhand',
  'kashmir',
  'not-sure',
] as const

export const CONTACT_EXPERIENCE_TYPES = [
  'group-trip',
  'day-trip',
  'stay',
  'school-trip',
  'retreat',
  'exploring',
] as const

export const contactEnquirySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(1, 'Phone is required'),
  destination: z.enum(CONTACT_DESTINATIONS),
  experienceType: z.enum(CONTACT_EXPERIENCE_TYPES),
  message: z.string().min(1, 'Message is required'),
})

export type ContactEnquiryInput = z.infer<typeof contactEnquirySchema>
