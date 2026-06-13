import type { NextRequest } from 'next/server'

type Bucket = {
  count: number
  resetAt: number
}

export type RateLimitResult = {
  allowed: boolean
  remaining: number
  resetAt: number
}

const buckets = new Map<string, Bucket>()

// Drop expired buckets so the Map can't grow unbounded under many unique keys
// (e.g. lots of distinct client IPs). Runs at most once per sweep interval,
// piggy-backed on calls to the in-memory limiter — no background timer needed.
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
 * client-controllable unless the proxy overwrites it.
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

function consumeInMemory(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now()
  evictExpired(now)
  const existing = buckets.get(key)

  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true, remaining: limit - 1, resetAt: now + windowMs }
  }

  if (existing.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: existing.resetAt }
  }

  existing.count += 1
  buckets.set(key, existing)
  return {
    allowed: true,
    remaining: Math.max(0, limit - existing.count),
    resetAt: existing.resetAt,
  }
}

// Optional distributed backend. When UPSTASH_REDIS_REST_URL/TOKEN are set the
// limiter becomes correct across multiple instances (serverless / horizontal
// scale); otherwise it stays in-memory (correct for a single instance, e.g.
// Render free tier). Uses the Upstash REST API directly so there is no extra
// npm dependency.
const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL?.replace(/\/$/, '')
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN

async function upstashPipeline(commands: Array<Array<string | number>>): Promise<unknown[]> {
  const response = await fetch(`${UPSTASH_URL}/pipeline`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${UPSTASH_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(commands),
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error(`Upstash request failed: ${response.status}`)
  }

  // Each entry is shaped { result } or { error }.
  const payload = (await response.json()) as Array<{ result?: unknown; error?: string }>
  return payload.map((entry) => {
    if (entry.error) throw new Error(`Upstash command error: ${entry.error}`)
    return entry.result
  })
}

async function consumeViaUpstash(
  key: string,
  limit: number,
  windowMs: number,
): Promise<RateLimitResult> {
  const now = Date.now()
  // Fixed-window counter: INCR establishes/increments the count, PTTL reports
  // the remaining window so we can report an accurate reset time.
  const [countRaw, ttlRaw] = (await upstashPipeline([
    ['INCR', key],
    ['PTTL', key],
  ])) as [number, number]

  let ttl = Number(ttlRaw)
  // First hit in a window (or a key with no expiry yet) — arm the TTL.
  if (Number(countRaw) === 1 || ttl < 0) {
    await upstashPipeline([['PEXPIRE', key, windowMs]])
    ttl = windowMs
  }

  const count = Number(countRaw)
  return {
    allowed: count <= limit,
    remaining: Math.max(0, limit - count),
    resetAt: now + ttl,
  }
}

/**
 * Consume one unit from the rate-limit bucket for `key`.
 *
 * Prefers the distributed Upstash backend when configured, and falls back to
 * the in-memory limiter on any error so a misconfigured/unreachable store can
 * never take the endpoint down — it degrades to per-instance limiting instead.
 */
export async function consumeRateLimit(
  key: string,
  limit: number,
  windowMs: number,
): Promise<RateLimitResult> {
  if (UPSTASH_URL && UPSTASH_TOKEN) {
    try {
      return await consumeViaUpstash(key, limit, windowMs)
    } catch (error) {
      console.error('[rateLimit] Upstash backend failed, falling back to in-memory:', error)
    }
  }

  return consumeInMemory(key, limit, windowMs)
}
