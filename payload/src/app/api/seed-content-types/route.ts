import { NextResponse } from 'next/server'
import { getPayload } from 'payload'

import config from '@/payload.config'

const contentTypes = [
  { label: 'Insight', key: 'insight', routeBase: '/insights', active: true, sortOrder: 1 },
  { label: 'White Paper', key: 'whitepaper', routeBase: '/whitepapers', active: true, sortOrder: 2 },
  { label: 'Webinar', key: 'webinar', routeBase: '/webinars', active: true, sortOrder: 3 },
] as const

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization')
    const expected = process.env.PAYLOAD_SECRET

    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Disabled in production.' }, { status: 403 })
    }

    if (!expected || authHeader !== `Bearer ${expected}`) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
    }

    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })
    const results = []

    for (const item of contentTypes) {
      const existing = await payload.find({
        collection: 'content-types',
        where: { key: { equals: item.key } },
        limit: 1,
        depth: 0,
      })

      if (existing.docs[0]) {
        const updated = await payload.update({
          collection: 'content-types',
          id: existing.docs[0].id,
          data: item,
          draft: false,
          depth: 0,
        })
        results.push({ action: 'updated', id: updated.id, key: item.key })
      } else {
        const created = await payload.create({
          collection: 'content-types',
          data: item,
          draft: false,
          depth: 0,
        })
        results.push({ action: 'created', id: created.id, key: item.key })
      }
    }

    return NextResponse.json({ ok: true, count: results.length, results })
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'Unknown seed error' },
      { status: 500 },
    )
  }
}
