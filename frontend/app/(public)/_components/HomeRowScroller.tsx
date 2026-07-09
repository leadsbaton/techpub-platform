'use client'

import Link from 'next/link'
import { type ReactNode, useRef, useState } from 'react'

function ArrowIcon({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4 fill-none stroke-current stroke-[2.4]"
    >
      {direction === 'left' ? (
        <path d="M15 6 9 12l6 6" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d="m9 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
      )}
    </svg>
  )
}

export function HomeRowScroller({
  title,
  children,
  href,
  actionLabel = 'View all',
  className = '',
}: {
  title: string
  children: ReactNode
  href?: string
  actionLabel?: string
  className?: string
}) {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)

  function scrollByPage(direction: -1 | 1) {
    const scroller = scrollerRef.current
    if (!scroller) return
    setIsPaused(true)
    scroller.scrollBy({
      left: direction * Math.min(scroller.clientWidth * 0.86, 900),
      behavior: 'smooth',
    })
  }

  return (
    <section className={`site-container space-y-6 ${className}`}>
      <div className="flex items-center gap-4">
        <h2 className="ui-font text-[26px] font-semibold leading-tight text-[#111] md:text-[32px]">
          {title}
        </h2>
        {href ? (
          <Link
            href={href}
            className="ml-auto hidden border-b border-[#111] text-sm font-medium text-[#111] transition hover:border-[var(--accent-red)] hover:text-[var(--accent-red)] sm:inline-flex"
          >
            {actionLabel}
          </Link>
        ) : null}
        <div className={href ? 'flex gap-2' : 'ml-auto flex gap-2'}>
          <button
            type="button"
            aria-label={`Previous ${title}`}
            className="grid h-9 w-9 place-items-center rounded-full border border-[#d7d7d7] bg-white text-[#111] transition hover:border-[var(--accent-red)] hover:text-[var(--accent-red)]"
            onClick={() => scrollByPage(-1)}
          >
            <ArrowIcon direction="left" />
          </button>
          <button
            type="button"
            aria-label={`Next ${title}`}
            className="grid h-9 w-9 place-items-center rounded-full border border-[#d7d7d7] bg-white text-[#111] transition hover:border-[var(--accent-red)] hover:text-[var(--accent-red)]"
            onClick={() => scrollByPage(1)}
          >
            <ArrowIcon direction="right" />
          </button>
        </div>
      </div>

      <div
        ref={scrollerRef}
        className="no-scrollbar overflow-x-auto pb-3"
        data-paused={isPaused}
      >
        <div className="flex w-max gap-6">{children}</div>
      </div>
    </section>
  )
}
