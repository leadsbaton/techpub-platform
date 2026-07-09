'use client'

import { useLayoutEffect, useState } from 'react'

const CONSENT_KEY = 'tp_cookie_consent'
const GA_ID = process.env.NEXT_PUBLIC_GA_ID

type ConsentState = 'pending' | 'accepted' | 'declined'

declare global {
  interface Window {
    dataLayer: unknown[]
  }
}

function loadGA() {
  if (!GA_ID || typeof document === 'undefined') return
  if (document.getElementById('ga-script')) return

  const script = document.createElement('script')
  script.id = 'ga-script'
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
  script.async = true
  document.head.appendChild(script)

  window.dataLayer = window.dataLayer || []
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function gtag(...args: any[]) {
    window.dataLayer.push(args)
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(window as any).gtag = gtag
  gtag('js', new Date())
  gtag('config', GA_ID)
}

export function CookieConsent() {
  const [consent, setConsent] = useState<ConsentState | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  useLayoutEffect(() => {
    queueMicrotask(() => {
      const stored = localStorage.getItem(CONSENT_KEY) as ConsentState | null
      setConsent(stored ?? 'pending')
    })
  }, [])

  useLayoutEffect(() => {
    if (consent === 'accepted') {
      loadGA()
    }
  }, [consent])

  function acceptAll() {
    localStorage.setItem(CONSENT_KEY, 'accepted')
    setConsent('accepted')
    loadGA()
  }

  function decline() {
    localStorage.setItem(CONSENT_KEY, 'declined')
    setConsent('declined')
  }

  function reopenPreferences() {
    setConsent('pending')
    setShowDetails(true)
  }

  if (consent === null) {
    return null
  }

  if (consent !== 'pending') {
    return (
      <button
        type="button"
        onClick={reopenPreferences}
        className="fixed bottom-0 right-4 z-[60] rounded-t-md border border-b-0 border-gray-200 bg-white px-4 py-3 text-sm font-medium text-[#333] shadow-[0_-4px_20px_rgba(0,0,0,0.08)] transition-colors hover:text-[var(--accent-red)] sm:right-8"
      >
        Manage consent
      </button>
    )
  }

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed bottom-0 left-0 right-0 z-[60] border-t border-gray-200 bg-white px-4 py-5 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] sm:bottom-4 sm:left-auto sm:right-6 sm:max-w-sm sm:rounded-md sm:border"
    >
      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium text-[color:var(--text-strong)]">Your Privacy Matters</p>
          <p className="mt-1 text-sm text-[color:var(--text-soft)]">
            We use cookies to improve your browsing experience. Read our{' '}
            <a
              href="https://leadsbaton.com/privacy-policy/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-[var(--accent-red)]"
            >
              Privacy Statement
            </a>
            .
          </p>
        </div>

        {showDetails && (
          <div className="space-y-3 border-t border-[var(--border-subtle)] pt-3 text-xs text-[color:var(--text-muted)]">
            <p className="font-medium text-[color:var(--text-strong)]">Consent Categories</p>
            <ul className="space-y-2">
              <li>
                <label className="flex gap-2">
                  <input
                    type="checkbox"
                    defaultChecked
                    disabled
                    className="h-4 w-4"
                    aria-label="Functional cookies"
                  />
                  <span>Functional (required for site operation)</span>
                </label>
              </li>
              <li>
                <label className="flex gap-2">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="h-4 w-4"
                    aria-label="Analytics cookies"
                  />
                  <span>Analytics & Performance</span>
                </label>
              </li>
              <li>
                <label className="flex gap-2">
                  <input type="checkbox" className="h-4 w-4" aria-label="Marketing cookies" />
                  <span>Marketing & Third-party</span>
                </label>
              </li>
            </ul>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <button
            onClick={acceptAll}
            className="rounded-full bg-[var(--accent-red)] px-4 py-2 text-sm font-semibold text-white transition-colors hover:opacity-90"
          >
            Accept All
          </button>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-[color:var(--text-strong)] transition-colors hover:bg-gray-50"
          >
            {showDetails ? 'Hide' : 'Manage consent'}
          </button>
          <button
            onClick={decline}
            className="rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-[color:var(--text-soft)] transition-colors hover:bg-gray-50"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  )
}
