'use client'

import { useFormFields } from '@payloadcms/ui'
import type { UIFieldClientComponent } from 'payload'
import React from 'react'

type FormFieldState = {
  value?: unknown
}

function readValue<T>(fields: Record<string, FormFieldState>, path: string): T | undefined {
  return fields[path]?.value as T | undefined
}

const guideByType = {
  insight: {
    label: 'Insight',
    route: '/insights/[slug]',
    checklist: [
      'Use a strong headline, excerpt, featured image, and full rich-text body.',
      'Choose the main category carefully because it drives listing filters and category hubs.',
      'Add SEO title, description, and share image before publishing.',
    ],
    previewNotes: 'The frontend shows a hero image, title, long-form content, and a favorite rail.',
  },
  whitepaper: {
    label: 'White Paper',
    route: '/whitepapers/[slug]',
    checklist: [
      'Set featured image, excerpt, authors, and a primary category.',
      'Configure the access form, success message, delivery mode, and either a download asset or external/delivery URL.',
      'Review the access page copy because users see this before opening the resource.',
    ],
    previewNotes: 'The frontend uses a dedicated preview page plus a separate gated form/access page. Form entries are saved in the shared submissions collection.',
  },
  webinar: {
    label: 'Webinar',
    route: '/webinars/[slug]',
    checklist: [
      'Set featured image, optional second banner, event date label, CTA label, summary, and agenda points.',
      'Add speakers and moderator details if they should appear on the detail page.',
      'Use either an external registration URL or a video URL for the final destination. Webinar form entries are saved in the shared submissions collection.',
    ],
    previewNotes: 'The frontend uses a banner-style webinar detail page plus a separate registration form page.',
  },
} as const

export const PostAuthoringGuide: UIFieldClientComponent = () => {
  const fields = useFormFields(([formFields]) => formFields) as Record<string, FormFieldState>
  const type = (readValue<string>(fields, 'type') || 'insight') as keyof typeof guideByType
  const title = readValue<string>(fields, 'title') || 'Untitled post'
  const activeGuide = guideByType[type] || guideByType.insight

  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #e2e8f0',
        borderRadius: '24px',
        padding: '1.2rem',
      }}
    >
      <div style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
        Authoring Guide
      </div>
      <h3 style={{ color: '#0f172a', fontSize: '1.2rem', fontWeight: 800, margin: '0.45rem 0 0' }}>
        {activeGuide.label} preview for “{title}”
      </h3>
      <p style={{ color: '#475569', fontSize: '0.92rem', lineHeight: 1.6, margin: '0.75rem 0 0' }}>
        Public route: <strong>{activeGuide.route}</strong>. {activeGuide.previewNotes}
      </p>

      <div
        style={{
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '18px',
          marginTop: '1rem',
          padding: '1rem',
        }}
      >
        <div style={{ color: '#0f172a', fontSize: '0.92rem', fontWeight: 700 }}>Before publishing</div>
        <ul style={{ color: '#475569', lineHeight: 1.8, margin: '0.6rem 0 0', paddingLeft: '1.2rem' }}>
          {activeGuide.checklist.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
