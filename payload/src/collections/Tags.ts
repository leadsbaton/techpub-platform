import type { CollectionConfig } from 'payload'

import { seoFields } from '../fields/seo'
import { slugHook } from '../fields/slug'

export const Tags: CollectionConfig = {
  slug: 'tags',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug'],
  },
  access: {
    read: () => true,
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
      hooks: {
        beforeValidate: [slugHook('name')],
      },
    },
    {
      name: 'description',
      type: 'textarea',
    },
    ...seoFields(),
  ],
}
