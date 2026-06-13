import type { Access, FieldAccess, PayloadRequest } from 'payload'

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

// Field-level read access: only authenticated CMS users may read the field.
// Used to keep gated delivery assets (e.g. the whitepaper download) out of
// public API responses. The gated POST routes use `overrideAccess: true`, so
// they can still resolve the asset after a lead is captured.
export const isAuthenticatedField: FieldAccess = ({ req }) => Boolean(getUser(req))

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

async function noUsersExist(req: PayloadRequest): Promise<boolean> {
  const existingUsers = await req.payload.find({
    collection: 'users',
    depth: 0,
    limit: 1,
    overrideAccess: true,
    pagination: false,
  })

  return existingUsers.docs.length === 0
}

export const canBootstrapFirstAdmin: Access = async ({ req }) => {
  if (isAdminUser(getUser(req))) {
    return true
  }

  return noUsersExist(req)
}

// Field-level access for the `role` field: only admins may set/change it,
// except during first-admin bootstrap (no users exist yet) so the very first
// user can be created as an admin.
export const canSetUserRole: FieldAccess = async ({ req }) => {
  if (isAdminUser(getUser(req))) {
    return true
  }

  return noUsersExist(req)
}
