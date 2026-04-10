import Image from 'next/image'
import Link from 'next/link'

import type { Category, Post } from '@/lib/types/cms'
import { getPostHref } from '@/lib/utils/contentTypes'
import { getImageUrl } from '@/lib/utils/formatting'

function EchoCopy() {
  return (
    <div className="grid grid-cols-[1.28fr_0.76fr_0.76fr] items-end gap-3 text-white">
      <div className="headline-font text-[1.52rem] font-extrabold leading-[0.88] sm:text-[2.06rem]">
        Explore,
        <br />
        Engage,
        <br />
        Elevate
      </div>
      <div className="headline-font pb-1 text-[0.83rem] font-bold leading-[1.02] text-white/92 sm:text-[0.94rem]">
        Explore,
        <br />
        Engage,
        <br />
        Elevate
      </div>
      <div className="headline-font pb-1 text-[0.83rem] font-bold leading-[1.02] text-white/92 sm:text-[0.94rem]">
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
    <section className="overflow-hidden rounded-[26px] bg-[linear-gradient(180deg,var(--hero-purple)_0%,var(--hero-purple-dark)_100%)] px-4 py-5 text-white shadow-[0_28px_70px_rgba(68,16,125,0.28)] md:px-10 md:py-8">
      <div className="grid gap-5 xl:grid-cols-[228px_minmax(0,1fr)] xl:gap-0">
        <div className="relative z-10 flex flex-col gap-4 pt-1 xl:translate-x-8 xl:pt-11">
          <Link href={heroHref} className="group ml-1 block max-w-[198px] overflow-hidden rounded-[12px] xl:ml-0 xl:max-w-[210px]">
            <div className="relative aspect-[1.12/0.74] overflow-hidden rounded-[12px]">
              <Image
                src={getImageUrl(post.featuredImage)}
                alt={post.title}
                fill
                className="object-cover transition duration-300 group-hover:scale-[1.03]"
              />
            </div>
          </Link>

          <div className="max-w-[220px] px-1 pt-1 xl:max-w-[228px] xl:px-0">
            <EchoCopy />
          </div>
        </div>

        <div className="space-y-4 xl:space-y-5">
          <div className="relative overflow-hidden rounded-[18px] xl:ml-[-10px]">
            <Link href={heroHref} className="block">
              <div className="relative aspect-[2.28/0.9] min-h-[190px] overflow-hidden rounded-[18px] md:min-h-[250px] xl:min-h-[0]">
                <Image
                  src={getImageUrl(heroImage)}
                  alt={post.title}
                  fill
                  priority
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
              </div>
            </Link>

            <div className="absolute inset-x-0 bottom-4 flex flex-wrap items-center justify-center gap-2.5 px-4 md:bottom-5 md:gap-3 xl:justify-start xl:px-14">
              <Link
                href={webinarHref}
                className="inline-flex min-h-10 items-center justify-center rounded-[8px] border border-[var(--accent-red-dark)] bg-[var(--accent-red)] px-4 py-2.5 text-[0.82rem] font-bold text-white shadow-[0_8px_20px_rgba(255,42,31,0.28)] transition hover:bg-[var(--accent-red-dark)] md:min-h-11 md:px-5 md:text-sm"
              >
                Join Webinars
              </Link>
              <Link
                href={whitepaperHref}
                className="inline-flex min-h-10 items-center justify-center rounded-[8px] border border-white bg-white px-4 py-2.5 text-[0.82rem] font-bold text-[color:var(--accent-red)] shadow-[0_8px_20px_rgba(255,255,255,0.18)] md:min-h-11 md:px-5 md:text-sm"
              >
                Download White Papers
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 xl:ml-[-4px]">
            {secondaryPosts.map((item) => (
              <Link
                key={item.id}
                href={getPostHref(item)}
                className="group block overflow-hidden rounded-[14px]"
              >
                <div className="relative aspect-[1/1.08] overflow-hidden rounded-[14px]">
                  <Image
                    src={getImageUrl(item.featuredImage)}
                    alt={item.title}
                    fill
                    className="object-cover transition duration-300 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/82 via-black/18 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-3">
                    <h3 className="line-clamp-3 text-[0.9rem] font-medium leading-5 text-white">
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
