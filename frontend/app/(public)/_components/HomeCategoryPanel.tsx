import Image from 'next/image'
import Link from 'next/link'

import type { Category } from '@/lib/types/cms'
import { hasMediaSource, getImageUrl } from '@/lib/utils/formatting'

const copyBySlug: Record<string, string> = {
  marketing:
    'Explore strategies, stories, & playbooks powering high-impact campaigns & brands.',
  finance:
    'Understand the numbers, risks, & opportunities driving smarter financial decisions.',
  technology:
    'Dive into cutting-edge trends, tools, & insights shaping the future of digital innovation.',
}

const preferredOrder = ['marketing', 'finance', 'technology']

function getCategoryHref(slug: string) {
  return `/categories/${slug}`
}

function sortCategories(categories: Category[]) {
  return [...categories].sort((a, b) => {
    const aPreferred = preferredOrder.indexOf(a.slug)
    const bPreferred = preferredOrder.indexOf(b.slug)

    const aScore =
      (a.featured ? 10 : 0) +
      (hasMediaSource(a.image) ? 5 : 0) +
      (aPreferred >= 0 ? 3 - aPreferred : 0)
    const bScore =
      (b.featured ? 10 : 0) +
      (hasMediaSource(b.image) ? 5 : 0) +
      (bPreferred >= 0 ? 3 - bPreferred : 0)

    if (aScore !== bScore) {
      return bScore - aScore
    }

    return a.name.localeCompare(b.name)
  })
}

export function HomeCategoryPanel({ categories }: { categories: Category[] }) {
  if (!categories.length) return null

  const rankedCategories = sortCategories(categories)
  const primary = rankedCategories.slice(0, 2)
  const featured = rankedCategories[2] ?? rankedCategories[0]

  return (
    <section className="site-container mt-16 space-y-7">
      <div className="section-heading">
        <h2 className="text-[clamp(1.5rem,2.4vw,2.25rem)] font-semibold tracking-tight text-[color:var(--text-strong)]">
          Discover by Category
        </h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {primary.map((category) => (
          <Link
            key={category.id}
            href={getCategoryHref(category.slug)}
            className="group block rounded-[22px]"
          >
            <article className="overflow-hidden rounded-[22px] bg-white shadow-[var(--shadow-soft)]">
              <div className="relative aspect-[1.2/0.78] overflow-hidden bg-[color:var(--surface-muted)]">
                <Image
                  src={getImageUrl(category.image)}
                  alt={category.name}
                  fill
                  className="object-cover transition duration-300 group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
              </div>
              <div className="space-y-3 px-5 py-5">
                <h3 className="text-[1.35rem] font-semibold text-[color:var(--text-strong)]">
                  {category.name}
                </h3>
                <p className="text-[0.98rem] leading-7 text-[color:var(--text-muted)]">
                  {copyBySlug[category.slug] ||
                    category.description ||
                    'Explore the latest editorial coverage in this category.'}
                </p>
              </div>
            </article>
          </Link>
        ))}
      </div>

      {featured ? (
        <Link
          href={getCategoryHref(featured.slug)}
          className="group block rounded-[24px] bg-white shadow-[var(--shadow-soft)]"
        >
          <article className="overflow-hidden rounded-[24px]">
            <div className="relative aspect-[2.8/1] min-h-[240px] overflow-hidden bg-[color:var(--surface-muted)]">
              <Image
                src={getImageUrl(featured.image)}
                alt={featured.name}
                fill
                className="object-cover transition duration-300 group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent" />
            </div>
            <div className="space-y-3 px-6 py-5 md:px-7">
              <h3 className="text-[1.8rem] font-semibold tracking-tight text-[color:var(--text-strong)]">
                {featured.name}
              </h3>
              <p className="max-w-3xl text-[1rem] leading-7 text-[color:var(--text-muted)]">
                {copyBySlug[featured.slug] ||
                  featured.description ||
                  'Explore a focused stream of high-signal category coverage.'}
              </p>
            </div>
          </article>
        </Link>
      ) : null}
    </section>
  )
}
