import Image from 'next/image'
import Link from 'next/link'

import type { Post } from '@/lib/types/cms'
import { getPostHref } from '@/lib/utils/contentTypes'
import { formatDate, getAuthorNames, getCategoryName, getImageUrl } from '@/lib/utils/formatting'

export function HomeOverlayCard({
  post,
  variant = 'default',
}: {
  post: Post
  variant?: 'default' | 'compact' | 'webinar'
}) {
  const href = getPostHref(post)
  const isCompact = variant === 'compact'
  const isWebinar = variant === 'webinar'
  const actionLabel =
    post.type === 'webinar' ? 'Join' : post.type === 'whitepaper' ? 'Download' : 'Read'

  if (!isCompact && !isWebinar) {
    return (
      <article className="flex h-full flex-col rounded-[18px] bg-white shadow-[var(--shadow-soft)]">
        <Link href={href} className="group block overflow-hidden rounded-t-[18px]">
          <div className="relative aspect-[1/0.78] overflow-hidden bg-[color:var(--surface-alt)]">
            <Image
              src={getImageUrl(post.featuredImage)}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            />
            <div className="absolute right-4 top-4">
              <span className="inline-flex rounded-[4px] bg-[var(--accent-red)] px-2 py-1 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-white shadow-sm">
                {getCategoryName(post.primaryCategory)}
              </span>
            </div>
          </div>
        </Link>

        <div className="flex flex-1 flex-col gap-4 p-4">
          <Link
            href={href}
            className="text-[1.05rem] font-semibold leading-7 text-[color:var(--text-strong)] transition hover:text-[color:var(--accent-red)]"
          >
            {post.title}
          </Link>

          <div className="mt-auto flex flex-wrap items-center justify-between gap-3">
            <Link
              href={href}
              className="inline-flex min-w-[108px] items-center justify-center rounded-[12px] bg-[var(--accent-red)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--accent-red-dark)]"
            >
              {actionLabel}
            </Link>

            <div className="text-right text-sm text-[color:var(--text-muted)]">
              <div className="font-medium text-[color:var(--text-strong)]">
                {getAuthorNames(post.authors)}
              </div>
              <div>{post.readingTime ? `${post.readingTime} mins` : formatDate(post.publishedAt)}</div>
            </div>
          </div>
        </div>
      </article>
    )
  }

  return (
    <Link href={href} className="group block overflow-hidden rounded-[16px]">
      <article
        className={`relative overflow-hidden rounded-[16px] bg-black ${
          isCompact ? 'aspect-[0.95/1]' : 'aspect-[1.2/1]'
        }`}
      >
        <Image
          src={getImageUrl(post.featuredImage)}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />
        <div className="absolute right-3 top-3">
          <span
            className={`inline-flex rounded-[4px] px-2 py-1 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-white ${
              isWebinar ? 'bg-emerald-600' : 'bg-[#2339d7]'
            }`}
          >
            {getCategoryName(post.primaryCategory)}
          </span>
        </div>
        <div className="absolute inset-x-0 bottom-0 p-4 text-white">
          <h3
            className={`mt-3 line-clamp-3 font-medium ${
              isCompact ? 'text-[0.98rem] leading-5' : 'text-[1.1rem] leading-6'
            }`}
          >
            {post.title}
          </h3>
          <div className="mt-3 text-xs text-white/80">
            {isWebinar
              ? `${getCategoryName(post.primaryCategory)} - ${formatDate(post.publishedAt)}`
              : formatDate(post.publishedAt)}
          </div>
        </div>
      </article>
    </Link>
  )
}
