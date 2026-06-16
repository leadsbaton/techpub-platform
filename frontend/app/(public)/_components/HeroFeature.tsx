import Image from 'next/image'
import Link from 'next/link'

import type { Category, Post } from '@/lib/types/cms'
import { getPostHref } from '@/lib/utils/contentTypes'
import { getImageUrl } from '@/lib/utils/formatting'

export function HeroFeature({
  secondaryPosts,
  webinarHref,
  whitepaperHref,
}: {
  // `post` and `categories` are kept for call-site compatibility; the hero visual
  // is now the fixed banner image (which already contains the circuit/laptop art
  // and the Explore/Engage/Elevate text).
  post?: Post
  secondaryPosts: Post[]
  categories?: Category[]
  webinarHref: string
  whitepaperHref: string
}) {
  return (
    <section className="bg-[var(--hero-purple)] py-4 md:py-6">
      <div className="site-container">
        {/* Fixed banner: hero_bg.png already contains the circuit/laptop graphics
            and the "Explore, Engage, Elevate" text. Cropped to the artwork (the
            image has empty space at the bottom) with the CTA buttons overlaid. */}
        <div className="relative aspect-[1.7/1] overflow-hidden rounded-[20px] sm:aspect-[2.2/1] xl:aspect-[2.55/1]">
          <Image
            src="/hero_bg.png"
            alt="Explore, Engage, Elevate"
            fill
            priority
            sizes="(max-width: 1280px) 100vw, 1200px"
            className="object-cover object-top"
          />

          <div className="absolute inset-x-0 bottom-[6%] flex flex-col items-center justify-center gap-2.5 px-4 sm:flex-row sm:gap-4">
            <Link
              href={webinarHref}
              className="inline-flex min-h-10 items-center justify-center rounded-[8px] border border-[var(--accent-red-dark)] bg-[var(--accent-red)] px-5 py-2.5 text-[0.82rem] font-bold text-white shadow-[0_8px_20px_rgba(255,42,31,0.28)] transition hover:bg-[var(--accent-red-dark)] md:min-h-11 md:px-7 md:text-base"
            >
              Join Webinars
            </Link>
            <Link
              href={whitepaperHref}
              className="inline-flex min-h-10 items-center justify-center rounded-[8px] border border-white bg-white px-5 py-2.5 text-[0.82rem] font-bold text-[color:var(--accent-red)] shadow-[0_8px_20px_rgba(255,255,255,0.18)] transition hover:bg-white/90 md:min-h-11 md:px-7 md:text-base"
            >
              Download White Papers
            </Link>
          </div>
        </div>

        {/* Dynamic post cards under the banner. */}
        <div className="mt-5 min-w-0 overflow-x-auto pb-1 md:mt-6 xl:overflow-visible">
          <div className="flex gap-3 xl:grid xl:grid-cols-4">
            {secondaryPosts.map((item) => (
              <Link
                key={item.id}
                href={getPostHref(item)}
                className="group block min-w-[148px] overflow-hidden rounded-[14px] sm:min-w-[168px] xl:min-w-0"
              >
                <div className="relative aspect-[1/1.08] overflow-hidden rounded-[14px]">
                  <Image
                    src={getImageUrl(item.featuredImage)}
                    alt={item.title}
                    fill
                    sizes="(max-width: 1280px) 168px, 220px"
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
