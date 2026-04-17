import Image from 'next/image'
import Link from 'next/link'

import type { Post } from '@/lib/types/cms'
import { formatDate, getCategoryName, getImageUrl, getWebinarSpeakerSummary } from '@/lib/utils/formatting'

const categoryStyles: Record<string, string> = {
  technology: 'text-[#0015AD]',
  finance: 'text-[#FC0203]',
  marketing: 'text-[#00A01D]',
}

export function WebinarCard({ post, compact = false }: { post: Post; compact?: boolean }) {
  const category = getCategoryName(post.primaryCategory)
  const categoryClass = categoryStyles[category.toLowerCase()] || 'text-[#0015AD]'
  const presenterLabel = getWebinarSpeakerSummary(post)

  return (
    <article className={`ui-font ${compact ? '' : 'w-full'}`}>
      <Link href={`/webinars/${post.slug}`} className="block">
        <div className={`relative overflow-hidden bg-[#ececec] ${compact ? 'h-[115px]' : 'h-[146px] sm:h-[170px]'}`}>
          <Image src={getImageUrl(post.featuredImage)} alt={post.title} fill className="object-cover" />
          {post.webinarRegistration?.eventDateLabel ? (
            <div className="absolute inset-x-0 top-0 bg-black/25 px-3 py-1 text-center text-[10px] font-medium uppercase tracking-[0.03em] text-white sm:text-[12px]">
              {post.webinarRegistration.eventDateLabel}
            </div>
          ) : null}
        </div>
      </Link>
      <div className={`${compact ? 'pt-2' : 'pt-3'} space-y-1`}>
        <div className={`text-[13px] font-bold uppercase ${categoryClass}`}>{category}</div>
        <Link href={`/webinars/${post.slug}`} className={`${compact ? 'text-[14px]' : 'text-[18px]'} block font-medium leading-[1.2] text-[#111]`}>
          {post.title}
        </Link>
        {presenterLabel ? (
          <div className={`${compact ? 'text-[11px]' : 'text-[13px]'} text-[#808080]`}>
            Speakers: {presenterLabel}
          </div>
        ) : null}
        {!compact ? (
          <div className="text-[13px] text-[#808080]">
            {formatDate(post.publishedAt)} {post.webinarRegistration?.eventDateLabel ? ` ${post.webinarRegistration.eventDateLabel}` : ''}
          </div>
        ) : null}
      </div>
    </article>
  )
}
