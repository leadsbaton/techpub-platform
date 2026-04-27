import Image from 'next/image'
import React from 'react'

export function BrandIcon() {
  return (
    <Image
      alt="LeadsBaton"
      src="/leads-baton-logo.png"
      width={32}
      height={32}
      loading="eager"
      style={{ display: 'block', height: '2rem', objectFit: 'contain', width: '2rem' }}
    />
  )
}
