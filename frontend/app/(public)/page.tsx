import type { Metadata } from 'next'
import Link from 'next/link'

import { HeroFeature } from './_components/HeroFeature'
import { HomeCategoryPanel } from './_components/HomeCategoryPanel'
import { HomeRowScroller } from './_components/HomeRowScroller'
import {
  HomeLatestInsightCard,
  HomeSectionEmpty,
  HomeTrendingCard,
  HomeWebinarMiniCard,
  HomeWhitepaperRow,
} from './_components/HomeStitchCards'
import { getHomePageData, LISTING_REVALIDATE } from '@/lib/api/cms'
import { getContentTypeConfigByType } from '@/lib/utils/contentTypes'
import { compareWebinarsByEventDate, isUpcomingWebinar } from '@/lib/utils/formatting'
import type { Post } from '@/lib/types/cms'

// Serve from the Data Cache between refreshes instead of hitting the CMS on
// every view; content is at most LISTING_REVALIDATE seconds stale.
export const revalidate = 60

export const metadata: Metadata = {
  title: 'Home',
  description: 'Explore the latest insights, white papers, and webinars from LeadsBaton TechPub.',
}

function uniquePosts(posts: Post[]) {
  return Array.from(new Map(posts.map((post) => [post.id, post])).values())
}

function interleavePostTypes(groups: Post[][], limit: number, excludeId?: string) {
  const output: Post[] = []
  const seen = new Set<string>()
  const maxLength = Math.max(...groups.map((group) => group.length), 0)

  for (let index = 0; index < maxLength && output.length < limit; index += 1) {
    groups.forEach((group) => {
      const post = group[index]
      if (!post || post.id === excludeId || seen.has(post.id) || output.length >= limit) return
      seen.add(post.id)
      output.push(post)
    })
  }

  return output
}

function scoreTrendingPost(post: Post) {
  const featuredScore = post.featured ? 3_000_000 : 0
  const pinnedScore = post.pinned ? 2_000_000 : 0
  const webinarBoost = post.type === 'webinar' ? 180_000 : 0
  const whitepaperBoost = post.type === 'whitepaper' ? 120_000 : 0
  const insightBoost = post.type === 'insight' ? 80_000 : 0
  const categoryScore = typeof post.primaryCategory === 'object' && post.primaryCategory?.featured ? 70_000 : 0
  const readingScore = post.readingTime ? Math.max(0, 20 - post.readingTime) * 500 : 0
  const dateScore = post.publishedAt ? new Date(post.publishedAt).getTime() / 100_000_000 : 0
  return featuredScore + pinnedScore + webinarBoost + whitepaperBoost + insightBoost + categoryScore + readingScore + dateScore
}

function buildTrendingPosts({
  insights,
  whitepapers,
  webinars,
  excludeId,
  limit,
}: {
  insights: Post[]
  whitepapers: Post[]
  webinars: Post[]
  excludeId?: string
  limit: number
}) {
  const groups = [insights, whitepapers, webinars].map((group) =>
    group
      .filter((post) => post.id !== excludeId)
      .sort((a, b) => scoreTrendingPost(b) - scoreTrendingPost(a)),
  )

  const mixed = interleavePostTypes(groups, limit, excludeId)
  if (mixed.length >= limit) return mixed

  return uniquePosts([...mixed, ...groups.flat()])
    .filter((post) => post.id !== excludeId)
    .sort((a, b) => scoreTrendingPost(b) - scoreTrendingPost(a))
    .slice(0, limit)
}

