import Image from 'next/image'
import Link from 'next/link'

import { RankedSidebar } from '../../_components/RankedSidebar'
import type { Category, Post } from '@/lib/types/cms'
import { getPostHref } from '@/lib/utils/contentTypes'
import {
  formatShortDate,
  getCategoryAccent,
  getCategoryName,
  getImageUrl,
} from '@/lib/utils/formatting'

function groupByCategory(posts: Post[], categories: Category[]) {
  return categories
    .map((category) => ({
      category,
      posts: posts.filter((post) => {
        const primary =
          typeof post.primaryCategory === 'string'
            ? post.primaryCategory
            : post.primaryCategory?.slug
        return primary === category.slug
      }),
    }))
    .filter((group) => group.posts.length > 0)
    .slice(0, 3)
}

function CategoryTab({ category }: { category: Category }) {
  return (
    <div className="border-b-2 pb-2" style={{ borderColor: getCategoryAccent(category) }}>
      <span
        className="inline-flex rounded-[2px] px-4 py-2 text-[0.82rem] font-extrabold uppercase tracking-[0.08em] text-white"
        style={{ backgroundColor: getCategoryAccent(category) }}
      >
        {category.name}
      </span>
    </div>
  )
}

function JustInCard({ post, large = false }: { post: Post; large?: boolean }) {
  const category = getCategoryName(post.primaryCategory)
  const accent = getCategoryAccent(post.primaryCategory)

  return (
    <Link href={getPostHref(post)} className="group block">
      <article>
        <div
          className={`relative overflow-hidden rounded-[4px] ${
            large ? 'aspect-[1.1/0.98]' : 'aspect-[1.26/0.7]'
          }`}
        >
          <Image
            src={getImageUrl(post.featuredImage)}
            alt={post.title}
            fill
            className="object-cover transition duration-300 group-hover:scale-[1.02]"
          />
          <div
            className="absolute bottom-3 left-3 inline-flex px-3 py-1.5 text-[0.68rem] font-extrabold uppercase tracking-[0.08em] text-white"
            style={{ backgroundColor: accent }}
          >
            {category}
          </div>
        </div>
        <h3
          className={`mt-4 text-white ${
            large
              ? 'headline-font text-[1rem] font-bold leading-[1.18] md:text-[1.05rem]'
              : 'text-[0.96rem] font-semibold leading-[1.18]'
          }`}
        >
          {post.title}
        </h3>
        <p className="mt-2 text-sm text-white/82">{formatShortDate(post.publishedAt)}</p>
      </article>
    </Link>
  )
}

function TopPickFeature({ post }: { post: Post }) {
  return (
    <Link href={getPostHref(post)} className="group block">
      <article className="space-y-4">
        <div className="relative aspect-[1.22/0.8] overflow-hidden">
          <Image
            src={getImageUrl(post.featuredImage)}
            alt={post.title}
            fill
            className="object-cover transition duration-300 group-hover:scale-[1.02]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/78 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-3 text-white">
            <p className="text-[0.92rem]">{formatShortDate(post.publishedAt)}</p>
            <h3 className="mt-1 max-w-[18ch] text-[0.95rem] font-medium leading-6">
              {post.title}
            </h3>
          </div>
        </div>
      </article>
    </Link>
  )
}

function TopPickListItem({ post }: { post: Post }) {
  return (
    <Link href={getPostHref(post)} className="group flex gap-3">
      <div className="relative h-[88px] w-[88px] shrink-0 overflow-hidden bg-[var(--surface-muted)]">
        <Image
          src={getImageUrl(post.featuredImage)}
          alt={post.title}
          fill
          className="object-cover transition duration-300 group-hover:scale-[1.02]"
        />
      </div>
      <div>
        <p className="text-[0.82rem] text-[color:var(--text-muted)]">
          {formatShortDate(post.publishedAt)}
        </p>
        <h4 className="mt-1 text-[0.92rem] font-semibold leading-[1.3] text-[color:var(--text-strong)]">
          {post.title}
        </h4>
      </div>
    </Link>
  )
}

