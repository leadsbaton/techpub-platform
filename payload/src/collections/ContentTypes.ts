import type { CollectionConfig } from 'payload'

import { isAdmin } from '../access/cmsAccess'

export const ContentTypes: CollectionConfig = {
  slug: 'content-types',
  admin: {
    useAsTitle: 'label',
    defaultColumns: ['label', 'key', 'routeBase', 'active'],
  },
  access: {
    read: () => true,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'label',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'key',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Stable value used internally by frontend filters and post routing.',
      },
    },
    {
      name: 'routeBase',
      type: 'text',
      required: true,
      admin: {
        description: 'Public route base such as /insights, /whitepapers, or /webinars.',
      },
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'sortOrder',
      type: 'number',
      defaultValue: 0,
    },
  ],
}

export default ContentTypes
