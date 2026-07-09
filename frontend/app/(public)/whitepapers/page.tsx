import type { Metadata } from 'next'
import Link from 'next/link'

import { RankedSidebar } from '../_components/RankedSidebar'
import { SafeImage } from '../_components/SafeImage'
import { WhitepaperCard } from './_components/WhitepaperCard'
import { WhitepaperListingClient } from './_components/WhitepaperListingClient'
import { getCategories, getContentTypes, getPosts, LISTING_REVALIDATE } from '@/lib/api/cms'
import type { Category, Post } from '@/lib/types/cms'
import { getCategoryName, getImageUrl, getPostCardImageClass, getPostCardImageUrl } from '@/lib/utils/formatting'

// Cache CMS fetches between refreshes instead of hitting the backend per view.
export const revalidate = 60

export const metadata: Metadata = {
  title: 'White Papers',
  description: 'Browse the latest white papers, downloadable resources, and category-led research.',
}

function buildFilterHref(category?: string, q?: string, view?: 'all') {
  const params = new URLSearchParams()
  if (category) params.set('category', category)
  if (q) params.set('q', q)
  if (view) params.set('view', view)
  const query = params.toString()
  return query ? `/whitepapers?${query}` : '/whitepapers'
}

function getImageCategory(post: Post) {
  return getCategoryName(post.primaryCategory).toUpperCase()
}

function SectionHeader({
  title,
  href,
  actionLabel = 'View all',
}: {
  title: string
  href?: string
  actionLabel?: string
}) {
  return (
    <div className="ui-font flex items-center gap-4">
      <h2 className="text-[22px] font-medium leading-[1.15] text-[#020202] sm:text-[30px]">{title}</h2>
      <div className="double-rule hidden md:block" />
      {href ? (
        <Link
          href={href}
          className="ml-auto whitespace-nowrap border-b border-[#020202] text-[14px] font-medium leading-none text-[#020202] transition hover:border-[var(--accent-red)] hover:text-[var(--accent-red)] sm:text-[16px]"
        >
          {actionLabel}
        </Link>
      ) : null}
    </div>
  )
}

function TrendingDownloads({ posts }: { posts: Post[] }) {
  if (!posts.length) return null

  const [feature, ...supportingPosts] = posts

  return (
    <section className="ui-font space-y-7">
      <h2 className="text-[30px] font-bold leading-tight text-[var(--text-strong)] sm:text-[44px]">
        Trending Downloads
      </h2>

      {feature ? (
        <Link href={`/whitepapers/${feature.slug}`} className="group block">
          <article className="grid overflow-hidden rounded-[4px] border border-[var(--border-subtle)] bg-white transition hover:border-[var(--accent-red)] hover:shadow-[var(--accent-red-shadow)] md:grid-cols-[1.05fr_0.95fr]">
            <div className="flex min-h-[300px] flex-col items-start justify-center p-7 sm:p-10">
              <span className="rounded-full bg-[var(--accent-red-soft)] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--accent-red)]">
                Featured Release
              </span>
              <h3 className="mt-6 max-w-xl text-[26px] font-bold leading-[1.12] text-[var(--text-strong)] sm:text-[34px]">
                {feature.title}
              </h3>
              {feature.excerpt ? (
                <p className="mt-5 max-w-xl text-[15px] leading-7 text-[var(--text-soft)] sm:text-[17px]">
                  {feature.excerpt}
                </p>
              ) : null}
              <span className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-[4px] border border-[var(--accent-red)] px-8 text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--accent-red)] transition group-hover:bg-[var(--accent-red)] group-hover:text-white">
                Download Asset
                <span aria-hidden="true">↓</span>
              </span>
            </div>
            <div className="relative min-h-[260px] bg-[var(--surface-muted)] md:min-h-[390px]">
              <SafeImage
                src={getPostCardImageUrl(feature)}
                alt={feature.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className={`${getPostCardImageClass(feature)} transition-transform duration-500 group-hover:scale-105`}
              />
            </div>
          </article>
        </Link>
      ) : null}

      <div className="grid gap-8 md:grid-cols-2">
        {supportingPosts.slice(0, 2).map((post) => (
          <Link key={post.id} href={`/whitepapers/${post.slug}`} className="group block">
            <article className="flex min-h-[250px] flex-col rounded-[4px] border border-[var(--border-subtle)] bg-white p-7 transition hover:border-[var(--accent-red)] hover:shadow-[var(--accent-red-shadow)] sm:p-9">
              <span className="w-fit rounded-full bg-[var(--accent-red-soft)] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--accent-red)]">
                {getImageCategory(post)}
              </span>
              <h3 className="mt-6 line-clamp-3 text-[22px] font-semibold leading-[1.22] text-[var(--text-strong)] transition group-hover:text-[var(--accent-red)] sm:text-[26px]">
                {post.title}
              </h3>
              {post.excerpt ? (
                <p className="mt-4 line-clamp-3 text-[14px] leading-6 text-[var(--text-soft)] sm:text-[15px]">
                  {post.excerpt}
                </p>
              ) : null}
              <span className="mt-auto flex justify-end border-t border-[var(--border-subtle)] pt-5 text-[22px] leading-none text-[var(--accent-red)] transition group-hover:translate-x-1">
                →
              </span>
            </article>
          </Link>
        ))}
      </div>
    </section>
  )
}

