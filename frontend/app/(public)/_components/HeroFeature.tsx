import Image from 'next/image'
import Link from 'next/link'

import type { Category, Post } from '@/lib/types/cms'
import { getPostHref } from '@/lib/utils/contentTypes'
import { getImageUrl } from '@/lib/utils/formatting'

function EchoCopy() {
  return (
    <div className="grid grid-cols-1 items-end gap-2 text-white sm:grid-cols-[1.28fr_0.76fr_0.76fr] sm:gap-3">
      <div className="headline-font text-[1.08rem] font-extrabold leading-[0.9] sm:text-[1.52rem] xl:text-[2.06rem]">
        Explore,
        <br />
        Engage,
        <br />
        Elevate
      </div>
      <div className="headline-font hidden pb-1 text-[0.78rem] font-bold leading-[1.02] text-white/92 sm:block xl:text-[0.94rem]">
        Explore,
        <br />
        Engage,
        <br />
        Elevate
      </div>
      <div className="headline-font hidden pb-1 text-[0.78rem] font-bold leading-[1.02] text-white/92 sm:block xl:text-[0.94rem]">
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
          <div className="overflow-hidden rounded-[18px] px-0 py-3 sm:rounded-[22px] sm:px-4 sm:py-5 md:px-6 xl:rounded-[26px] xl:px-8 xl:py-6">
            <div className="grid grid-cols-[116px_minmax(0,1fr)] items-start gap-3 sm:grid-cols-[168px_minmax(0,1fr)] sm:gap-4 md:grid-cols-[210px_minmax(0,1fr)] xl:grid-cols-[228px_minmax(0,1fr)] xl:gap-0">
              {/* Left: fixed circuit image + Explore/Engage/Elevate. */}
              <div className="relative z-10 flex flex-col gap-3 pt-0 sm:gap-4 md:pt-4 xl:translate-x-8 xl:pt-11">
                <div className="block max-w-[116px] overflow-hidden rounded-[10px] sm:max-w-[168px] sm:rounded-[12px] md:max-w-[198px] xl:max-w-[210px]">
                  <div className="relative aspect-[1.12/0.74] overflow-hidden rounded-[12px]">
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

                <div className="max-w-[116px] pt-1 sm:max-w-[168px] md:max-w-[210px] xl:max-w-[228px]">
                  <EchoCopy />
                </div>
              </div>

              {/* Right: fixed laptop image with the CTA buttons. */}
              <div className="relative -ml-6 overflow-hidden rounded-[12px] sm:-ml-8 sm:rounded-[16px] md:-ml-10 md:rounded-[18px] xl:ml-[-10px]">
                <div className="relative h-[168px] overflow-hidden rounded-[12px] sm:h-[220px] sm:rounded-[16px] md:h-[285px] md:rounded-[18px] xl:h-auto xl:aspect-[2.28/0.9]">
                  <Image
                    src="/hero-laptop.png"
                    alt=""
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 960px"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                </div>

                <div className="absolute inset-x-0 bottom-2 flex flex-col items-center justify-center gap-1.5 px-2 sm:bottom-4 sm:flex-row sm:flex-wrap sm:gap-2 md:bottom-5 md:gap-3">
                  <Link
                    href={webinarHref}
                    className="inline-flex min-h-8 items-center justify-center rounded-[7px] border border-[var(--accent-red-dark)] bg-[var(--accent-red)] px-3 py-1.5 text-[0.68rem] font-bold text-white shadow-[0_8px_20px_rgba(255,42,31,0.28)] transition hover:bg-[var(--accent-red-dark)] sm:min-h-10 sm:px-4 sm:py-2 sm:text-[0.82rem] md:min-h-11 md:px-5 md:text-sm"
                  >
                    Join Webinars
                  </Link>
                  <Link
                    href={whitepaperHref}
                    className="inline-flex min-h-8 items-center justify-center rounded-[7px] border border-white bg-white px-3 py-1.5 text-[0.68rem] font-bold text-[color:var(--accent-red)] shadow-[0_8px_20px_rgba(255,255,255,0.18)] transition hover:bg-white/90 sm:min-h-10 sm:px-4 sm:py-2 sm:text-[0.82rem] md:min-h-11 md:px-5 md:text-sm"
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
        <div className="no-scrollbar min-w-0 overflow-x-auto pb-2">
          <div className="flex gap-3 pl-[max(16px,calc((100vw-1200px)/2+32px))] xl:gap-5">
            {secondaryPosts.map((item) => (
              <Link
                key={item.id}
                href={getPostHref(item)}
                className="group block h-[300px] w-[300px] shrink-0 overflow-hidden rounded-[14px] shadow-[0px_4px_4px_0px_#00000040]"
              >
                <div className="relative h-[300px] w-[300px] overflow-hidden rounded-[14px]">
                  <Image
                    src={getImageUrl(item.featuredImage)}
                    alt={item.title}
                    fill
                    sizes="(max-width: 1280px) 180px, 260px"
                    className="object-cover transition duration-300 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
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
    </div>
  )
}
