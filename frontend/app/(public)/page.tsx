import type { Metadata } from 'next'
import Link from 'next/link'

import { HeroFeature } from './_components/HeroFeature'
import { HomeCategoryPanel } from './_components/HomeCategoryPanel'
import { HomeOverlayCard } from './_components/HomeOverlayCard'
import { HomeResourceCard } from './_components/HomeResourceCard'
import { HomeSectionHeader } from './_components/HomeSectionHeader'
import { getHomePageData, LISTING_REVALIDATE } from '@/lib/api/cms'
import { getContentTypeConfigByType } from '@/lib/utils/contentTypes'

// Serve from the Data Cache between refreshes instead of hitting the CMS on
// every view; content is at most LISTING_REVALIDATE seconds stale.
export const revalidate = 60

export const metadata: Metadata = {
  title: 'Home',
  description: 'Explore the latest insights, white papers, and webinars from LeadsBaton TechPub.',
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

  const secondaryHeroPosts = [...whitepapers, ...webinars, ...insights]
    .filter((item) => item.id !== heroPost.id)
    .slice(0, 4)
  const trendingPosts = insights.slice(0, 3)
  const latestInsights = insights.slice(0, 6)
  const webinarLead = webinars[0] ?? null
  const webinarSupport = webinars.slice(1, 3)
  const mustReadWhitepapers = whitepapers.slice(0, 3)

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
        <HomeSectionHeader title="Trending Now" />
        <div className="grid gap-5 md:grid-cols-3">
          {trendingPosts.map((post) => (
            <HomeOverlayCard key={post.id} post={post} />
          ))}
        </div>
      </section>

      <section className="site-container mt-14 space-y-6 md:mt-16 md:space-y-7">
        <HomeSectionHeader
          title="Explore our Latest Insights"
          subtitle="Insight that inspires, informs, and ignites change"
          href={insightConfig.routeBase}
          actionLabel="View All"
        />
        <div className="grid gap-5 lg:grid-cols-3">
          <div className="space-y-5">
            {latestInsights[0] ? (
              <HomeOverlayCard post={latestInsights[0]} variant="compact" compactSize="large" />
            ) : null}
            {latestInsights[3] ? (
              <HomeOverlayCard post={latestInsights[3]} variant="compact" compactSize="large" />
            ) : null}
          </div>

          <div className="space-y-5">
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

          <div className="space-y-5">
            {latestInsights[2] ? (
              <HomeOverlayCard post={latestInsights[2]} variant="compact" compactSize="large" />
            ) : null}
          </div>
        </div>
      </section>

      <HomeCategoryPanel categories={categories} />

      <section className="site-container mt-14 space-y-6 md:mt-16 md:space-y-7">
        <HomeSectionHeader title="Upcoming Webinars" href={webinarConfig.routeBase} actionLabel="View All" />
        <div className="grid gap-5 lg:grid-cols-[0.48fr_0.52fr]">
          <div className="space-y-5">
            {webinarSupport[0] ? (
              <HomeOverlayCard post={webinarSupport[0]} variant="webinar" compactSize="small" />
            ) : null}
            {webinarSupport[1] ? (
              <HomeOverlayCard post={webinarSupport[1]} variant="webinar" compactSize="small" />
            ) : null}
          </div>
          <div>
            {webinarLead ? <HomeOverlayCard post={webinarLead} variant="webinar" /> : null}
          </div>
        </div>
      </section>

      <section className="site-container mt-14 space-y-6 md:mt-16 md:space-y-7">
        <HomeSectionHeader title="Must Read White Papers" href={whitepaperConfig.routeBase} actionLabel="View All" />
        <div className="grid gap-5 md:grid-cols-3">
          {mustReadWhitepapers.map((post) => (
            <HomeResourceCard key={post.id} post={post} />
          ))}
        </div>
      </section>
    </div>
  )
}
