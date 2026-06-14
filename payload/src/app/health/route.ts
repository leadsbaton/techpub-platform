import { NextResponse } from 'next/server'

// Lightweight liveness endpoint. An external pinger (GitHub Actions / UptimeRobot
// / cron-job.org) hits this on a schedule so Render's free web service doesn't
// spin down after ~15 min idle. Intentionally does NOT touch the database — it
// only needs to keep the HTTP instance warm and respond fast.
export const dynamic = 'force-dynamic'

export function GET() {
  return NextResponse.json({ status: 'ok' }, { status: 200 })
}

export function HEAD() {
  return new NextResponse(null, { status: 200 })
}
