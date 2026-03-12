'use client'

import { useFormFields } from '@payloadcms/ui'
import type { UIFieldClientComponent } from 'payload'
import React from 'react'

function readValue<T>(fields: Record<string, { value?: unknown }>, path: string): T | undefined {
  return fields[path]?.value as T | undefined
}

function formatType(type?: string) {
  switch (type) {
    case 'whitepaper':
      return 'White Paper'
    case 'webinar':
      return 'Webinar'
    case 'case-study':
      return 'Case Study'
    default:
      return 'Insight'
  }
}

function formatStatus(status?: string) {
  switch (status) {
    case 'published':
      return 'Published'
    case 'archived':
      return 'Archived'
    default:
      return 'Draft'
  }
}

function formatCategory(category: unknown) {
  if (!category) {
    return 'No category selected'
  }

  if (typeof category === 'string') {
    return category
  }

  if (typeof category === 'object' && category !== null && 'name' in category) {
    return String((category as { name?: unknown }).name || 'Selected category')
  }

  return 'Selected category'
}

export const PostDraftPreview: UIFieldClientComponent = () => {
  const fields = useFormFields(([formFields]) => formFields) as Record<string, { value?: unknown }>

  const title = readValue<string>(fields, 'title') || 'Untitled post'
  const slug = readValue<string>(fields, 'slug') || 'auto-generated-slug'
  const excerpt = readValue<string>(fields, 'excerpt') || 'Add an excerpt to preview the summary shown on cards and detail pages.'
  const type = readValue<string>(fields, 'type')
  const status = readValue<string>(fields, 'status')
  const category = readValue<unknown>(fields, 'primaryCategory')
  const readingTime = readValue<number>(fields, 'readingTime')

  return (
    <div
      style={{
        background: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: '24px',
        marginBottom: '1rem',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          background: 'linear-gradient(135deg, #0f172a, #1e293b)',
          color: '#fff',
          padding: '1rem 1.25rem',
        }}
      >
        <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.14em', opacity: 0.75, textTransform: 'uppercase' }}>
          Draft Preview
        </div>
        <div style={{ fontSize: '1.35rem', fontWeight: 700, marginTop: '0.5rem' }}>{title}</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.75rem' }}>
          {[formatType(type), formatStatus(status), formatCategory(category)]
            .filter(Boolean)
            .map((item) => (
              <span
                key={item}
                style={{
                  background: 'rgba(255,255,255,0.12)',
                  borderRadius: '999px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  padding: '0.35rem 0.7rem',
                }}
              >
                {item}
              </span>
            ))}
        </div>
      </div>

      <div style={{ padding: '1.25rem' }}>
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '20px',
            boxShadow: '0 8px 24px rgba(15, 23, 42, 0.06)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              alignItems: 'center',
              background: 'linear-gradient(135deg, #cbd5e1, #e2e8f0)',
              color: '#475569',
              display: 'flex',
              fontSize: '0.85rem',
              height: '180px',
              justifyContent: 'center',
            }}
          >
            Featured image preview area
          </div>
          <div style={{ padding: '1.25rem' }}>
            <div style={{ color: '#64748b', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
              /{type === 'case-study' ? 'case-studies' : `${type || 'insight'}s`}/{slug}
            </div>
            <div style={{ color: '#0f172a', fontSize: '1.2rem', fontWeight: 700, lineHeight: 1.3, marginTop: '0.5rem' }}>
              {title}
            </div>
            <div style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.7, marginTop: '0.75rem' }}>{excerpt}</div>
            <div style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '1rem' }}>
              {readingTime ? `${readingTime} min read` : 'Reading time not set'}
            </div>
          </div>
        </div>
        <p style={{ color: '#64748b', fontSize: '0.8rem', margin: '0.9rem 0 0' }}>
          This panel reflects the current form values. Use Payload preview/live preview after the first save to open the real frontend page layout.
        </p>
      </div>
    </div>
  )
}
