import type { CollectionConfig } from 'payload'

import { isAdmin } from '../access/cmsAccess'

export const Registrations: CollectionConfig = {
  slug: 'registrations',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['name', 'email', 'post', 'submittedAt'],
  },
  access: {
    create: isAdmin,
    delete: isAdmin,
    read: isAdmin,
    update: isAdmin,
  },
  fields: [
    {
      name: 'post',
      type: 'relationship',
      relationTo: 'posts',
      required: true,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          admin: { width: '50%' },
        },
        {
          name: 'email',
          type: 'email',
          required: true,
          admin: { width: '50%' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'jobTitle',
          type: 'text',
          admin: { width: '33%' },
        },
        {
          name: 'company',
          type: 'text',
          admin: { width: '33%' },
        },
        {
          name: 'country',
          type: 'text',
          admin: { width: '33%' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'newsletterOptIn',
          type: 'checkbox',
          defaultValue: false,
          admin: { width: '33%' },
        },
        {
          name: 'consentAccepted',
          type: 'checkbox',
          required: true,
          admin: { width: '33%' },
        },
        {
          name: 'submittedAt',
          type: 'date',
          required: true,
          admin: {
            width: '34%',
            date: { pickerAppearance: 'dayAndTime' },
          },
        },
      ],
    },
    {
      name: 'sourceUrl',
      type: 'text',
    },
  ],
}

export default Registrations
