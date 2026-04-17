import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { RankedSidebar } from '../_components/RankedSidebar'
import { WhitepaperCard } from './_components/WhitepaperCard'
import { WhitepaperListingClient } from './_components/WhitepaperListingClient'
import { getCategoriesForType, getContentTypes, getPosts } from '@/lib/api/cms'
import type { Category, Post } from '@/lib/types/cms'
import { getCategoryName, getImageUrl } from '@/lib/utils/formatting'

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
    <div className="ui-font flex items-center gap-4">
      <h2 className="text-[32px] font-medium leading-[39px] text-[#020202]">
        {title}
      </h2>
      <div className="double-rule hidden md:block" />
      {href ? (
        <Link
          href={href}
          className="ml-auto whitespace-nowrap text-[20px] font-normal leading-6 text-[#020202] underline underline-offset-4 transition hover:text-[var(--accent-red)]"
        >
          {actionLabel}
        </Link>
      ) : null}
    </div>
  )
}

function TrendingDownloads({ posts }: { posts: Post[] }) {
  if (!posts.length) return null

  const categoryColors: Record<string, string> = {
    technology: 'bg-[#0015AD]',
    finance: 'bg-[#FC0203]',
    marketing: 'bg-[#00A01D]',
  }

  return (
    <section className="ui-font space-y-6">
      <div className="flex items-center gap-6">
        <div className="double-rule" />
        <h2 className="shrink-0 text-center text-[36px] font-medium uppercase leading-[44px] text-[#020202]">
          Trending Downloads
        </h2>
        <div className="double-rule" />
      </div>
      <div className="grid gap-[10px] md:grid-cols-[1.95fr_1fr_0.96fr]">
        {posts.slice(0, 3).map((post, index) => {
          const category = getImageCategory(post)
          const categoryColor = categoryColors[category.toLowerCase()] || 'bg-[#0015AD]'

          return (
            <Link
              key={post.id}
              href={`/whitepapers/${post.slug}`}
              className={`group relative block overflow-hidden bg-black ${
                index === 0 ? 'h-[330px] md:h-[475px]' : 'h-[230px] md:h-[475px]'
              }`}
            >
              <Image
                src={getImageUrl(post.featuredImage)}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
              <div className={`absolute right-0 top-0 flex h-[108px] w-[28px] items-center justify-center md:h-[162px] ${categoryColor}`}>
                <span className="vertical-badge text-[18px] font-bold uppercase leading-none tracking-[-0.02em] text-white">
                  {category}
                </span>
              </div>

              {index === 0 ? (
                <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
                  <h3 className="max-w-[260px] text-[16px] font-medium leading-[145%] tracking-[-0.005em] text-white md:text-[18px]">
                    {post.title}
                  </h3>
                </div>
              ) : null}
            </Link>
          )
        })}
      </div>
    </section>
  )
}

function getImageCategory(post: Post) {
  return getCategoryName(post.primaryCategory).toUpperCase()
}

function LatestWhitepapers({ posts }: { posts: Post[] }) {
  if (!posts.length) return null

  return (
    <section id="latest-whitepapers" className="space-y-8">
      <SectionHeader title="Latest White Papers" href="/whitepapers?view=all" />
      <div className="grid justify-between gap-y-10 gap-x-8 md:grid-cols-2 xl:grid-cols-3">
        {posts.slice(0, 9).map((post) => (
          <WhitepaperCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  )
}

function CategoryBanner({ category }: { category: Category }) {
  return (
    <div className="overflow-hidden rounded-[10px]">
      <div className="relative h-[120px] sm:h-[170px]">
        {category.image ? (
          <Image src={getImageUrl(category.image)} alt={category.name} fill className="object-cover" />
        ) : (
          <div className="absolute inset-0 bg-[linear-gradient(135deg,#0f172a_0%,#1d4ed8_45%,#ff2a1f_100%)]" />
        )}
        <div className="absolute inset-0 bg-black/10" />
        <div className="ui-font absolute inset-x-0 bottom-0 p-5 sm:p-8">
          <h2 className="text-4xl font-medium tracking-normal text-white sm:text-[54px]">
            {category.name.toUpperCase()}
          </h2>
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
          <div className="grid justify-between gap-y-10 gap-x-8 md:grid-cols-2 xl:grid-cols-2">
            {posts.map((post) => (
              <WhitepaperCard key={post.id} post={post} />
            ))}
          </div>
          <div className="flex justify-center">
            <Link
              href={buildFilterHref(category.slug)}
              className="ui-font rounded-[4px] bg-[#FC0203] px-6 py-2 text-[14px] font-medium text-white"
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
      <article className="site-container bg-white py-6 sm:py-8">
        <div className="space-y-14">
          <TrendingDownloads posts={trendingPosts} />
          <LatestWhitepapers posts={latestWhitepapers.docs} />
        </div>

        <div id="category-sections" className="space-y-10 hidden">
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
