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
      <h2 className="text-[26px] font-medium leading-[1.2] text-[#020202] sm:text-[32px]">{title}</h2>
      <div className="double-rule hidden md:block" />
      {href ? (
        <Link
          href={href}
          className="ml-auto whitespace-nowrap text-[16px] font-normal leading-6 text-[#020202] underline underline-offset-4 sm:text-[20px]"
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
      <div className="flex items-center gap-4 sm:gap-6">
        <div className="double-rule" />
        <h2 className="shrink-0 text-center text-[24px] font-medium uppercase leading-[1.2] text-[#020202] sm:text-[36px]">
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
                index === 0 ? 'h-[220px] sm:h-[320px] md:h-[475px]' : 'h-[220px] md:h-[475px]'
              }`}
            >
              <Image
                src={getImageUrl(post.featuredImage)}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-transparent" />
              <div
                className={`absolute right-0 top-0 flex w-[28px] items-center justify-center ${
                  index === 0 ? 'h-[130px] sm:h-[162px]' : 'h-[130px] sm:h-[198px]'
                } ${categoryColor}`}
              >
                <span className="vertical-badge text-[18px] font-bold uppercase tracking-[-0.02em] text-white">
                  {category}
                </span>
              </div>
              {index === 0 ? (
                <div className="absolute bottom-0 left-0 max-w-[290px] p-4 text-white">
                  <h3 className="text-[16px] font-medium leading-[145%] tracking-[-0.005em] sm:text-[18px]">
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

function CategoryBanner({ category }: { category: Category }) {
  return (
    <section className="overflow-hidden rounded-[6px]">
      <div className="relative h-[120px] sm:h-[170px]">
        {category.image ? (
          <Image src={getImageUrl(category.image)} alt={category.name} fill className="object-cover" />
        ) : (
          <div className="absolute inset-0 bg-[linear-gradient(135deg,#0f172a_0%,#1d4ed8_45%,#ff2a1f_100%)]" />
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
  const categories = await getCategoriesForType('whitepaper', 12)
  const selectedCategory = categories.find((item) => item.slug === category)
  const contentTypes = await getContentTypes(12)
  const webinars = await getPosts({ type: 'webinar', limit: 6 })

  if (category && selectedCategory) {
    const categoryWhitepapers = await getPosts({ type: 'whitepaper', category, limit: 6 })

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
    const listing = await getPosts({ type: 'whitepaper', limit: 6, query: q })
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
    getPosts({ type: 'whitepaper', limit: 6, pinned: true }),
    getPosts({ type: 'whitepaper', limit: 9 }),
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
