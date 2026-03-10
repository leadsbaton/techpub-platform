import { NextResponse } from 'next/server'
import { getPayload } from 'payload'

import config from '@/payload.config'
import { seedDemoContent } from '@/utilities/seedDemo'

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
    const result = await seedDemoContent(payload)

    return NextResponse.json({
      ok: true,
      seeded: result,
    })
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : 'Unknown seed error',
      },
      { status: 500 },
    )
  }
}
