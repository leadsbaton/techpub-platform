import type { Metadata } from 'next'
import Link from 'next/link'

import { HeroFeature } from './_components/HeroFeature'
import { HomeAutoCarousel } from './_components/HomeAutoCarousel'
import { HomeCategoryPanel } from './_components/HomeCategoryPanel'
import { HomeOverlayCard } from './_components/HomeOverlayCard'
import { HomeResourceCard } from './_components/HomeResourceCard'
import { HomeRuledHeader } from './_components/HomeRuledHeader'
import { getHomePageData, LISTING_REVALIDATE } from '@/lib/api/cms'
import { getContentTypeConfigByType } from '@/lib/utils/contentTypes'
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

  const secondaryHeroPosts = interleavePostTypes(
    [insights, whitepapers, webinars],
    8,
    heroPost.id,
  )
  const trendingPosts = buildTrendingPosts({
    insights,
    whitepapers,
    webinars,
    excludeId: heroPost.id,
    limit: 8,
  })
  const latestInsights = insights.slice(0, 7)
  const webinarLead = webinars[0] ?? null
  const webinarSupport = webinars.slice(1, 3)
  const mustReadWhitepapers = whitepapers.slice(0, 8)

  return (
    <div className="pb-20 pt-0">
      <HeroFeature
        post={heroPost}
        secondaryPosts={secondaryHeroPosts}
        categories={categoriesByType[heroPost.type] ?? []}
        webinarHref={webinarConfig.routeBase}
        whitepaperHref={whitepaperConfig.routeBase}
      />

      <section className="site-container mt-12 space-y-6 md:mt-14 md:space-y-7">
        <HomeRuledHeader title="Trending Now" />
        <HomeAutoCarousel trackClassName="px-0 sm:px-12 md:px-14" speed={0.032}>
          {trendingPosts.map((post) => (
            <HomeOverlayCard key={post.id} post={post} />
          ))}
        </HomeAutoCarousel>
      </section>

      <section className="site-container mt-14 space-y-6 md:mt-16 md:space-y-7">
        <HomeRuledHeader
          title="Explore our Latest Insights"
          subtitle="Insight that inspires, informs, and ignites change"
          href={insightConfig.routeBase}
          actionLabel="View All"
        />
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6">
            {latestInsights[0] ? (
              <HomeOverlayCard post={latestInsights[0]} variant="compact" compactSize="large" />
            ) : null}
            {latestInsights[3] ? (
              <HomeOverlayCard post={latestInsights[3]} variant="compact" compactSize="large" />
            ) : null}
          </div>

          <div className="space-y-6">
            {latestInsights[1] ? (
              <HomeOverlayCard post={latestInsights[1]} variant="compact" compactSize="small" />
            ) : null}
            {latestInsights[4] ? (
              <HomeOverlayCard post={latestInsights[4]} variant="compact" compactSize="small" />
            ) : null}
            {latestInsights[5] ? (
              <HomeOverlayCard post={latestInsights[5]} variant="compact" compactSize="small" />
            ) : null}
          </div>

          <div className="space-y-6">
            {latestInsights[2] ? (
              <HomeOverlayCard post={latestInsights[2]} variant="compact" compactSize="small" />
            ) : null}
            {latestInsights[6] ? (
              <HomeOverlayCard post={latestInsights[6]} variant="compact" compactSize="large" />
            ) : null}
          </div>
        </div>
      </section>

      <HomeCategoryPanel categories={categories} />

      <section className="site-container mt-14 space-y-6 md:mt-16 md:space-y-7">
        <HomeRuledHeader title="Upcoming Webinars" />
        <div className="grid gap-2 lg:grid-cols-[0.48fr_0.52fr]">
          <div className="grid gap-2">
            {webinarSupport[0] ? (
              <HomeOverlayCard post={webinarSupport[0]} variant="webinar" compactSize="small" />
            ) : null}
            {webinarSupport[1] ? (
              <HomeOverlayCard post={webinarSupport[1]} variant="webinar" compactSize="small" />
            ) : null}
          </div>
          <div className="min-h-[420px] lg:min-h-0">
            {webinarLead ? <HomeOverlayCard post={webinarLead} variant="webinar" /> : null}
          </div>
        </div>
      </section>

      <section className="mt-14 space-y-6 overflow-hidden md:mt-16 md:space-y-7">
        <HomeRuledHeader title="Must Read White Papers" className="site-container" />
        <HomeAutoCarousel
          className="py-3"
          trackClassName="pl-[max(64px,calc((100vw-1200px)/2+48px))] pr-[max(64px,calc((100vw-1200px)/2+48px))]"
          speed={0.03}
        >
          {mustReadWhitepapers.map((post) => (
            <HomeResourceCard key={post.id} post={post} />
          ))}
        </HomeAutoCarousel>
      </section>
    </div>
  )
}
