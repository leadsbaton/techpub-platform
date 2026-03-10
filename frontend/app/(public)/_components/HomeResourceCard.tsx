import Image from 'next/image'
import Link from 'next/link'

import type { Post } from '@/lib/types/cms'
import { formatDate, getAuthorNames, getImageUrl } from '@/lib/utils/formatting'

export function HomeResourceCard({ post }: { post: Post }) {
  const href = `/${post.type}s/${post.slug}`.replace('/case-studys/', '/case-studies/')

  return (
    <article className="space-y-4">
      <Link href={href} className="group block overflow-hidden bg-white">
        <div className="relative aspect-[0.78/1] overflow-hidden rounded-[4px] bg-white">
          <Image
            src={getImageUrl(post.featuredImage)}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        </div>
      </Link>
      <div className="space-y-2">
        <Link href={href} className="block text-[1rem] font-medium leading-8 text-[color:var(--text-strong)] md:text-[1.1rem]">
          {post.title}
        </Link>
        <p className="text-sm text-[color:var(--text-muted)]">
          By {getAuthorNames(post.authors)} - {formatDate(post.publishedAt)}
        </p>
      </div>
    </article>
  )
}
