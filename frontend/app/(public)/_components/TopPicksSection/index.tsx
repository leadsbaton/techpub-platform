import Link from 'next/link'
import type { Insight, Category } from '@/lib/types/insights'
import { InsightCard } from '../InsightCard'

interface TopPicksSectionProps {
  insightsByCategory: {
    category: Category | string
    insights: Insight[]
  }[]
}

export function TopPicksSection({ insightsByCategory }: TopPicksSectionProps) {
  if (!insightsByCategory || insightsByCategory.length === 0) {
    return null
  }

  return (
    <section className="py-16 bg-base-100">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-bold">
            <span className="border-b-4 border-primary pb-2">Top Picks</span>
          </h2>
          <Link href="/insights" className="link link-primary">
            View all
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {insightsByCategory.map(({ category, insights }) => {
            const categoryName =
              typeof category === 'string' ? category : category?.name || ''
            const categorySlug =
              typeof category === 'string' ? category : category?.slug || ''

            // Determine badge color based on category
            const badgeColor =
              categoryName.toLowerCase() === 'technology'
                ? 'badge-primary'
                : categoryName.toLowerCase() === 'finance'
                ? 'badge-error'
                : 'badge-success'

            return (
              <div key={categorySlug} className="flex flex-col">
                {/* Category Header */}
                <div className={`${badgeColor} badge-lg mb-6 w-fit`}>
                  {categoryName.toUpperCase()}
                </div>

                {/* Insights List */}
                <div className="flex flex-col gap-4 flex-grow">
                  {insights.map((insight) => (
                    <InsightCard
                      key={insight.id}
                      insight={insight}
                      variant="small"
                      showCategory={false}
                    />
                  ))}
                </div>

                {/* View More Link */}
                <Link
                  href={`/insights?category=${categorySlug}`}
                  className="link link-primary mt-4"
                >
                  View More
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