function CategoryBanner({ category }: { category: Category }) {
  return (
    <section className="overflow-hidden rounded-[6px]">
      <div className="relative h-[120px] sm:h-[170px]">
        {category.image ? (
          <SafeImage src={getImageUrl(category.image)} alt={category.name} fill sizes="(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 1200px" className="object-cover" />
        ) : (
          <div className="absolute inset-0 bg-[linear-gradient(135deg,var(--text-strong)_0%,var(--accent-red-dark)_100%)]" />
        )}
        <div className="absolute inset-0 bg-black/5" />
        <div className="ui-font absolute inset-x-0 bottom-0 p-5 sm:p-7">
          <h1 className="text-[34px] font-medium leading-none tracking-normal text-white sm:text-[58px]">
            {category.name.toUpperCase()}
          </h1>
        </div>
      </div>
    </section>
  )
}

function LandingLatestSection({ posts }: { posts: Post[] }) {
  if (!posts.length) return null

  return (
    <section id="latest-whitepapers" className="space-y-8">
      <SectionHeader title="Latest White Papers" href={buildFilterHref(undefined, undefined, 'all')} />
      <div className="grid justify-between gap-x-8 gap-y-10 md:grid-cols-2 xl:grid-cols-3">
        {posts.slice(0, 9).map((post) => (
          <WhitepaperCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  )
}

function ListingSection({
  title,
  posts,
  page,
  hasNextPage,
  category,
  query,
  webinars,
  contentTypes,
}: {
  title: string
  posts: Post[]
  page: number
  hasNextPage: boolean
  category?: string
  query?: string
  webinars: Post[]
  contentTypes: Awaited<ReturnType<typeof getContentTypes>>
}) {
  return (
    <section className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-8">
        <SectionHeader title={title} />
        <WhitepaperListingClient
          initialPosts={posts}
          initialPage={page}
          initialHasNextPage={hasNextPage}
          selectedCategory={category}
          query={query}
        />
      </div>

      <div className="space-y-6 xl:sticky xl:top-28 xl:self-start">
        {webinars.length ? (
          <RankedSidebar
            title="Webinars"
            accent="Upcoming"
            items={webinars}
            contentTypes={contentTypes}
          />
        ) : null}
      </div>
    </section>
  )
}

export default async function WhitepapersPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string; view?: string }>
}) {
  const { category, q, view } = await searchParams
  const categories = await getCategories(50)
  const selectedCategory = categories.find((item) => item.slug === category)
  const contentTypes = await getContentTypes(12)
  const webinars = await getPosts({ type: 'webinar', limit: 6 }, LISTING_REVALIDATE)

  if (category && selectedCategory) {
    const categoryWhitepapers = await getPosts({ type: 'whitepaper', category, limit: 6 }, LISTING_REVALIDATE)

    return (
      <div className="relative left-1/2 w-screen -translate-x-1/2 bg-white">
        <article className="site-container space-y-8 py-8 sm:py-10">
          <CategoryBanner category={selectedCategory} />
          <ListingSection
            title={selectedCategory.name}
            posts={categoryWhitepapers.docs}
            page={categoryWhitepapers.page}
            hasNextPage={categoryWhitepapers.hasNextPage}
            category={category}
            webinars={webinars.docs}
            contentTypes={contentTypes}
          />
        </article>
      </div>
    )
  }

  if (q || view === 'all') {
    const listing = await getPosts({ type: 'whitepaper', limit: 6, query: q }, LISTING_REVALIDATE)
    return (
      <div className="relative left-1/2 w-screen -translate-x-1/2 bg-white">
        <article className="site-container space-y-8 py-8 sm:py-10">
          <ListingSection
            title="Latest White Papers"
            posts={listing.docs}
            page={listing.page}
            hasNextPage={listing.hasNextPage}
            query={q}
            webinars={webinars.docs}
            contentTypes={contentTypes}
          />
        </article>
      </div>
    )
  }

  const [trendingDownloads, latestWhitepapers] = await Promise.all([
    getPosts({ type: 'whitepaper', limit: 6, pinned: true }, LISTING_REVALIDATE),
    getPosts({ type: 'whitepaper', limit: 9 }, LISTING_REVALIDATE),
  ])

  const trendingPosts = trendingDownloads.docs.length
    ? trendingDownloads.docs
    : latestWhitepapers.docs.slice(0, 3)

  return (
    <div className="relative left-1/2 w-screen -translate-x-1/2 bg-white">
      <article className="site-container space-y-14 py-8 sm:py-10">
        <TrendingDownloads posts={trendingPosts} />
        <LandingLatestSection posts={latestWhitepapers.docs} />
      </article>
    </div>
  )
}
