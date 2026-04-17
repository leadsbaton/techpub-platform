'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

import type { Post } from '@/lib/types/cms'
import { getPostHref } from '@/lib/utils/contentTypes'

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.NODE_ENV === 'production' ? 'https://techpub-platform.vercel.app' : 'http://localhost:3000')

function ShareIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
      <path
        d="M15.5 8.5a3 3 0 1 0-2.72-4.26L7.88 6.7a3 3 0 0 0 0 4.6l4.9 2.46a3 3 0 1 0 .9-1.8l-4.9-2.46a3.17 3.17 0 0 0 0-1l4.9-2.46A3 3 0 0 0 15.5 8.5Z"
        fill="currentColor"
      />
    </svg>
  )
}

export function PostShareBar({ post }: { post: Post }) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const ref = useRef<HTMLDivElement | null>(null)

  const shareData = useMemo(() => {
    const absoluteUrl = `${SITE_URL}${getPostHref(post)}`
    const encodedUrl = encodeURIComponent(absoluteUrl)
    const encodedTitle = encodeURIComponent(post.title)

    return {
      absoluteUrl,
      items: [
        {
          label: 'LinkedIn',
          href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
        },
        {
          label: 'Facebook',
          href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
        },
        {
          label: 'X',
          href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
        },
        {
          label: 'WhatsApp',
          href: `https://wa.me/?text=${encodeURIComponent(`${post.title} ${absoluteUrl}`)}`,
        },
        {
          label: 'Email',
          href: `mailto:?subject=${encodedTitle}&body=${encodedUrl}`,
        },
      ],
    }
  }, [post])

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  useEffect(() => {
    if (!copied) return
    const timeout = window.setTimeout(() => setCopied(false), 1800)
    return () => window.clearTimeout(timeout)
  }, [copied])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareData.absoluteUrl)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label="Share this post"
        onClick={() => setOpen((value) => !value)}
        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border-subtle)] bg-white text-[color:var(--text-strong)] transition hover:border-[var(--accent-red)] hover:text-[var(--accent-red)]"
      >
        <ShareIcon />
      </button>

      {open ? (
        <div className="absolute left-0 top-[calc(100%+10px)] z-40 min-w-[220px] rounded-[18px] border border-[var(--border-subtle)] bg-white p-3 shadow-[0_22px_48px_rgba(15,23,42,0.14)]">
          <div className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[color:var(--text-muted)]">
            Share this post
          </div>
          <div className="grid gap-1">
            {shareData.items.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl px-3 py-2 text-[14px] font-medium text-[color:var(--text-strong)] transition hover:bg-[var(--surface-muted)]"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <button
              type="button"
              onClick={handleCopy}
              className="rounded-xl px-3 py-2 text-left text-[14px] font-medium text-[color:var(--text-strong)] transition hover:bg-[var(--surface-muted)]"
            >
              {copied ? 'Link copied' : 'Copy link'}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
