import type { CollectionConfig } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: () => true, // Public read access
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description:
          'URL-friendly version of the name (e.g., "technology", "finance", "marketing")',
      },
    },
    {
      name: 'description',
      type: 'textarea',
    },
  ],
}

export default Categories
