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
  // "Contain" banners are logos and cover art, not photography. Forcing them into a
  // full-bleed box scaled them up until they filled it, bars and all. They now sit in
  // a portrait frame sized to the artwork, centred on a white card. "Cover" banners
  // keep the fixed crop, which keeps photo grids even.
  const fit = getPostCardImageFit(post)
  const dims = getMediaDimensions(post.cardBannerImage || post.featuredImage)
  const useNaturalRatio = fit === 'contain' && Boolean(dims)

  return (
    <article className="ui-font group w-full max-w-[320px]">
      <Link href={href} className="block">
        <div
          className={`relative overflow-hidden bg-white ${
            useNaturalRatio ? 'flex items-center justify-center px-8 pb-8 pt-7' : 'h-[180px] sm:h-[222px]'
          }`}
        >
          {useNaturalRatio ? (
            // A portrait frame sized to the artwork, not to the card. Bordering the
            // full-width panel instead made the card read as a box with a logo lost
            // inside it; this reads as cover art. The frame carries the border, so
            // the surrounding card stays plain white.
            <div className="flex aspect-[3/4] w-[150px] items-center justify-center overflow-hidden border border-[#c9c9c9] bg-white p-3">
              <SafeImage
                src={getPostCardImageUrl(post)}
                alt={post.title}
                width={dims!.width}
                height={dims!.height}
                sizes="150px"
                className="h-auto max-h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </div>
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
            // The dark scrim exists to keep the label legible over photography. On a
            // white card behind a framed logo it has nothing to darken and just reads
            // as a grey smudge, so it is limited to the cover crop.
            <div
              className={`absolute inset-x-0 bottom-0 px-4 pb-6 ${
                useNaturalRatio ? 'pt-0' : 'bg-gradient-to-t from-black/30 via-black/0 to-transparent pt-20'
              }`}
            >
              <span className="content-label">
                {category}
              </span>
            </div>
          )}
        </div>
      </Link>
      <div className="space-y-2 pt-4">
        <Link
          href={href}
          className="block text-[15px] font-medium leading-[1.4] tracking-[-0.005em] text-[#000] transition hover:text-[var(--accent-red)]"
        >
          {post.title}
        </Link>
        <div className="text-[13px] font-medium leading-[1.4] tracking-[-0.005em] text-[#808080]">
          {formatDate(post.publishedAt)}
        </div>
      </div>
    </article>
  )
}
