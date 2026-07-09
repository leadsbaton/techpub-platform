import Link from 'next/link'

import type { Post } from '@/lib/types/cms'
import { getPostHref } from '@/lib/utils/contentTypes'
import {
  formatDate,
  getCategoryName,
  getPostCardImageClass,
  getPostCardImageUrl,
  getWebinarEventLabel,
} from '@/lib/utils/formatting'
import { SafeImage } from './SafeImage'

function ArrowRightIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={`fill-none stroke-current stroke-[2.3] ${className}`}
    >
      <path d="M5 12h14" strokeLinecap="round" />
      <path d="m13 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function DocumentIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5 fill-none stroke-current stroke-[2]"
    >
      <path d="M7 3h10v18H7z" strokeLinejoin="round" />
      <path d="M10 8h4M10 12h4M10 16h3" strokeLinecap="round" />
    </svg>
  )
}

function DownloadIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5 fill-none stroke-current stroke-[2]"
    >
      <path d="M12 4v11" strokeLinecap="round" />
      <path d="m8 11 4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 20h14" strokeLinecap="round" />
    </svg>
  )
}

function typeLabel(post: Post) {
  if (post.type === 'whitepaper') return 'White Paper'
  if (post.type === 'webinar') return 'Webinar'
  return 'Insight'
}

export function HomeTrendingCard({ post }: { post: Post }) {
  const href = getPostHref(post)
  const category = getCategoryName(post.primaryCategory)

  return (
    <Link href={href} className="group block w-[316px] sm:w-[390px]">
      <article className="flex min-h-[230px] flex-col rounded-lg border border-[#dfe5ee] bg-white p-6 transition hover:border-[var(--accent-red)] hover:shadow-[0_4px_20px_rgba(188,1,0,0.08)]">
        <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--accent-red)]">
          {typeLabel(post)}
        </div>
        <h3 className="mt-5 line-clamp-2 text-[19px] font-semibold leading-[1.18] text-[#111] transition group-hover:text-[var(--accent-red)]">
          {post.title}
        </h3>
        {post.excerpt ? (
          <p className="mt-4 line-clamp-3 text-[13px] leading-6 text-[#555]">
            {post.excerpt}
          </p>
        ) : null}
        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          <span className="max-w-[220px] truncate rounded-[3px] bg-[#ddd9d9] px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-[#444655]">
            {category}
          </span>
          <ArrowRightIcon className="h-5 w-5 shrink-0 transition group-hover:translate-x-1" />
        </div>
      </article>
    </Link>
  )
}

export function HomeLatestInsightCard({ post }: { post: Post }) {
  const href = getPostHref(post)
  const category = getCategoryName(post.primaryCategory)

  return (
    <Link href={href} className="group block w-[230px] sm:w-[274px]">
      <article>
        <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-[#dfe5ee] bg-[#f8fafc]">
          <SafeImage
            src={getPostCardImageUrl(post)}
            alt={post.title}
            fill
            sizes="274px"
            className={`${getPostCardImageClass(post)} transition-transform duration-500 group-hover:scale-105`}
          />
        </div>
        <div className="mt-4 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--accent-red)]">
          {category}
        </div>
        <h3 className="mt-2 line-clamp-2 text-[15px] font-medium leading-[1.3] text-[#111] transition group-hover:text-[var(--accent-red)]">
          {post.title}
        </h3>
      </article>
    </Link>
  )
}

export function HomeWebinarMiniCard({ post }: { post: Post }) {
  const href = getPostHref(post)

  return (
    <article className="flex min-h-[292px] w-[316px] flex-col rounded-lg border border-[#dfe5ee] bg-white p-6 transition hover:border-[var(--accent-red)] hover:shadow-[0_4px_20px_rgba(188,1,0,0.08)] sm:w-[380px]">
      <div className="w-fit rounded-full bg-[var(--accent-red)]/8 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--accent-red)]">
        {getWebinarEventLabel(post)}
      </div>
      <Link
        href={href}
        className="mt-5 line-clamp-3 text-[19px] font-semibold leading-[1.22] text-[#111] transition hover:text-[var(--accent-red)]"
      >
        {post.title}
      </Link>
      {post.excerpt ? (
        <p className="mt-4 line-clamp-4 text-[13px] leading-6 text-[#555]">
          {post.excerpt}
        </p>
      ) : null}
      <Link
        href={href}
        className="mt-auto inline-flex h-11 w-full items-center justify-center gap-2 rounded bg-[var(--accent-red)] px-4 text-sm font-bold text-white transition hover:bg-[var(--accent-red-dark)]"
      >
        Register Now
        <ArrowRightIcon className="h-4 w-4" />
      </Link>
    </article>
  )
}

export function HomeWhitepaperRow({ post }: { post: Post }) {
  const href = getPostHref(post)

  return (
    <Link href={href} className="group block">
      <article className="grid gap-5 rounded-lg border border-[#dfe5ee] bg-white p-5 transition hover:border-[var(--accent-red)] hover:shadow-[0_4px_20px_rgba(188,1,0,0.08)] sm:grid-cols-[64px_1fr_auto_auto] sm:items-center">
        <div className="grid h-16 w-16 place-items-center rounded bg-[var(--accent-red)] text-white shadow-sm">
          <DocumentIcon />
        </div>
        <div className="min-w-0">
          <h3 className="line-clamp-2 text-[17px] font-semibold leading-6 text-[#111] transition group-hover:text-[var(--accent-red)]">
            {post.title}
          </h3>
          {post.excerpt ? (
            <p className="mt-1 line-clamp-2 text-[13px] leading-5 text-[#555]">
              {post.excerpt}
            </p>
          ) : null}
        </div>
        <div className="text-left sm:text-right">
          <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--accent-red)]">
            Published
          </div>
          <div className="mt-1 text-sm text-[#444]">{formatDate(post.publishedAt)}</div>
        </div>
        <span className="grid h-11 w-11 place-items-center rounded-full border border-[var(--accent-red)] text-[var(--accent-red)] transition group-hover:bg-[var(--accent-red)] group-hover:text-white">
          <DownloadIcon />
        </span>
      </article>
    </Link>
  )
}

export function HomeSectionEmpty({ label }: { label: string }) {
  return (
    <div className="rounded-lg border border-[#dfe5ee] bg-white px-6 py-10 text-center text-sm font-medium text-[#666]">
      {label}
    </div>
  )
}
