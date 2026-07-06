'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { API_URL } from '@/lib/api/config'

type State = 'loading' | 'success' | 'error' | 'missing-token'

export function UnsubscribeClient() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [state, setState] = useState<State>(() => (token ? 'loading' : 'missing-token'))
  const [message, setMessage] = useState(() => (token ? '' : 'No unsubscribe token provided.'))

  useEffect(() => {
    if (!token) return

    ;(async () => {
      try {
        const res = await fetch(`${API_URL}/api/newsletter/unsubscribe`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        })
        const data = await res.json().catch(() => ({}))

        if (res.ok) {
          setState('success')
          setMessage(data.message || 'You have been unsubscribed successfully.')
        } else {
          setState('error')
          setMessage(data.message || 'Something went wrong.')
        }
      } catch {
        setState('error')
        setMessage('Unable to reach the server. Please try again later.')
      }
    })()
  }, [token])

  return (
    <div className="w-full max-w-md rounded-lg border border-[var(--border-subtle)] bg-white p-8 shadow-sm">
      <h1 className="mb-4 text-2xl font-bold text-[color:var(--text-strong)]">
        {state === 'loading' ? 'Processing...' : 'Unsubscribe'}
      </h1>

      {state === 'loading' && (
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--border-subtle)] border-t-[var(--accent-red)]" />
          <p className="text-[color:var(--text-soft)]">Please wait...</p>
        </div>
      )}

      {state === 'success' && (
        <div className="space-y-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
            <i className="ri-check-line text-xl text-emerald-600" aria-hidden="true" />
          </div>
          <p className="text-[color:var(--text-soft)]">{message}</p>
        </div>
      )}

      {state === 'error' && (
        <div className="space-y-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-100">
            <i className="ri-alert-line text-xl text-rose-600" aria-hidden="true" />
          </div>
          <p className="text-[color:var(--text-soft)]">{message}</p>
        </div>
      )}

      {state === 'missing-token' && (
        <div className="space-y-3">
          <p className="text-[color:var(--text-soft)]">{message}</p>
          <p className="text-sm text-[color:var(--text-muted)]">
            Please use the unsubscribe link sent in your newsletter email.
          </p>
        </div>
      )}
    </div>
  )
}
