import Image from 'next/image'
import Link from 'next/link'

import type { Category, Post } from '@/lib/types/cms'
import { HomeHeroCarousel } from './HomeHeroCarousel'
import { SafeImage } from './SafeImage'

function EchoCopy() {
  return (
    <div className="grid grid-cols-[1.18fr_0.74fr_0.74fr] items-end gap-2 text-white sm:grid-cols-[1.28fr_0.76fr_0.76fr] sm:gap-3">
      <div className="headline-font text-[1rem] font-extrabold leading-[1] sm:text-[1.50rem] xl:text-[2rem]">
        Explore,
        <br />
        Engage,
        <br />
        Elevate
      </div>
      <div className="headline-font pb-0.5 text-[0.75rem] font-bold leading-[1] text-white/92 sm:pb-1 sm:text-[1rem] xl:text-[1.5rem]">
        Explore,
        <br />
        Engage,
        <br />
        Elevate
      </div>
      <div className="headline-font pb-0.5 text-[0.5rem] font-bold leading-[1] text-white/92 sm:pb-1 sm:text-[0.75rem] xl:text-[1rem]">
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
  secondaryPosts,
  webinarHref,
  whitepaperHref,
}: {
  // `post`/`categories` kept for call-site compatibility; the hero artwork is now
  // fixed (hero-circuit.png + hero-laptop.png), not derived from a post.
  post?: Post
  secondaryPosts: Post[]
  categories?: Category[]
  webinarHref: string
  whitepaperHref: string
}) {
  return (
    <div>
      {/* Purple banner. Extra bottom padding on desktop leaves room for the card
          row to overlap into it (the cards bridge the purple hero and the white
          section below). */}
      <section className="bg-[linear-gradient(180deg,var(--hero-purple)_0%,var(--hero-purple-dark)_100%)] pb-[230px] pt-4 text-white shadow-[0_28px_70px_rgba(68,16,125,0.22)] md:pt-6 xl:pb-[250px]">
        <div className="site-container">
          <div className="mx-auto max-w-[972px] overflow-hidden rounded-[8px] px-0 py-3 sm:px-4 sm:py-5 md:px-0 xl:h-[377px] xl:py-0">
            <div className="grid grid-cols-[136px_minmax(0,1fr)] items-start gap-2 sm:grid-cols-[188px_minmax(0,1fr)] sm:gap-4 md:grid-cols-[258px_minmax(0,1fr)] xl:grid-cols-[258px_714px] xl:gap-0">
              {/* Left: fixed circuit image + Explore/Engage/Elevate. */}
              <div className="relative z-10 flex flex-col gap-3 pt-0 sm:gap-4 md:pt-10 xl:w-[361px] xl:pt-10">
                <div className="block max-w-[136px] overflow-hidden rounded-[8px] sm:max-w-[188px] md:max-w-[220px] xl:max-w-none">
                  <div className="relative aspect-[1.12/0.74] overflow-hidden rounded-[8px] xl:h-[222px] xl:w-[361px] xl:aspect-auto">
                    <Image
                      src="/hero-circuit.png"
                      alt=""
                      fill
                      priority
                      sizes="210px"
                      className="object-cover"
                    />
                  </div>
                </div>

                <div className="max-w-[136px] pt-1 sm:max-w-[188px] md:max-w-[220px] xl:max-w-[361px]">
                  <EchoCopy />
                </div>
              </div>

              {/* Right: fixed laptop image with the CTA buttons. */}
              <div className="relative -ml-6 overflow-hidden rounded-[8px] sm:-ml-8 md:-ml-10 xl:ml-0">
                <div className="relative h-[168px] overflow-hidden rounded-[8px] sm:h-[220px] md:h-[285px] xl:h-[364px] xl:w-[714px]">
                  <SafeImage
                    src="/hero-laptop.png"
                    alt=""
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 960px"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                </div>

                <div className="absolute inset-x-0 bottom-2 flex flex-row items-center justify-center gap-1.5 px-2 sm:bottom-4 sm:gap-2 md:bottom-5 md:gap-3">
                  <Link
                    href={webinarHref}
                    className="inline-flex min-h-8 min-w-0 flex-1 items-center justify-center rounded-[7px] border border-[var(--accent-red-dark)] bg-[var(--accent-red)] px-2 py-1.5 text-center text-[0.62rem] font-bold text-white shadow-[0_8px_20px_rgba(255,42,31,0.28)] transition hover:bg-[var(--accent-red-dark)] sm:min-h-10 sm:flex-none sm:px-4 sm:py-2 sm:text-[0.82rem] md:min-h-11 md:px-5 md:text-sm"
                  >
                    Join Webinars
                  </Link>
                  <Link
                    href={whitepaperHref}
                    className="inline-flex min-h-8 min-w-0 flex-1 items-center justify-center rounded-[7px] border border-white bg-white px-2 py-1.5 text-center text-[0.62rem] font-bold text-[color:var(--accent-red)] shadow-[0_8px_20px_rgba(255,255,255,0.18)] transition hover:bg-white/90 sm:min-h-10 sm:flex-none sm:px-4 sm:py-2 sm:text-[0.82rem] md:min-h-11 md:px-5 md:text-sm"
                  >
                    Download White Papers
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic post cards. On desktop they are pulled up to overlap the bottom of
          the purple banner (matching xl:pb above), so ~30% sits over the white page
          background below; on mobile they sit normally beneath the banner. */}
      <div className="relative z-10 -mt-[210px]">
        <HomeHeroCarousel posts={secondaryPosts} />
      </div>
    </div>
  )
}
