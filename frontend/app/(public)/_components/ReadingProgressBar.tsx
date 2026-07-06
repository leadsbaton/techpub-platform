'use client'

import { useEffect, useState } from 'react'

export function ReadingProgressBar() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    function handleScroll() {
      const docEl = document.documentElement
      const scrollTop = docEl.scrollTop || document.body.scrollTop
      const scrollHeight = docEl.scrollHeight - docEl.clientHeight
      const percent = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0
      setProgress(percent)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div
      className="fixed top-0 left-0 z-[70] h-[3px] bg-[var(--accent-red)] transition-[width] duration-100 ease-out"
      style={{ width: `${progress}%` }}
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Reading progress"
    />
  )
}
