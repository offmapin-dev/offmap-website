import type { CollectionConfig } from 'payload'

export const Bookings: CollectionConfig = {
  slug: 'bookings',
  access: {
    read: ({ req }) => Boolean(req.user),
    create: () => true,
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  admin: {
    useAsTitle: 'bookingId',
    defaultColumns: ['bookingId', 'travelerName', 'batch', 'paymentStatus', 'status', 'createdAt'],
    listSearchableFields: ['bookingId', 'travelerName', 'travelerEmail', 'travelerPhone'],
    description: 'Trip bookings with payment tracking',
  },
  timestamps: true,
  fields: [
    {
      name: 'bookingId',
      type: 'text',
      required: true,
      unique: true,
      admin: { description: 'Auto-generated booking ID (OM-YYYYMMDD-XXXX)' },
    },
    {
      name: 'batch',
      type: 'relationship',
      relationTo: 'batches',
      required: true,
    },
    {
      name: 'travelers',
      type: 'number',
      required: true,
      min: 1,
      max: 15,
      defaultValue: 1,
    },
    {
      name: 'travelerName',
      type: 'text',
      required: true,
    },
    {
      name: 'travelerEmail',
      type: 'email',
      required: true,
    },
    {
      name: 'travelerPhone',
      type: 'text',
      required: true,
    },
    {
      name: 'specialRequirements',
      type: 'textarea',
    },
    {
      name: 'pricePerPerson',
      type: 'number',
      required: true,
      min: 0,
    },
    {
      name: 'totalAmount',
      type: 'number',
      required: true,
      min: 0,
      admin: { description: 'Total trip cost (travelers x pricePerPerson)' },
    },
    {
      name: 'advanceAmount',
      type: 'number',
      required: true,
      min: 0,
      admin: { description: '30% advance + GST' },
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
      admin: { description: 'Amount remaining to pay before trip' },
    },
    {
      name: 'razorpayOrderId',
      type: 'text',
      admin: { description: 'Razorpay order ID', readOnly: true },
    },
    {
      name: 'razorpayPaymentId',
      type: 'text',
      admin: { description: 'Razorpay payment ID', readOnly: true },
    },
    {
      name: 'razorpaySignature',
      type: 'text',
      admin: { description: 'Razorpay signature for verification', readOnly: true },
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
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Confirmed', value: 'confirmed' },
        { label: 'Cancelled', value: 'cancelled' },
        { label: 'Completed', value: 'completed' },
      ],
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: { description: 'Internal admin notes' },
    },
  ],
}
