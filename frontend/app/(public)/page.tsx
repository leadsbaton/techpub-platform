import type { Metadata } from 'next'

import { HeroFeature } from './_components/HeroFeature'
import { HomeOverlayCard } from './_components/HomeOverlayCard'
import { HomeResourceCard } from './_components/HomeResourceCard'
import { HomeSectionHeader } from './_components/HomeSectionHeader'
import { RankedSidebar } from './_components/RankedSidebar'
import { getHomePageData } from '@/lib/api/cms'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Home',
  description: 'Explore the latest insights, white papers, and webinars from LeadsBaton TechPub.',
}

export default async function HomePage() {
  const { heroPost, insights, whitepapers, webinars, categories } = await getHomePageData()
  const rankedItems = [...whitepapers, ...insights]
    .filter((item, index, all) => all.findIndex((candidate) => candidate.id === item.id) === index)
    .slice(0, 6)

  return (
    <div className="pb-20 pt-8 md:pt-10">
      <section className="site-container space-y-10">
        {heroPost ? <HeroFeature post={heroPost} categories={categories} /> : null}
      </section>

      <section className="site-container mt-12 space-y-8">
        <HomeSectionHeader title="Insights" href="/insights" />
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] xl:grid-cols-[minmax(0,1fr)_380px]">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {insights.slice(0, 3).map((post) => (
              <HomeOverlayCard key={post.id} post={post} />
            ))}
          </div>
          <RankedSidebar title="Favorite" accent="People's" items={rankedItems} />
        </div>
      </section>

      <section className="site-container mt-14 space-y-8">
        <HomeSectionHeader title="White Papers" href="/whitepapers" />
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {whitepapers.slice(0, 3).map((post) => (
            <HomeResourceCard key={post.id} post={post} />
          ))}
        </div>
      </section>

      <section className="site-container mt-14 space-y-8">
        <HomeSectionHeader title="Webinars" href="/webinars" />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {webinars.slice(0, 3).map((post) => (
            <HomeOverlayCard key={post.id} post={post} />
          ))}
        </div>
      </section>
    </div>
  )
}
