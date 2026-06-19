'use client'

import Image, { type ImageProps } from 'next/image'
import { useState } from 'react'

import { FALLBACK_IMAGE } from '@/lib/utils/formatting'

export function SafeImage({ src, alt, onError, ...props }: ImageProps) {
  const [fallbackState, setFallbackState] = useState<{
    originalSrc: ImageProps['src']
    currentSrc: ImageProps['src']
  }>({
    originalSrc: src,
    currentSrc: src,
  })
  const currentSrc = fallbackState.originalSrc === src ? fallbackState.currentSrc : src

  return (
    <Image
      {...props}
      src={currentSrc}
      alt={alt}
      onError={(event) => {
        if (currentSrc !== FALLBACK_IMAGE) {
          setFallbackState({ originalSrc: src, currentSrc: FALLBACK_IMAGE })
        }
        onError?.(event)
      }}
    />
  )
}
