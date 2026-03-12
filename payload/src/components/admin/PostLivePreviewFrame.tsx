'use client'

import { useFormFields } from '@payloadcms/ui'
import type { UIFieldClientComponent } from 'payload'
import React from 'react'

const frontendURL = process.env.NEXT_PUBLIC_SITE_URL || process.env.FRONTEND_URL || 'http://localhost:3000'

type FormFieldState = {
  value?: unknown
}

function readValue<T>(fields: Record<string, FormFieldState>, path: string): T | undefined {
  return fields[path]?.value as T | undefined
}

function slugify(value?: string) {
  if (!value) {
    return ''
  }

  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function getRelationId(value: unknown): string | undefined {
  if (typeof value === 'string') {
    return value
  }

  if (value && typeof value === 'object' && 'id' in value) {
    const id = (value as { id?: unknown }).id
    return typeof id === 'string' ? id : undefined
  }

  return undefined
}

function getTypeKey(fields: Record<string, FormFieldState>) {
  const syncedType = readValue<string>(fields, 'type')
  if (syncedType) {
    return syncedType
  }

  const contentType = readValue<unknown>(fields, 'contentType')
  if (contentType && typeof contentType === 'object' && 'key' in contentType) {
    return String((contentType as { key?: unknown }).key || 'insight')
  }

  return undefined
}

export const PostLivePreviewFrame: UIFieldClientComponent = () => {
  const fields = useFormFields(([formFields]) => formFields) as Record<string, FormFieldState>

  const title = readValue<string>(fields, 'title') || ''
  const excerpt = readValue<string>(fields, 'excerpt') || ''
  const status = readValue<string>(fields, 'status') || 'draft'
  const slug = readValue<string>(fields, 'slug') || slugify(title)
  const type = getTypeKey(fields)
  const contentTypeId = getRelationId(readValue<unknown>(fields, 'contentType'))

  const params = new URLSearchParams()
  if (slug) params.set('slug', slug)
  if (type) params.set('type', type)
  if (contentTypeId) params.set('contentTypeId', contentTypeId)
  if (title) params.set('title', title)
  if (excerpt) params.set('excerpt', excerpt)
  if (status) params.set('status', status)

  const src = `${frontendURL}/preview/post?${params.toString()}`

  return (
    <div
      style={{
        background: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: '24px',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          alignItems: 'center',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          padding: '0.9rem 1rem',
        }}
      >
        <div>
          <div style={{ color: '#0f172a', fontSize: '0.95rem', fontWeight: 700 }}>Post Preview</div>
          <div style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '0.2rem' }}>
            Uses the same frontend preview route as the public post page.
          </div>
        </div>
        <a
          href={src}
          target="_blank"
          rel="noreferrer"
          style={{
            background: '#0f172a',
            borderRadius: '999px',
            color: '#fff',
            fontSize: '0.8rem',
            fontWeight: 600,
            padding: '0.55rem 0.9rem',
            textDecoration: 'none',
          }}
        >
          Open full preview
        </a>
      </div>
      <iframe
        key={src}
        src={src}
        title="Post live preview"
        style={{
          background: '#fff',
          border: 0,
          display: 'block',
          height: '820px',
          width: '100%',
        }}
      />
    </div>
  )
}
