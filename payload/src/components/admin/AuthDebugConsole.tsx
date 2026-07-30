'use client'

import { useEffect } from 'react'

declare global {
  interface Window {
    __techpubAuthDebugFetchInstalled?: boolean
  }
}

function isAuthDebugURL(input: RequestInfo | URL): boolean {
  const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url

  return url.includes('/api/users/login') || url.includes('/api/users/me')
}

export function AuthDebugConsole() {
  useEffect(() => {
    if (window.__techpubAuthDebugFetchInstalled) {
      return
    }

    window.__techpubAuthDebugFetchInstalled = true
    const originalFetch = window.fetch.bind(window)

    window.fetch = async (input, init) => {
      const shouldLog = isAuthDebugURL(input)
      const method =
        init?.method ||
        (typeof input !== 'string' && !(input instanceof URL) ? input.method : undefined) ||
        'GET'

      if (shouldLog) {
        console.info('[auth-debug] request', {
          method,
          url: typeof input === 'string' ? input : input instanceof URL ? input.href : input.url,
          credentials:
            init?.credentials ||
            (typeof input !== 'string' && !(input instanceof URL) ? input.credentials : undefined) ||
            'default',
          location: window.location.href,
        })
      }

      try {
        const response = await originalFetch(input, init)

        if (shouldLog) {
          const clonedResponse = response.clone()
          let body: unknown = null

          try {
            body = await clonedResponse.json()
          } catch {
            body = await clonedResponse.text()
          }

          console.info('[auth-debug] response', {
            ok: response.ok,
            status: response.status,
            redirected: response.redirected,
            url: response.url,
            body,
            location: window.location.href,
          })
        }

        return response
      } catch (error) {
        if (shouldLog) {
          console.error('[auth-debug] fetch failed', error)
        }

        throw error
      }
    }

    console.info('[auth-debug] Payload admin fetch logger installed')
  }, [])

  return null
}
