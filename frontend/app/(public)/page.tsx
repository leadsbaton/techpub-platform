import type { Metadata } from 'next'

import { HeroFeature } from './_components/HeroFeature'
import { HomeCallout } from './_components/HomeCallout'
import { HomeCategoryPanel } from './_components/HomeCategoryPanel'
import { HomeOverlayCard } from './_components/HomeOverlayCard'
import { HomeResourceCard } from './_components/HomeResourceCard'
import { HomeSectionHeader } from './_components/HomeSectionHeader'
import { getHomePageData } from '@/lib/api/cms'
import { getContentTypeConfigByType } from '@/lib/utils/contentTypes'

export const dynamic = 'force-dynamic'

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
  } = await getHomePageData()

  if (!heroPost) {
    return null
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
    <div className="pb-20 pt-4 md:pt-8">
      <section className="site-container">
        <HeroFeature
          post={heroPost}
          secondaryPosts={secondaryHeroPosts}
          categories={categoriesByType[heroPost.type] ?? []}
          webinarHref={webinarConfig.routeBase}
          whitepaperHref={whitepaperConfig.routeBase}
        />
      </section>

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
              <HomeOverlayCard post={webinarSupport[0]} variant="webinar" />
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

      <HomeCallout />
    </div>
  )
}
