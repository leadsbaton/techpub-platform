import Image from 'next/image'
import Link from 'next/link'

import type { Post } from '@/lib/types/cms'
import { getPostHref } from '@/lib/utils/contentTypes'
import {
  formatDate,
  formatShortDate,
  getAuthorNames,
  getCategoryAccent,
  getCategoryName,
  getImageUrl,
} from '@/lib/utils/formatting'
import { HomeVerticalBadge } from './HomeVerticalBadge'

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
  const actionLabel =
    post.type === 'webinar' ? 'Join' : post.type === 'whitepaper' ? 'Download' : 'Read'
  const category = getCategoryName(post.primaryCategory)
  const accent = getCategoryAccent(post.primaryCategory)

  if (!isCompact && !isWebinar) {
    return (
      <article className="flex h-full flex-col rounded-[20px] bg-white shadow-[var(--shadow-soft)]">
        <Link href={href} className="group block overflow-hidden rounded-t-[20px]">
          <div className="relative h-[300px] overflow-hidden bg-[color:var(--surface-muted)] sm:h-[340px] lg:h-[370px]">
            <Image
              src={getImageUrl(post.featuredImage)}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            />
            <HomeVerticalBadge label={category} color={accent} />
          </div>
        </Link>

        <div className="flex flex-1 flex-col gap-4 px-4 pb-4 pt-4 md:px-5">
          <Link
            href={href}
            className="headline-font text-[1rem] font-extrabold leading-[1.16] text-[color:var(--text-strong)] transition hover:text-[color:var(--accent-red)] md:text-[1.04rem]"
          >
            {post.title}
          </Link>

          <div className="mt-auto flex items-end justify-between gap-3 border-t border-black/6 pt-3">
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
              <div className="mt-1 whitespace-nowrap">
                {post.type === 'webinar'
                  ? `${formatShortDate(post.publishedAt)} | 12:20PM IST`
                  : `${post.readingTime ?? 12} mins`}
              </div>
            </div>
          </div>
        </div>
      </article>
    )
  }

  if (isWebinar) {
    const isSmallWebinar = compactSize === 'small'

    return (
      <Link href={href} className="group block overflow-hidden rounded-[20px]">
        <article
          className={`relative h-full overflow-hidden rounded-[20px] bg-black ${
            isSmallWebinar ? 'min-h-[220px] md:min-h-[250px]' : 'min-h-[260px] md:min-h-[520px]'
          }`}
        >
          <Image
            src={getImageUrl(post.featuredImage)}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
          <div
            className={`absolute inset-x-0 bottom-0 text-white ${
              isSmallWebinar ? 'p-5' : 'p-6 md:p-8'
            }`}
          >
            <h3
              className={`headline-font max-w-[22ch] font-extrabold leading-tight ${
                isSmallWebinar
                  ? 'text-[1.05rem] md:text-[1.2rem]'
                  : 'text-[1.3rem] md:text-[1.8rem]'
              }`}
            >
              {post.title}
            </h3>
            <p className={`mt-2 text-white/82 ${isSmallWebinar ? 'text-xs' : 'text-sm'}`}>
              Oracle - {formatDate(post.publishedAt)} 11:00AM PT, 2:00PM ET
            </p>
            <span
              className={`inline-flex rounded-[6px] font-extrabold uppercase tracking-[0.1em] text-white ${
                isSmallWebinar
                  ? 'mt-3 px-3 py-1.5 text-[0.68rem]'
                  : 'mt-4 px-3 py-2 text-[0.75rem]'
              }`}
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
    <Link href={href} className="group block overflow-hidden rounded-[18px]">
      <article
        className={`relative overflow-hidden rounded-[18px] bg-black ${
          isSmallCompact ? 'min-h-[170px]' : 'min-h-[320px]'
        }`}
      >
        <Image
          src={getImageUrl(post.featuredImage)}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/88 via-black/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-4 text-white">
          <span
            className="inline-flex rounded-[4px] px-3 py-1.5 text-[0.7rem] font-extrabold uppercase tracking-[0.12em] text-white"
            style={{ backgroundColor: accent }}
          >
            {category}
          </span>
          <h3
            className={`mt-3 max-w-[24ch] font-semibold ${
              isSmallCompact
                ? 'line-clamp-2 text-[1rem] leading-5'
                : 'line-clamp-3 text-[1.1rem] leading-6'
            }`}
          >
            {post.title}
          </h3>
        </div>
      </article>
    </Link>
  )
}
