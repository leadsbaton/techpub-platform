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

  if (!large) {
    return (
      <Link href={getPostHref(post)} className="group block border-b border-[#e5e7eb] py-6 first:pt-0 last:border-b-0 lg:py-7">
        <article>
          <span className="inline-flex rounded-[3px] bg-[#eef2f7] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#14213d]">
            {category}
          </span>
          <h3 className="mt-3 line-clamp-2 text-[20px] font-semibold leading-[1.18] text-[#070022] transition group-hover:text-[var(--accent-red)]">
            {post.title}
          </h3>
          {post.excerpt ? (
            <p className="mt-2 line-clamp-2 text-[14px] leading-6 text-[#555]">
              {post.excerpt}
            </p>
          ) : null}
        </article>
      </Link>
    )
  }

  return (
    <Link href={getPostHref(post)} className="group block">
      <article>
        <div className="relative aspect-[16/9] overflow-hidden bg-[#eef2f7]">
          <SafeImage
            src={getPostCardImageUrl(post)}
            alt={post.title}
            fill
            sizes="(max-width: 1024px) 100vw, 58vw"
            className={`${getPostCardImageClass(post)} transition duration-500 group-hover:scale-[1.04]`}
          />
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <span className="inline-flex rounded-[3px] bg-[#eef2f7] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#14213d]">
            {category}
          </span>
          {post.readingTime ? (
            <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#14213d]">
              {post.readingTime} min read
            </span>
          ) : null}
        </div>
        <h3 className="mt-5 text-[28px] font-semibold leading-[1.15] text-[#070022] transition group-hover:text-[var(--accent-red)] md:text-[34px]">
          {post.title}
        </h3>
        {post.excerpt ? (
          <p className="mt-4 max-w-3xl text-[15px] leading-6 text-[#555] md:text-[16px]">
            {post.excerpt}
          </p>
        ) : null}
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
      <section className="site-container py-10 sm:py-12 md:py-14">
        <div>
          <div className="ui-font mb-8 flex items-center justify-between gap-4 sm:mb-10">
            <h1 className="text-[1.45rem] font-extrabold uppercase leading-none text-[#070022] sm:text-[1.85rem] md:text-[2rem]">
              Just In: Insights
            </h1>
            <span className="h-8 w-8 rounded-[9px] border border-[#cfd4dc]" aria-hidden="true" />
          </div>

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.9fr)_minmax(320px,0.9fr)] lg:items-start">
            <div>{justInLead ? <JustInCard post={justInLead} large /> : null}</div>

            <div className="lg:pt-1">
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
