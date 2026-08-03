import Link from 'next/link'

import { SafeImage } from '../../_components/SafeImage'
import type { Post } from '@/lib/types/cms'
import { getPostHref } from '@/lib/utils/contentTypes'
import { formatDate, getCategoryName, getPostCardImageClass, getPostCardImageUrl } from '@/lib/utils/formatting'

// `hideCategory` is used on category-scoped pages, where the page heading already
// names the category and repeating it on every card is noise.
export function WhitepaperCard({ post, hideCategory = false }: { post: Post; hideCategory?: boolean }) {
  const href = getPostHref(post)
  const category = getCategoryName(post.primaryCategory)

  return (
    <article className="ui-font group w-full max-w-[320px]">
      <Link href={href} className="block">
        <div className="relative h-[180px] overflow-hidden bg-[#ececec] sm:h-[222px]">
          <SafeImage
            src={getPostCardImageUrl(post)}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, 320px"
            className={`${getPostCardImageClass(post)} transition-transform duration-300 group-hover:scale-105`}
          />
          {hideCategory ? null : (
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/30 via-black/0 to-transparent px-4 pb-6 pt-20">
              <span className="content-label">
                {category}
              </span>
            </div>
          )}
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
          {formatDate(post.publishedAt)}
        </div>
      </div>
    </article>
  )
}
