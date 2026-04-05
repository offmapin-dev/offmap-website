import type { CollectionConfig } from 'payload'

export const Enquiries: CollectionConfig = {
  slug: 'enquiries',
  access: {
    // Only authenticated admins can read/manage enquiries
    read: ({ req }) => Boolean(req.user),
    create: () => true, // Public can submit enquiry forms
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'tripType', 'status', 'createdAt'],
    description: 'Enquiries submitted via trip and stay pages',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
      required: true,
    },
    {
      name: 'tripType',
      type: 'select',
      required: true,
      options: [
        { label: 'Group Trip', value: 'group-trip' },
        { label: 'School Trip', value: 'school-trip' },
        { label: 'Retreat', value: 'retreat' },
        { label: 'Day Trip', value: 'day-trip' },
      ],
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
    },
    {
      name: 'source',
      type: 'select',
      required: true,
      options: [
        { label: 'Trips', value: 'trips' },
        { label: 'Stays', value: 'stays' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Contacted', value: 'contacted' },
        { label: 'Closed', value: 'closed' },
      ],
    },
  ],
  timestamps: true,
}
