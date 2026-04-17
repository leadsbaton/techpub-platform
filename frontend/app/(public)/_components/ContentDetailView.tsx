import Image from 'next/image'
import Link from 'next/link'

import { RankedSidebar } from './RankedSidebar'
import { RichTextRenderer } from './RichTextRenderer'
import type { ContentType, Post } from '@/lib/types/cms'
import {
  getContentTypeConfigByType,
  getRouteBaseForType,
} from '@/lib/utils/contentTypes'
import {
  formatDate,
  getAuthorNames,
  getCategoryName,
  getImageUrl,
  getMediaUrl,
  getWebinarSpeakerSummary,
  resolveLinkHref,
} from '@/lib/utils/formatting'

function getTagNames(post: Post) {
  return post.tags
    ?.map((tag) => (typeof tag === 'string' ? tag : tag.name))
    .filter(Boolean) ?? []
}

function buildPrimaryAction(post: Post) {
  const ctaHref = post.cta?.primary ? resolveLinkHref(post.cta.primary) : null
  const downloadHref = getMediaUrl(post.downloadAsset)

  if (ctaHref && ctaHref !== '#') {
    return { href: ctaHref, label: post.cta?.primary?.label || 'Open resource' }
  }

  if (post.type === 'whitepaper') {
    if (downloadHref) return { href: downloadHref, label: 'Download now' }
    if (post.externalUrl) return { href: post.externalUrl, label: 'Read now' }
  }

  if (post.type === 'webinar') {
    if (post.externalUrl) return { href: post.externalUrl, label: 'Register now' }
    if (post.videoUrl) return { href: post.videoUrl, label: 'Watch session' }
  }

  return null
}

function MetaStrip({ post }: { post: Post }) {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[color:var(--text-muted)]">
      <span>{getAuthorNames(post.authors)}</span>
      <span>{formatDate(post.publishedAt)}</span>
      <span>{getCategoryName(post.primaryCategory)}</span>
      {post.readingTime ? <span>{post.readingTime} min read</span> : null}
    </div>
  )
}

function TagPills({ post }: { post: Post }) {
  const tagNames = getTagNames(post)
  if (!tagNames.length) return null

  return (
    <div className="flex flex-wrap gap-2 pt-2">
      {tagNames.map((tag) => (
        <span
          key={tag}
          className="rounded-full border border-[var(--border-subtle)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--text-muted)]"
        >
          {tag}
        </span>
      ))}
    </div>
  )
}

function GalleryBlock({ post }: { post: Post }) {
  if (!post.gallery?.length) return null

  return (
    <section className="space-y-4 rounded-[28px] bg-white p-6 shadow-[var(--shadow-soft)]">
      <h2 className="text-2xl font-semibold tracking-tight text-[color:var(--text-strong)]">Gallery</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {post.gallery.map((item, index) => (
          <figure key={item.id || `${post.id}-gallery-${index}`} className="overflow-hidden rounded-[24px] bg-[var(--surface)]">
            <div className="relative aspect-[16/10]">
              <Image src={getImageUrl(item.image)} alt={item.caption || post.title} fill className="object-cover" />
            </div>
            {item.caption ? <figcaption className="px-4 py-3 text-sm text-[color:var(--text-soft)]">{item.caption}</figcaption> : null}
          </figure>
        ))}
      </div>
    </section>
  )
}

function ResourceRail({ post, contentTypes, railItems }: { post: Post; contentTypes: ContentType[]; railItems: Post[] }) {
  const config = getContentTypeConfigByType(post.type, contentTypes)
  const items = railItems.filter((item) => item.id !== post.id).slice(0, 6)
  if (!items.length) return null

  return <RankedSidebar title={config.sidebarTitle} accent={config.sidebarAccent} items={items} contentTypes={contentTypes} />
}

