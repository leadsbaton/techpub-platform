import Link from 'next/link'

import { SafeImage } from '../../_components/SafeImage'
import type { Media, Post } from '@/lib/types/cms'
import { getCategoryName, getPostCardImageUrl, getWebinarEventLabel, getWebinarSpeakerSummary } from '@/lib/utils/formatting'

function getCardImageDims(post: Post): { width: number; height: number } | null {
  const img = post.cardBannerImage || post.featuredImage
  if (img && typeof img === 'object' && (img as Media).width && (img as Media).height) {
    return { width: (img as Media).width!, height: (img as Media).height! }
  }
  return null
}

export function WebinarCard({ post, compact = false }: { post: Post; compact?: boolean }) {
  const category = getCategoryName(post.primaryCategory)
  const presenterLabel = getWebinarSpeakerSummary(post)
  const eventDate = getWebinarEventLabel(post)
  const dims = getCardImageDims(post)

  return (
    <article className="ui-font flex flex-col overflow-hidden border border-[#E0E0E0] bg-white">
      <Link href={`/webinars/${post.slug}`} className="block w-full overflow-hidden bg-white">
        {dims ? (
          // Natural image proportions — height follows the actual uploaded image ratio
          <SafeImage
            src={getPostCardImageUrl(post)}
            alt={post.title}
            width={dims.width}
            height={dims.height}
            sizes={compact ? '(max-width: 1024px) 100vw, 467px' : '(max-width: 1024px) 100vw, 668px'}
            className="h-auto w-full object-contain"
          />
        ) : (
          // Fallback when image has no stored dimensions
          <div className={`relative w-full overflow-hidden ${compact ? 'aspect-[16/7]' : 'aspect-[16/9]'}`}>
            <SafeImage
              src={getPostCardImageUrl(post)}
              alt={post.title}
              fill
              sizes={compact ? '(max-width: 1024px) 100vw, 467px' : '(max-width: 1024px) 100vw, 668px'}
              className="object-contain"
            />
          </div>
        )}
      </Link>
      <div className={`${compact ? 'px-3 py-3' : 'px-5 py-4'} flex min-w-0 flex-1 flex-col gap-1.5`}>
        <div className={`${compact ? 'text-[11px]' : 'text-[13px]'} font-medium uppercase text-[var(--accent-red)]`}>
          {category}
        </div>
        <Link
          href={`/webinars/${post.slug}`}
          className={`${compact ? 'line-clamp-2 text-[13px]' : 'line-clamp-3 text-[18px]'} font-medium leading-[1.3] text-[#111] transition hover:text-[var(--accent-red)]`}
        >
          {post.title}
        </Link>
        {presenterLabel ? (
          <div className={`${compact ? 'text-[11px]' : 'text-[14px]'} line-clamp-1 text-[#555]`}>
            Sponsored by: {presenterLabel}
          </div>
        ) : null}
        <div className={`${compact ? 'text-[11px]' : 'text-[14px]'} font-medium leading-[1.3] text-[#333]`}>
          {eventDate}
        </div>
      </div>
    </article>
  )
}
