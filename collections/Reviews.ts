import type { CollectionConfig } from 'payload'

export const Reviews: CollectionConfig = {
  slug: 'reviews',
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  admin: {
    useAsTitle: 'reviewerName',
    defaultColumns: ['reviewerName', 'tripName', 'rating', 'featured'],
  },
  fields: [
    {
      name: 'reviewerName',
      type: 'text',
      required: true,
    },
    {
      name: 'reviewerPhoto',
      type: 'relationship',
      relationTo: 'media',
    },
    {
      name: 'tripName',
      type: 'text',
      required: true,
      admin: {
        description: 'Name of the trip this review is for',
      },
    },
    {
      name: 'rating',
      type: 'number',
      required: true,
      min: 1,
      max: 5,
      admin: {
        description: 'Rating from 1 to 5',
      },
    },
    {
      name: 'reviewText',
      type: 'textarea',
      required: true,
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Show this review on the homepage or key landing pages',
      },
    },
  ],
}
