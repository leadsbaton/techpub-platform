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

export function WebinarRegistrationForm({ post }: { post: Post }) {
  const [form, setForm] = useState<FormState>(initialState)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const copy = useMemo(
    () => ({
      newsletterLabel:
        post.webinarRegistration?.newsletterLabel || 'Tick this box to receive our newsletter',
      consentLabel:
        post.webinarRegistration?.consentLabel ||
        'By requesting this resource, you agree to our terms of use. All data is protected by our Privacy Notice.',
      submitLabel: post.webinarRegistration?.submitLabel || 'SUBMIT',
    }),
    [post],
  )

  function updateField<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitting(true)
    setError(null)
    setMessage(null)
    try {
      const response = await fetch(`${API_URL}/api/webinar-registrations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId: post.id,
          ...form,
          sourceUrl: typeof window !== 'undefined' ? window.location.href : '',
        }),
      })
      const data = (await response.json()) as { message?: string; redirectUrl?: string | null }
      if (!response.ok) {
        setError(data.message || 'Unable to save your registration right now.')
        return
      }
      setMessage(data.message || 'Your registration has been saved successfully.')
      if (data.redirectUrl && typeof window !== 'undefined') {
        window.open(data.redirectUrl, '_blank', 'noopener,noreferrer')
      }
    } catch {
      setError('Unable to save your registration right now.')
    } finally {
      setSubmitting(false)
    }
  }

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
        <span>{copy.newsletterLabel}</span>
      </label>

      <label className="flex items-start gap-3 text-[16px] leading-[145%] text-[#3b3b3b]">
        <input
          type="checkbox"
          checked={form.consentAccepted}
          onChange={(event) => updateField('consentAccepted', event.target.checked)}
          required
          className="mt-1 h-4 w-4 rounded-none border border-[#9a9a9a]"
        />
        <span>{copy.consentLabel}</span>
      </label>

      <button
        type="submit"
        disabled={submitting}
        className="ml-[196px] inline-flex bg-[#FC0203] px-8 py-2 text-[20px] font-medium text-white disabled:opacity-70"
      >
        {submitting ? 'Submitting...' : copy.submitLabel}
      </button>

      {message ? <p className="text-sm text-emerald-700">{message}</p> : null}
      {error ? <p className="text-sm text-[var(--accent-red)]">{error}</p> : null}
    </form>
  )
}
