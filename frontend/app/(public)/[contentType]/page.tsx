import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { ReactNode } from 'react'

import { Pagination } from '../_components/Pagination'
import { PostCard } from '../_components/PostCard'
import { RichTextRenderer } from '../_components/RichTextRenderer'
import {
  getCategoriesForType,
  getContentTypes,
  getPageBySlug,
  getPosts,
  getSiteSettings,
} from '@/lib/api/cms'
import type { Category, PageDoc, Post, SiteSettings } from '@/lib/types/cms'
import {
  getCategoryFilterHref,
  getContentTypeConfigByRoute,
  normalizeRouteBase,
} from '@/lib/utils/contentTypes'
import { getImageUrl, resolveLinkHref } from '@/lib/utils/formatting'

function getFeaturedPosts(pageDoc: PageDoc) {
  return (
    pageDoc.featuredPosts?.filter(
      (item): item is Exclude<typeof item, string> => Boolean(item && typeof item !== 'string'),
    ) ?? []
  )
}

function CategoryFilters({
  categories,
  routeBase,
  query,
  selectedCategory,
}: {
  categories: Category[]
  routeBase: string
  query?: string
  selectedCategory?: string
}) {
  const buildHref = (category?: string) => {
    const href = getCategoryFilterHref(routeBase, category)
    if (!query) return href
    const separator = href.includes('?') ? '&' : '?'
    return `${href}${separator}q=${encodeURIComponent(query)}`
  }

  return (
    <div className="flex flex-wrap gap-3">
      <Link
        href={buildHref()}
        className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
          !selectedCategory
            ? 'border-[color:var(--accent-red)] bg-[color:var(--accent-red)] text-white'
            : 'border-[var(--border-subtle)] text-[color:var(--text-soft)] hover:border-[var(--accent-red)] hover:text-[color:var(--text-strong)]'
        }`}
      >
        View All
      </Link>
      {categories.map((category) => (
        <Link
          key={category.id}
          href={buildHref(category.slug)}
          className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
            selectedCategory === category.slug
              ? 'border-[color:var(--accent-red)] bg-[color:var(--accent-red)] text-white'
              : 'border-[var(--border-subtle)] text-[color:var(--text-soft)] hover:border-[var(--accent-red)] hover:text-[color:var(--text-strong)]'
          }`}
        >
          {category.name}
        </Link>
      ))}
    </div>
  )
}

function PageHero({ pageDoc }: { pageDoc: PageDoc }) {
  return (
    <section className="grid gap-8 rounded-[32px] bg-white p-6 shadow-[var(--shadow-soft)] md:grid-cols-[1.05fr_0.95fr] md:p-8">
      <div className="space-y-5">
        {pageDoc.hero?.eyebrow ? (
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--accent-red)]">
            {pageDoc.hero.eyebrow}
          </p>
        ) : null}
        <h1 className="text-4xl font-semibold tracking-tight text-[color:var(--text-strong)] md:text-6xl">
          {pageDoc.hero?.headline || pageDoc.title}
        </h1>
        {pageDoc.hero?.description || pageDoc.summary ? (
          <p className="max-w-2xl text-lg leading-8 text-[color:var(--text-soft)]">
            {pageDoc.hero?.description || pageDoc.summary}
          </p>
        ) : null}
        <div className="flex flex-wrap gap-3">
          {pageDoc.hero?.primaryAction ? (
            <Link
              href={resolveLinkHref(pageDoc.hero.primaryAction)}
              className="rounded-full bg-[var(--accent-red)] px-5 py-3 text-sm font-semibold text-white"
            >
              {pageDoc.hero.primaryAction.label}
            </Link>
          ) : null}
          {pageDoc.hero?.secondaryAction ? (
            <Link
              href={resolveLinkHref(pageDoc.hero.secondaryAction)}
              className="rounded-full border border-[var(--border-subtle)] px-5 py-3 text-sm font-semibold text-[color:var(--text-strong)]"
            >
              {pageDoc.hero.secondaryAction.label}
            </Link>
          ) : null}
        </div>
      </div>

      {pageDoc.hero?.image ? (
        <div className="relative min-h-[280px] overflow-hidden rounded-[28px]">
          <Image src={getImageUrl(pageDoc.hero.image)} alt={pageDoc.title} fill className="object-cover" />
        </div>
      ) : null}
    </section>
  )
}

