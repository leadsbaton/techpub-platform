import type { CollectionConfig } from 'payload'

import { canBootstrapFirstAdmin, canReadUser, canSetUserRole, isAdmin } from '../access/cmsAccess'

const publicPayloadURL = process.env.PAYLOAD_PUBLIC_URL || process.env.PAYLOAD_PUBLIC_SERVERURL || ''
const shouldUseSecureCookies = publicPayloadURL.startsWith('https://')

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'name',
  },
  auth: {
    cookies: {
      sameSite: 'Lax',
      secure: shouldUseSecureCookies,
    },
    useSessions: true,
    // Throttle brute-force password guessing on /api/users/login. After
    // `maxLoginAttempts` consecutive failures Payload locks the account for
    // `lockTime` (ms) and tracks loginAttempts/lockUntil automatically.
    maxLoginAttempts: 5,
    lockTime: 15 * 60 * 1000, // 15 minutes
  },
  access: {
    admin: ({ req }) => Boolean(req.user),
    create: canBootstrapFirstAdmin,
    delete: isAdmin,
    read: canReadUser,
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
    afterLogin: [
      ({ req, user }) => {
        if (process.env.DEBUG_AUTH !== 'true') {
          return
        }

        req.payload.logger.info({
          msg: '[auth-debug] login succeeded',
          userID: user.id,
          email: 'email' in user ? user.email : undefined,
          role: 'role' in user ? user.role : undefined,
          origin: req.headers.get('origin'),
          referer: req.headers.get('referer'),
          publicPayloadURL,
          secureCookie: shouldUseSecureCookies,
        })
      },
    ],
    afterMe: [
      ({ req, response }) => {
        if (process.env.DEBUG_AUTH !== 'true') {
          return
        }

        type DebugUser = { id?: string | number; email?: string; role?: string }
        const meResponse = response as DebugUser & { user?: DebugUser }
        const user = meResponse.user || meResponse

        req.payload.logger.info({
          msg: '[auth-debug] me result',
          userID: user?.id,
          email: user && 'email' in user ? user.email : undefined,
          role: user && 'role' in user ? user.role : undefined,
          origin: req.headers.get('origin'),
          referer: req.headers.get('referer'),
          hasPayloadCookie: req.headers.get('cookie')?.includes('payload-token') || false,
        })
      },
    ],
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
