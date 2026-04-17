import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { RankedSidebar } from '../_components/RankedSidebar'
import { WhitepaperListingClient } from './_components/WhitepaperListingClient'
import { getCategoriesForType, getContentTypes, getPosts } from '@/lib/api/cms'
import type { Category } from '@/lib/types/cms'
import { getImageUrl } from '@/lib/utils/formatting'

export const metadata: Metadata = {
  title: 'White Papers',
  description: 'Browse the latest white papers, downloadable resources, and category-led research.',
}

function buildFilterHref(category?: string, q?: string) {
  const params = new URLSearchParams()
  if (category) params.set('category', category)
  if (q) params.set('q', q)
  const query = params.toString()
  return query ? `/whitepapers?${query}` : '/whitepapers'
}

function CategoryHero({
  selectedCategory,
  searchQuery,
}: {
  selectedCategory?: Category
  searchQuery?: string
}) {
  const title = selectedCategory ? selectedCategory.name.toUpperCase() : 'Latest White Papers'
  const description =
    searchQuery && !selectedCategory
      ? `Showing search results for "${searchQuery}".`
      : selectedCategory?.description ||
        'Explore CMS-managed reports, guides, and downloadable resources across your core categories.'

  return (
    <section className="overflow-hidden rounded-[32px] border border-[var(--border-subtle)] bg-white shadow-[var(--shadow-soft)]">
      <div className="relative min-h-[220px] sm:min-h-[260px]">
        {selectedCategory?.image ? (
          <Image
            src={getImageUrl(selectedCategory.image)}
            alt={selectedCategory.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-[linear-gradient(135deg,#101828_0%,#1f3c88_50%,#ff2a1f_100%)]" />
        )}
        <div className="absolute inset-0 bg-black/35" />
        <div className="relative z-10 flex min-h-[220px] items-end p-6 sm:min-h-[260px] sm:p-10">
          <div className="max-w-3xl text-white">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/80">White Papers</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/86 sm:text-base">{description}</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default async function WhitepapersPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>
}) {
  const { category, q } = await searchParams
  const [whitepapers, categories, webinars, contentTypes] = await Promise.all([
    getPosts({ type: 'whitepaper', page: 1, limit: 6, category, query: q }),
    getCategoriesForType('whitepaper', 12),
    getPosts({ type: 'webinar', limit: 6 }),
    getContentTypes(12),
  ])

  const selectedCategory = categories.find((item) => item.slug === category)

  return (
    <article className="site-container space-y-8 py-8 sm:py-10">
      <CategoryHero selectedCategory={selectedCategory} searchQuery={q} />

      <section className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <div className="rounded-[28px] bg-white p-5 shadow-[var(--shadow-soft)]">
            <form method="GET" className="flex flex-col gap-4">
              <div className="flex flex-col gap-4 lg:flex-row">
                <input
                  type="search"
                  name="q"
                  defaultValue={q}
                  placeholder="Search white papers by title or excerpt"
                  className="min-w-0 flex-1 rounded-full border border-[var(--border-subtle)] px-5 py-3 outline-none"
                />
                {category ? <input type="hidden" name="category" value={category} /> : null}
                <button
                  type="submit"
                  className="rounded-full bg-[var(--accent-red)] px-5 py-3 text-sm font-semibold text-white"
                >
                  Search
                </button>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href={buildFilterHref(undefined, q)}
                  className={`rounded-full border px-4 py-2 text-sm font-medium ${
                    !category
                      ? 'border-[var(--accent-red)] bg-[var(--accent-red)] text-white'
                      : 'border-[var(--border-subtle)] text-[color:var(--text-soft)]'
                  }`}
                >
                  View All
                </Link>
                {categories.map((item) => (
                  <Link
                    key={item.id}
                    href={buildFilterHref(item.slug, q)}
                    className={`rounded-full border px-4 py-2 text-sm font-medium ${
                      category === item.slug
                        ? 'border-[var(--accent-red)] bg-[var(--accent-red)] text-white'
                        : 'border-[var(--border-subtle)] text-[color:var(--text-soft)]'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </form>
          </div>

          <WhitepaperListingClient
            initialPosts={whitepapers.docs}
            initialPage={whitepapers.page}
            initialHasNextPage={whitepapers.hasNextPage}
            selectedCategory={category}
            query={q}
          />
        </div>

        <div className="space-y-6 xl:sticky xl:top-28 xl:self-start">
          {webinars.docs.length ? (
            <RankedSidebar
              title="Webinars"
              accent="Upcoming"
              items={webinars.docs}
              contentTypes={contentTypes}
            />
          ) : null}
        </div>
      </section>
    </article>
  )
}
