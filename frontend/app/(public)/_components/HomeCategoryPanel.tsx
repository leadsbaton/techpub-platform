import Link from 'next/link'

import type { Category } from '@/lib/types/cms'
import { hasMediaSource, getImageUrl } from '@/lib/utils/formatting'
import { HomeRuledHeader } from './HomeRuledHeader'
import { SafeImage } from './SafeImage'

const copyBySlug: Record<string, string> = {
  marketing:
    'Explore strategies, stories, & playbooks powering high-impact campaigns & brands.',
  finance:
    'Understand the numbers, risks, & opportunities driving smarter financial decisions.',
  technology:
    'Dive into cutting-edge trends, tools, & insights shaping the future of digital innovation.',
}

const shortCopyBySlug: Record<string, string> = {
  marketing: 'Strategies & Playbooks',
  finance: 'Numbers & Risk Analysis',
  technology: 'Future of Innovation',
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
  const allThree = rankedCategories.slice(0, 3)

  return (
    <>
      {/* ── MOBILE layout (< md) ── stacked overlay cards */}
      <section className="bg-white px-5 py-16 md:hidden">
        <HomeRuledHeader title="Discover by Category" />
        <div className="mt-8 flex flex-col gap-4">
          {allThree.map((category) => (
            <Link
              key={category.id}
              href={getCategoryHref(category.slug)}
              className="group relative flex h-40 items-center justify-center overflow-hidden rounded-lg bg-[color:var(--surface-muted)]"
            >
              <SafeImage
                src={getImageUrl(category.image)}
                alt={category.name}
                fill
                sizes="100vw"
                className="object-cover opacity-30 transition-opacity duration-300 group-hover:opacity-50"
              />
              <div className="relative z-10 p-4 text-center">
                <h3 className="headline-font text-[2rem] font-bold leading-tight text-[color:var(--text-strong)]">
                  {category.name}
                </h3>
                <p className="mt-1 text-[0.75rem] font-semibold text-[color:var(--text-muted)]">
                  {shortCopyBySlug[category.slug] || category.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── DESKTOP layout (≥ md) ── grid with large image cards */}
      <section className="site-container mt-16 hidden space-y-7 md:block">
        <HomeRuledHeader title="Discover by Category" />

        <div className="grid gap-6 md:grid-cols-[0.34fr_0.66fr]">
          {primary.map((category) => (
            <Link
              key={category.id}
              href={getCategoryHref(category.slug)}
              className="group block rounded-[16px]"
            >
              <article className="space-y-3">
                <div className="relative min-h-[260px] overflow-hidden rounded-[16px] bg-[color:var(--surface-muted)] md:min-h-[350px]">
                  <SafeImage
                    src={getImageUrl(category.image)}
                    alt={category.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition duration-300 group-hover:scale-[1.02]"
                  />
                </div>
                <div className="space-y-2">
                  <h3 className="ui-font text-[1rem] font-medium leading-tight text-[color:var(--text-strong)]">
                    {category.name}
                  </h3>
                  <p className="line-clamp-2 text-[0.88rem] leading-6 text-[color:var(--text-muted)]">
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
            className="group block rounded-[16px]"
          >
            <article className="space-y-3">
              <div className="relative min-h-[260px] overflow-hidden rounded-[16px] bg-[color:var(--surface-muted)] md:min-h-[350px]">
                <SafeImage
                  src={getImageUrl(featured.image)}
                  alt={featured.name}
                  fill
                  sizes="(max-width: 1280px) 100vw, 1200px"
                  className="object-cover transition duration-300 group-hover:scale-[1.02]"
                />
              </div>
              <div className="space-y-2">
                <h3 className="ui-font text-[1rem] font-medium leading-tight text-[color:var(--text-strong)]">
                  {featured.name}
                </h3>
                <p className="line-clamp-2 max-w-3xl text-[0.88rem] leading-6 text-[color:var(--text-muted)]">
                  {copyBySlug[featured.slug] ||
                    featured.description ||
                    'Explore a focused stream of high-signal category coverage.'}
                </p>
              </div>
            </article>
          </Link>
        ) : null}
      </section>
    </>
  )
}
