import Image from 'next/image'
import Link from 'next/link'

import type { Post } from '@/lib/types/cms'
import { getPostHref } from '@/lib/utils/contentTypes'
import { formatDate, getAuthorNames, getCategoryName, getImageUrl } from '@/lib/utils/formatting'

const categoryStyles: Record<string, string> = {
  technology: 'bg-[#0015AD]',
  finance: 'bg-[#FC0203]',
  marketing: 'bg-[#00A01D]',
}

export function WhitepaperCard({ post }: { post: Post }) {
  const href = getPostHref(post)
  const category = getCategoryName(post.primaryCategory)
  const categoryKey = category.toLowerCase()
  const categoryClass = categoryStyles[categoryKey] || 'bg-[#0015AD]'

  return (
    <article className="ui-font group w-full max-w-[320px]">
      <Link href={href} className="block">
        <div className="relative h-[445px] overflow-hidden bg-[#ececec]">
          <Image
            src={getImageUrl(post.featuredImage)}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/30 via-black/0 to-transparent px-4 pb-6 pt-20">
            <span
              className={`inline-flex h-[42px] min-w-[102px] items-center justify-center px-3 text-center text-[18px] font-bold uppercase leading-none tracking-[-0.02em] text-white ${categoryClass}`}
            >
              {category}
            </span>
          </div>
        </div>
      </Link>
      <div className="space-y-3 pt-4">
        <Link
          href={href}
          className="block text-[18px] font-medium leading-[145%] tracking-[-0.005em] text-[#000] transition hover:text-[var(--accent-red)]"
        >
          {post.title}
        </Link>
        <div className="text-[16px] font-medium leading-[145%] tracking-[-0.005em] text-[#808080]">
          By {getAuthorNames(post.authors)} {formatDate(post.publishedAt)}
        </div>
      </div>
    </article>
  )
}
