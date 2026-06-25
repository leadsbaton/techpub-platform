'use client'

import { useMemo, useState } from 'react'

import type { Post } from '@/lib/types/cms'
import { API_URL } from '@/lib/api/config'

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

type LeadResponse = {
  message?: string
  delivery?: DeliveryResponse
}

// Safely parse a response body that may not be JSON (e.g. a 502/504 HTML page
// from the host, or an empty body). Never throws — returns {} when the body
// isn't valid JSON so the caller can branch on response.ok instead.
async function parseJsonSafe(response: Response): Promise<LeadResponse> {
  const text = await response.text()
  if (!text) return {}
  try {
    return JSON.parse(text) as LeadResponse
  } catch {
    return {}
  }
}

export function WhitepaperLeadForm({ post, variant = 'default' }: { post: Post; variant?: 'default' | 'figma' }) {
  const [form, setForm] = useState<FormState>(initialState)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [delivery, setDelivery] = useState<DeliveryResponse | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

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

    if (target.mode === 'download') {
      const link = document.createElement('a')
      link.href = target.url
      link.rel = 'noopener noreferrer'
      if (target.openInNewTab !== false) {
        link.target = '_blank'
      }
      link.download = target.url.split('/').pop() || 'resource'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      return
    }

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

      const data = await parseJsonSafe(response)

      if (!response.ok) {
        setError(data.message || 'Unable to save your request right now.')
        return
      }

      setMessage(data.message || post.leadCapture?.successMessage || 'Request saved successfully.')
      setDelivery(data.delivery || null)
      setForm(initialState)
      setSubmitted(true)
      if (data.delivery?.url) {
        openDelivery(data.delivery)
      }
    } catch {
      setError('Unable to save your request right now.')
    } finally {
      setSubmitting(false)
    }
  }

  const successScreen = (
    <div className="ui-font space-y-6 rounded-[8px] border border-[#d1fae5] bg-[#f0fdf4] px-6 py-8 text-[#020202]">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#16a34a]">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <h3 className="text-[20px] font-semibold text-[#15803d]">Request submitted!</h3>
      </div>
      <p className="text-[16px] leading-[1.6] text-[#166534]">
        {message || 'Your request has been saved successfully.'}
      </p>
      {delivery?.url ? (
        <button
          type="button"
          onClick={() => openDelivery(delivery)}
          className="inline-flex bg-[#FC0203] px-8 py-3 text-[16px] font-medium text-white"
        >
          {delivery.mode === 'download' ? 'Download White Paper' : 'Open resource'}
        </button>
      ) : null}
    </div>
  )

  if (submitted) return successScreen

  if (variant === 'figma') {
    return (
      <form onSubmit={handleSubmit} className="ui-font space-y-4 text-[#020202]">
        <div className="grid gap-3">
          {[
            { label: 'Name', key: 'name' as const, type: 'text' },
            { label: 'Email', key: 'email' as const, type: 'email' },
            { label: 'Job Title', key: 'jobTitle' as const, type: 'text' },
            { label: 'Company', key: 'company' as const, type: 'text' },
            { label: 'Country', key: 'country' as const, type: 'text' },
          ].map((field) => (
            <label key={field.key} className="grid grid-cols-[88px_1fr] items-center gap-4 text-[16px]">
              <span>{field.label}</span>
              <input
                type={field.type}
                value={form[field.key]}
                onChange={(event) => updateField(field.key, event.target.value)}
                required
                className="h-[30px] border border-[#8f8f8f] px-3 outline-none"
              />
            </label>
          ))}
        </div>

        <label className="flex items-start gap-3 text-[16px] text-[#3b3b3b]">
          <input
            type="checkbox"
            checked={form.newsletterOptIn}
            onChange={(event) => updateField('newsletterOptIn', event.target.checked)}
            className="mt-1 h-4 w-4 rounded-none border border-[#9a9a9a]"
          />
          <span>{formCopy.newsletterLabel}</span>
        </label>

        <label className="flex items-start gap-3 text-[16px] leading-[145%] text-[#3b3b3b]">
          <input
            type="checkbox"
            checked={form.consentAccepted}
            onChange={(event) => updateField('consentAccepted', event.target.checked)}
            required
            className="mt-1 h-4 w-4 rounded-none border border-[#9a9a9a]"
          />
          <span>{formCopy.consentLabel}</span>
        </label>

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex bg-[#FC0203] px-8 py-2 text-[20px] font-medium text-white disabled:opacity-70 sm:ml-[196px]"
        >
          {submitting ? 'Submitting...' : formCopy.submitLabel}
        </button>

        {error ? <p className="text-sm text-[var(--accent-red)]">{error}</p> : null}
      </form>
    )
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
        </div>
        {error ? <p className="text-sm text-[var(--accent-red)]">{error}</p> : null}
      </form>
    </div>
  )
}