function InfoPanel({ title, children, className = '' }: { title: string; children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-[28px] bg-white p-6 shadow-[var(--shadow-soft)] ${className}`}>
      <h2 className="text-2xl font-semibold tracking-tight text-[color:var(--text-strong)]">{title}</h2>
      <div className="mt-5">{children}</div>
    </div>
  )
}

function ContactTemplate({ pageDoc, settings, featuredPosts }: { pageDoc: PageDoc; settings: SiteSettings | null; featuredPosts: Post[] }) {
  return (
    <article className="site-container space-y-10 px-0 py-10">
      <PageHero pageDoc={pageDoc} />
      <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <InfoPanel title="How To Reach Us" className="md:p-8">
          <div className="prose max-w-none">
            <RichTextRenderer content={pageDoc.content} />
          </div>
        </InfoPanel>
        <aside className="space-y-6 rounded-[32px] border border-[var(--accent-red)] bg-[var(--surface)] p-6">
          <div>
            <h2 className="text-2xl font-semibold text-[color:var(--text-strong)]">Contact Details</h2>
            <div className="mt-5 space-y-4 text-[15px] text-[color:var(--text-soft)]">
              {settings?.contactEmail ? (
                <div>
                  <div className="text-sm font-semibold uppercase tracking-[0.14em] text-[color:var(--text-muted)]">Email</div>
                  <a href={`mailto:${settings.contactEmail}`} className="mt-1 block font-medium text-[color:var(--text-strong)]">
                    {settings.contactEmail}
                  </a>
                </div>
              ) : null}
              <div>
                <div className="text-sm font-semibold uppercase tracking-[0.14em] text-[color:var(--text-muted)]">Response Window</div>
                <p className="mt-1">Usually within 1 to 2 business days.</p>
              </div>
            </div>
          </div>
        </aside>
      </section>
      {featuredPosts.length ? (
        <section className="space-y-6">
          <h2 className="text-3xl font-semibold tracking-tight text-[color:var(--text-strong)]">Featured Resources</h2>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {featuredPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      ) : null}
    </article>
  )
}

function SupportTemplate({ pageDoc, settings, featuredPosts }: { pageDoc: PageDoc; settings: SiteSettings | null; featuredPosts: Post[] }) {
  const supportLinks =
    settings?.footerSections?.find((section) => section.title.toLowerCase() === 'support')?.links ?? []

  return (
    <article className="site-container space-y-10 px-0 py-10">
      <PageHero pageDoc={pageDoc} />
      <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <InfoPanel title="Support Coverage" className="md:p-8">
          <div className="prose max-w-none">
            <RichTextRenderer content={pageDoc.content} />
          </div>
        </InfoPanel>
        <aside className="space-y-6 rounded-[32px] bg-white p-6 shadow-[var(--shadow-soft)]">
          <div>
            <h2 className="text-2xl font-semibold text-[color:var(--text-strong)]">Quick Help</h2>
            <div className="mt-4 grid gap-3">
              {supportLinks.map(({ item }) => (
                <Link
                  key={item.label}
                  href={resolveLinkHref(item)}
                  className="rounded-2xl border border-[var(--border-subtle)] px-4 py-3 text-sm font-medium text-[color:var(--text-strong)]"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </section>
      {featuredPosts.length ? (
        <section className="space-y-6">
          <h2 className="text-3xl font-semibold tracking-tight text-[color:var(--text-strong)]">Help Center Picks</h2>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {featuredPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      ) : null}
    </article>
  )
}

function LegalTemplate({ pageDoc, settings }: { pageDoc: PageDoc; settings: SiteSettings | null }) {
  return (
    <article className="site-container space-y-10 px-0 py-10">
      <PageHero pageDoc={pageDoc} />
      <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <InfoPanel title="Legal Overview" className="md:p-8">
          <div className="prose max-w-none">
            <RichTextRenderer content={pageDoc.content} />
          </div>
        </InfoPanel>
        <aside className="space-y-5 rounded-[32px] border border-[var(--border-subtle)] bg-[var(--surface)] p-6">
          <h2 className="text-2xl font-semibold text-[color:var(--text-strong)]">Policy Notes</h2>
          <div className="space-y-4 text-[15px] leading-7 text-[color:var(--text-soft)]">
            <p>These documents describe site usage, privacy expectations, and content-access rules.</p>
            {settings?.contactEmail ? (
              <p>
                For legal or compliance questions, contact{' '}
                <a href={`mailto:${settings.contactEmail}`} className="font-semibold text-[color:var(--text-strong)]">
                  {settings.contactEmail}
                </a>
                .
              </p>
            ) : null}
          </div>
        </aside>
      </section>
    </article>
  )
}

export async function generateMetadata({ params }: { params: Promise<{ contentType: string }> }): Promise<Metadata> {
  const { contentType } = await params
  const contentTypes = await getContentTypes(12)
  const config = getContentTypeConfigByRoute(contentType, contentTypes)

  if (config) {
    return {
      title: config.pluralLabel,
      description: `Browse the latest ${config.pluralLabel.toLowerCase()} from LeadsBaton.`,
    }
  }

  const pageDoc = await getPageBySlug(contentType)
  if (!pageDoc) {
    return { title: 'Page' }
  }

  return {
    title: pageDoc.seo?.metaTitle || pageDoc.title,
    description: pageDoc.seo?.metaDescription || pageDoc.summary || undefined,
  }
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ contentType: string }>
  searchParams: Promise<{ page?: string; q?: string; category?: string }>
}) {
  const { contentType } = await params
  const { page: rawPage, q, category } = await searchParams
  const page = Number(rawPage || 1)
  const contentTypes = await getContentTypes(12)
  const config = getContentTypeConfigByRoute(contentType, contentTypes)

  if (config) {
    const [data, categories] = await Promise.all([
      getPosts({ type: config.key, page, limit: 9, query: q, category }),
      getCategoriesForType(config.key, 12),
    ])

    return (
      <section className="site-container space-y-8 py-10">
        <div className="max-w-3xl space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--accent-red)]">Content library</p>
          <h1 className="text-4xl font-semibold tracking-tight text-[color:var(--text-strong)] md:text-5xl">
            {config.pluralLabel}
          </h1>
          <p className="text-base leading-7 text-[color:var(--text-soft)]">
            Search published content and filter by the categories that currently exist inside this section.
          </p>
        </div>

        <div className="rounded-[28px] bg-white p-5 shadow-[var(--shadow-soft)]">
          <form className="flex flex-col gap-4 md:flex-row md:items-center" method="GET">
            <input
              type="search"
              name="q"
              defaultValue={q}
              placeholder={`Search ${config.pluralLabel.toLowerCase()} by title or excerpt`}
              className="min-w-0 flex-1 rounded-full border border-[var(--border-subtle)] px-5 py-3 text-[color:var(--text-strong)] outline-none"
            />
            {category ? <input type="hidden" name="category" value={category} /> : null}
            <button
              type="submit"
              className="rounded-full bg-[var(--accent-red)] px-5 py-3 text-sm font-semibold text-white"
            >
              Search
            </button>
          </form>
          <div className="mt-4">
            <CategoryFilters
              categories={categories}
              routeBase={config.routeBase}
              query={q}
              selectedCategory={category}
            />
          </div>
        </div>

        {data.docs.length ? (
          <>
            <div className="text-sm text-[color:var(--text-muted)]">
              Showing {data.docs.length} item{data.docs.length === 1 ? '' : 's'} on this page.
            </div>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {data.docs.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
            <Pagination
              basePath={normalizeRouteBase(config.routeBase)}
              currentPage={data.page}
              totalPages={data.totalPages}
              query={{ q, category }}
            />
          </>
        ) : (
          <div className="rounded-[28px] border border-[var(--border-subtle)] bg-white p-10 text-center shadow-[var(--shadow-soft)]">
            <h2 className="text-2xl font-semibold tracking-tight text-[color:var(--text-strong)]">No published items found</h2>
            <p className="mt-3 text-[color:var(--text-soft)]">
              Try a different keyword or reset the category filter to view all content in this section.
            </p>
          </div>
        )}
      </section>
    )
  }

  const [pageDoc, settings] = await Promise.all([getPageBySlug(contentType), getSiteSettings()])
  if (!pageDoc) notFound()

  const featuredPosts = getFeaturedPosts(pageDoc)

  if (pageDoc.template === 'contact') {
    return <ContactTemplate pageDoc={pageDoc} settings={settings} featuredPosts={featuredPosts} />
  }

  if (pageDoc.template === 'support') {
    return <SupportTemplate pageDoc={pageDoc} settings={settings} featuredPosts={featuredPosts} />
  }

  if (pageDoc.template === 'legal') {
    return <LegalTemplate pageDoc={pageDoc} settings={settings} />
  }

  return (
    <article className="site-container space-y-10 px-0 py-10">
      <PageHero pageDoc={pageDoc} />

      <section className="rounded-[32px] bg-white p-6 shadow-[var(--shadow-soft)] md:p-8">
        <div className="prose max-w-none">
          <RichTextRenderer content={pageDoc.content} />
        </div>
      </section>

      {featuredPosts.length ? (
        <section className="space-y-6">
          <h2 className="text-3xl font-semibold tracking-tight text-[color:var(--text-strong)]">Featured content</h2>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {featuredPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      ) : null}
    </article>
  )
}
