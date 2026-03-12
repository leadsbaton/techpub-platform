import type { Metadata } from 'next'

import { HeroFeature } from './_components/HeroFeature'
import { HomeOverlayCard } from './_components/HomeOverlayCard'
import { HomeResourceCard } from './_components/HomeResourceCard'
import { HomeSectionHeader } from './_components/HomeSectionHeader'
import { RankedSidebar } from './_components/RankedSidebar'
import { getHomePageData } from '@/lib/api/cms'
import { getContentTypeConfigByType } from '@/lib/utils/contentTypes'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Home',
  description: 'Explore the latest insights, white papers, and webinars from LeadsBaton TechPub.',
}

export default async function HomePage() {
  const { heroPost, insights, whitepapers, webinars, categories, contentTypes } =
    await getHomePageData()

  const postsByType = {
    insight: insights,
    whitepaper: whitepapers,
    webinar: webinars,
  }

  const contentSections = contentTypes
    .map((contentType) => ({
      contentType,
      config: getContentTypeConfigByType(contentType.key, contentTypes),
      posts: postsByType[contentType.key],
    }))
    .filter((section) => section.posts.length > 0)

  const rankedItems = [...whitepapers, ...insights, ...webinars]
    .filter((item, index, all) => all.findIndex((candidate) => candidate.id === item.id) === index)
    .slice(0, 6)

  return (
    <div className="pb-20 pt-8 md:pt-10">
      <section className="site-container space-y-10">
        {heroPost ? <HeroFeature post={heroPost} categories={categories} /> : null}
      </section>

      {contentSections.map((section) => {
        const cards =
          section.contentType.key === 'whitepaper'
            ? section.posts.slice(0, 3).map((post) => <HomeResourceCard key={post.id} post={post} />)
            : section.posts.slice(0, 3).map((post) => <HomeOverlayCard key={post.id} post={post} />)

        return (
          <section key={section.contentType.id} className="site-container mt-14 space-y-8">
            <HomeSectionHeader title={section.config.pluralLabel} href={section.config.routeBase} actionLabel="View All" />

            {section.contentType.key === 'insight' ? (
              <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] xl:grid-cols-[minmax(0,1fr)_380px]">
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">{cards}</div>
                <RankedSidebar title="Favorite" accent="People's" items={rankedItems} />
              </div>
            ) : (
              <div
                className={
                  section.contentType.key === 'whitepaper'
                    ? 'grid gap-8 md:grid-cols-2 xl:grid-cols-3'
                    : 'grid gap-6 md:grid-cols-2 xl:grid-cols-3'
                }
              >
                {cards}
              </div>
            )}
          </section>
        )
      })}
    </div>
  )
}
