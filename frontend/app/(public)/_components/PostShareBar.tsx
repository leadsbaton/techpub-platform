import Link from 'next/link'

import type { Post } from '@/lib/types/cms'
import { getPostHref } from '@/lib/utils/contentTypes'

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.NODE_ENV === 'production' ? 'https://techpub-platform.vercel.app' : 'http://localhost:3000')

export function PostShareBar({ post }: { post: Post }) {
  const absoluteUrl = `${SITE_URL}${getPostHref(post)}`
  const encodedUrl = encodeURIComponent(absoluteUrl)
  const encodedTitle = encodeURIComponent(post.title)

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="ui-font text-[12px] font-semibold uppercase tracking-[0.12em] text-[#808080]">
        Share
      </span>
      <Link
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        rel="noreferrer"
        className="rounded-full border border-[var(--border-subtle)] px-4 py-2 text-[13px] font-medium text-[color:var(--text-strong)]"
      >
        LinkedIn
      </Link>
      <Link
        href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
        target="_blank"
        rel="noreferrer"
        className="rounded-full border border-[var(--border-subtle)] px-4 py-2 text-[13px] font-medium text-[color:var(--text-strong)]"
      >
        X
      </Link>
      <Link
        href={`mailto:?subject=${encodedTitle}&body=${encodedUrl}`}
        className="rounded-full border border-[var(--border-subtle)] px-4 py-2 text-[13px] font-medium text-[color:var(--text-strong)]"
      >
        Email
      </Link>
    </div>
  )
}
