import type { Access, PayloadRequest } from 'payload'

type CMSUser = {
  id?: number | string
  role?: 'admin' | 'editor' | string
} | null | undefined

function getUser(req: PayloadRequest): CMSUser {
  return req.user as CMSUser
}

export function isAdminUser(user: CMSUser): boolean {
  return String(user?.role || '').toLowerCase() === 'admin'
}

export const isAdmin: Access = ({ req }) => isAdminUser(getUser(req))

export const isAdminOrPublished: Access = ({ req }) => {
  if (isAdminUser(getUser(req))) {
    return true
  }

  return {
    status: {
      equals: 'published',
    },
  }
}

export const canBootstrapFirstAdmin: Access = async ({ req }) => {
  if (isAdminUser(getUser(req))) {
    return true
  }

  const existingUsers = await req.payload.find({
    collection: 'users',
    depth: 0,
    limit: 1,
    overrideAccess: true,
    pagination: false,
  })

  return existingUsers.docs.length === 0
}
