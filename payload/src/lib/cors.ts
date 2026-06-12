import { NextRequest, NextResponse } from 'next/server'

const DEFAULT_FRONTEND_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://techpub-platform.vercel.app'
    : 'http://localhost:3000'

const allowedOrigins = Array.from(
  new Set(
    [
      process.env.NEXT_PUBLIC_SITE_URL,
      process.env.FRONTEND_URL,
      DEFAULT_FRONTEND_URL,
      'http://localhost:3000',
      'http://127.0.0.1:3000',
    ].filter((origin): origin is string => Boolean(origin)),
  ),
)

function getAllowedOrigin(request: NextRequest) {
  const origin = request.headers.get('origin')

  if (!origin || !allowedOrigins.includes(origin)) {
    return null
  }

  return origin
}

export function getCorsHeaders(request: NextRequest) {
  const headers = new Headers()
  const origin = getAllowedOrigin(request)

  if (origin) {
    headers.set('Access-Control-Allow-Origin', origin)
    headers.set('Vary', 'Origin')
  }

  headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS')
  headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  headers.set('Access-Control-Max-Age', '86400')

  return headers
}

export function jsonWithCors(
  request: NextRequest,
  body: unknown,
  init: ResponseInit = {},
) {
  const headers = getCorsHeaders(request)
  const initHeaders = new Headers(init.headers)

  initHeaders.forEach((value, key) => {
    headers.set(key, value)
  })

  return NextResponse.json(body, {
    ...init,
    headers,
  })
}

export function optionsWithCors(request: NextRequest) {
  return new Response(null, {
    headers: getCorsHeaders(request),
    status: 204,
  })
}
