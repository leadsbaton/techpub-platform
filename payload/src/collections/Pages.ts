import type { CollectionConfig } from 'payload'

import { linkField } from '../fields/link'
import { seoFields } from '../fields/seo'
import { slugHook } from '../fields/slug'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'status', 'template'],
  },
  access: {
    read: () => true,
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
      hooks: {
        beforeValidate: [slugHook('title')],
      },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      required: true,
    },
    {
      name: 'template',
      type: 'select',
      defaultValue: 'standard',
      options: [
        { label: 'Standard', value: 'standard' },
        { label: 'Landing', value: 'landing' },
        { label: 'Contact', value: 'contact' },
        { label: 'Legal', value: 'legal' },
      ],
      required: true,
    },
    {
      name: 'hero',
      type: 'group',
      fields: [
        {
          name: 'eyebrow',
          type: 'text',
        },
        {
          name: 'headline',
          type: 'text',
        },
        {
          name: 'description',
          type: 'textarea',
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
        linkField('primaryAction', 'Primary Action'),
        linkField('secondaryAction', 'Secondary Action'),
      ],
    },
    {
      name: 'summary',
      type: 'textarea',
    },
    {
      name: 'content',
      type: 'richText',
    },
    {
      name: 'featuredPosts',
      type: 'relationship',
      relationTo: 'posts',
      hasMany: true,
    },
    {
      name: 'hideFromNavigation',
      type: 'checkbox',
      defaultValue: false,
    },
    ...seoFields(),
  ],
}