function InsightLayout({ post, contentTypes, railItems }: { post: Post; contentTypes: ContentType[]; railItems: Post[] }) {
  return (
    <article className="site-container space-y-8 py-10">
      <div className="space-y-5">
        <Link href={getRouteBaseForType(post.type, contentTypes)} className="text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--accent-red)]">
          {getContentTypeConfigByType(post.type, contentTypes).pluralLabel}
        </Link>
        <h1 className="max-w-5xl text-4xl font-semibold tracking-tight text-[color:var(--text-strong)] md:text-6xl">
          {post.title}
        </h1>
        <MetaStrip post={post} />
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
        <div className="space-y-8">
          <div className="relative aspect-[16/9] overflow-hidden rounded-[32px]">
            <Image src={getImageUrl(post.featuredImage)} alt={post.title} fill className="object-cover" />
          </div>
          <section className="space-y-6 rounded-[32px] bg-white p-6 shadow-[var(--shadow-soft)] md:p-8">
            <p className="text-xl leading-9 text-[color:var(--text-soft)]">{post.excerpt}</p>
            <div className="prose max-w-none">
              <RichTextRenderer content={post.content} />
            </div>
            <TagPills post={post} />
          </section>
          <GalleryBlock post={post} />
        </div>

        <div className="space-y-6 lg:sticky lg:top-28">
          <ResourceRail post={post} contentTypes={contentTypes} railItems={railItems} />
        </div>
      </div>
    </article>
  )
}

function WhitepaperLayout({ post, contentTypes, railItems }: { post: Post; contentTypes: ContentType[]; railItems: Post[] }) {
  const primaryAction = buildPrimaryAction(post)

  return (
    <article className="site-container space-y-8 py-10">
      <div className="space-y-5 text-center lg:text-left">
        <Link href={getRouteBaseForType(post.type, contentTypes)} className="text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--accent-red)]">
          {getContentTypeConfigByType(post.type, contentTypes).pluralLabel}
        </Link>
        <h1 className="mx-auto max-w-4xl text-4xl font-semibold tracking-tight text-[color:var(--text-strong)] lg:mx-0 md:text-6xl">
          {post.title}
        </h1>
      </div>

      <section className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)_360px] lg:items-start">
        <div className="rounded-[28px] bg-white p-5 shadow-[var(--shadow-soft)]">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[18px] bg-[var(--surface-muted)]">
            <Image src={getImageUrl(post.featuredImage)} alt={post.title} fill className="object-cover" />
          </div>
          {primaryAction ? (
            <a
              href={primaryAction.href}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex w-full items-center justify-center rounded-[14px] bg-[var(--accent-red)] px-4 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-white"
            >
              {primaryAction.label}
            </a>
          ) : null}
        </div>

        <div className="space-y-6 rounded-[32px] bg-white p-6 shadow-[var(--shadow-soft)] md:p-8">
          <MetaStrip post={post} />
          <p className="text-xl leading-9 text-[color:var(--text-soft)]">{post.excerpt}</p>
          <div className="prose max-w-none">
            <RichTextRenderer content={post.content} />
          </div>
          <TagPills post={post} />
        </div>

        <div className="space-y-6 lg:sticky lg:top-28">
          <div className="rounded-[28px] border border-[var(--accent-red)] bg-[var(--surface)] p-6">
            <h2 className="text-2xl font-semibold tracking-tight text-[color:var(--text-strong)]">Resource Snapshot</h2>
            <div className="mt-5 space-y-4 text-sm text-[color:var(--text-soft)]">
              <p><span className="font-semibold text-[color:var(--text-strong)]">Category:</span> {getCategoryName(post.primaryCategory)}</p>
              <p><span className="font-semibold text-[color:var(--text-strong)]">Published:</span> {formatDate(post.publishedAt)}</p>
              {post.readingTime ? <p><span className="font-semibold text-[color:var(--text-strong)]">Read time:</span> {post.readingTime} min</p> : null}
              <p><span className="font-semibold text-[color:var(--text-strong)]">Authors:</span> {getAuthorNames(post.authors)}</p>
            </div>
          </div>
          <ResourceRail post={post} contentTypes={contentTypes} railItems={railItems} />
        </div>
      </section>

      <GalleryBlock post={post} />
    </article>
  )
}

