/**
 * Generate a unique booking ID.
 * Format: PREFIX-YYYYMMDD-XXXX (e.g., OM-20260409-A3X7)
 */
export function generateBookingId(prefix: 'OM' | 'SM'): string {
  const now = new Date()
  const date = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
  ].join('')
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `${prefix}-${date}-${random}`
}

/**
 * Calculate booking amounts.
 */
export function calculateBookingAmounts(params: {
  pricePerPerson: number
  travelers: number
  advancePercent: number
  gstPercent: number
}): {
  totalAmount: number
  advanceBase: number
  gstAmount: number
  advanceAmount: number
  remainingAmount: number
} {
  const totalAmount = params.pricePerPerson * params.travelers
  const advanceBase = Math.round(totalAmount * (params.advancePercent / 100))
  const gstAmount = Math.round(advanceBase * (params.gstPercent / 100))
  const advanceAmount = advanceBase + gstAmount
  const remainingAmount = totalAmount - advanceBase
  return { totalAmount, advanceBase, gstAmount, advanceAmount, remainingAmount }
}

/**
 * Calculate stay booking amounts.
 */
export function calculateStayBookingAmounts(params: {
  pricePerNight: number
  numberOfNights: number
  numberOfGuests: number
  advancePercent?: number
  gstPercent?: number
}): {
  totalAmount: number
  advanceBase: number
  gstAmount: number
  advanceAmount: number
  remainingAmount: number
} {
  const advancePercent = params.advancePercent ?? 30
  const gstPercent = params.gstPercent ?? 5
  const totalAmount = params.pricePerNight * params.numberOfNights * params.numberOfGuests
  const advanceBase = Math.round(totalAmount * (advancePercent / 100))
  const gstAmount = Math.round(advanceBase * (gstPercent / 100))
  const advanceAmount = advanceBase + gstAmount
  const remainingAmount = totalAmount - advanceBase
  return { totalAmount, advanceBase, gstAmount, advanceAmount, remainingAmount }
}
