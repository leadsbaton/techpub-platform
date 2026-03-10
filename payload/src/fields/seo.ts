import type { Field } from 'payload'

export const seoFields = (): Field[] => [
  {
    name: 'seo',
    type: 'group',
    fields: [
      {
        name: 'metaTitle',
        type: 'text',
      },
      {
        name: 'metaDescription',
        type: 'textarea',
      },
      {
        name: 'canonicalUrl',
        type: 'text',
      },
      {
        name: 'metaImage',
        type: 'upload',
        relationTo: 'media',
      },
      {
        name: 'noIndex',
        type: 'checkbox',
        defaultValue: false,
      },
    ],
  },
]
