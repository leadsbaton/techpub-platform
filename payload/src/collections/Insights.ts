import type { CollectionConfig, CollectionSlug } from 'payload'

export const Insights: CollectionConfig = {
  slug: 'insights',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'publishedAt', 'isTrending'],
  },
  access: {
    read: () => true, // Public read access
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Auto-generated from title, or set manually',
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Short description shown in listings',
      },
    },
    {
      name: 'content',
      type: 'richText',
      admin: {
        description: 'Full article content',
      },
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories' as CollectionSlug,
      required: true,
    },
    {
      name: 'publishedAt',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'isTrending',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Show in "JUST IN: INSIGHTS" trending section',
      },
    },
    {
      name: 'isTopPick',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Show in "Top Picks" section',
      },
    },
  ],
  hooks: {
    beforeValidate: [
      async ({ data, operation }) => {
        // Auto-generate slug from title if not provided
        if (data?.title && !data?.slug) {
          data.slug = data.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')
        }
        return data
      },
    ],
  },
}

export default Insights
