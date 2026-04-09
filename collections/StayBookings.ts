import type { CollectionConfig } from 'payload'

export const StayBookings: CollectionConfig = {
  slug: 'stay-bookings',
  access: {
    read: ({ req }) => Boolean(req.user),
    create: () => true,
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  admin: {
    useAsTitle: 'bookingId',
    defaultColumns: ['bookingId', 'guestName', 'stay', 'checkIn', 'checkOut', 'paymentStatus', 'createdAt'],
    listSearchableFields: ['bookingId', 'guestName', 'guestEmail', 'guestPhone'],
    description: 'Stay bookings with payment tracking',
  },
  timestamps: true,
  fields: [
    {
      name: 'bookingId',
      type: 'text',
      required: true,
      unique: true,
      admin: { description: 'Auto-generated booking ID (SM-YYYYMMDD-XXXX)' },
    },
    {
      name: 'stay',
      type: 'relationship',
      relationTo: 'stays',
      required: true,
    },
    {
      name: 'checkIn',
      type: 'date',
      required: true,
      admin: { date: { pickerAppearance: 'dayOnly' } },
    },
    {
      name: 'checkOut',
      type: 'date',
      required: true,
      admin: { date: { pickerAppearance: 'dayOnly' } },
    },
    {
      name: 'numberOfGuests',
      type: 'number',
      required: true,
      min: 1,
      max: 20,
      defaultValue: 1,
    },
    {
      name: 'numberOfNights',
      type: 'number',
      required: true,
      min: 1,
    },
    {
      name: 'guestName',
      type: 'text',
      required: true,
    },
    {
      name: 'guestEmail',
      type: 'email',
      required: true,
    },
    {
      name: 'guestPhone',
      type: 'text',
      required: true,
    },
    {
      name: 'pricePerNight',
      type: 'number',
      required: true,
      min: 0,
    },
    {
      name: 'totalAmount',
      type: 'number',
      required: true,
      min: 0,
    },
    {
      name: 'advanceAmount',
      type: 'number',
      required: true,
      min: 0,
    },
    {
      name: 'gstAmount',
      type: 'number',
      required: true,
      min: 0,
    },
    {
      name: 'remainingAmount',
      type: 'number',
      required: true,
      min: 0,
    },
    {
      name: 'razorpayOrderId',
      type: 'text',
      admin: { readOnly: true },
    },
    {
      name: 'razorpayPaymentId',
      type: 'text',
      admin: { readOnly: true },
    },
    {
      name: 'razorpaySignature',
      type: 'text',
      admin: { readOnly: true },
    },
    {
      name: 'paymentStatus',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Advance Paid', value: 'advance_paid' },
        { label: 'Fully Paid', value: 'fully_paid' },
        { label: 'Cancelled', value: 'cancelled' },
        { label: 'Refunded', value: 'refunded' },
      ],
    },
    {
      name: 'specialRequests',
      type: 'textarea',
    },
  ],
}
