import type { CollectionConfig } from 'payload'

export const TripTypes: CollectionConfig = {
  slug: 'trip-types',
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  admin: {
    useAsTitle: 'name',
    description:
      'Trip categories: Group Trip, Day Trip, School Trip, Retreat, Learning Experience',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description:
          'URL-friendly identifier, e.g. "group-trip", "day-trip", "school-trip", "retreat", "learning-experience"',
      },
    },
  ],
}
