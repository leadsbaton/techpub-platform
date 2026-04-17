import type { Metadata } from 'next'

import { SearchPageClient } from './_components/SearchPageClient'
import { getCategories, getContentTypes, getPosts } from '@/lib/api/cms'

export const metadata: Metadata = {
  title: 'Search',
  description: 'Search across insights, white papers, and webinars with filters for type, category, and date.',
}

export const dynamic = 'force-dynamic'

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string
    type?: 'insight' | 'whitepaper' | 'webinar'
    category?: string
    from?: string
    to?: string
    sort?: string
  }>
}) {
  const { q = '', type, category, from, to, sort = '-publishedAt' } = await searchParams

  const [results, categories, contentTypes] = await Promise.all([
    getPosts({
      query: q || undefined,
      type,
      category,
      dateFrom: from,
      dateTo: to,
      sort,
      limit: 9,
    }),
    getCategories(20),
    getContentTypes(12),
  ])

  return (
    <div className="relative left-1/2 w-screen -translate-x-1/2 bg-white">
      <article className="site-container space-y-8 py-8 sm:py-10">
        <header className="space-y-3">
          <h1 className="ui-font text-[34px] font-medium leading-none text-[#111] sm:text-[48px]">
            Search
          </h1>
          <p className="max-w-3xl text-[15px] leading-7 text-[#666]">
            Find the right content across our editorial library with filters for content type, category, publish date, and sort order.
          </p>
        </header>

        <SearchPageClient
          initialResults={results}
          initialFilters={{
            q,
            type: type || '',
            category: category || '',
            from: from || '',
            to: to || '',
            sort,
          }}
          categories={categories}
          contentTypes={contentTypes}
        />
      </article>
    </div>
  )
}
