import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { PostCard } from '../../_components/PostCard'
import { RichTextRenderer } from '../../_components/RichTextRenderer'
import { getPostBySlug, getPosts } from '@/lib/api/cms'
import {
  formatDate,
  getAuthorNames,
  getCategoryName,
  getContentTypeLabel,
  getImageUrl,
} from '@/lib/utils/formatting'

export const dynamic = 'force-dynamic'

export default async function InsightDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPostBySlug(slug, 'insight')

  if (!post) {
    notFound()
  }

  const related = await getPosts({
    type: 'insight',
    category: typeof post.primaryCategory === 'string' ? undefined : post.primaryCategory?.slug,
    limit: 3,
  })

  return (
    <article className="mx-auto max-w-5xl space-y-10 px-4 py-10 md:px-6">
      <div className="space-y-5">
        <Link href="/insights" className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
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

      <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-8">
          <p className="text-xl leading-8 text-slate-600">{post.excerpt}</p>
          <RichTextRenderer content={post.content} />
        </div>

        <aside className="space-y-6 rounded-[28px] border border-slate-200 bg-slate-50 p-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Details</p>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <p>Type: {getContentTypeLabel(post.type)}</p>
              <p>Category: {getCategoryName(post.primaryCategory)}</p>
              {post.readingTime ? <p>Reading time: {post.readingTime} min</p> : null}
            </div>
          </div>
          {post.externalUrl ? (
            <a href={post.externalUrl} target="_blank" rel="noreferrer" className="inline-flex rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white">
              Open external resource
            </a>
          ) : null}
        </aside>
      </div>

      {related.docs.length > 1 ? (
        <section className="space-y-6">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-950">Related insights</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {related.docs
              .filter((item) => item.id !== post.id)
              .slice(0, 3)
              .map((item) => (
                <PostCard key={item.id} post={item} />
              ))}
          </div>
        </section>
      ) : null}
    </article>
  )
}
