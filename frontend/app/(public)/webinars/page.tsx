import type { Metadata } from 'next'
import Link from 'next/link'

import { SafeImage } from '../_components/SafeImage'
import { WebinarCard } from './_components/WebinarCard'
import { WebinarListingClient } from './_components/WebinarListingClient'
import { getCategoriesForType, getPosts, LISTING_REVALIDATE } from '@/lib/api/cms'
import type { Category, Post } from '@/lib/types/cms'
import { getCategoryAccent, getCategoryName, getImageUrl, getPostCardImageClass, getPostCardImageUrl } from '@/lib/utils/formatting'

// Cache CMS fetches between refreshes instead of hitting the backend per view.
export const revalidate = 60

export const metadata: Metadata = {
  title: 'Webinars',
  description: 'Browse upcoming webinars, featured sessions, and category-led webinar discovery.',
}

function buildFilterHref(category?: string, q?: string, view?: 'all') {
  const params = new URLSearchParams()
  if (category) params.set('category', category)
  if (q) params.set('q', q)
  if (view) params.set('view', view)
  const query = params.toString()
  return query ? `/webinars?${query}` : '/webinars'
}

function CategoryBanner({ category }: { category: Category }) {
  return (
    <section className="overflow-hidden rounded-[6px]">
      <div className="relative h-[120px] sm:h-[170px]">
        {category.image ? (
          <SafeImage src={getImageUrl(category.image)} alt={category.name} fill sizes="(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 1200px" className="object-cover" />
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

function CenterHeader({
  title,
  href,
}: {
  title: string
  href?: string
}) {
  return (
    <div className="ui-font space-y-3">
      <div className="flex items-center gap-4 sm:gap-6">
        <div className="double-rule" />
        <h2 className="min-w-0 text-center text-[24px] font-medium uppercase leading-[1.2] text-[#020202] sm:text-[36px]">
          {title}
        </h2>
        <div className="double-rule" />
      </div>
      {href ? (
        <div className="flex justify-end">
          <Link href={href} className="border-b border-[#020202] text-[16px] leading-none text-[#020202] sm:text-[20px]">
            View all
          </Link>
        </div>
      ) : null}
    </div>
  )
}

function ListingSection({
  title,
  posts,
  page,
  hasNextPage,
  category,
  query,
}: {
  title: string
  posts: Post[]
  page: number
  hasNextPage: boolean
  category?: string
  query?: string
}) {
  return (
    <section className="space-y-8">
      <div className="ui-font flex items-center gap-4">
        <h2 className="text-[26px] font-medium leading-[1.2] text-[#020202] sm:text-[32px]">{title}</h2>
        <div className="double-rule hidden md:block" />
      </div>
      <WebinarListingClient
        initialPosts={posts}
        initialPage={page}
        initialHasNextPage={hasNextPage}
        selectedCategory={category}
        query={query}
      />
    </section>
  )
}

function FeaturedWebinars({ posts }: { posts: Post[] }) {
  const lead = posts[0]
  const side = posts.slice(1, 3)
  if (!lead) return null

  return (
    <section className="space-y-8">
      <CenterHeader title="Upcoming Webinars" href={buildFilterHref(undefined, undefined, 'all')} />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,668px)_minmax(0,467px)] lg:items-start">
        <div className="space-y-3">
          <WebinarCard post={lead} />
        </div>
        <div className="space-y-4">
          {side.map((post) => (
            <WebinarCard key={post.id} post={post} compact />
          ))}
        </div>
      </div>
    </section>
  )
}

function DontMiss({ posts }: { posts: Post[] }) {
  if (!posts.length) return null

  return (
    <section className="relative pt-2">
      <div className="absolute left-0 top-2 hidden h-[255px] w-[356px] bg-[#FC0203] sm:block" />
      <div className="relative bg-[#FC0203] px-8 py-7 text-white sm:w-[356px] sm:px-10">
        <h2 className="ui-font text-[24px] font-bold uppercase leading-none sm:text-[32px]">
          Don&apos;t Miss
        </h2>
      </div>
      <div className="relative bg-[#e3e3e3] px-6 py-8 sm:ml-10 sm:mr-0 sm:px-8 md:ml-10 lg:ml-10">
        <div className="grid gap-8 md:grid-cols-3">
          {posts.slice(0, 3).map((post) => (
            <Link key={post.id} href={`/whitepapers/${post.slug}`} className="group grid grid-cols-[104px_1fr] items-center gap-4">
              <div className="relative h-[104px] w-[104px] overflow-hidden bg-white">
                <SafeImage src={getPostCardImageUrl(post)} alt={post.title} fill sizes="72px" className={getPostCardImageClass(post)} />
              </div>
              <div className="ui-font space-y-1">
                <div
                  className="text-[16px] font-medium uppercase"
                  style={{ color: getCategoryAccent(post.primaryCategory) }}
                >
                  {getCategoryName(post.primaryCategory)}
                </div>
                <div className="line-clamp-3 text-[18px] font-bold leading-[1.22] text-[#111] transition group-hover:text-[var(--accent-red)]">{post.title}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default async function WebinarsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string; view?: string }>
}) {
  const { category, q, view } = await searchParams
  const categories = await getCategoriesForType('webinar', 12, LISTING_REVALIDATE)
  const selectedCategory = categories.find((item) => item.slug === category)

  if (category && selectedCategory) {
    const listing = await getPosts({ type: 'webinar', category, limit: 6 }, LISTING_REVALIDATE)
    return (
      <div className="relative left-1/2 w-screen -translate-x-1/2 bg-white">
        <article className="site-container space-y-8 py-8 sm:py-10">
          <CategoryBanner category={selectedCategory} />
          <ListingSection
            title={selectedCategory.name}
            posts={listing.docs}
            page={listing.page}
            hasNextPage={listing.hasNextPage}
            category={category}
          />
        </article>
      </div>
    )
  }

  if (q || view === 'all') {
    const listing = await getPosts({ type: 'webinar', limit: 6, query: q }, LISTING_REVALIDATE)
    return (
      <div className="relative left-1/2 w-screen -translate-x-1/2 bg-white">
        <article className="site-container space-y-8 py-8 sm:py-10">
          <ListingSection
            title="Upcoming Webinars"
            posts={listing.docs}
            page={listing.page}
            hasNextPage={listing.hasNextPage}
            query={q}
          />
        </article>
      </div>
    )
  }

  const [featuredWebinars, dontMissWhitepapers] = await Promise.all([
    getPosts({ type: 'webinar', limit: 6 }, LISTING_REVALIDATE),
    getPosts({ type: 'whitepaper', limit: 3 }, LISTING_REVALIDATE),
  ])

  return (
    <div className="relative left-1/2 w-screen -translate-x-1/2 bg-white">
      <article className="site-container space-y-14 py-8 sm:py-10">
        <FeaturedWebinars posts={featuredWebinars.docs} />
        <DontMiss posts={dontMissWhitepapers.docs} />
      </article>
    </div>
  )
}
