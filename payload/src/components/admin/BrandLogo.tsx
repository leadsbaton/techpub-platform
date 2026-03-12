import Image from 'next/image'
import React from 'react'

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
        src="/leads-baton-logo.png"
        width={48}
        height={48}
        style={{ display: 'block', height: '3rem', objectFit: 'contain', width: '3rem' }}
      />
      <div style={{ lineHeight: 1.1 }}>
        <div style={{ color: '#0f172a', fontSize: '1rem', fontWeight: 700 }}>LeadsBaton CMS</div>
        <div style={{ color: '#475569', fontSize: '0.8rem' }}>Editorial control panel</div>
      </div>
    </div>
  )
}
