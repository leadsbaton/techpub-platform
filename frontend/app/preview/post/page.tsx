import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { RichTextRenderer } from '@/app/(public)/_components/RichTextRenderer'
import { getPreviewPostBySlug } from '@/lib/api/cms'
import type { Post } from '@/lib/types/cms'
import {
  formatDate,
  getAuthorNames,
  getCategoryName,
  getContentTypeLabel,
  getImageUrl,
} from '@/lib/utils/formatting'

const typeMap: Record<string, Post['type']> = {
  insight: 'insight',
  whitepaper: 'whitepaper',
  webinar: 'webinar',
  'case-study': 'case-study',
}

export default async function PreviewPostPage({
  searchParams,
}: {
  searchParams: Promise<{ slug?: string; token?: string; type?: string }>
}) {
  const { slug, token, type } = await searchParams

  if (!slug || !type || !typeMap[type]) {
    notFound()
  }

  const post = await getPreviewPostBySlug(slug, typeMap[type], token)

  if (!post) {
    return (
      <section className="mx-auto max-w-5xl space-y-6 px-4 py-10 md:px-6">
        <div className="rounded-[28px] border border-dashed border-slate-300 bg-slate-50 p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Preview unavailable</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
            Save the post first to load the preview
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
            The preview route needs a saved slug and type. After the document is saved, this window will render the same public UI shell used by the live site.
          </p>
        </div>
      </section>
    )
  }

  return (
    <article className="mx-auto max-w-5xl space-y-10 px-4 py-10 md:px-6">
      <div className="space-y-5">
        <Link
          href={`/${post.type === 'case-study' ? 'case-studies' : `${post.type}s`}`}
          className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500"
        >
          {getContentTypeLabel(post.type)}
        </Link>
        <h1 className="text-4xl font-semibold tracking-tight text-slate-950 md:text-6xl">{post.title}</h1>
        <div className="flex flex-wrap gap-4 text-sm text-slate-500">
          <span>{getAuthorNames(post.authors)}</span>
          <span>{formatDate(post.publishedAt)}</span>
          <span>{getCategoryName(post.primaryCategory)}</span>
        </div>
      </div>

      <div className="relative aspect-[16/9] overflow-hidden rounded-[32px]">
        <Image src={getImageUrl(post.featuredImage)} alt={post.title} fill className="object-cover" />
      </div>

      <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_280px]">
        <div className="space-y-8">
          <p className="text-xl leading-8 text-slate-600">{post.excerpt}</p>
          <RichTextRenderer content={post.content} />
        </div>

        <aside className="space-y-3 rounded-[28px] border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">
          <p>Type: {getContentTypeLabel(post.type)}</p>
          <p>Category: {getCategoryName(post.primaryCategory)}</p>
          {post.readingTime ? <p>Reading time: {post.readingTime} min</p> : null}
          {post.externalUrl ? (
            <a href={post.externalUrl} target="_blank" rel="noreferrer" className="inline-flex pt-3 font-semibold text-slate-950">
              Open resource
            </a>
          ) : null}
        </aside>
      </div>
    </article>
  )
}
