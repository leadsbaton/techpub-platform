import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { HomeOverlayCard } from '../../_components/HomeOverlayCard'
import { WhitepaperCard } from '../../whitepapers/_components/WhitepaperCard'
import { WebinarCard } from '../../webinars/_components/WebinarCard'
import { getCategoryBySlug, getPosts } from '@/lib/api/cms'
import { getImageUrl } from '@/lib/utils/formatting'

export const dynamic = 'force-dynamic'

function buildTypeHref(type: 'insight' | 'whitepaper' | 'webinar', categorySlug: string) {
  if (type === 'insight') return `/insights?category=${encodeURIComponent(categorySlug)}`
  if (type === 'whitepaper') return `/whitepapers?category=${encodeURIComponent(categorySlug)}`
  return `/webinars?category=${encodeURIComponent(categorySlug)}`
}

function SectionHeader({
  title,
  href,
}: {
  title: string
  href: string
}) {
  return (
    <div className="ui-font flex items-center gap-4">
      <h2 className="text-[24px] font-medium leading-[1.2] text-[#020202] sm:text-[32px]">{title}</h2>
      <div className="double-rule hidden md:block" />
      <Link href={href} className="ml-auto text-[15px] underline underline-offset-4 sm:text-[18px]">
        View all
      </Link>
    </div>
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categorySlug: string }>
}): Promise<Metadata> {
  const { categorySlug } = await params
  const category = await getCategoryBySlug(categorySlug)

  if (!category) return { title: 'Category' }

  return {
    title: category.name,
    description: category.description || `${category.name} content hub`,
  }
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ categorySlug: string }>
}) {
  const { categorySlug } = await params

  const [category, insights, whitepapers, webinars] = await Promise.all([
    getCategoryBySlug(categorySlug),
    getPosts({ type: 'insight', category: categorySlug, limit: 3 }),
    getPosts({ type: 'whitepaper', category: categorySlug, limit: 4 }),
    getPosts({ type: 'webinar', category: categorySlug, limit: 3 }),
  ])

  if (!category) {
    notFound()
  }

  return (
    <div className="relative left-1/2 w-screen -translate-x-1/2 bg-white">
      <article className="site-container space-y-10 py-8 sm:py-10">
        <section className="overflow-hidden rounded-[8px]">
          <div className="relative h-[120px] sm:h-[170px]">
            <Image src={getImageUrl(category.image)} alt={category.name} fill className="object-cover" />
            <div className="absolute inset-0 bg-black/5" />
            <div className="ui-font absolute inset-x-0 bottom-0 p-5 sm:p-7">
              <h1 className="text-[34px] font-medium leading-none text-white sm:text-[58px]">
                {category.name.toUpperCase()}
              </h1>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <SectionHeader title="Insights" href={buildTypeHref('insight', category.slug)} />
          <div className="grid gap-5 md:grid-cols-3">
            {insights.docs.map((post) => (
              <HomeOverlayCard key={post.id} post={post} variant="compact" compactSize="small" />
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <SectionHeader title="White Papers" href={buildTypeHref('whitepaper', category.slug)} />
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {whitepapers.docs.map((post) => (
              <WhitepaperCard key={post.id} post={post} />
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <SectionHeader title="Webinars" href={buildTypeHref('webinar', category.slug)} />
          <div className="grid gap-6 md:grid-cols-3">
            {webinars.docs.map((post) => (
              <WebinarCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      </article>
    </div>
  )
}
