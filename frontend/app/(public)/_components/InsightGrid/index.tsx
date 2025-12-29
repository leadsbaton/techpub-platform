import type { Insight } from '@/lib/types/insights'
import { InsightCard } from '../InsightCard'

interface InsightGridProps {
  insights: Insight[]
  variant?: 'default' | 'large' | 'small'
  columns?: 1 | 2 | 3 | 4
}

export function InsightGrid({
  insights,
  variant = 'default',
  columns = 3,
}: InsightGridProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }

  return (
    <div className={`grid ${gridCols[columns]} gap-6`}>
      {insights.map((insight) => (
        <InsightCard key={insight.id} insight={insight} variant={variant} />
      ))}
    </div>
  )
}

