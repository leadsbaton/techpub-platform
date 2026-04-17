import Image from 'next/image'
import Link from 'next/link'

import type { Post } from '@/lib/types/cms'
import { getPostHref, getSingularLabelForType } from '@/lib/utils/contentTypes'
import { formatDate, getAuthorNames, getCategoryName, getImageUrl } from '@/lib/utils/formatting'

const categoryColors: Record<string, string> = {
  technology: 'bg-[#0015AD]',
  finance: 'bg-[#FC0203]',
  marketing: 'bg-[#00A01D]',
}

export function SearchResultCard({ post }: { post: Post }) {
  const href = getPostHref(post)
  const category = getCategoryName(post.primaryCategory)
  const categoryClass = categoryColors[category.toLowerCase()] || 'bg-[#0015AD]'

  return (
    <article className="ui-font overflow-hidden rounded-[20px] border border-[var(--border-subtle)] bg-white shadow-[var(--shadow-soft)]">
      <Link href={href} className="block">
        <div className="relative h-[210px] overflow-hidden bg-[var(--surface-muted)]">
          <Image
            src={getImageUrl(post.featuredImage)}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-300 hover:scale-[1.03]"
          />
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-black/55 via-transparent to-transparent px-4 pb-4 pt-14">
            <span className={`inline-flex rounded-[3px] px-3 py-2 text-[12px] font-bold uppercase text-white ${categoryClass}`}>
              {category}
            </span>
            <span className="rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#111]">
              {getSingularLabelForType(post.type)}
            </span>
          </div>
        </div>
      </Link>

      <div className="space-y-3 p-5">
        <Link href={href} className="block text-[20px] font-medium leading-[1.2] text-[#111]">
          {post.title}
        </Link>
        <p className="line-clamp-3 text-[14px] leading-6 text-[#4b4b4b]">{post.excerpt}</p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-[#808080]">
          <span>{getAuthorNames(post.authors)}</span>
          <span>{formatDate(post.publishedAt)}</span>
        </div>
      </div>
    </article>
  )
}
