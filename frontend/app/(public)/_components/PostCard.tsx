import Link from 'next/link'

import type { Post } from '@/lib/types/cms'
import { getPostHref } from '@/lib/utils/contentTypes'
import {
  formatDate,
  getAuthorNames,
  getCategoryName,
  getContentTypeLabel,
  getPostCardImageClass,
  getPostCardImageUrl,
} from '@/lib/utils/formatting'
import { SafeImage } from './SafeImage'

export function PostCard({ post }: { post: Post }) {
  const href = getPostHref(post)
  const categoryName = getCategoryName(post.primaryCategory)

  return (
    <article className="group panel-card overflow-hidden rounded-[28px] transition-transform duration-200 hover:-translate-y-1">
      <Link href={href} className="block">
        <div className="relative aspect-[16/10] overflow-hidden">
          <SafeImage
            src={getPostCardImageUrl(post)}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className={`${getPostCardImageClass(post)} transition-transform duration-300 group-hover:scale-105`}
          />
        </div>
      </Link>
      <div className="space-y-4 p-6">
        <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--text-muted)]">
          <span>{getContentTypeLabel(post.type)}</span>
          <span className="category-pill">
            {categoryName}
          </span>
        </div>
        <div className="space-y-3">
          <Link href={href} className="block text-2xl font-semibold tracking-tight text-[color:var(--text-strong)]">
            {post.title}
          </Link>
          <p className="text-sm leading-6 text-[color:var(--text-soft)]">{post.excerpt}</p>
        </div>
        <div className="flex items-center justify-between gap-4 text-sm text-[color:var(--text-muted)]">
          <span>{getAuthorNames(post.authors)}</span>
          <span>{formatDate(post.publishedAt)}</span>
        </div>
      </div>
    </article>
  )
}
