import type { CollectionConfig } from 'payload'

import { canBootstrapFirstAdmin, isAdmin } from '../access/cmsAccess'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'name',
  },
  auth: {
    cookies: {
      sameSite: 'Lax',
      secure: process.env.NODE_ENV === 'production',
    },
    useSessions: true,
  },
  access: {
    create: canBootstrapFirstAdmin,
    delete: isAdmin,
    read: isAdmin,
    update: isAdmin,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      defaultValue: 'editor',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
      ],
      required: true,
    },
  ],
  hooks: {
    beforeValidate: [
      ({ data }) => {
        const nextData = { ...(data || {}) } as Record<string, unknown>
        const name = typeof nextData.name === 'string' ? nextData.name.trim() : ''
        const email = typeof nextData.email === 'string' ? nextData.email.trim() : ''

        if (!name && email) {
          nextData.name = email.split('@')[0].replace(/[._-]+/g, ' ')
        }

        return nextData
      },
    ],
  },
}
