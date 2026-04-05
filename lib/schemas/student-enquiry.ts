import { z } from 'zod'

export const STUDENT_GRADE_GROUPS = [
  'primary',
  'middle',
  'high-school',
  'college',
] as const

export const STUDENT_DESTINATIONS = [
  'himachal',
  'rajasthan',
  'uttarakhand',
  'kashmir',
  'flexible',
] as const

export const studentEnquirySchema = z.object({
  school: z.string().min(1, 'School name is required'),
  contactName: z.string().min(1, 'Contact name is required'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(1, 'Phone is required'),
  gradeGroup: z.enum(STUDENT_GRADE_GROUPS),
  studentCount: z.number().int().positive().max(500),
  destination: z.enum(STUDENT_DESTINATIONS),
  preferredDates: z.string().min(1, 'Preferred dates are required'),
  message: z.string().min(1, 'Please add a message or requirements'),
})

export type StudentEnquiryInput = z.infer<typeof studentEnquirySchema>
