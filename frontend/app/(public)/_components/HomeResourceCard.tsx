import Link from 'next/link'

import type { Post } from '@/lib/types/cms'
import { getPostHref } from '@/lib/utils/contentTypes'
import { getCategoryAccent, getCategoryName, getPostCardButtonLabel, getPostCardImageClass, getPostCardImageUrl } from '@/lib/utils/formatting'
import { HomeVerticalBadge } from './HomeVerticalBadge'
import { SafeImage } from './SafeImage'

export function HomeResourceCard({ post }: { post: Post }) {
  const href = getPostHref(post)
  const category = getCategoryName(post.primaryCategory)
  const accent = getCategoryAccent(post.primaryCategory)
  const actionLabel = getPostCardButtonLabel(post)

  return (
    <article className="flex h-[380px] w-[300px] flex-col overflow-hidden rounded-[16px] border border-[var(--border-subtle)] bg-white shadow-[0px_6px_12px_0px_#00000008,0px_4px_8px_0px_#00000005]">
      <div className="relative overflow-visible">
        <HomeVerticalBadge label={category} color={accent} className="right-4 top-0" />
        <Link href={href} className="group block overflow-hidden rounded-t-[16px]">
          <div className="relative h-[170px] overflow-hidden rounded-t-[16px]">
            <SafeImage
              src={getPostCardImageUrl(post)}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className={`${getPostCardImageClass(post)} transition-transform duration-300 group-hover:scale-[1.02]`}
            />
          </div>
        </Link>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <Link
          href={href}
          className="headline-font line-clamp-2 text-[1rem] font-extrabold leading-[1.22] text-[color:var(--text-strong)]"
        >
          {post.title}
        </Link>
        {post.excerpt ? (
          <p className="mt-3 line-clamp-3 text-[0.88rem] leading-5 text-[color:var(--text-muted)]">
            {post.excerpt}
          </p>
        ) : null}
        <div className="mt-auto pt-4">
          <Link
            href={href}
            className="inline-flex items-center gap-2 text-sm font-bold text-[color:var(--text-strong)] transition hover:text-[color:var(--accent-red)]"
          >
            {actionLabel} <span aria-hidden="true">-&gt;</span>
          </Link>
        </div>
      </div>
    </article>
  )
}
