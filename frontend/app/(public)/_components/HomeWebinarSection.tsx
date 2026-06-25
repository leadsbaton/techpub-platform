import Link from 'next/link'

import type { Post } from '@/lib/types/cms'
import { getPostHref } from '@/lib/utils/contentTypes'
import {
  getCategoryAccent,
  getCategoryName,
  getPostCardImageClass,
  getPostCardImageUrl,
  getWebinarEventLabel,
} from '@/lib/utils/formatting'
import { HomeOverlayCard } from './HomeOverlayCard'
import { HomeRuledHeader } from './HomeRuledHeader'
import { SafeImage } from './SafeImage'

function MobileWebinarCard({ post }: { post: Post }) {
  const href = getPostHref(post)
  const category = getCategoryName(post.primaryCategory)
  const accent = getCategoryAccent(post.primaryCategory)
  const eventLabel = getWebinarEventLabel(post)

  return (
    <div className="group flex flex-col gap-4">
      <Link href={href} className="relative block h-56 overflow-hidden rounded-lg border border-white/10">
        <SafeImage
          src={getPostCardImageUrl(post)}
          alt={post.title}
          fill
          sizes="100vw"
          className={`${getPostCardImageClass(post)} transition-transform duration-700 group-hover:scale-105`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <span
          className="absolute bottom-4 left-4 px-3 py-1 text-[0.7rem] font-bold uppercase tracking-wide text-white"
          style={{ backgroundColor: accent }}
        >
          {category}
        </span>
      </Link>

      <div className="flex flex-col gap-2">
        <p className="text-[0.72rem] font-bold uppercase tracking-widest text-[color:var(--accent-red)]">
          {eventLabel}
        </p>
        <h3 className="headline-font text-[1.45rem] font-extrabold leading-tight text-white">
          <Link href={href} className="transition hover:text-[color:var(--accent-red)]">
            {post.title}
          </Link>
        </h3>
        <Link
          href={href}
          className="mt-2 flex items-center gap-2 text-[0.8rem] font-bold uppercase tracking-widest text-white/70 transition hover:text-[color:var(--accent-red)]"
        >
          RESERVE YOUR SPOT
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M7 17L17 7M7 7h10v10" />
          </svg>
        </Link>
      </div>
    </div>
  )
}

export function HomeWebinarSection({
  webinarLead,
  webinarSupport,
  allWebinars,
}: {
  webinarLead: Post | null
  webinarSupport: Post[]
  allWebinars: Post[]
}) {
  if (!webinarLead) {
    return (
      <section className="site-container mt-14 space-y-6 md:mt-16 md:space-y-7">
        <HomeRuledHeader title="Upcoming Webinars" />
        <div className="ui-font border border-[var(--border-subtle)] bg-white px-6 py-10 text-center text-[color:var(--text-muted)]">
          No upcoming webinars right now. Past sessions are available on the webinars page.
        </div>
      </section>
    )
  }

  return (
    <>
      {/* ── MOBILE layout (< md) ── dark section, stacked image-above-text cards */}
      <section className="mt-14 bg-black px-5 py-12 md:hidden">
        <div className="mb-8 border-l-4 border-[color:var(--accent-red)] pl-4">
          <h2 className="ui-font text-[clamp(1.2rem,5.4vw,2rem)] font-medium leading-none text-white">
            Upcoming Webinars
          </h2>
        </div>
        <div className="flex flex-col gap-10">
          {allWebinars.slice(0, 3).map((post) => (
            <MobileWebinarCard key={post.id} post={post} />
          ))}
        </div>
      </section>

      {/* ── DESKTOP layout (≥ md) ── existing grid with overlay cards */}
      <section className="site-container mt-14 hidden space-y-6 md:block md:mt-16 md:space-y-7">
        <HomeRuledHeader title="Upcoming Webinars" />
        <div className="grid gap-2 lg:grid-cols-[0.48fr_0.52fr]">
          <div className="grid gap-2">
            {webinarSupport[0] ? (
              <HomeOverlayCard post={webinarSupport[0]} variant="webinar" compactSize="small" />
            ) : null}
            {webinarSupport[1] ? (
              <HomeOverlayCard post={webinarSupport[1]} variant="webinar" compactSize="small" />
            ) : null}
          </div>
          <div className="min-h-[420px] lg:min-h-0">
            <HomeOverlayCard post={webinarLead} variant="webinar" />
          </div>
        </div>
      </section>
    </>
  )
}
