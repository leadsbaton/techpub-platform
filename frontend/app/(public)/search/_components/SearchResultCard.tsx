import Link from 'next/link'

import { SafeImage } from '../../_components/SafeImage'
import type { Post } from '@/lib/types/cms'
import { getPostHref, getSingularLabelForType } from '@/lib/utils/contentTypes'
import { formatDate, getAuthorNames, getCategoryName, getPostCardImageClass, getPostCardImageUrl } from '@/lib/utils/formatting'

export function SearchResultCard({ post, view = 'grid' }: { post: Post; view?: 'grid' | 'list' }) {
  const href = getPostHref(post)
  const category = getCategoryName(post.primaryCategory)
  const typeLabel = getSingularLabelForType(post.type)

  if (view === 'list') {
    return (
      <article className="ui-font group flex overflow-hidden rounded-[16px] border border-[var(--border-subtle)] bg-white shadow-[var(--shadow-soft)] transition-shadow hover:shadow-md">
        <Link href={href} className="relative w-[160px] shrink-0 overflow-hidden bg-[var(--surface-muted)] sm:w-[200px]">
          <SafeImage
            src={getPostCardImageUrl(post)}
            alt={post.title}
            fill
            sizes="200px"
            className={`${getPostCardImageClass(post)} transition-transform duration-300 group-hover:scale-[1.04]`}
          />
          <span className="absolute left-3 top-3 inline-flex rounded-[3px] bg-[var(--accent-red)] px-2 py-1 text-[10px] font-bold uppercase text-white">
            {category}
          </span>
        </Link>

        <div className="flex min-w-0 flex-1 flex-col justify-between p-4 sm:p-5">
          <div className="space-y-1.5">
            <span className="inline-block rounded-full bg-[#f0f0f0] px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-[#555]">
              {typeLabel}
            </span>
            <Link
              href={href}
              className="block text-[17px] font-semibold leading-[1.3] text-[#111] transition-colors group-hover:text-[var(--accent-red)]"
            >
              {post.title}
            </Link>
            <p className="line-clamp-2 text-[13px] leading-5 text-[#666]">{post.excerpt}</p>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-[#999]">
            <span>{getAuthorNames(post.authors)}</span>
            <span aria-hidden>·</span>
            <span>{formatDate(post.publishedAt)}</span>
          </div>
        </div>
      </article>
    )
  }

  return (
    <article className="ui-font group overflow-hidden rounded-[20px] border border-[var(--border-subtle)] bg-white shadow-[var(--shadow-soft)] transition-shadow hover:shadow-md">
      <Link href={href} className="block">
        <div className="relative h-[210px] overflow-hidden bg-[var(--surface-muted)]">
          <SafeImage
            src={getPostCardImageUrl(post)}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={`${getPostCardImageClass(post)} transition-transform duration-300 group-hover:scale-[1.04]`}
          />
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-black/60 via-black/10 to-transparent px-4 pb-4 pt-14">
            <span className="inline-flex rounded-[3px] bg-[var(--accent-red)] px-2.5 py-1.5 text-[11px] font-bold uppercase text-white">
              {category}
            </span>
            <span className="rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.07em] text-[#111]">
              {typeLabel}
            </span>
          </div>
        </div>
      </Link>

      <div className="space-y-2.5 p-5">
        <Link
          href={href}
          className="block text-[18px] font-semibold leading-[1.25] text-[#111] transition-colors group-hover:text-[var(--accent-red)]"
        >
          {post.title}
        </Link>
        <p className="line-clamp-3 text-[13px] leading-6 text-[#555]">{post.excerpt}</p>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-0.5 text-[12px] text-[#888]">
          <span>{getAuthorNames(post.authors)}</span>
          <span aria-hidden>·</span>
          <span>{formatDate(post.publishedAt)}</span>
        </div>
      </div>
    </article>
  )
}
