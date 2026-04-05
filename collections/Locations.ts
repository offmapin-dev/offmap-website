import type { CollectionConfig } from 'payload'

export const Locations: CollectionConfig = {
  slug: 'locations',
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  admin: {
    useAsTitle: 'name',
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
        description: 'URL-friendly identifier, e.g. "himachal-pradesh"',
      },
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'heroImage',
      type: 'relationship',
      relationTo: 'media',
    },
    {
      name: 'accentColor',
      type: 'text',
      admin: {
        description: 'Hex color code for this location, e.g. "#1B4FD8"',
      },
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      required: true,
    },
  ],
}
