import type { Metadata } from 'next'

import { InsightsListingLayout } from './_components/InsightsListingLayout'
import { getCategories, getPosts, LISTING_REVALIDATE } from '@/lib/api/cms'

// Cache fetches between refreshes; the page still renders per-request for its
// search/category params, but the CMS isn't hit on every view.
export const revalidate = 60

export const metadata: Metadata = {
  title: 'Insights',
  description: 'Latest insights and top picks across technology, finance, and marketing.',
}

export default async function InsightsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string; category?: string; view?: string }>
}) {
  const params = await searchParams
  const query = params.q
  const selectedCategory = params.category
  const viewAll = params.view === 'all'

  const [insightsResponse, categories, whitepapers] = await Promise.all([
    getPosts(
      {
        type: 'insight',
        limit: 18,
        page: Number(params.page || '1'),
        query,
        category: selectedCategory,
      },
      LISTING_REVALIDATE,
    ),
    getCategories(50),
    getPosts({ type: 'whitepaper', limit: 6 }, LISTING_REVALIDATE),
  ])

  return (
    <InsightsListingLayout
      insights={insightsResponse.docs}
      categories={categories}
      selectedCategory={selectedCategory}
      viewAll={viewAll}
      whitepapers={whitepapers.docs}
      currentPage={insightsResponse.page ?? Number(params.page || '1')}
      hasNextPage={insightsResponse.hasNextPage}
    />
  )
}
