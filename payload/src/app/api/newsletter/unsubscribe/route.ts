import { NextRequest } from 'next/server'
import { getPayload } from 'payload'

import config from '@/payload.config'
import { jsonWithCors, optionsWithCors } from '@/lib/cors'
import { consumeRateLimit, getClientIp } from '@/lib/rateLimit'
import { sendEmailJsTemplate } from '@/lib/emailjs'

const WINDOW_MS = 15 * 60 * 1000
const LIMIT = 10

function getClientKey(request: NextRequest) {
  return `newsletter:unsubscribe:${getClientIp(request)}`
}

export async function POST(request: NextRequest) {
  const rate = await consumeRateLimit(getClientKey(request), LIMIT, WINDOW_MS)

  if (!rate.allowed) {
    return jsonWithCors(
      request,
      { message: 'Too many unsubscribe attempts. Please try again later.' },
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

  let body: { token?: string }

  try {
    body = await request.json()
  } catch {
    return jsonWithCors(request, { message: 'Invalid JSON payload.' }, { status: 400 })
  }

  const token = (body.token || '').trim()

  if (!token) {
    return jsonWithCors(request, { message: 'Missing or invalid token.' }, { status: 400 })
  }

  const payload = await getPayload({ config })

  try {
    const { docs } = await payload.find({
      collection: 'subscribers',
      depth: 0,
      limit: 1,
      overrideAccess: true,
      pagination: false,
      where: {
        unsubscribeToken: {
          equals: token,
        },
      },
    })

    if (!docs.length) {
      return jsonWithCors(
        request,
        { message: 'Token not found or already used.' },
        {
          headers: {
            'X-RateLimit-Limit': String(LIMIT),
            'X-RateLimit-Remaining': String(rate.remaining),
            'X-RateLimit-Reset': String(rate.resetAt),
          },
          status: 404,
        },
      )
    }

    const subscriber = docs[0]
    const subscriberRecord = subscriber as unknown as Record<string, unknown>

    if (subscriberRecord.status === 'unsubscribed') {
      return jsonWithCors(
        request,
        { message: 'You are already unsubscribed.' },
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

    // Update subscriber status to unsubscribed
    await payload.update({
      collection: 'subscribers',
      id: subscriber.id,
      data: {
        status: 'unsubscribed',
      },
      overrideAccess: true,
    })

    // Send confirmation email (non-blocking)
    void sendEmailJsTemplate({
      to_email: subscriber.email,
      subscriber_name: subscriber.firstName || subscriber.email,
      source: 'unsubscribe_confirmation',
    }, process.env.EMAILJS_UNSUBSCRIBE_TEMPLATE_ID)

    return jsonWithCors(
      request,
      { message: 'You have been unsubscribed successfully.' },
      {
        headers: {
          'X-RateLimit-Limit': String(LIMIT),
          'X-RateLimit-Remaining': String(rate.remaining),
          'X-RateLimit-Reset': String(rate.resetAt),
        },
        status: 200,
      },
    )
  } catch (error) {
    return jsonWithCors(
      request,
      { message: 'An error occurred. Please try again.' },
      { status: 500 },
    )
  }
}

export function OPTIONS(request: NextRequest) {
  return optionsWithCors(request)
}
