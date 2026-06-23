import Link from 'next/link'

import { HomeRuledHeader } from '../../_components/HomeRuledHeader'
import { RankedSidebar } from '../../_components/RankedSidebar'
import { SafeImage } from '../../_components/SafeImage'
import type { Category, Post } from '@/lib/types/cms'
import { getPostHref } from '@/lib/utils/contentTypes'
import {
  formatShortDate,
  getCategoryAccent,
  getCategoryName,
  getImageUrl,
  getPostCardImageClass,
  getPostCardImageUrl,
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
        className="inline-flex rounded-[2px] px-4 py-2 text-[0.82rem] font-semibold uppercase tracking-[0.08em] text-white"
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
    <Link href={getPostHref(post)} className="group block h-full">
      <article className="flex h-full flex-col">
        <div
          className={`relative overflow-hidden rounded-[6px]  ${
            large ? 'aspect-[1.28/0.9] lg:aspect-[1.12/0.88]' : 'aspect-[1.58/0.9]'
          }`}
        >
          <SafeImage
            src={getPostCardImageUrl(post)}
            alt={post.title}
            fill
            sizes={large ? '(max-width: 1024px) 100vw, 45vw' : '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw'}
            className={`${getPostCardImageClass(post)} transition duration-500 group-hover:scale-[1.04]`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-90" />
          <div
            className="absolute bottom-4 left-4 inline-flex px-3 py-1.5 text-[0.68rem] font-semibold uppercase text-white"
            style={{ backgroundColor: accent }}
          >
            {category}
          </div>
        </div>
        <h3
          className={`mt-4 text-balance text-white transition group-hover:text-white/82 ${
            large
              ? 'ui-font text-[1.25rem] font-medium leading-[1.18] sm:text-[1.45rem] lg:text-[1.55rem]'
              : 'ui-font text-[1rem] font-medium leading-[1.18] sm:text-[1.05rem]'
          }`}
        >
          {post.title}
        </h3>
        <p className="mt-2 text-sm font-medium text-white/82">{formatShortDate(post.publishedAt)}</p>
      </article>
    </Link>
  )
}

function TopPickFeature({ post }: { post: Post }) {
  return (
    <Link href={getPostHref(post)} className="group block">
      <article>
        <div className="relative aspect-[1.45/0.95] overflow-hidden">
          <SafeImage
            src={getPostCardImageUrl(post)}
            alt={post.title}
            fill
            sizes="(max-width: 1024px) 100vw, 33vw"
            className={`${getPostCardImageClass(post)} transition duration-500 group-hover:scale-[1.04]`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/82 via-black/12 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-4 text-white">
            <p className="text-[0.92rem] font-medium">{formatShortDate(post.publishedAt)}</p>
            <h3 className="mt-1 max-w-[24ch] text-[1.05rem] font-semibold leading-[1.25]">
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
    <Link href={getPostHref(post)} className="group grid grid-cols-[112px_1fr] items-center gap-4">
      <div className="relative aspect-square w-full shrink-0 overflow-hidden">
        <SafeImage
          src={getPostCardImageUrl(post)}
          alt={post.title}
          fill
          sizes="112px"
          className={`${getPostCardImageClass(post)} transition duration-500 group-hover:scale-[1.04]`}
        />
      </div>
      <div className="min-w-0">
        <p className="text-[0.82rem] text-[color:var(--text-muted)]">
          {formatShortDate(post.publishedAt)}
        </p>
        <h4 className="mt-1 text-[1rem] font-medium leading-[1.25] text-[color:var(--text-strong)] transition group-hover:text-[var(--accent-red)]">
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
        <SafeImage
          src={getImageUrl(category.image)}
          alt={category.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 1200px"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/25" />
        <h1 className="ui-font absolute inset-0 flex items-center justify-center px-6 text-center text-[2rem] font-medium uppercase tracking-normal text-white sm:text-[2.7rem] md:text-[3.2rem]">
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
        <h3 className="text-[1rem] font-medium leading-[1.4] text-[color:var(--text-strong)]">
          {post.title}
        </h3>
        <p className="mt-2 text-[0.85rem] text-[color:var(--text-muted)]">
          {formatShortDate(post.publishedAt)}
        </p>
      </div>
      <div className="relative aspect-square w-[120px] overflow-hidden bg-[var(--surface-muted)] sm:justify-self-end">
        <SafeImage
          src={getPostCardImageUrl(post)}
          alt={post.title}
          fill
          sizes="120px"
          className={getPostCardImageClass(post)}
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
      <section
        className="py-10 sm:py-12 md:py-14"
        style={{ background: 'linear-gradient(180deg, #C70001 -3.96%, #000000 74.4%)' }}
      >
        <div className="site-container">
          <div className="ui-font mb-8 flex items-center gap-4 sm:mb-10">
            <div className="double-rule [&::after]:border-white/70 [&::before]:border-white/70" />
            <h1 className="shrink-0 text-center text-[1.45rem] font-medium uppercase leading-none text-white sm:text-[1.85rem] md:text-[2rem]">
              Just In: Insights
            </h1>
            <div className="double-rule [&::after]:border-white/70 [&::before]:border-white/70" />
          </div>

          <div className="grid gap-7 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1.15fr)] lg:items-stretch">
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
        <HomeRuledHeader title="Top Picks" href="/insights?view=all" actionLabel="View all" />

        <div className="grid gap-10 lg:grid-cols-3">
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
                  className="ui-font border-b border-[color:var(--text-muted)] text-[0.95rem] font-medium leading-none text-[color:var(--text-muted)] transition hover:border-[var(--accent-red)] hover:text-[var(--accent-red)]"
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
                className="rounded-[8px] bg-[var(--accent-red)] px-10 py-3 text-sm font-medium text-white transition hover:bg-[var(--accent-red-dark)]"
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
          className="text-[0.72rem] font-semibold uppercase tracking-[0.08em]"
          style={{ color: accent }}
        >
          {category}
        </span>
        <h3 className="mt-1.5 text-[1rem] font-medium leading-[1.4] text-[color:var(--text-strong)]">
          {post.title}
        </h3>
        <p className="mt-2 text-[0.85rem] text-[color:var(--text-muted)]">
          {formatShortDate(post.publishedAt)}
        </p>
      </div>
      <div className="relative aspect-square w-[120px] overflow-hidden bg-[var(--surface-muted)] sm:justify-self-end">
        <SafeImage
          src={getPostCardImageUrl(post)}
          alt={post.title}
          fill
          sizes="120px"
          className={getPostCardImageClass(post)}
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
      <HomeRuledHeader title="Insights" />

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
                className="rounded-[8px] bg-[var(--accent-red)] px-10 py-3 text-sm font-medium text-white transition hover:bg-[var(--accent-red-dark)]"
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
