import type { NextRequest } from 'next/server'

type Bucket = {
  count: number
  resetAt: number
}

const buckets = new Map<string, Bucket>()

// Drop expired buckets so the Map can't grow unbounded under many unique keys
// (e.g. lots of distinct client IPs). Runs at most once per sweep interval,
// piggy-backed on calls to consumeRateLimit — no background timer needed.
const SWEEP_INTERVAL_MS = 5 * 60 * 1000
let lastSweepAt = 0

function evictExpired(now: number) {
  if (now - lastSweepAt < SWEEP_INTERVAL_MS) {
    return
  }
  lastSweepAt = now
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) {
      buckets.delete(key)
    }
  }
}

/**
 * Derive a best-effort client IP for rate-limiting.
 *
 * NOTE: this is only as trustworthy as the deploy's proxy setup. `x-real-ip`
 * (set by Render/Nginx/most proxies to the real peer) is preferred because it
 * is harder to spoof than `x-forwarded-for`, whose first segment is
 * client-controllable unless the proxy overwrites it. For a hard guarantee in a
 * multi-instance/serverless deploy, move rate-limiting to a shared store
 * (Redis/Upstash) keyed on a proxy-verified IP.
 */
export function getClientIp(request: NextRequest): string {
  const realIp = request.headers.get('x-real-ip')?.trim()
  if (realIp) {
    return realIp
  }

  const forwarded = request.headers.get('x-forwarded-for')
  const firstHop = forwarded?.split(',')[0]?.trim()
  return firstHop || 'unknown'
}

export function consumeRateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now()
  evictExpired(now)
  const existing = buckets.get(key)

  if (!existing || existing.resetAt <= now) {
    buckets.set(key, {
      count: 1,
      resetAt: now + windowMs,
    })

    return {
      allowed: true,
      remaining: limit - 1,
      resetAt: now + windowMs,
    }
  }

  if (existing.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: existing.resetAt,
    }
  }

  existing.count += 1
  buckets.set(key, existing)

  return {
    allowed: true,
    remaining: Math.max(0, limit - existing.count),
    resetAt: existing.resetAt,
  }
}
