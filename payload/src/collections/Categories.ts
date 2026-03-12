import type { CollectionConfig } from 'payload'

import { isAdmin } from '../access/cmsAccess'
import { seoFields } from '../fields/seo'
import { slugHook } from '../fields/slug'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'featured'],
  },
  access: {
    read: () => true,
    create: isAdmin,
    delete: isAdmin,
    update: isAdmin,
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
      admin: {
        description: 'Auto-generated from the category name when left empty.',
      },
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'color',
      type: 'text',
      admin: {
        description: 'Hex value such as #0F172A',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    ...seoFields(),
  ],
}

export default Categories
