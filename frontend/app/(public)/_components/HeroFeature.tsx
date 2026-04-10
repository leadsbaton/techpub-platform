import Image from 'next/image'
import Link from 'next/link'

import type { Category, Post } from '@/lib/types/cms'
import { getPostHref } from '@/lib/utils/contentTypes'
import {
  formatDate,
  getCategoryName,
  getContentTypeLabel,
  getImageUrl,
} from '@/lib/utils/formatting'

function renderEchoTitle() {
  return Array.from({ length: 3 }).map((_, index) => (
    <p
      key={index}
      className={`text-[1.35rem] font-semibold leading-[0.95] text-white sm:text-[1.45rem] ${
        index === 0 ? '' : 'opacity-90'
      }`}
    >
      Explore,
      <br />
      Engage,
      <br />
      Elevate
    </p>
  ))
}

export function HeroFeature({
  post,
  secondaryPosts,
  categories,
  webinarHref,
  whitepaperHref,
}: {
  post: Post
  secondaryPosts: Post[]
  categories: Category[]
  webinarHref: string
  whitepaperHref: string
}) {
  const heroHref = getPostHref(post)
  const heroImage = (() => {
    const category = typeof post.primaryCategory === 'string' ? undefined : post.primaryCategory
    return categories.find((item) => item.slug === category?.slug)?.image || post.featuredImage
  })()

  return (
    <section className="overflow-hidden rounded-[30px] bg-[linear-gradient(180deg,var(--hero-purple)_0%,var(--hero-purple-dark)_100%)] px-3 py-4 text-white shadow-[0_28px_70px_rgba(68,16,125,0.28)] md:px-6 md:py-6">
      <div className="grid gap-5 xl:grid-cols-[0.28fr_0.72fr]">
        <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr] xl:grid-cols-1">
          <Link
            href={heroHref}
            className="group overflow-hidden rounded-[22px] bg-white/10 p-3 backdrop-blur-sm"
          >
            <div className="grid h-full gap-4 sm:grid-cols-[0.9fr_1.1fr] xl:grid-cols-1">
              <div className="relative aspect-[1/0.72] overflow-hidden rounded-[16px] xl:aspect-[1/0.92]">
                <Image
                  src={getImageUrl(post.featuredImage)}
                  alt={post.title}
                  fill
                  className="object-cover transition duration-300 group-hover:scale-[1.03]"
                />
              </div>

              <div className="flex flex-col justify-between gap-3 px-1 pb-1">
                <div className="space-y-2">
                  <p className="text-[0.72rem] uppercase tracking-[0.24em] text-white/72">
                    {getContentTypeLabel(post.type)}
                  </p>
                  <h2 className="text-[1.08rem] font-semibold leading-6 md:text-[1.22rem]">
                    {post.title}
                  </h2>
                </div>

                <div className="grid grid-cols-3 gap-3 text-[0.68rem] uppercase tracking-[0.11em] text-white/70">
                  <span>{formatDate(post.publishedAt)}</span>
                  <span>{post.readingTime ? `${post.readingTime} mins` : '12 mins'}</span>
                  <span>{getCategoryName(post.primaryCategory)}</span>
                </div>
              </div>
            </div>
          </Link>

          <div className="grid gap-3 rounded-[22px] bg-white/6 px-4 py-4 sm:grid-cols-3 xl:grid-cols-3">
            {renderEchoTitle()}
          </div>
        </div>

        <div className="space-y-4">
          <div className="overflow-hidden rounded-[24px] bg-black/15 p-3 md:p-4">
            <div className="relative aspect-[1.62/0.96] overflow-hidden rounded-[18px]">
              <Image
                src={getImageUrl(heroImage)}
                alt={post.title}
                fill
                priority
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/28 via-transparent to-black/12" />
            </div>

            <div className="-mt-4 flex flex-col gap-4 px-2 pb-1 sm:-mt-8 sm:px-5 md:flex-row md:items-end md:justify-between">
              <div className="md:max-w-[58%]">
                <p className="text-[0.78rem] uppercase tracking-[0.28em] text-white/72">
                  Explore, Engage, Elevate
                </p>
                <Link
                  href={heroHref}
                  className="mt-2 block text-[clamp(1.55rem,3vw,3rem)] font-semibold leading-[1.03] transition hover:text-white/85"
                >
                  {post.title}
                </Link>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href={webinarHref}
                  className="inline-flex min-h-12 items-center justify-center rounded-[14px] bg-[var(--accent-red)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent-red-dark)]"
                >
                  Join Webinars
                </Link>
                <Link
                  href={whitepaperHref}
                  className="inline-flex min-h-12 items-center justify-center rounded-[14px] bg-white px-5 py-3 text-sm font-semibold text-[color:var(--text-strong)]"
                >
                  Download White Papers
                </Link>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {secondaryPosts.map((item) => (
              <Link
                key={item.id}
                href={getPostHref(item)}
                className="group block overflow-hidden rounded-[16px] bg-white/10 p-2"
              >
                <div className="relative aspect-[1.05/1] overflow-hidden rounded-[12px]">
                  <Image
                    src={getImageUrl(item.featuredImage)}
                    alt={item.title}
                    fill
                    className="object-cover transition duration-300 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/78 via-black/5 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-3">
                    <p className="text-[0.66rem] uppercase tracking-[0.18em] text-white/72">
                      {getCategoryName(item.primaryCategory)}
                    </p>
                    <h3 className="mt-1 line-clamp-2 text-sm font-medium leading-5 text-white">
                      {item.title}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
