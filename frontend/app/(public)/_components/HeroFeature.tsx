import Image from 'next/image'
import Link from 'next/link'

import type { Category, Post } from '@/lib/types/cms'
import { getPostHref } from '@/lib/utils/contentTypes'
import { formatDate, getCategoryName, getContentTypeLabel, getImageUrl } from '@/lib/utils/formatting'

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
    <section className="overflow-hidden rounded-[28px] bg-[#44107d] px-4 py-5 text-white shadow-[0_28px_70px_rgba(68,16,125,0.28)] md:px-6 md:py-6">
      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <Link href={heroHref} className="group overflow-hidden rounded-[18px] bg-white/10 p-4 backdrop-blur-sm">
          <div className="grid h-full gap-4 md:grid-cols-[0.88fr_1.12fr]">
            <div className="relative aspect-[1/1.05] overflow-hidden rounded-[14px]">
              <Image
                src={getImageUrl(post.featuredImage)}
                alt={post.title}
                fill
                className="object-cover transition duration-300 group-hover:scale-[1.03]"
              />
            </div>
            <div className="flex flex-col justify-between gap-3">
              <div className="space-y-2">
                <p className="text-[0.72rem] uppercase tracking-[0.22em] text-white/70">
                  {getContentTypeLabel(post.type)}
                </p>
                <h2 className="text-[1.15rem] font-semibold leading-6 md:text-[1.35rem]">
                  {post.title}
                </h2>
              </div>
              <div className="grid grid-cols-3 gap-3 text-[0.72rem] uppercase tracking-[0.12em] text-white/70">
                <span>{formatDate(post.publishedAt)}</span>
                <span>{post.readingTime ? `${post.readingTime} mins` : '12 mins'}</span>
                <span>{getCategoryName(post.primaryCategory)}</span>
              </div>
            </div>
          </div>
        </Link>

        <div className="space-y-4">
          <div className="group overflow-hidden rounded-[20px] bg-black/15 p-4">
            <div className="relative aspect-[1.8/0.9] overflow-hidden rounded-[16px]">
              <Image src={getImageUrl(heroImage)} alt={post.title} fill priority className="object-cover transition duration-300 group-hover:scale-[1.03]" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/25 to-transparent" />
              <div className="absolute inset-y-0 left-0 flex max-w-xl items-center p-5 md:p-7">
                <div>
                  <p className="text-sm uppercase tracking-[0.25em] text-white/70">Explore, Engage, Elevate</p>
                  <Link href={heroHref} className="mt-3 block text-[clamp(1.85rem,3.6vw,3.3rem)] font-semibold leading-tight transition hover:text-white/85">
                    {post.title}
                  </Link>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <Link href={webinarHref} className="rounded-full bg-[var(--accent-red)] px-4 py-2 text-sm font-semibold transition hover:bg-[var(--accent-red-dark)]">
                      Join Webinars
                    </Link>
                    <Link href={whitepaperHref} className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-[color:var(--text-strong)]">
                      Download White Papers
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {secondaryPosts.map((item) => (
              <Link key={item.id} href={getPostHref(item)} className="group block overflow-hidden rounded-[16px] bg-white/10 p-2">
                <div className="relative aspect-[1.1/1] overflow-hidden rounded-[12px]">
                  <Image
                    src={getImageUrl(item.featuredImage)}
                    alt={item.title}
                    fill
                    className="object-cover transition duration-300 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-3">
                    <p className="text-[0.68rem] uppercase tracking-[0.18em] text-white/70">
                      {getCategoryName(item.primaryCategory)}
                    </p>
                    <h3 className="mt-1 line-clamp-2 text-sm font-medium leading-5 text-white">{item.title}</h3>
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
