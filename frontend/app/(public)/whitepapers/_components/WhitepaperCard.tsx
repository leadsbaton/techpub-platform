import Link from 'next/link'

import { SafeImage } from '../../_components/SafeImage'
import type { Post } from '@/lib/types/cms'
import { getPostHref } from '@/lib/utils/contentTypes'
import {
  formatDate,
  getCategoryName,
  getMediaDimensions,
  getPostCardImageFit,
  getPostCardImageUrl,
} from '@/lib/utils/formatting'

// `hideCategory` is used on category-scoped pages, where the page heading already
// names the category and repeating it on every card is noise.
export function WhitepaperCard({ post, hideCategory = false }: { post: Post; hideCategory?: boolean }) {
  const href = getPostHref(post)
  const category = getCategoryName(post.primaryCategory)
  // "Contain" banners are logos and cover art, not photography. Cropping them to a
  // fixed-height box left grey pillarbox bars either side of the artwork — the card
  // read as a box containing an image rather than as the image. So contain banners
  // render at their own aspect ratio and the card ends where the artwork ends.
  // "Cover" banners keep the fixed crop, which is what keeps photo grids even.
  const fit = getPostCardImageFit(post)
  const dims = getMediaDimensions(post.cardBannerImage || post.featuredImage)
  const useNaturalRatio = fit === 'contain' && Boolean(dims)

  return (
    <article className="ui-font group w-full max-w-[320px]">
      <Link href={href} className="block">
        <div
          className={`relative overflow-hidden ${
            useNaturalRatio ? 'bg-white' : 'h-[180px] bg-[#ececec] sm:h-[222px]'
          }`}
        >
          {useNaturalRatio ? (
            <SafeImage
              src={getPostCardImageUrl(post)}
              alt={post.title}
              width={dims!.width}
              height={dims!.height}
              sizes="(max-width: 768px) 100vw, 320px"
              className="h-auto w-full object-contain transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <SafeImage
              src={getPostCardImageUrl(post)}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, 320px"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          )}
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
