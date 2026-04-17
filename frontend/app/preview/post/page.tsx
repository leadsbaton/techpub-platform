import Link from 'next/link'
import { notFound } from 'next/navigation'

import { ContentDetailView } from '@/app/(public)/_components/ContentDetailView'
import { getContentTypeById, getContentTypes, getPreviewPostBySlug } from '@/lib/api/cms'
import type { Post } from '@/lib/types/cms'
import {
  getContentTypeConfigByType,
  getRouteBaseForType,
} from '@/lib/utils/contentTypes'

function PreviewPlaceholder({
  resolvedType,
  title,
  excerpt,
  status,
}: {
  resolvedType: Post['type']
  title?: string
  excerpt?: string
  status?: string
}) {
  const palette =
    resolvedType === 'whitepaper'
      ? { accent: '#FC5A0A', label: 'White Paper', helper: 'Gated detail page and access form preview' }
      : resolvedType === 'webinar'
        ? { accent: '#FC0203', label: 'Webinar', helper: 'Event hero, CTA, speakers, and registration form preview' }
        : { accent: '#0015AD', label: 'Insight', helper: 'Editorial detail page with hero image and content body' }

  return (
    <article className="site-container py-10">
      <div className="space-y-8 rounded-[32px] border border-[var(--border-subtle)] bg-white p-8 shadow-[var(--shadow-soft)]">
        <div className="space-y-4">
          <div
            className="inline-flex rounded-full px-4 py-2 text-sm font-semibold uppercase tracking-[0.14em] text-white"
            style={{ backgroundColor: palette.accent }}
          >
            {palette.label} preview
          </div>
          <h1 className="text-4xl font-semibold tracking-tight text-[color:var(--text-strong)] md:text-6xl">
            {title || 'Untitled post'}
          </h1>
          <div className="flex flex-wrap gap-4 text-sm text-[color:var(--text-muted)]">
            <span>Draft preview</span>
            <span>{status || 'draft'}</span>
            <span>{palette.helper}</span>
          </div>
          <p className="max-w-3xl text-xl leading-9 text-[color:var(--text-soft)]">
            {excerpt || 'Add a featured image, body content, and save once to render the richer frontend preview with related data.'}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.5fr_0.9fr]">
          <div className="overflow-hidden rounded-[28px] border border-[var(--border-subtle)] bg-[var(--surface)]">
            <div className="h-[280px] bg-[linear-gradient(135deg,#eef2ff_0%,#f8fafc_55%,#e2e8f0_100%)]" />
            <div className="space-y-4 p-6">
              <div className="h-4 w-36 rounded-full" style={{ backgroundColor: `${palette.accent}26` }} />
              <div className="h-8 w-full max-w-[34rem] rounded-full bg-[#e2e8f0]" />
              <div className="h-8 w-4/5 rounded-full bg-[#e2e8f0]" />
              <div className="space-y-3 pt-3">
                <div className="h-4 w-full rounded-full bg-[#e2e8f0]" />
                <div className="h-4 w-full rounded-full bg-[#e2e8f0]" />
                <div className="h-4 w-5/6 rounded-full bg-[#e2e8f0]" />
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-[var(--border-subtle)] bg-white p-6">
            <div className="text-sm font-semibold uppercase tracking-[0.14em]" style={{ color: palette.accent }}>
              Preview Checklist
            </div>
            <ul className="mt-4 space-y-3 text-[15px] leading-7 text-[color:var(--text-soft)]">
              <li>Save the post once to load relationships, images, and richer CMS data.</li>
              <li>Use the Preview tab inside Payload to compare the type-specific structure before publishing.</li>
              <li>Review SEO fields and category assignment because they change sharing and listing behavior.</li>
            </ul>
          </div>
        </div>
      </div>
    </article>
  )
}

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
      <>
        <div className="site-container pt-10">
          <Link
            href={getRouteBaseForType(resolvedType, contentTypes)}
            className="text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--accent-red)]"
          >
            {config.pluralLabel}
          </Link>
        </div>
        <PreviewPlaceholder
          resolvedType={resolvedType}
          title={title}
          excerpt={excerpt}
          status={status}
        />
      </>
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
