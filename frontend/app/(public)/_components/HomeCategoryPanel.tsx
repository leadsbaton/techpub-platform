import Link from 'next/link'

import type { Category } from '@/lib/types/cms'

const preferredOrder = ['marketing', 'finance', 'technology']

function getCategoryHref(slug: string) {
  return `/categories/${slug}`
}

function sortCategories(categories: Category[]) {
  return [...categories].sort((a, b) => {
    const aPreferred = preferredOrder.indexOf(a.slug)
    const bPreferred = preferredOrder.indexOf(b.slug)

    const aScore = (a.featured ? 10 : 0) + (aPreferred >= 0 ? 3 - aPreferred : 0)
    const bScore = (b.featured ? 10 : 0) + (bPreferred >= 0 ? 3 - bPreferred : 0)

    if (aScore !== bScore) {
      return bScore - aScore
    }

    return a.name.localeCompare(b.name)
  })
}

export function HomeCategoryPanel({ categories }: { categories: Category[] }) {
  if (!categories.length) return null

  const rankedCategories = sortCategories(categories)

  return (
    <section className="site-container mt-14 md:mt-16">
      <div className="rounded-lg bg-[#eeeeee] px-4 py-7 text-center sm:px-8 md:px-10">
        <h2 className="ui-font text-lg font-bold leading-tight text-black md:text-xl">
          Discover by Category
        </h2>

        <div className="mt-5 flex flex-wrap justify-center gap-3">
          {rankedCategories.map((category) => (
            <Link
              key={category.id}
              href={getCategoryHref(category.slug)}
              className="ui-font rounded-full border border-gray-200 bg-white px-5 py-2 text-[11px] font-bold uppercase tracking-wide text-black shadow-sm transition hover:border-[var(--accent-red)] hover:text-[var(--accent-red)] hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-red)]"
            >
              {category.name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
