import Link from 'next/link'

import { SafeImage } from '../../_components/SafeImage'
import type { Post } from '@/lib/types/cms'
import { formatDate, getCategoryName, getPostCardImageUrl, getWebinarSpeakerSummary } from '@/lib/utils/formatting'

const categoryStyles: Record<string, string> = {
  technology: 'text-[#0015AD]',
  finance: 'text-[#FC0203]',
  marketing: 'text-[#00A01D]',
}

function getWebinarDateLabel(post: Post) {
  const rawDate = post.webinarRegistration?.eventDateLabel || formatDate(post.publishedAt)
  const cleanDate = rawDate.replace(/^coming\s+/i, '').trim()
  const parsedDate = new Date(cleanDate)

  if (Number.isNaN(parsedDate.getTime())) {
    return rawDate
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  parsedDate.setHours(0, 0, 0, 0)

  if (parsedDate > today) return `Coming ${cleanDate}`
  if (parsedDate.getTime() === today.getTime()) return `Today ${cleanDate}`
  return cleanDate
}

export function WebinarCard({ post, compact = false }: { post: Post; compact?: boolean }) {
  const category = getCategoryName(post.primaryCategory)
  const categoryClass = categoryStyles[category.toLowerCase()] || 'text-[#0015AD]'
  const presenterLabel = getWebinarSpeakerSummary(post)
  const eventDate = getWebinarDateLabel(post)

  return (
    <article
      className={`ui-font flex flex-col overflow-hidden border border-[#E0E0E0] bg-white ${
        compact ? 'h-auto lg:h-[189px]' : 'h-auto lg:h-[394px]'
      }`}
    >
      <Link href={`/webinars/${post.slug}`} className="block">
        <div className={`relative w-full overflow-hidden bg-white ${compact ? 'h-[110px]' : 'h-[201px]'}`}>
          <SafeImage src={getPostCardImageUrl(post)} alt={post.title} fill sizes={compact ? '(max-width: 1024px) 100vw, 467px' : '(max-width: 1024px) 100vw, 668px'} className="object-contain" />
          <div className="absolute inset-x-0 top-0 truncate bg-black/35 px-3 py-1 text-center text-[10px] font-medium uppercase leading-[145%] tracking-[-0.005em] text-white">
            {eventDate.replace(/^Coming\s+/i, '')}
          </div>
          {compact ? (
            <>
              <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/5 to-transparent" />
              <div className="absolute inset-x-4 top-1/2 overflow-hidden text-ellipsis whitespace-nowrap -translate-y-1/2 text-center text-[13px] font-medium leading-none text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)]">
                {post.title}
              </div>
            </>
          ) : null}
        </div>
      </Link>
      <div className={`${compact ? 'px-1 pb-1 pt-1' : 'p-4'} flex min-w-0 flex-1 flex-col space-y-1`}>
        <div className={`${compact ? 'text-[10px]' : 'text-[13px]'} truncate font-medium uppercase ${categoryClass}`}>{category}</div>
        <Link href={`/webinars/${post.slug}`} className={`${compact ? 'text-[13px]' : 'text-[24px]'} block overflow-hidden text-ellipsis whitespace-nowrap font-medium leading-none text-[#111]`}>
          {post.title}
        </Link>
        {presenterLabel ? (
          <div className={`${compact ? 'text-[10px]' : 'text-[19px]'} truncate text-[#111]`}>
            Sponsored by: {presenterLabel}
          </div>
        ) : null}
        <div className={`${compact ? 'text-[10px]' : 'text-[19px]'} mt-auto truncate font-medium leading-none text-[#111]`}>
          {eventDate}
        </div>
      </div>
    </article>
  )
}