function WebinarLayout({ post, contentTypes, railItems }: { post: Post; contentTypes: ContentType[]; railItems: Post[] }) {
  const primaryAction = buildPrimaryAction(post)
  const speakerSummary = getWebinarSpeakerSummary(post) || 'Speakers listed on the webinar page'

  return (
    <article className="site-container space-y-8 py-10">
      <div className="space-y-5">
        <Link href={getRouteBaseForType(post.type, contentTypes)} className="text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--accent-red)]">
          {getContentTypeConfigByType(post.type, contentTypes).pluralLabel}
        </Link>
        <div className="overflow-hidden rounded-[32px] bg-white shadow-[var(--shadow-soft)]">
          <div className="relative aspect-[16/7] min-h-[260px]">
            <Image src={getImageUrl(post.featuredImage)} alt={post.title} fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 space-y-5 p-6 text-white md:p-8">
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/80">
                <span>{formatDate(post.publishedAt)}</span>
                <span>{getCategoryName(post.primaryCategory)}</span>
                {post.webinarRegistration?.eventDateLabel ? <span>{post.webinarRegistration.eventDateLabel}</span> : null}
              </div>
              <h1 className="max-w-4xl text-4xl font-semibold tracking-tight md:text-6xl">{post.title}</h1>
              {primaryAction ? (
                <a
                  href={primaryAction.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center rounded-[16px] bg-[var(--accent-red)] px-6 py-3 text-base font-semibold text-white"
                >
                  {primaryAction.label}
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
        <div className="space-y-6 rounded-[32px] bg-white p-6 shadow-[var(--shadow-soft)] md:p-8">
          <p className="text-xl leading-9 text-[color:var(--text-soft)]">{post.excerpt}</p>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-[22px] border border-[var(--border-subtle)] bg-[var(--surface)] p-5">
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--text-muted)]">Event Type</div>
              <div className="mt-2 text-lg font-semibold text-[color:var(--text-strong)]">{getContentTypeConfigByType(post.type, contentTypes).singularLabel}</div>
            </div>
            <div className="rounded-[22px] border border-[var(--border-subtle)] bg-[var(--surface)] p-5">
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--text-muted)]">Category</div>
              <div className="mt-2 text-lg font-semibold text-[color:var(--text-strong)]">{getCategoryName(post.primaryCategory)}</div>
            </div>
            <div className="rounded-[22px] border border-[var(--border-subtle)] bg-[var(--surface)] p-5">
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--text-muted)]">Speakers</div>
              <div className="mt-2 text-lg font-semibold text-[color:var(--text-strong)]">{speakerSummary}</div>
            </div>
          </div>
          <div className="prose max-w-none">
            <RichTextRenderer content={post.content} />
          </div>
          <TagPills post={post} />
        </div>

        <div className="space-y-6 lg:sticky lg:top-28">
          <ResourceRail post={post} contentTypes={contentTypes} railItems={railItems} />
        </div>
      </section>

      <GalleryBlock post={post} />
    </article>
  )
}

export function ContentDetailView({
  post,
  contentTypes = [],
  railItems = [],
}: {
  post: Post
  contentTypes?: ContentType[]
  railItems?: Post[]
}) {
  if (post.type === 'whitepaper') {
    return <WhitepaperLayout post={post} contentTypes={contentTypes} railItems={railItems} />
  }

  if (post.type === 'webinar') {
    return <WebinarLayout post={post} contentTypes={contentTypes} railItems={railItems} />
  }

  return <InsightLayout post={post} contentTypes={contentTypes} railItems={railItems} />
}
