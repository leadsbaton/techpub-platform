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
    <article className="ui-font flex h-auto flex-col overflow-hidden border border-[#E0E0E0] bg-white">
      <Link href={`/webinars/${post.slug}`} className="block">
        <div className={`relative w-full overflow-hidden bg-white ${compact ? 'h-[110px]' : 'h-[201px]'}`}>
          <SafeImage src={getPostCardImageUrl(post)} alt={post.title} fill sizes={compact ? '(max-width: 1024px) 100vw, 467px' : '(max-width: 1024px) 100vw, 668px'} className="object-contain" />
        </div>
      </Link>
      <div className={`${compact ? 'px-2 py-1.5' : 'px-4 py-3'} flex min-w-0 flex-1 flex-col gap-1`}>
        <div className={`${compact ? 'text-[10px]' : 'text-[13px]'} truncate font-medium uppercase ${categoryClass}`}>{category}</div>
        <Link href={`/webinars/${post.slug}`} className={`${compact ? 'text-[12px]' : 'text-[18px]'} block truncate font-medium leading-[1.15] text-[#111]`}>
          {post.title}
        </Link>
        {presenterLabel ? (
          <div className={`${compact ? 'text-[10px]' : 'text-[15px]'} truncate text-[#111]`}>
            Sponsored by: {presenterLabel}
          </div>
        ) : null}
        <div className={`${compact ? 'text-[10px]' : 'text-[15px]'} truncate font-medium leading-[1.15] text-[#111]`}>
          {eventDate}
        </div>
      </div>
    </article>
  )
}
