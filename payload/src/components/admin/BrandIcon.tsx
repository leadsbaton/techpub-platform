import Image from 'next/image'
import React from 'react'

// Uses the square LB mark, not the full logo. The full lockup is 3584x2832 and
// carries the "LeadsBaton" wordmark plus a tagline — forced into a 2rem square it
// rendered as an illegible smudge sitting in a lot of dead space.
export function BrandIcon() {
  return (
    <Image
      alt="LeadsBaton"
      src="/leads-baton-mark.png"
      // Requested at 2x the display size so the mark stays sharp on retina screens.
      width={64}
      height={64}
      loading="eager"
      style={{ display: 'block', height: '2rem', objectFit: 'contain', width: '2rem' }}
    />
  )
}
