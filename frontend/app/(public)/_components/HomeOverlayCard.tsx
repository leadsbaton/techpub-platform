import Link from 'next/link'

import type { Post } from '@/lib/types/cms'
import { getPostHref } from '@/lib/utils/contentTypes'
import {
  formatDate,
  formatShortDate,
  getAuthorNames,
  getCategoryAccent,
  getCategoryName,
  getPostCardButtonLabel,
  getPostCardImageClass,
  getPostCardImageUrl,
} from '@/lib/utils/formatting'
import { HomeVerticalBadge } from './HomeVerticalBadge'
import { SafeImage } from './SafeImage'

function CalendarIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="shrink-0 text-[color:var(--accent-red)]"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="shrink-0 text-[color:var(--accent-red)]"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  )
}

export function HomeOverlayCard({
  post,
  variant = 'default',
  compactSize = 'large',
}: {
  post: Post
  variant?: 'default' | 'compact' | 'webinar'
  compactSize?: 'large' | 'small'
}) {
  const href = getPostHref(post)
  const isCompact = variant === 'compact'
  const isWebinar = variant === 'webinar'
  const actionLabel = getPostCardButtonLabel(post)
  const category = getCategoryName(post.primaryCategory)
  const accent = getCategoryAccent(post.primaryCategory)

  if (!isCompact && !isWebinar) {
    return (
      <article className="flex h-full max-w-[388px] flex-col gap-4">
        <Link href={href} className="group relative block">
          <div className="relative aspect-[350/466] overflow-hidden rounded-[16px] bg-[color:var(--surface-muted)]">
            <SafeImage
              src={getPostCardImageUrl(post)}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className={`${getPostCardImageClass(post)} transition-transform duration-300 group-hover:scale-[1.03]`}
            />
          </div>
          <HomeVerticalBadge label={category} color={accent} />
        </Link>

        <div className="flex flex-1 flex-col gap-3">
          <Link
            href={href}
            className="ui-font text-[1rem] font-medium leading-[1.2] text-[color:var(--text-strong)] transition hover:text-[color:var(--accent-red)] md:text-[1.04rem]"
          >
            {post.title}
          </Link>

          <div className="mt-auto flex items-end justify-between gap-3 pt-1">
            <Link
              href={href}
              className="inline-flex min-w-[88px] items-center justify-center rounded-[10px] bg-[var(--accent-red)] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[var(--accent-red-dark)] md:min-w-[96px]"
            >
              {actionLabel}
            </Link>

            <div className="text-right text-[0.74rem] text-[color:var(--text-muted)] md:text-[0.78rem]">
              <div className="font-semibold text-[color:var(--text-strong)]">
                {getAuthorNames(post.authors)}
              </div>
              {post.type === 'webinar' ? (
                <div className="mt-1 flex items-center justify-end gap-2 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1">
                    <CalendarIcon />
                    {formatShortDate(post.publishedAt)}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <ClockIcon />
                    12:20PM IST
                  </span>
                </div>
              ) : (
                <div className="mt-1 flex items-center justify-end gap-1 whitespace-nowrap">
                  <ClockIcon />
                  {post.readingTime ?? 12} mins
                </div>
              )}
            </div>
          </div>
        </div>
      </article>
    )
  }

  if (isWebinar) {
    const isSmallWebinar = compactSize === 'small'

    return (
      <Link href={href} className="group block h-full overflow-hidden">
        <article
          className={`relative h-full overflow-hidden bg-black ${
            isSmallWebinar ? 'min-h-[280px] lg:min-h-[310px]' : 'min-h-[420px] lg:min-h-[620px]'
          }`}
        >
          <SafeImage
            src={getPostCardImageUrl(post)}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={`${getPostCardImageClass(post)} transition-transform duration-300 group-hover:scale-[1.03]`}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/35 to-transparent" />
          <div className="absolute inset-x-0 top-0 p-6 text-white md:p-8">
            <h3
              className={`headline-font line-clamp-2 max-w-[24ch] font-extrabold leading-[1.14] ${
                isSmallWebinar
                  ? 'text-[1.35rem] md:text-[1.5rem]'
                  : 'text-[1.45rem] md:text-[1.75rem]'
              }`}
            >
              {post.title}
            </h3>
            <p className="mt-3 max-w-full text-[0.98rem] font-medium leading-6 text-white/90 md:text-[1.08rem]">
              Oracle - {formatDate(post.publishedAt)} 11:00AM PT, 2:00PM ET
            </p>
            <span
              className="mt-4 inline-flex px-4 py-2 text-[0.95rem] font-extrabold uppercase tracking-[0.02em] text-white md:text-[1.05rem]"
              style={{ backgroundColor: accent }}
            >
              {category}
            </span>
          </div>
        </article>
      </Link>
    )
  }

  const isSmallCompact = compactSize === 'small'

  return (
    <Link href={href} className="group block overflow-hidden rounded-[16px]">
      <article
        className={`relative overflow-hidden rounded-[16px] bg-black ${
          isSmallCompact ? 'h-[280px] md:h-[300px]' : 'h-[360px] md:h-[411px]'
        }`}
      >
        <SafeImage
          src={getPostCardImageUrl(post)}
          alt={post.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className={`${getPostCardImageClass(post)} transition-transform duration-300 group-hover:scale-105`}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(179.85deg, rgba(0, 0, 0, 0) 71.72%, #000000 99.87%)',
          }}
        />
        <div className="absolute inset-x-0 bottom-0 p-4 text-white md:p-5">
          <span
            className="inline-flex rounded-[3px] px-3 py-2 text-[0.78rem] font-extrabold uppercase leading-none text-white md:text-[0.9rem]"
            style={{ backgroundColor: accent }}
          >
            {category}
          </span>
          <h3
            className={`mt-2 max-w-[25ch] font-semibold drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)] ${
              isSmallCompact
                ? 'line-clamp-2 text-[1rem] leading-5 md:text-[1.08rem] md:leading-6'
                : 'line-clamp-2 text-[1.08rem] leading-6 md:text-[1.18rem] md:leading-7'
            }`}
          >
            {post.title}
          </h3>
        </div>
      </article>
    </Link>
  )
}
