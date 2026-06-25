import Link from 'next/link'

import { SafeImage } from '../../_components/SafeImage'
import type { Post } from '@/lib/types/cms'
import { getCategoryName, getPostCardImageUrl, getWebinarEventLabel, getWebinarSpeakerSummary } from '@/lib/utils/formatting'

const categoryStyles: Record<string, string> = {
  technology: 'text-[#0015AD]',
  finance: 'text-[#FC0203]',
  marketing: 'text-[#00A01D]',
}

export function WebinarCard({ post, compact = false }: { post: Post; compact?: boolean }) {
  const category = getCategoryName(post.primaryCategory)
  const categoryClass = categoryStyles[category.toLowerCase()] || 'text-[#0015AD]'
  const presenterLabel = getWebinarSpeakerSummary(post)
  const eventDate = getWebinarEventLabel(post)

  return (
    <article className="ui-font flex flex-col overflow-hidden border border-[#E0E0E0] bg-white">
      <Link href={`/webinars/${post.slug}`} className="block">
        <div className={`relative w-full overflow-hidden bg-[#f0f0f0] ${compact ? 'aspect-[16/8]' : 'aspect-video'}`}>
          <SafeImage
            src={getPostCardImageUrl(post)}
            alt={post.title}
            fill
            sizes={compact ? '(max-width: 1024px) 100vw, 467px' : '(max-width: 1024px) 100vw, 668px'}
            className="object-cover transition-transform duration-300 hover:scale-[1.02]"
          />
        </div>
      </Link>
      <div className={`${compact ? 'px-3 py-3' : 'px-5 py-4'} flex min-w-0 flex-1 flex-col gap-1.5`}>
        <div className={`${compact ? 'text-[11px]' : 'text-[13px]'} font-medium uppercase ${categoryClass}`}>
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
