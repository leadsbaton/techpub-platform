import type { CollectionConfig } from 'payload'

import { canBootstrapFirstAdmin, canSetUserRole, isAdmin } from '../access/cmsAccess'

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
    // Throttle brute-force password guessing on /api/users/login. After
    // `maxLoginAttempts` consecutive failures Payload locks the account for
    // `lockTime` (ms) and tracks loginAttempts/lockUntil automatically.
    maxLoginAttempts: 5,
    lockTime: 15 * 60 * 1000, // 15 minutes
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
      // Only admins may set or change a user's role (with a bootstrap
      // exception for the first user). This prevents a non-admin editor
      // from self-promoting to admin via create/update.
      access: {
        create: canSetUserRole,
        update: canSetUserRole,
      },
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
