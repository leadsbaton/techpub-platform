import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { WebinarCard } from './_components/WebinarCard'
import { WebinarListingClient } from './_components/WebinarListingClient'
import { getCategoriesForType, getPosts } from '@/lib/api/cms'
import type { Category, Post } from '@/lib/types/cms'
import { getImageUrl } from '@/lib/utils/formatting'

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
        <h2 className="shrink-0 text-center text-[24px] font-medium uppercase leading-[1.2] text-[#020202] sm:text-[36px]">
          {title}
        </h2>
        <div className="double-rule" />
      </div>
      {href ? (
        <div className="flex justify-end">
          <Link href={href} className="text-[16px] underline underline-offset-4 sm:text-[20px]">
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
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_360px]">
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
    <section className="space-y-0 pt-2">
      <div className="ui-font w-[210px] bg-[#FC0203] px-8 py-5 text-[24px] font-medium uppercase text-white sm:w-[240px] sm:text-[28px]">
        Don&apos;t Miss
      </div>
      <div className="bg-[#e9e9e9] px-6 py-8">
        <div className="grid gap-6 md:grid-cols-3">
          {posts.slice(0, 3).map((post) => (
            <Link key={post.id} href={`/whitepapers/${post.slug}`} className="grid grid-cols-[72px_1fr] items-center gap-4">
              <div className="relative h-[62px] w-[72px] overflow-hidden bg-white">
                <Image src={getImageUrl(post.featuredImage)} alt={post.title} fill className="object-cover" />
              </div>
              <div className="ui-font space-y-1">
                <div className="text-[12px] font-bold uppercase text-[#0015AD]">{post.primaryCategory && typeof post.primaryCategory !== 'string' ? post.primaryCategory.name : 'Technology'}</div>
                <div className="text-[16px] font-medium leading-[1.2] text-[#111]">{post.title}</div>
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
  const categories = await getCategoriesForType('webinar', 12)
  const selectedCategory = categories.find((item) => item.slug === category)

  if (category && selectedCategory) {
    const listing = await getPosts({ type: 'webinar', category, limit: 6 })
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
    const listing = await getPosts({ type: 'webinar', limit: 6, query: q })
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
    getPosts({ type: 'webinar', limit: 6 }),
    getPosts({ type: 'whitepaper', limit: 3 }),
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