export default async function HomePage() {
  const {
    heroPost,
    insights,
    whitepapers,
    webinars,
    contentTypes,
    categoriesByType,
    categories,
  } = await getHomePageData(LISTING_REVALIDATE)

  // No hero means there's no published content yet, or the backend is
  // unreachable (the API layer swallows errors and returns empty lists). Show a
  // friendly placeholder instead of a completely blank page.
  if (!heroPost) {
    const sections = [
      getContentTypeConfigByType('insight', contentTypes),
      getContentTypeConfigByType('whitepaper', contentTypes),
      getContentTypeConfigByType('webinar', contentTypes),
    ]

    return (
      <section className="site-container flex min-h-[60vh] items-center justify-center py-16">
        <div className="max-w-xl space-y-5 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--accent-red)]">
            LeadsBaton TechPub
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-[color:var(--text-strong)] md:text-4xl">
            Fresh content is on the way.
          </h1>
          <p className="text-lg text-[color:var(--text-soft)]">
            We couldn&apos;t load the homepage highlights right now. Please check back
            shortly, or browse our sections directly.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {sections.map((section) => (
              <Link
                key={section.routeBase}
                href={section.routeBase}
                className="rounded-full border border-[var(--border-subtle)] px-6 py-3 text-sm font-semibold text-[color:var(--text-strong)]"
              >
                {section.pluralLabel}
              </Link>
            ))}
          </div>
        </div>
      </section>
    )
  }

  const webinarConfig = getContentTypeConfigByType('webinar', contentTypes)
  const whitepaperConfig = getContentTypeConfigByType('whitepaper', contentTypes)
  const insightConfig = getContentTypeConfigByType('insight', contentTypes)
  const upcomingWebinars = webinars.filter((post) => isUpcomingWebinar(post)).sort(compareWebinarsByEventDate)

  const secondaryHeroPosts = insights
    .filter((p) => p.id !== heroPost.id)
    .slice(0, 8)
  const trendingPosts = buildTrendingPosts({
    insights,
    whitepapers,
    webinars: upcomingWebinars,
    excludeId: heroPost.id,
    limit: 8,
  })
  const latestInsights = insights.slice(0, 12)
  const mustReadWhitepapers = whitepapers.slice(0, 4)
  const hasMoreWhitepapers = whitepapers.length > mustReadWhitepapers.length

  return (
    <div className="bg-white pb-20 pt-0">
      <HeroFeature
        post={heroPost}
        secondaryPosts={secondaryHeroPosts}
        categories={categoriesByType[heroPost.type] ?? []}
        webinarHref={webinarConfig.routeBase}
        whitepaperHref={whitepaperConfig.routeBase}
      />

      <HomeRowScroller title="Trending Now" className="mt-14 md:mt-16">
        {trendingPosts.length ? (
          trendingPosts.map((post) => <HomeTrendingCard key={post.id} post={post} />)
        ) : (
          <HomeSectionEmpty label="No trending content is available right now." />
        )}
      </HomeRowScroller>

      <HomeRowScroller
        title="Latest Insights"
        href={insightConfig.routeBase}
        className="mt-14 md:mt-16"
      >
        {latestInsights.length ? (
          latestInsights.map((post) => <HomeLatestInsightCard key={post.id} post={post} />)
        ) : (
          <HomeSectionEmpty label="No latest insights are available right now." />
        )}
      </HomeRowScroller>

      <HomeCategoryPanel categories={categories} />

      <HomeRowScroller
        title="Upcoming Webinars"
        href={webinarConfig.routeBase}
        className="mt-14 md:mt-16"
      >
        {upcomingWebinars.length ? (
          upcomingWebinars.slice(0, 12).map((post) => (
            <HomeWebinarMiniCard key={post.id} post={post} />
          ))
        ) : (
          <HomeSectionEmpty label="No upcoming webinars right now." />
        )}
      </HomeRowScroller>

      <section className="site-container mt-14 space-y-6 md:mt-16">
        <div className="flex items-center">
          <h2 className="ui-font text-[26px] font-semibold leading-tight text-[#111] md:text-[32px]">
            Must Read White Papers
          </h2>
        </div>

        <div className="space-y-4">
          {mustReadWhitepapers.length ? (
            mustReadWhitepapers.map((post) => <HomeWhitepaperRow key={post.id} post={post} />)
          ) : (
            <HomeSectionEmpty label="No white papers are available right now." />
          )}
        </div>

        {hasMoreWhitepapers ? (
          <div className="flex justify-center pt-2">
            <Link
              href={whitepaperConfig.routeBase}
              className="inline-flex h-11 items-center justify-center rounded border border-[var(--accent-red)] px-6 text-sm font-bold text-[var(--accent-red)] transition hover:bg-[var(--accent-red)] hover:text-white"
            >
              View more white papers
            </Link>
          </div>
        ) : null}
      </section>
    </div>
  )
}
