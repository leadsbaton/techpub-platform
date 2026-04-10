import Image from 'next/image'
import Link from 'next/link'

import type { Category, Post } from '@/lib/types/cms'
import { getPostHref } from '@/lib/utils/contentTypes'
import { getImageUrl } from '@/lib/utils/formatting'

function EchoCopy() {
  return (
    <div className="grid grid-cols-[1.15fr_0.85fr_0.85fr] gap-3 text-white">
      <div className="headline-font text-[1.28rem] font-extrabold leading-[0.92] sm:text-[1.75rem]">
        Explore,
        <br />
        Engage,
        <br />
        Elevate
      </div>
      <div className="headline-font text-[0.9rem] font-bold leading-[1.03] text-white/94 sm:text-[1.05rem]">
        Explore,
        <br />
        Engage,
        <br />
        Elevate
      </div>
      <div className="headline-font text-[0.9rem] font-bold leading-[1.03] text-white/94 sm:text-[1.05rem]">
        Explore,
        <br />
        Engage,
        <br />
        Elevate
      </div>
    </div>
  )
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
    <section className="overflow-hidden rounded-[28px] bg-[linear-gradient(180deg,var(--hero-purple)_0%,var(--hero-purple-dark)_100%)] px-4 py-6 text-white shadow-[0_28px_70px_rgba(68,16,125,0.28)] md:px-8 md:py-8">
      <div className="grid gap-5 xl:grid-cols-[0.28fr_0.72fr]">
        <div className="flex flex-col gap-4">
          <Link href={heroHref} className="group block overflow-hidden rounded-[18px]">
            <div className="relative aspect-[1.18/0.72] overflow-hidden rounded-[18px]">
              <Image
                src={getImageUrl(post.featuredImage)}
                alt={post.title}
                fill
                className="object-cover transition duration-300 group-hover:scale-[1.03]"
              />
            </div>
          </Link>

          <div className="rounded-[18px] bg-transparent px-1 py-2">
            <EchoCopy />
          </div>
        </div>

        <div className="space-y-4">
          <div className="overflow-hidden rounded-[22px]">
            <div className="relative aspect-[1.7/0.92] overflow-hidden rounded-[22px]">
              <Image
                src={getImageUrl(heroImage)}
                alt={post.title}
                fill
                priority
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/28 via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-4 flex flex-wrap items-center justify-center gap-3 px-4 md:bottom-6">
                <Link
                  href={webinarHref}
                  className="inline-flex min-h-12 items-center justify-center rounded-[14px] bg-[var(--accent-red)] px-5 py-3 text-sm font-bold text-white transition hover:bg-[var(--accent-red-dark)]"
                >
                  Join Webinars
                </Link>
                <Link
                  href={whitepaperHref}
                  className="inline-flex min-h-12 items-center justify-center rounded-[14px] bg-white px-5 py-3 text-sm font-bold text-[color:var(--text-strong)]"
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
                className="group block overflow-hidden rounded-[16px] bg-white/8 p-2"
              >
                <div className="relative aspect-[1.04/1] overflow-hidden rounded-[12px]">
                  <Image
                    src={getImageUrl(item.featuredImage)}
                    alt={item.title}
                    fill
                    className="object-cover transition duration-300 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/78 via-black/5 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-3">
                    <h3 className="line-clamp-2 text-sm font-medium leading-5 text-white">
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
