import type { CollectionConfig } from 'payload'

export const Batches: CollectionConfig = {
  slug: 'batches',
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  admin: {
    useAsTitle: 'trip',
    description: 'A scheduled run of a trip with specific dates and seat count',
  },
  fields: [
    {
      name: 'trip',
      type: 'relationship',
      relationTo: 'trips',
      required: true,
    },
    {
      name: 'startDate',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'endDate',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'seatsTotal',
      type: 'number',
      required: true,
      defaultValue: 15,
      min: 1,
    },
    {
      name: 'seatsBooked',
      type: 'number',
      required: true,
      defaultValue: 0,
      min: 0,
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'open',
      options: [
        { label: 'Open', value: 'open' },
        { label: 'Full', value: 'full' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
    },
  ],
}
