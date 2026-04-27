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

function getTypeKey(fields: Record<string, FormFieldState>) {
  const syncedType = readValue<string>(fields, 'type')
  if (syncedType) return syncedType

  const contentType = readValue<unknown>(fields, 'contentType')
  if (contentType && typeof contentType === 'object' && 'key' in contentType) {
    return String((contentType as { key?: unknown }).key || 'insight')
  }

  return 'insight'
}

function Frame({
  children,
  title,
  note,
}: {
  children: React.ReactNode
  title: string
  note: string
}) {
  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #e2e8f0',
        borderRadius: '24px',
        padding: '1rem',
      }}
    >
      <div style={{ color: '#0f172a', fontSize: '0.95rem', fontWeight: 700 }}>{title}</div>
      <div style={{ color: '#64748b', fontSize: '0.82rem', lineHeight: 1.5, marginTop: '0.35rem' }}>{note}</div>
      <div
        style={{
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '18px',
          marginTop: '0.9rem',
          padding: '1rem',
        }}
      >
        {children}
      </div>
    </div>
  )
}

function Bar({ width = '100%', height = 14 }: { width?: string; height?: number }) {
  return (
    <div
      style={{
        background: '#cbd5e1',
        borderRadius: '999px',
        height,
        width,
      }}
    />
  )
}

function Block({ height = 120 }: { height?: number }) {
  return (
    <div
      style={{
        background: '#dbeafe',
        borderRadius: '16px',
        height,
        width: '100%',
      }}
    />
  )
}

function InsightTemplate() {
  return (
    <div style={{ display: 'grid', gap: '1rem' }}>
      <Block height={140} />
      <Bar width="82%" height={18} />
      <Bar width="100%" />
      <Bar width="100%" />
      <Bar width="88%" />
      <div style={{ display: 'grid', gap: '0.6rem' }}>
        <Bar width="94%" />
        <Bar width="90%" />
        <Bar width="85%" />
      </div>
    </div>
  )
}

function WhitepaperTemplate() {
  return (
    <div style={{ display: 'grid', gap: '1rem' }}>
      <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '140px 1fr' }}>
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          <Block height={170} />
          <div style={{ background: '#ef4444', borderRadius: '12px', height: 38 }} />
        </div>
        <div style={{ display: 'grid', gap: '0.7rem' }}>
          <Bar width="80%" height={18} />
          <Bar width="100%" />
          <Bar width="96%" />
          <Bar width="90%" />
          <div style={{ background: '#fee2e2', borderRadius: '999px', height: 22, width: 120 }} />
        </div>
      </div>
      <div style={{ display: 'grid', justifyItems: 'center' }}>
        <div style={{ background: '#ef4444', borderRadius: '999px', height: 14, width: 120 }} />
      </div>
    </div>
  )
}

function WebinarTemplate() {
  return (
    <div style={{ display: 'grid', gap: '1rem' }}>
      <Block height={110} />
      <Block height={90} />
      <div style={{ display: 'grid', justifyItems: 'center' }}>
        <div style={{ background: '#ef4444', borderRadius: '12px', height: 42, width: 170 }} />
      </div>
      <div style={{ display: 'grid', gap: '0.6rem' }}>
        <Bar width="95%" />
        <Bar width="100%" />
        <Bar width="92%" />
      </div>
      <div style={{ display: 'grid', gap: '0.8rem', gridTemplateColumns: '1fr 120px' }}>
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          <div style={{ color: '#5b5bd6', fontSize: '0.78rem', fontWeight: 800 }}>SPEAKERS</div>
          <div style={{ display: 'grid', gap: '0.8rem', gridTemplateColumns: 'repeat(3, 1fr)' }}>
            {[0, 1, 2].map((key) => (
              <div key={key} style={{ display: 'grid', justifyItems: 'center', gap: '0.5rem' }}>
                <div style={{ background: '#d1d5db', borderRadius: '999px', height: 54, width: 54 }} />
                <Bar width="90%" height={10} />
                <Bar width="70%" height={8} />
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: 'grid', justifyItems: 'center', gap: '0.5rem' }}>
          <div style={{ color: '#7c7cb6', fontSize: '0.78rem', fontWeight: 800 }}>MODERATOR</div>
          <div style={{ background: '#d1d5db', borderRadius: '999px', height: 54, width: 54 }} />
          <Bar width="90%" height={10} />
          <Bar width="70%" height={8} />
        </div>
      </div>
    </div>
  )
}

export const PostTypeTemplatePreview: UIFieldClientComponent = () => {
  const fields = useFormFields(([formFields]) => formFields) as Record<string, FormFieldState>
  const type = getTypeKey(fields)

  if (type === 'webinar') {
    return (
      <Frame
        title="Webinar template"
        note="Fill wide banner image, optional second banner, CTA label, rich text content, and speaker profiles. The last selected speaker becomes the moderator."
      >
        <WebinarTemplate />
      </Frame>
    )
  }

  if (type === 'whitepaper') {
    return (
      <Frame
        title="White paper template"
        note="Fill cover image, summary text, CTA delivery settings, and rich text body. This template opens a form page before continuing to read or download."
      >
        <WhitepaperTemplate />
      </Frame>
    )
  }

  return (
    <Frame
      title="Insight template"
      note="Fill hero image, title, summary, and rich text body. This template is the long-form article layout with the favorite rail on the right."
    >
      <InsightTemplate />
    </Frame>
  )
}
