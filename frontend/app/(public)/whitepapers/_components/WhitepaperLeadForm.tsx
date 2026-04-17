'use client'

import { useMemo, useState } from 'react'

import type { Post } from '@/lib/types/cms'

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === 'production'
    ? 'https://techpub-platform.onrender.com'
    : 'http://localhost:5000')

type FormState = {
  name: string
  email: string
  jobTitle: string
  company: string
  country: string
  newsletterOptIn: boolean
  consentAccepted: boolean
}

const initialState: FormState = {
  name: '',
  email: '',
  jobTitle: '',
  company: '',
  country: '',
  newsletterOptIn: false,
  consentAccepted: false,
}

type DeliveryResponse = {
  mode: 'read' | 'download' | 'redirect'
  url: string
  openInNewTab?: boolean
}

export function WhitepaperLeadForm({ post }: { post: Post }) {
  const [form, setForm] = useState<FormState>(initialState)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [delivery, setDelivery] = useState<DeliveryResponse | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const formCopy = useMemo(
    () => ({
      title: post.leadCapture?.formTitle || 'Access this white paper',
      description:
        post.leadCapture?.formDescription ||
        'Complete the form and continue to the CMS-configured destination.',
      submitLabel: post.leadCapture?.submitLabel || 'Submit and continue',
      newsletterLabel:
        post.leadCapture?.newsletterLabel || 'Tick this box to receive our newsletter.',
      consentLabel:
        post.leadCapture?.consentLabel ||
        'By requesting this resource, you agree to our terms of use and privacy notice.',
    }),
    [post],
  )

  function updateField<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  function openDelivery(target: DeliveryResponse) {
    if (typeof window === 'undefined') return

    if (target.openInNewTab === false) {
      window.location.assign(target.url)
      return
    }

    window.open(target.url, '_blank', 'noopener,noreferrer')
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitting(true)
    setError(null)
    setMessage(null)

    try {
      const response = await fetch(`${API_URL}/api/whitepaper-leads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId: post.id,
          ...form,
          sourceUrl: typeof window !== 'undefined' ? window.location.href : '',
        }),
      })

      const data = (await response.json()) as {
        message?: string
        delivery?: DeliveryResponse
      }

      if (!response.ok) {
        setError(data.message || 'Unable to save your request right now.')
        return
      }

      setMessage(data.message || post.leadCapture?.successMessage || 'Request saved successfully.')
      setDelivery(data.delivery || null)

      if (data.delivery?.url) {
        openDelivery(data.delivery)
      }
    } catch {
      setError('Unable to save your request right now.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="rounded-[28px] border border-[var(--border-subtle)] bg-white p-6 shadow-[var(--shadow-soft)] md:p-7">
      <div className="space-y-3">
        <h2 className="text-2xl font-semibold tracking-tight text-[color:var(--text-strong)]">
          {formCopy.title}
        </h2>
        <p className="text-sm leading-6 text-[color:var(--text-soft)]">{formCopy.description}</p>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm text-[color:var(--text-soft)]">
            <span>Name</span>
            <input
              type="text"
              value={form.name}
              onChange={(event) => updateField('name', event.target.value)}
              required
              className="w-full rounded-2xl border border-[var(--border-subtle)] px-4 py-3 outline-none"
            />
          </label>
          <label className="space-y-2 text-sm text-[color:var(--text-soft)]">
            <span>Email</span>
            <input
              type="email"
              value={form.email}
              onChange={(event) => updateField('email', event.target.value)}
              required
              className="w-full rounded-2xl border border-[var(--border-subtle)] px-4 py-3 outline-none"
            />
          </label>
          <label className="space-y-2 text-sm text-[color:var(--text-soft)]">
            <span>Job Title</span>
            <input
              type="text"
              value={form.jobTitle}
              onChange={(event) => updateField('jobTitle', event.target.value)}
              required
              className="w-full rounded-2xl border border-[var(--border-subtle)] px-4 py-3 outline-none"
            />
          </label>
          <label className="space-y-2 text-sm text-[color:var(--text-soft)]">
            <span>Company</span>
            <input
              type="text"
              value={form.company}
              onChange={(event) => updateField('company', event.target.value)}
              required
              className="w-full rounded-2xl border border-[var(--border-subtle)] px-4 py-3 outline-none"
            />
          </label>
          <label className="space-y-2 text-sm text-[color:var(--text-soft)] md:col-span-2">
            <span>Country</span>
            <input
              type="text"
              value={form.country}
              onChange={(event) => updateField('country', event.target.value)}
              required
              className="w-full rounded-2xl border border-[var(--border-subtle)] px-4 py-3 outline-none"
            />
          </label>
        </div>

        <label className="flex items-start gap-3 rounded-2xl bg-[var(--surface)] px-4 py-3 text-sm text-[color:var(--text-soft)]">
          <input
            type="checkbox"
            checked={form.newsletterOptIn}
            onChange={(event) => updateField('newsletterOptIn', event.target.checked)}
            className="mt-1"
          />
          <span>{formCopy.newsletterLabel}</span>
        </label>

        <label className="flex items-start gap-3 rounded-2xl bg-[var(--surface)] px-4 py-3 text-sm text-[color:var(--text-soft)]">
          <input
            type="checkbox"
            checked={form.consentAccepted}
            onChange={(event) => updateField('consentAccepted', event.target.checked)}
            required
            className="mt-1"
          />
          <span>{formCopy.consentLabel}</span>
        </label>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-full bg-[var(--accent-red)] px-6 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? 'Submitting...' : formCopy.submitLabel}
          </button>
          {delivery?.url ? (
            <button
              type="button"
              onClick={() => openDelivery(delivery)}
              className="rounded-full border border-[var(--border-subtle)] px-6 py-3 text-sm font-semibold text-[color:var(--text-strong)]"
            >
              Open resource
            </button>
          ) : null}
        </div>

        {message ? <p className="text-sm text-emerald-700">{message}</p> : null}
        {error ? <p className="text-sm text-[var(--accent-red)]">{error}</p> : null}
      </form>
    </div>
  )
}
