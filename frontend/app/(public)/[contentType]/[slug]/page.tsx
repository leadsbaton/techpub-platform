import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { RichTextRenderer } from '../../_components/RichTextRenderer'
import { getPostBySlug } from '@/lib/api/cms'
import {
  formatDate,
  getAuthorNames,
  getCategoryName,
  getContentTypeLabel,
  getImageUrl,
} from '@/lib/utils/formatting'

const typeMap = {
  insights: 'insight',
  whitepapers: 'whitepaper',
  webinars: 'webinar',
  'case-studies': 'case-study',
} as const

export default async function Page({
  params,
}: {
  params: Promise<{ contentType: string; slug: string }>
}) {
  const { contentType, slug } = await params
  const mappedType = typeMap[contentType as keyof typeof typeMap]

  if (!mappedType) notFound()

  const post = await getPostBySlug(slug, mappedType)
  if (!post) notFound()

  return (
    <article className="mx-auto max-w-5xl space-y-10 px-4 py-10 md:px-6">
      <div className="space-y-5">
        <Link href={`/${contentType}`} className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
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
