'use client'

import { useState } from 'react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV === 'production' ? 'https://techpub-platform.onrender.com' : 'http://localhost:5000')

export function NewsletterForm({ submitLabel }: { submitLabel: string }) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setMessage(null)
    setSubmitting(true)

    try {
      const response = await fetch(`${API_URL}/api/newsletter/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          source: 'website-newsletter-panel',
        }),
      })

      const data = (await response.json()) as { message?: string }

      if (!response.ok) {
        setError(data.message || 'Unable to subscribe right now.')
        return
      }

      setMessage(data.message || 'Subscription saved successfully.')
      setEmail('')
    } catch {
      setError('Unable to reach the subscription service right now.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-xl">
      <form onSubmit={handleSubmit} className="flex w-full flex-col gap-3 md:flex-row">
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Work email"
          autoComplete="email"
          required
          className="min-w-0 flex-1 rounded-full border border-white/15 bg-white/10 px-5 py-3 text-white outline-none placeholder:text-slate-400"
        />
        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-amber-300 px-5 py-3 text-sm font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {submitting ? 'Submitting...' : submitLabel}
        </button>
      </form>
      {message ? <p className="mt-3 text-sm text-emerald-300">{message}</p> : null}
      {error ? <p className="mt-3 text-sm text-rose-300">{error}</p> : null}
    </div>
  )
}
