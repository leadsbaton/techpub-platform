import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { ReactNode } from 'react'

import { Pagination } from '../_components/Pagination'
import { PostCard } from '../_components/PostCard'
import { RichTextRenderer } from '../_components/RichTextRenderer'
import { getPageBySlug, getPosts, getSiteSettings } from '@/lib/api/cms'
import type { PageDoc, Post, SiteSettings } from '@/lib/types/cms'
import { getImageUrl, resolveLinkHref } from '@/lib/utils/formatting'

const typeMap = {
  insights: 'insight',
  whitepapers: 'whitepaper',
  webinars: 'webinar',
  'case-studies': 'case-study',
} as const

function getFeaturedPosts(pageDoc: PageDoc) {
  return (
    pageDoc.featuredPosts?.filter(
      (item): item is Exclude<typeof item, string> => Boolean(item && typeof item !== 'string'),
    ) ?? []
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

function InfoPanel({
  title,
  children,
  className = '',
}: {
  title: string
  children: ReactNode
  className?: string
}) {
  return (
    <div className={`rounded-[28px] bg-white p-6 shadow-[var(--shadow-soft)] ${className}`}>
      <h2 className="text-2xl font-semibold tracking-tight text-[color:var(--text-strong)]">{title}</h2>
      <div className="mt-5">{children}</div>
    </div>
  )
}

function ContactTemplate({
  pageDoc,
  settings,
  featuredPosts,
}: {
  pageDoc: PageDoc
  settings: SiteSettings | null
  featuredPosts: Post[]
}) {
  return (
    <article className="site-container space-y-10 px-0 py-10">
      <PageHero pageDoc={pageDoc} />

      <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <InfoPanel title="How To Reach Us" className="md:p-8">
          <div className="prose max-w-none">
            <RichTextRenderer content={pageDoc.content} />
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-[24px] border border-[var(--border-subtle)] bg-[var(--surface)] p-5">
              <div className="text-sm font-semibold uppercase tracking-[0.14em] text-[color:var(--accent-red)]">
                Partnerships
              </div>
              <p className="mt-3 text-sm leading-7 text-[color:var(--text-soft)]">
                Use this route for sponsorships, editorial partnerships, or strategic distribution requests.
              </p>
            </div>
            <div className="rounded-[24px] border border-[var(--border-subtle)] bg-[var(--surface)] p-5">
              <div className="text-sm font-semibold uppercase tracking-[0.14em] text-[color:var(--accent-red)]">
                Reader Support
              </div>
              <p className="mt-3 text-sm leading-7 text-[color:var(--text-soft)]">
                Include the resource title, webinar name, and the email used so the support team can trace your request quickly.
              </p>
            </div>
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
              <div>
                <div className="text-sm font-semibold uppercase tracking-[0.14em] text-[color:var(--text-muted)]">Best For</div>
                <p className="mt-1">Partnerships, content access issues, newsletter support, and webinar questions.</p>
              </div>
            </div>
          </div>

          {settings?.socialLinks?.length ? (
            <div>
              <h3 className="text-lg font-semibold text-[color:var(--text-strong)]">Follow LeadsBaton</h3>
              <div className="mt-4 grid gap-3">
                {settings.socialLinks.map((item) => (
                  <a
                    key={`${item.platform}-${item.url}`}
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-2xl border border-[var(--border-subtle)] bg-white px-4 py-3 text-sm font-medium text-[color:var(--text-strong)]"
                  >
                    {item.platform}
                  </a>
                ))}
              </div>
            </div>
          ) : null}
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

function SupportTemplate({
  pageDoc,
  settings,
  featuredPosts,
}: {
  pageDoc: PageDoc
  settings: SiteSettings | null
  featuredPosts: Post[]
}) {
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
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-[24px] border border-[var(--border-subtle)] bg-[var(--surface)] p-5">
              <h3 className="text-base font-semibold text-[color:var(--text-strong)]">Downloads</h3>
              <p className="mt-2 text-sm leading-7 text-[color:var(--text-soft)]">
                Help with white paper access, download links, and form submission issues.
              </p>
            </div>
            <div className="rounded-[24px] border border-[var(--border-subtle)] bg-[var(--surface)] p-5">
              <h3 className="text-base font-semibold text-[color:var(--text-strong)]">Webinars</h3>
              <p className="mt-2 text-sm leading-7 text-[color:var(--text-soft)]">
                Support for registration problems, event access, and session-related follow-up.
              </p>
            </div>
            <div className="rounded-[24px] border border-[var(--border-subtle)] bg-[var(--surface)] p-5">
              <h3 className="text-base font-semibold text-[color:var(--text-strong)]">Subscriptions</h3>
              <p className="mt-2 text-sm leading-7 text-[color:var(--text-soft)]">
                Newsletter preferences, subscriber changes, and general content notifications.
              </p>
            </div>
            <div className="rounded-[24px] border border-[var(--border-subtle)] bg-[var(--surface)] p-5">
              <h3 className="text-base font-semibold text-[color:var(--text-strong)]">General Issues</h3>
              <p className="mt-2 text-sm leading-7 text-[color:var(--text-soft)]">
                Browser-specific errors, broken links, and unexpected behavior across public pages.
              </p>
            </div>
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

          {settings?.contactEmail ? (
            <div className="rounded-[24px] bg-[var(--surface-muted)] p-5">
              <div className="text-sm font-semibold uppercase tracking-[0.14em] text-[color:var(--text-muted)]">Direct Support</div>
              <a href={`mailto:${settings.contactEmail}`} className="mt-2 block text-lg font-semibold text-[color:var(--text-strong)]">
                {settings.contactEmail}
              </a>
              <p className="mt-3 text-sm leading-7 text-[color:var(--text-soft)]">
                For faster handling, include the page URL, resource name, and what you expected to happen.
              </p>
            </div>
          ) : null}
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

function LegalTemplate({
  pageDoc,
  settings,
}: {
  pageDoc: PageDoc
  settings: SiteSettings | null
}) {
  return (
    <article className="site-container space-y-10 px-0 py-10">
      <PageHero pageDoc={pageDoc} />

      <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <InfoPanel title="Legal Overview" className="md:p-8">
          <div className="prose max-w-none">
            <RichTextRenderer content={pageDoc.content} />
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-[24px] border border-[var(--border-subtle)] bg-[var(--surface)] p-5">
              <div className="text-sm font-semibold uppercase tracking-[0.14em] text-[color:var(--accent-red)]">
                Data Use
              </div>
              <p className="mt-3 text-sm leading-7 text-[color:var(--text-soft)]">
                Covers how subscriber and form data are used to deliver resources and support readers.
              </p>
            </div>
            <div className="rounded-[24px] border border-[var(--border-subtle)] bg-[var(--surface)] p-5">
              <div className="text-sm font-semibold uppercase tracking-[0.14em] text-[color:var(--accent-red)]">
                Content Access
              </div>
              <p className="mt-3 text-sm leading-7 text-[color:var(--text-soft)]">
                Describes the rules around public content, gated white papers, and webinar registration flows.
              </p>
            </div>
            <div className="rounded-[24px] border border-[var(--border-subtle)] bg-[var(--surface)] p-5">
              <div className="text-sm font-semibold uppercase tracking-[0.14em] text-[color:var(--accent-red)]">
                Support Requests
              </div>
              <p className="mt-3 text-sm leading-7 text-[color:var(--text-soft)]">
                Explains how legal or privacy-related questions can be routed through the support team.
              </p>
            </div>
          </div>
        </InfoPanel>

        <aside className="space-y-5 rounded-[32px] border border-[var(--border-subtle)] bg-[var(--surface)] p-6">
          <h2 className="text-2xl font-semibold text-[color:var(--text-strong)]">Policy Notes</h2>
          <div className="space-y-4 text-[15px] leading-7 text-[color:var(--text-soft)]">
            <p>These documents describe site usage, privacy expectations, and content-access rules.</p>
            <p>Any legal updates can be made directly from the Payload `pages` collection without changing frontend code.</p>
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ contentType: string }>
}): Promise<Metadata> {
  const { contentType } = await params
  const mappedType = typeMap[contentType as keyof typeof typeMap]

  if (mappedType) {
    return {
      title: contentType.replace(/-/g, ' '),
    }
  }

  const pageDoc = await getPageBySlug(contentType)
  if (!pageDoc) {
    return {
      title: 'Page',
    }
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
  searchParams: Promise<{ page?: string; q?: string }>
}) {
  const { contentType } = await params
  const { page: rawPage, q } = await searchParams
  const page = Number(rawPage || 1)
  const mappedType = typeMap[contentType as keyof typeof typeMap]

  if (mappedType) {
    const data = await getPosts({ type: mappedType, page, limit: 9, query: q })

    return (
      <section className="mx-auto max-w-7xl space-y-8 px-4 py-10 md:px-6">
        <div className="max-w-3xl space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Content library</p>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
            {contentType.replace(/-/g, ' ')}
          </h1>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {data.docs.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
        <Pagination basePath={`/${contentType}`} currentPage={data.page} totalPages={data.totalPages} query={{ q }} />
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
