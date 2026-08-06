import Image from 'next/image'
import React from 'react'

// The login screen and nav header lockup: square LB mark + wordmark set in text.
// The mark is a crop of the full logo — the original lockup already contains the
// word "LeadsBaton" and a tagline, so rendering it next to this text duplicated
// the wordmark and shrank the mark to the point of being unreadable.
export function BrandLogo() {
  return (
    <div
      style={{
        alignItems: 'center',
        display: 'inline-flex',
        gap: '0.75rem',
      }}
    >
      <Image
        alt="LeadsBaton"
        src="/leads-baton-mark.png"
        // Requested at 2x the display size so the mark stays sharp on retina screens.
        width={96}
        height={96}
        loading="eager"
        style={{ display: 'block', height: '3rem', objectFit: 'contain', width: '3rem' }}
      />
      <div style={{ lineHeight: 1.1 }}>
        <div style={{ color: '#0f172a', fontSize: '1rem', fontWeight: 700 }}>LeadsBaton CMS</div>
        <div style={{ color: '#475569', fontSize: '0.8rem' }}>Editorial control panel</div>
      </div>
    </div>
  )
}
