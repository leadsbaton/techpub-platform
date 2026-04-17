import Image from 'next/image'
import Link from 'next/link'

import type { Post } from '@/lib/types/cms'
import { getPostHref } from '@/lib/utils/contentTypes'
import { formatDate, getAuthorNames, getCategoryName, getImageUrl } from '@/lib/utils/formatting'

export function WhitepaperCard({ post }: { post: Post }) {
  const href = getPostHref(post)
  const category = getCategoryName(post.primaryCategory)

  return (
    <article className="group overflow-hidden rounded-[28px] border border-[var(--border-subtle)] bg-white shadow-[var(--shadow-soft)]">
      <Link href={href} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-[var(--surface-muted)]">
          <Image
            src={getImageUrl(post.featuredImage)}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-black/70 via-black/15 to-transparent p-4">
            <span className="rounded-full bg-[var(--accent-red)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white">
              {category}
            </span>
            <span className="rounded-full border border-white/25 bg-white/12 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur">
              White Paper
            </span>
          </div>
        </div>
      </Link>
      <div className="space-y-3 p-5">
        <Link
          href={href}
          className="block text-[1.05rem] font-semibold leading-6 text-[color:var(--text-strong)] transition hover:text-[color:var(--accent-red)]"
        >
          {post.title}
        </Link>
        <p className="line-clamp-3 text-sm leading-6 text-[color:var(--text-soft)]">{post.excerpt}</p>
        <div className="text-xs leading-5 text-[color:var(--text-muted)]">
          By {getAuthorNames(post.authors)} on {formatDate(post.publishedAt)}
        </div>
      </div>
    </article>
  )
}
