import type { Metadata } from 'next'

import { InsightsListingLayout } from './_components/InsightsListingLayout'
import { getCategoriesForType, getPosts } from '@/lib/api/cms'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Insights',
  description: 'Latest insights and top picks across technology, finance, and marketing.',
}

export default async function InsightsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string; category?: string }>
}) {
  const params = await searchParams
  const query = params.q
  const selectedCategory = params.category

  const [insightsResponse, categories, whitepapers] = await Promise.all([
    getPosts({
      type: 'insight',
      limit: 18,
      page: Number(params.page || '1'),
      query,
      category: selectedCategory,
    }),
    getCategoriesForType('insight', 9),
    getPosts({ type: 'whitepaper', limit: 6 }),
  ])

  return (
    <InsightsListingLayout
      insights={insightsResponse.docs}
      categories={categories}
      selectedCategory={selectedCategory}
      whitepapers={whitepapers.docs}
    />
  )
}
