import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'

import config from '@/payload.config'
import { consumeRateLimit } from '@/lib/rateLimit'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const WINDOW_MS = 15 * 60 * 1000
const LIMIT = 5

function getClientKey(request: NextRequest) {
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded?.split(',')[0]?.trim() || 'unknown'
  return `newsletter:${ip}`
}

export async function POST(request: NextRequest) {
  const rate = consumeRateLimit(getClientKey(request), LIMIT, WINDOW_MS)

  if (!rate.allowed) {
    return NextResponse.json(
      { message: 'Too many subscription attempts. Please try again later.' },
      {
        headers: {
          'X-RateLimit-Limit': String(LIMIT),
          'X-RateLimit-Remaining': String(rate.remaining),
          'X-RateLimit-Reset': String(rate.resetAt),
        },
        status: 429,
      },
    )
  }

  let body: {
    email?: string
    firstName?: string
    lastName?: string
    source?: string
  }

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ message: 'Invalid JSON payload.' }, { status: 400 })
  }

  const email = body.email?.trim().toLowerCase()
  const firstName = body.firstName?.trim()
  const lastName = body.lastName?.trim()
  const source = body.source?.trim() || 'website'

  if (!email || !EMAIL_REGEX.test(email)) {
    return NextResponse.json({ message: 'A valid email address is required.' }, { status: 400 })
  }

  const payload = await getPayload({ config })
  const existing = await payload.find({
    collection: 'subscribers',
    depth: 0,
    limit: 1,
    overrideAccess: true,
    pagination: false,
    where: {
      email: {
        equals: email,
      },
    },
  })

  if (existing.docs[0]) {
    const current = existing.docs[0]

    if (current.status !== 'subscribed') {
      await payload.update({
        id: current.id,
        collection: 'subscribers',
        data: {
          email,
          firstName: firstName || current.firstName,
          lastName: lastName || current.lastName,
          source,
          status: 'subscribed',
        },
        overrideAccess: true,
      })
    }

    return NextResponse.json(
      { message: 'You are already subscribed.' },
      {
        headers: {
          'X-RateLimit-Limit': String(LIMIT),
          'X-RateLimit-Remaining': String(rate.remaining),
          'X-RateLimit-Reset': String(rate.resetAt),
        },
        status: 200,
      },
    )
  }

  await payload.create({
    collection: 'subscribers',
    data: {
      email,
      firstName,
      lastName,
      source,
      status: 'subscribed',
    },
    overrideAccess: true,
  })

  return NextResponse.json(
    { message: 'Subscription saved successfully.' },
    {
      headers: {
        'X-RateLimit-Limit': String(LIMIT),
        'X-RateLimit-Remaining': String(rate.remaining),
        'X-RateLimit-Reset': String(rate.resetAt),
      },
      status: 201,
    },
  )
}
