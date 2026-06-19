'use client'

import Image, { type ImageProps } from 'next/image'
import { useState } from 'react'

import { FALLBACK_IMAGE } from '@/lib/utils/formatting'

export function SafeImage({ src, alt, onError, ...props }: ImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src)

  return (
    <Image
      {...props}
      src={currentSrc}
      alt={alt}
      onError={(event) => {
        if (currentSrc !== FALLBACK_IMAGE) {
          setCurrentSrc(FALLBACK_IMAGE)
        }
        onError?.(event)
      }}
    />
  )
}
