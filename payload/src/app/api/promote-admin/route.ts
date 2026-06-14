import { NextResponse } from 'next/server'
import { getPayload } from 'payload'

import config from '@/payload.config'

// One-off maintenance endpoint to grant the `admin` role to a user by email.
// Fixes the "You are not allowed to perform this action" error that appears when
// a logged-in account's role isn't `admin` (all create/update/delete access is
// gated on role === 'admin').
//
// Protected by the server-only PAYLOAD_SECRET bearer token (knowing it already
// implies full control), so it is safe to leave enabled in production for the
// rare case the very first admin needs its role repaired.
export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization')
    const expected = process.env.PAYLOAD_SECRET

    if (!expected || authHeader !== `Bearer ${expected}`) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
    }

    const body = (await request.json().catch(() => ({}))) as { email?: string }
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''

    if (!email) {
      return NextResponse.json({ error: 'An "email" is required.' }, { status: 400 })
    }

    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })

    const found = await payload.find({
      collection: 'users',
      depth: 0,
      limit: 1,
      overrideAccess: true,
      pagination: false,
      where: { email: { equals: email } },
    })

    const user = found.docs[0]
    if (!user) {
      return NextResponse.json({ error: `No user found with email ${email}.` }, { status: 404 })
    }

    await payload.update({
      collection: 'users',
      id: user.id,
      data: { role: 'admin' },
      overrideAccess: true,
    })

    return NextResponse.json({ ok: true, email, role: 'admin' })
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 },
    )
  }
}
