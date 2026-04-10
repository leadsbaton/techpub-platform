import Image from 'next/image'
import Link from 'next/link'

import type { Post } from '@/lib/types/cms'
import { getPostHref } from '@/lib/utils/contentTypes'
import { getCategoryAccent, getCategoryName, getImageUrl } from '@/lib/utils/formatting'

export function HomeResourceCard({ post }: { post: Post }) {
  const href = getPostHref(post)
  const category = getCategoryName(post.primaryCategory)
  const accent = getCategoryAccent(post.primaryCategory)

  return (
    <article className="flex h-full flex-col rounded-[20px] border border-[var(--border-subtle)] bg-white p-5 shadow-[var(--shadow-soft)]">
      <div className="relative mb-6 overflow-visible">
        <div
          className="vertical-badge absolute right-[-10px] top-0 z-10 rounded-bl-[10px] rounded-br-[10px] px-2 py-3 text-[0.65rem] font-extrabold uppercase tracking-[0.2em] text-white"
          style={{ backgroundColor: accent }}
        >
          {category}
        </div>
        <Link href={href} className="group block overflow-hidden rounded-[14px]">
          <div className="relative aspect-[1.12/0.68] overflow-hidden rounded-[14px]">
            <Image
              src={getImageUrl(post.featuredImage)}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />
          </div>
        </Link>
      </div>

      <div className="flex flex-1 flex-col">
        <Link
          href={href}
          className="headline-font text-[1.08rem] font-extrabold leading-[1.24] text-[color:var(--text-strong)]"
        >
          {post.title}
        </Link>
        <p className="mt-4 text-[0.98rem] leading-7 text-[color:var(--text-muted)]">
          {post.excerpt ||
            'Cards are a great way to organize content in a collection of products, case studies, services, and more.'}
        </p>
        <div className="mt-8">
          <Link
            href={href}
            className="inline-flex items-center gap-2 text-base font-bold text-[color:var(--text-strong)] transition hover:text-[color:var(--accent-red)]"
          >
            Download Now <span aria-hidden="true">-&gt;</span>
          </Link>
        </div>
      </div>
    </article>
  )
}
