import Link from 'next/link'
import { notFound } from 'next/navigation'

import { ContentDetailView } from '@/app/(public)/_components/ContentDetailView'
import { getContentTypeById, getContentTypes, getPreviewPostBySlug } from '@/lib/api/cms'
import type { Post } from '@/lib/types/cms'
import {
  getContentTypeConfigByType,
  getRouteBaseForType,
} from '@/lib/utils/contentTypes'

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
  const contentTypes = await getContentTypes(12)

  if (!resolvedType) {
    notFound()
  }

  const post = slug ? await getPreviewPostBySlug(slug, resolvedType, token) : null
  if (!post) {
    const config = getContentTypeConfigByType(resolvedType, contentTypes)

    return (
      <article className="site-container space-y-8 py-10">
        <div className="space-y-5 rounded-[32px] bg-white p-8 shadow-[var(--shadow-soft)]">
          <Link
            href={getRouteBaseForType(resolvedType, contentTypes)}
            className="text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--accent-red)]"
          >
            {config.pluralLabel}
          </Link>
          <h1 className="text-4xl font-semibold tracking-tight text-[color:var(--text-strong)] md:text-6xl">
            {title || 'Untitled post'}
          </h1>
          <div className="flex flex-wrap gap-4 text-sm text-[color:var(--text-muted)]">
            <span>Draft preview</span>
            <span>{status || 'draft'}</span>
          </div>
          <p className="max-w-3xl text-xl leading-9 text-[color:var(--text-soft)]">
            {excerpt || 'Add an excerpt and save once to load the full frontend layout, media, and relationship content.'}
          </p>
        </div>
      </article>
    )
  }

  return (
    <ContentDetailView
      post={post}
      contentTypes={contentTypes}
      railItems={[]}
    />
  )
}
