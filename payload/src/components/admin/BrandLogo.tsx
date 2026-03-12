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
      <div
        style={{
          alignItems: 'center',
          background: 'linear-gradient(135deg, #0f172a, #2563eb)',
          borderRadius: '0.9rem',
          color: '#fff',
          display: 'inline-flex',
          fontSize: '1rem',
          fontWeight: 700,
          height: '2.5rem',
          justifyContent: 'center',
          letterSpacing: '0.08em',
          width: '2.5rem',
        }}
      >
        TP
      </div>
      <div style={{ lineHeight: 1.1 }}>
        <div style={{ color: '#0f172a', fontSize: '1rem', fontWeight: 700 }}>TechPub CMS</div>
        <div style={{ color: '#475569', fontSize: '0.8rem' }}>Editorial control panel</div>
      </div>
    </div>
  )
}
