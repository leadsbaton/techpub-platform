import Image from 'next/image'
import Link from 'next/link'

import type { Post } from '@/lib/types/cms'
import {
  formatDate,
  getAuthorNames,
  getCategoryName,
  getContentTypeLabel,
  getImageUrl,
} from '@/lib/utils/formatting'

export function FeaturedPost({ post }: { post: Post }) {
  const href = `/${post.type}s/${post.slug}`

  return (
    <section className="grid gap-8 rounded-[36px] bg-slate-950 px-6 py-6 text-white md:grid-cols-[1.15fr_0.85fr] md:px-8 md:py-8">
      <div className="space-y-6">
        <div className="flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-amber-300">
          <span>{getContentTypeLabel(post.type)}</span>
          <span>{getCategoryName(post.primaryCategory)}</span>
        </div>
        <div className="space-y-4">
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight md:text-6xl">
            {post.title}
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-slate-300">{post.excerpt}</p>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-300">
          <span>{getAuthorNames(post.authors)}</span>
          <span>{formatDate(post.publishedAt)}</span>
          {post.readingTime ? <span>{post.readingTime} min read</span> : null}
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href={href} className="rounded-full bg-amber-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-200">
            Read article
          </Link>
          <Link href={`/${post.type}s`} className="rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
            Explore {getContentTypeLabel(post.type)}s
          </Link>
        </div>
      </div>
      <div className="relative min-h-[320px] overflow-hidden rounded-[28px]">
        <Image src={getImageUrl(post.featuredImage)} alt={post.title} fill className="object-cover" />
      </div>
    </section>
  )
}
