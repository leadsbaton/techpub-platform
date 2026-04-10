import Image from 'next/image'
import Link from 'next/link'

import type { Post } from '@/lib/types/cms'
import { getPostHref } from '@/lib/utils/contentTypes'
import { getCategoryName, getImageUrl } from '@/lib/utils/formatting'

export function HomeResourceCard({ post }: { post: Post }) {
  const href = getPostHref(post)

  return (
    <article className="flex h-full flex-col rounded-[18px] bg-white p-3 shadow-[var(--shadow-soft)]">
      <Link href={href} className="group block overflow-hidden">
        <div className="relative aspect-[1.08/0.8] overflow-hidden rounded-[12px] bg-white">
          <Image
            src={getImageUrl(post.featuredImage)}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
          <div className="absolute right-3 top-3">
            <span className="inline-flex rounded-[4px] bg-[#2339d7] px-2 py-1 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-white">
              {getCategoryName(post.primaryCategory)}
            </span>
          </div>
        </div>
      </Link>
      <div className="flex flex-1 flex-col space-y-3 px-2 pb-2 pt-4">
        <div className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-[color:var(--accent-red)]">
          White Paper
        </div>
        <Link
          href={href}
          className="block text-[1rem] font-semibold leading-7 text-[color:var(--text-strong)] md:text-[1.05rem]"
        >
          {post.title}
        </Link>
        <p className="text-sm leading-6 text-[color:var(--text-muted)]">
          {post.excerpt || 'All you need to know from the latest long-form resource and downloadable guide.'}
        </p>
        <div className="pt-2">
          <Link
            href={href}
            className="inline-flex text-sm font-semibold text-[color:var(--accent-red)] transition hover:text-[color:var(--accent-red-dark)]"
          >
            Download Now {'->'}
          </Link>
        </div>
      </div>
    </article>
  )
}
