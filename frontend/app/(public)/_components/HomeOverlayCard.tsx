import Image from 'next/image'
import Link from 'next/link'

import type { Post } from '@/lib/types/cms'
import { formatDate, getImageUrl } from '@/lib/utils/formatting'

export function HomeOverlayCard({ post }: { post: Post }) {
  const href = `/${post.type}s/${post.slug}`

  return (
    <Link href={href} className="group block overflow-hidden rounded-[12px]">
      <article className="relative aspect-[1.35/1] overflow-hidden rounded-[12px] bg-black">
        <Image
          src={getImageUrl(post.featuredImage)}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-4 text-white">
          <div className="mb-1 text-sm text-white/85">{formatDate(post.publishedAt)}</div>
          <h3 className="line-clamp-2 text-[1.05rem] font-medium leading-6">{post.title}</h3>
        </div>
      </article>
    </Link>
  )
}
