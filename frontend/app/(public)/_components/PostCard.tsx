import Image from 'next/image'
import Link from 'next/link'

import type { Post } from '@/lib/types/cms'
import {
  formatDate,
  getAuthorNames,
  getCategoryName,
  getContentTypeLabel,
  getImageUrl,
} from '@/lib/utils/formatting'

export function PostCard({ post }: { post: Post }) {
  const href = `/${post.type}s/${post.slug}`.replace('/case-studys/', '/case-studies/')

  return (
    <article className="group overflow-hidden rounded-[28px] border border-black/10 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)] transition-transform duration-200 hover:-translate-y-1">
      <Link href={href} className="block">
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={getImageUrl(post.featuredImage)}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </Link>
      <div className="space-y-4 p-6">
        <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          <span>{getContentTypeLabel(post.type)}</span>
          <span>{getCategoryName(post.primaryCategory)}</span>
        </div>
        <div className="space-y-3">
          <Link href={href} className="block text-2xl font-semibold tracking-tight text-slate-950">
            {post.title}
          </Link>
          <p className="text-sm leading-6 text-slate-600">{post.excerpt}</p>
        </div>
        <div className="flex items-center justify-between gap-4 text-sm text-slate-500">
          <span>{getAuthorNames(post.authors)}</span>
          <span>{formatDate(post.publishedAt)}</span>
        </div>
      </div>
    </article>
  )
}
