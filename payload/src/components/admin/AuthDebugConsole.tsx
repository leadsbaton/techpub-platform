'use client'

import { useEffect } from 'react'

declare global {
  interface Window {
    __techpubAuthDebugFetchInstalled?: boolean
  }
}

function isAuthDebugURL(input: RequestInfo | URL): boolean {
  const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url

  return (
    url.includes('/api/users/login') ||
    url.includes('/api/users/me') ||
    url.includes('/admin')
  )
}

function sanitizeBody(body: unknown): unknown {
  if (!body || typeof body !== 'object') {
    return body
  }

  const nextBody = { ...(body as Record<string, unknown>) }

  if ('token' in nextBody) {
    nextBody.token = '[redacted]'
  }

  if ('user' in nextBody && nextBody.user && typeof nextBody.user === 'object') {
    const user = nextBody.user as Record<string, unknown>
    nextBody.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      collection: user.collection,
      strategy: user._strategy,
    }
  }

  return nextBody
}

export function AuthDebugConsole() {
  useEffect(() => {
    if (window.__techpubAuthDebugFetchInstalled) {
      return
    }

    window.__techpubAuthDebugFetchInstalled = true
    const originalFetch = window.fetch.bind(window)
    const originalPushState = window.history.pushState.bind(window.history)
    const originalReplaceState = window.history.replaceState.bind(window.history)

    const logNavigation = (label: string, value?: unknown) => {
      console.info(`[auth-debug] ${label}`, {
        value,
        pathname: window.location.pathname,
        href: window.location.href,
        referrer: document.referrer,
      })
    }

    window.history.pushState = (...args) => {
      logNavigation('history.pushState', args[2])
      return originalPushState(...args)
    }

    window.history.replaceState = (...args) => {
      logNavigation('history.replaceState', args[2])
      return originalReplaceState(...args)
    }

    window.addEventListener('popstate', () => logNavigation('popstate'))
    window.addEventListener('error', (event) => {
      console.error('[auth-debug] window error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      })
    })
    window.addEventListener('unhandledrejection', (event) => {
      console.error('[auth-debug] unhandled rejection', {
        reason:
          event.reason instanceof Error
            ? { message: event.reason.message, stack: event.reason.stack }
            : event.reason,
        href: window.location.href,
      })
    })

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
            const text = await clonedResponse.text()

            try {
              body = JSON.parse(text)
            } catch {
              body = text.slice(0, 500)
            }
          } catch (error) {
            body = error instanceof Error ? error.message : 'Unable to read response body'
          }

          console.info('[auth-debug] response', {
            ok: response.ok,
            status: response.status,
            redirected: response.redirected,
            url: response.url,
            body: sanitizeBody(body),
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

    console.info('[auth-debug] Payload admin browser logger installed', {
      href: window.location.href,
      referrer: document.referrer,
      userAgent: window.navigator.userAgent,
    })
  }, [])

  return null
}
