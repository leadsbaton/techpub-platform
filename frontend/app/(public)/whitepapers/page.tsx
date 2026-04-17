import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { RankedSidebar } from '../_components/RankedSidebar'
import { WhitepaperCard } from './_components/WhitepaperCard'
import { WhitepaperListingClient } from './_components/WhitepaperListingClient'
import { getCategoriesForType, getContentTypes, getPosts } from '@/lib/api/cms'
import type { Category, Post } from '@/lib/types/cms'
import { getImageUrl } from '@/lib/utils/formatting'

export const metadata: Metadata = {
  title: 'White Papers',
  description: 'Browse the latest white papers, downloadable resources, and category-led research.',
}

function buildFilterHref(category?: string, q?: string) {
  const params = new URLSearchParams()
  if (category) params.set('category', category)
  if (q) params.set('q', q)
  const query = params.toString()
  return query ? `/whitepapers?${query}` : '/whitepapers'
}

function CategoryHero({ selectedCategory, searchQuery }: { selectedCategory?: Category; searchQuery?: string }) {
  const title = selectedCategory ? selectedCategory.name.toUpperCase() : 'Latest White Papers'
  const description =
    searchQuery && !selectedCategory
      ? `Showing search results for "${searchQuery}".`
      : selectedCategory?.description ||
        'Explore CMS-managed reports, guides, and downloadable resources across your core categories.'

  return (
    <section className="overflow-hidden rounded-[32px] border border-[var(--border-subtle)] bg-white shadow-[var(--shadow-soft)]">
      <div className="relative min-h-[220px] sm:min-h-[260px]">
        {selectedCategory?.image ? (
          <Image
            src={getImageUrl(selectedCategory.image)}
            alt={selectedCategory.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-[linear-gradient(135deg,#101828_0%,#1f3c88_50%,#ff2a1f_100%)]" />
        )}
        <div className="absolute inset-0 bg-black/35" />
        <div className="relative z-10 flex min-h-[220px] items-end p-6 sm:min-h-[260px] sm:p-10">
          <div className="max-w-3xl text-white">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/80">White Papers</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/86 sm:text-base">{description}</p>
          </div>
        </div>
      </div>
    </section>
  )
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
    <div className="section-heading">
      <h2 className="text-[1.8rem] font-semibold tracking-tight text-[color:var(--text-strong)]">
        {title}
      </h2>
      {href ? (
        <Link
          href={href}
          className="ml-auto whitespace-nowrap text-sm font-semibold text-[color:var(--text-muted)] transition hover:text-[var(--accent-red)]"
        >
          {actionLabel}
        </Link>
      ) : null}
    </div>
  )
}

function TrendingDownloads({ posts }: { posts: Post[] }) {
  if (!posts.length) return null

  return (
    <section className="space-y-4">
      <SectionHeader title="Trending Downloads" />
      <div className="overflow-hidden rounded-[28px] border border-[var(--border-subtle)] bg-[#111] p-3 shadow-[var(--shadow-soft)]">
        <div className="grid gap-3 md:grid-cols-3">
          {posts.slice(0, 3).map((post) => (
            <Link
              key={post.id}
              href={`/whitepapers/${post.slug}`}
              className="group relative block min-h-[190px] overflow-hidden rounded-[20px] bg-black"
            >
              <Image
                src={getImageUrl(post.featuredImage)}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <span className="inline-flex rounded-full bg-[var(--accent-red)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white">
                  Trending
                </span>
                <h3 className="mt-3 line-clamp-3 text-lg font-semibold leading-6 text-white">
                  {post.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

function LatestWhitepapers({ posts }: { posts: Post[] }) {
  if (!posts.length) return null

  return (
    <section id="latest-whitepapers" className="space-y-6">
      <SectionHeader title="Latest White Papers" href="#category-sections" />
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {posts.map((post) => (
          <WhitepaperCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  )
}

function CategoryBanner({ category }: { category: Category }) {
  return (
    <div className="overflow-hidden rounded-[26px] border border-[var(--border-subtle)] bg-white shadow-[var(--shadow-soft)]">
      <div className="relative min-h-[170px]">
        {category.image ? (
          <Image src={getImageUrl(category.image)} alt={category.name} fill className="object-cover" />
        ) : (
          <div className="absolute inset-0 bg-[linear-gradient(135deg,#0f172a_0%,#1d4ed8_45%,#ff2a1f_100%)]" />
        )}
        <div className="absolute inset-0 bg-black/35" />
        <div className="relative z-10 flex min-h-[170px] items-end p-6 sm:p-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/75">Category</p>
            <h2 className="mt-2 text-4xl font-semibold tracking-[0.02em] text-white sm:text-5xl">
              {category.name.toUpperCase()}
            </h2>
          </div>
        </div>
      </div>
    </div>
  )
}

function CategoryWhitepaperSection({
  category,
  posts,
  hasMore,
  webinars,
  contentTypes,
}: {
  category: Category
  posts: Post[]
  hasMore: boolean
  webinars: Post[]
  contentTypes: Awaited<ReturnType<typeof getContentTypes>>
}) {
  if (!posts.length) return null

  return (
    <section className="space-y-6">
      <CategoryBanner category={category} />
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-2">
            {posts.map((post) => (
              <WhitepaperCard key={post.id} post={post} />
            ))}
          </div>
          <div className="flex justify-center">
            <Link
              href={buildFilterHref(category.slug)}
              className="rounded-full bg-[var(--accent-red)] px-6 py-3 text-sm font-semibold text-white"
            >
              {hasMore ? 'Load More' : 'View Category'}
            </Link>
          </div>
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
      </div>
    </section>
  )
}

export default async function WhitepapersPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>
}) {
  const { category, q } = await searchParams
  const isFocusedView = Boolean(category || q)

  const [whitepapers, categories, webinars, contentTypes, trendingDownloads, latestWhitepapers] =
    await Promise.all([
      getPosts({ type: 'whitepaper', page: 1, limit: 6, category, query: q }),
      getCategoriesForType('whitepaper', 12),
      getPosts({ type: 'webinar', limit: 6 }),
      getContentTypes(12),
      isFocusedView
        ? Promise.resolve({ docs: [], totalDocs: 0, limit: 0, totalPages: 1, page: 1, hasPrevPage: false, hasNextPage: false, prevPage: null, nextPage: null })
        : getPosts({ type: 'whitepaper', limit: 6, pinned: true }),
      isFocusedView
        ? Promise.resolve({ docs: [], totalDocs: 0, limit: 0, totalPages: 1, page: 1, hasPrevPage: false, hasNextPage: false, prevPage: null, nextPage: null })
        : getPosts({ type: 'whitepaper', limit: 6 }),
    ])

  const categorySections = isFocusedView
    ? []
    : await Promise.all(
        categories.slice(0, 3).map(async (item) => {
          const response = await getPosts({
            type: 'whitepaper',
            category: item.slug,
            limit: 4,
          })

          return {
            category: item,
            posts: response.docs,
            hasMore: response.hasNextPage,
          }
        }),
      )

  const selectedCategory = categories.find((item) => item.slug === category)
  const trendingPosts = trendingDownloads.docs.length
    ? trendingDownloads.docs
    : latestWhitepapers.docs.slice(0, 3)

  if (!isFocusedView) {
    return (
      <article className="site-container space-y-10 py-8 sm:py-10">
        <TrendingDownloads posts={trendingPosts} />
        <LatestWhitepapers posts={latestWhitepapers.docs} />

        <div id="category-sections" className="space-y-10">
          {categorySections.map((section) => (
            <CategoryWhitepaperSection
              key={section.category.id}
              category={section.category}
              posts={section.posts}
              hasMore={section.hasMore}
              webinars={webinars.docs}
              contentTypes={contentTypes}
            />
          ))}
        </div>
      </article>
    )
  }

  return (
    <article className="site-container space-y-8 py-8 sm:py-10">
      <CategoryHero selectedCategory={selectedCategory} searchQuery={q} />

      <section className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <div className="rounded-[28px] bg-white p-5 shadow-[var(--shadow-soft)]">
            <form method="GET" className="flex flex-col gap-4">
              <div className="flex flex-col gap-4 lg:flex-row">
                <input
                  type="search"
                  name="q"
                  defaultValue={q}
                  placeholder="Search white papers by title or excerpt"
                  className="min-w-0 flex-1 rounded-full border border-[var(--border-subtle)] px-5 py-3 outline-none"
                />
                {category ? <input type="hidden" name="category" value={category} /> : null}
                <button
                  type="submit"
                  className="rounded-full bg-[var(--accent-red)] px-5 py-3 text-sm font-semibold text-white"
                >
                  Search
                </button>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href={buildFilterHref(undefined, q)}
                  className={`rounded-full border px-4 py-2 text-sm font-medium ${
                    !category
                      ? 'border-[var(--accent-red)] bg-[var(--accent-red)] text-white'
                      : 'border-[var(--border-subtle)] text-[color:var(--text-soft)]'
                  }`}
                >
                  View All
                </Link>
                {categories.map((item) => (
                  <Link
                    key={item.id}
                    href={buildFilterHref(item.slug, q)}
                    className={`rounded-full border px-4 py-2 text-sm font-medium ${
                      category === item.slug
                        ? 'border-[var(--accent-red)] bg-[var(--accent-red)] text-white'
                        : 'border-[var(--border-subtle)] text-[color:var(--text-soft)]'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </form>
          </div>

          <WhitepaperListingClient
            initialPosts={whitepapers.docs}
            initialPage={whitepapers.page}
            initialHasNextPage={whitepapers.hasNextPage}
            selectedCategory={category}
            query={q}
          />
        </div>

        <div className="space-y-6 xl:sticky xl:top-28 xl:self-start">
          {webinars.docs.length ? (
            <RankedSidebar
              title="Webinars"
              accent="Upcoming"
              items={webinars.docs}
              contentTypes={contentTypes}
            />
          ) : null}
        </div>
      </section>
    </article>
  )
}
