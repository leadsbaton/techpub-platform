import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { RichTextRenderer } from '@/app/(public)/_components/RichTextRenderer'
import { getContentTypeById, getPreviewPostBySlug } from '@/lib/api/cms'
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
}

export default async function PreviewPostPage({
  searchParams,
}: {
  searchParams: Promise<{ slug?: string; token?: string; type?: string; title?: string; excerpt?: string; status?: string; contentTypeId?: string }>
}) {
  const { slug, token, type, title, excerpt, status, contentTypeId } = await searchParams

  const typeFromQuery = type ? typeMap[type] : null
  const contentType = !typeFromQuery && contentTypeId ? await getContentTypeById(contentTypeId) : null
  const resolvedType = typeFromQuery ?? contentType?.key ?? null

  if (!resolvedType) {
    notFound()
  }

  const post = slug ? await getPreviewPostBySlug(slug, resolvedType, token) : null
  if (!post) {
    return (
      <article className="mx-auto max-w-5xl space-y-10 px-4 py-10 md:px-6">
        <div className="space-y-5">
          <Link href={`/${resolvedType}s`} className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
            {contentType?.label || getContentTypeLabel(resolvedType)}
          </Link>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-950 md:text-6xl">
            {title || 'Untitled post'}
          </h1>
          <div className="flex flex-wrap gap-4 text-sm text-slate-500">
            <span>Draft preview</span>
            <span>{status || 'draft'}</span>
          </div>
        </div>

        <div className="relative aspect-[16/9] overflow-hidden rounded-[32px] bg-slate-200" />

        <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_280px]">
          <div className="space-y-8">
            <p className="text-xl leading-8 text-slate-600">
              {excerpt || 'Add an excerpt in Payload to preview the summary shown on the public post page.'}
            </p>
            <div className="rounded-[28px] border border-dashed border-slate-300 bg-slate-50 p-6 text-slate-600">
              Save the document once to load rich text, media, and relationship content in the full frontend preview.
            </div>
          </div>

          <aside className="space-y-3 rounded-[28px] border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">
            <p>Type: {contentType?.label || getContentTypeLabel(resolvedType)}</p>
            <p>Status: {status || 'draft'}</p>
            <p>Slug: {slug || 'auto-generated after save'}</p>
          </aside>
        </div>
      </article>
    )
  }

  return (
    <article className="mx-auto max-w-5xl space-y-10 px-4 py-10 md:px-6">
      <div className="space-y-5">
        <Link
          href={`/${post.type}s`}
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