function CategoryHero({
  category,
}: {
  category: Category
}) {
  return (
    <div className="relative overflow-hidden rounded-[8px]">
      <div className="relative aspect-[4.4/1] max-h-[280px] min-h-[150px]">
        <Image
          src={getImageUrl(category.image)}
          alt={category.name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/25" />
        <h1 className="headline-font absolute inset-0 flex items-center justify-center px-6 text-center text-[2.2rem] font-extrabold uppercase tracking-[0.04em] text-white sm:text-[3rem] md:text-[3.8rem]">
          {category.name}
        </h1>
      </div>
    </div>
  )
}

function CategoryListItem({ post }: { post: Post }) {
  return (
    <Link
      href={getPostHref(post)}
      className="grid items-center gap-5 border-b border-[var(--border-subtle)] py-5 sm:grid-cols-[1fr_120px]"
    >
      <div>
        <h3 className="text-[1rem] font-bold leading-[1.4] text-[color:var(--text-strong)]">
          {post.title}
        </h3>
        <p className="mt-2 text-[0.85rem] text-[color:var(--text-muted)]">
          {formatShortDate(post.publishedAt)}
        </p>
      </div>
      <div className="relative aspect-square w-[120px] overflow-hidden bg-[var(--surface-muted)] sm:justify-self-end">
        <Image
          src={getImageUrl(post.featuredImage)}
          alt={post.title}
          fill
          className="object-cover"
        />
      </div>
    </Link>
  )
}

function LandingView({
  insights,
  categories,
}: {
  insights: Post[]
  categories: Category[]
}) {
  const justInLead = insights[0] ?? null
  const justInSide = insights.slice(1, 5)
  const topPickGroups = groupByCategory(insights, categories)

  return (
    <>
      <section className="bg-[#c40000] py-11 md:py-12">
        <div className="site-container">
          <div className="mb-9 flex items-center gap-4">
            <div className="h-px flex-1 bg-white/70" />
            <h1 className="headline-font text-center text-[1.7rem] font-extrabold uppercase tracking-[0.06em] text-white md:text-[2rem]">
              Just In: Insights
            </h1>
            <div className="h-px flex-1 bg-white/70" />
          </div>

          <div className="grid gap-6 lg:grid-cols-[0.46fr_0.54fr]">
            <div>{justInLead ? <JustInCard post={justInLead} large /> : null}</div>

            <div className="grid gap-6 sm:grid-cols-2">
              {justInSide.map((post) => (
                <JustInCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="site-container mt-14 space-y-8 md:mt-16">
        <div className="flex items-center gap-4">
          <h2 className="headline-font text-[1.9rem] font-extrabold text-[color:var(--text-strong)]">
            Top Picks
          </h2>
          <div className="h-px flex-1 bg-[var(--border-subtle)]" />
          <Link
            href="/insights?view=all"
            className="text-[0.95rem] font-semibold text-[color:var(--text-strong)] underline underline-offset-4"
          >
            View all
          </Link>
        </div>

        <div className="grid gap-9 lg:grid-cols-3">
          {topPickGroups.map(({ category, posts }) => (
            <section key={category.id} className="space-y-6">
              <CategoryTab category={category} />
              {posts[0] ? <TopPickFeature post={posts[0]} /> : null}
              <div className="space-y-5">
                {posts.slice(1, 4).map((post) => (
                  <TopPickListItem key={post.id} post={post} />
                ))}
              </div>
              <div className="pt-1 text-center">
                <Link
                  href={`/insights?category=${category.slug}`}
                  className="text-[0.95rem] font-semibold text-[color:var(--text-muted)] underline underline-offset-4"
                >
                  View More
                </Link>
              </div>
            </section>
          ))}
        </div>
      </section>
    </>
  )
}

function CategoryView({
  category,
  insights,
  whitepapers,
  currentPage,
  hasNextPage,
}: {
  category: Category
  insights: Post[]
  whitepapers: Post[]
  currentPage: number
  hasNextPage: boolean
}) {
  return (
    <section className="site-container py-8 sm:py-10">
      <CategoryHero category={category} />

      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div>
          <div>
            {insights.map((post) => (
              <CategoryListItem key={post.id} post={post} />
            ))}
          </div>
          {hasNextPage ? (
            <div className="flex justify-center pt-10">
              <Link
                href={`/insights?category=${category.slug}&page=${currentPage + 1}`}
                className="rounded-[8px] bg-[var(--accent-red)] px-10 py-3 text-sm font-bold text-white transition hover:bg-[var(--accent-red-dark)]"
              >
                Load More
              </Link>
            </div>
          ) : null}
        </div>

        <div>
          <RankedSidebar accent="Most Downloaded" title="White Papers" items={whitepapers} />
        </div>
      </div>
    </section>
  )
}

function InsightListRow({ post }: { post: Post }) {
  const category = getCategoryName(post.primaryCategory)
  const accent = getCategoryAccent(post.primaryCategory)

  return (
    <Link
      href={getPostHref(post)}
      className="grid items-center gap-5 border-b border-[var(--border-subtle)] py-5 sm:grid-cols-[1fr_120px]"
    >
      <div>
        <span
          className="text-[0.72rem] font-extrabold uppercase tracking-[0.08em]"
          style={{ color: accent }}
        >
          {category}
        </span>
        <h3 className="mt-1.5 text-[1rem] font-bold leading-[1.4] text-[color:var(--text-strong)]">
          {post.title}
        </h3>
        <p className="mt-2 text-[0.85rem] text-[color:var(--text-muted)]">
          {formatShortDate(post.publishedAt)}
        </p>
      </div>
      <div className="relative aspect-square w-[120px] overflow-hidden bg-[var(--surface-muted)] sm:justify-self-end">
        <Image
          src={getImageUrl(post.featuredImage)}
          alt={post.title}
          fill
          className="object-cover"
        />
      </div>
    </Link>
  )
}

function AllInsightsView({
  insights,
  whitepapers,
  currentPage,
  hasNextPage,
}: {
  insights: Post[]
  whitepapers: Post[]
  currentPage: number
  hasNextPage: boolean
}) {
  return (
    <section className="site-container py-8 sm:py-10">
      <div className="section-heading">
        <h1 className="headline-font text-[1.9rem] font-extrabold text-[color:var(--text-strong)]">
          Insights
        </h1>
      </div>

      <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div>
          <div>
            {insights.map((post) => (
              <InsightListRow key={post.id} post={post} />
            ))}
          </div>
          {hasNextPage ? (
            <div className="flex justify-center pt-10">
              <Link
                href={`/insights?view=all&page=${currentPage + 1}`}
                className="rounded-[8px] bg-[var(--accent-red)] px-10 py-3 text-sm font-bold text-white transition hover:bg-[var(--accent-red-dark)]"
              >
                Load More
              </Link>
            </div>
          ) : null}
        </div>

        <div>
          <RankedSidebar accent="Most Downloaded" title="White Papers" items={whitepapers} />
        </div>
      </div>
    </section>
  )
}

export function InsightsListingLayout({
  insights,
  categories,
  whitepapers,
  selectedCategory,
  viewAll = false,
  currentPage = 1,
  hasNextPage = false,
}: {
  insights: Post[]
  categories: Category[]
  whitepapers: Post[]
  selectedCategory?: string
  viewAll?: boolean
  currentPage?: number
  hasNextPage?: boolean
}) {
  const activeCategory = selectedCategory
    ? categories.find((item) => item.slug === selectedCategory)
    : null

  return (
    <main className="bg-white pb-20">
      {activeCategory ? (
        <CategoryView
          category={activeCategory}
          insights={insights}
          whitepapers={whitepapers}
          currentPage={currentPage}
          hasNextPage={hasNextPage}
        />
      ) : viewAll ? (
        <AllInsightsView
          insights={insights}
          whitepapers={whitepapers}
          currentPage={currentPage}
          hasNextPage={hasNextPage}
        />
      ) : (
        <LandingView insights={insights} categories={categories} />
      )}
    </main>
  )
}
