import Image from 'next/image'
import Link from 'next/link'

import type { Category, Post } from '@/lib/types/cms'

function ArrowRightIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={`fill-none stroke-current stroke-[2.5] ${className}`}
    >
      <path d="M5 12h14" strokeLinecap="round" />
      <path d="m13 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function DocumentIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={`fill-none stroke-current stroke-[2.2] ${className}`}
    >
      <path d="M7 3h7l4 4v14H7z" strokeLinejoin="round" />
      <path d="M14 3v5h5" strokeLinejoin="round" />
      <path d="M10 13h6M10 17h6" strokeLinecap="round" />
    </svg>
  )
}

const heroDescription =
  'A curated sanctuary for technical clarity. Access high-signal research, industry-leading white papers, and expert-led webinars designed for the sophisticated professional.'

/* ═══════════════════════════════════════════════════════════════════
   LIGHT THEME HERO - RESPONSIVE MOBILE & DESKTOP
   Mobile: Centered, stacked, full-width background
   Desktop: Split layout (content left, image right)
   ═══════════════════════════════════════════════════════════════════ */

export function HeroFeature({
  webinarHref,
  whitepaperHref,
}: {
  post?: Post
  secondaryPosts?: Post[]
  categories?: Category[]
  webinarHref: string
  whitepaperHref: string
}) {
  return (
    <div>
      {/* ═══════════════════════════════════════════════════════════════
          MOBILE VIEW - Centered, stacked layout
          ═══════════════════════════════════════════════════════════════ */}
      <section className="relative flex min-h-[calc(100svh-5rem)] w-full flex-col items-center justify-center overflow-hidden bg-white px-6 pb-20 pt-10 sm:px-8 sm:pb-24 sm:pt-12 lg:hidden">
        {/* Mobile Background - Centered, fits screen width */}
        <div className="pointer-events-none absolute inset-0 z-0 flex h-full w-full items-center justify-center opacity-25">
          <Image
            src="/hero-tech-innovation.png"
            alt="Tech Innovation"
            width={500}
            height={500}
            className="h-auto w-full max-w-[460px] object-contain"
            priority
          />
        </div>

        {/* Shimmer Overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20 z-1"
          style={{
            background: 'linear-gradient(45deg, transparent 0%, rgba(188, 1, 0, 0.08) 45%, rgba(188, 1, 0, 0.12) 50%, rgba(188, 1, 0, 0.08) 55%, transparent 100%)',
            backgroundSize: '200% 200%',
            animation: 'shimmer 8s infinite linear',
          }}
        />

        {/* Mobile Content - Centered */}
        <div className="relative z-10 mx-auto flex w-full max-w-[22rem] translate-y-8 flex-col items-center text-center sm:translate-y-10">
          {/* Headline - 3 lines */}
          <h1 className="ui-font mb-5 text-4xl font-extrabold leading-[1.08] text-gray-900">
            Explore.
            <br />
            Engage.
            <br />
            Elevate.
          </h1>

          {/* Description */}
          <p className="ui-font mb-7 text-balance text-sm leading-6 text-gray-600 sm:text-base">
            {heroDescription}
          </p>

          {/* CTA Buttons - Full width stacked */}
          <div className="flex flex-col gap-3 w-full">
            <Link
              href={webinarHref}
              className="ui-font flex min-h-14 w-full items-center justify-center gap-2 rounded-lg bg-[var(--accent-red)] px-6 py-4 text-sm font-bold text-white shadow-sm transition-all duration-300 hover:brightness-110 hover:shadow-lg active:scale-[0.98]"
            >
              Join Webinar
              <ArrowRightIcon className="h-[18px] w-[18px]" />
            </Link>
            <Link
              href={whitepaperHref}
              className="ui-font flex min-h-14 w-full items-center justify-center gap-2 rounded-lg border border-gray-900 bg-white/80 px-6 py-4 text-sm font-semibold text-gray-900 shadow-sm transition-all duration-300 hover:bg-gray-50 hover:shadow-md active:scale-[0.98]"
            >

              Download White Papers

              <DocumentIcon className="h-[18px] w-[18px]" />
            </Link>
          </div>
        </div>

        <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-gray-500">
          <span className="ui-font text-[10px] font-semibold uppercase tracking-[0.22em]">
            Scroll to analyze
          </span>
          <span className="h-10 w-px bg-gradient-to-b from-[var(--accent-red)] to-transparent" />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          DESKTOP VIEW - Split layout (content left, image right)
          ═══════════════════════════════════════════════════════════════ */}
      <section className="group relative hidden min-h-[80vh] items-center overflow-hidden bg-white py-24 lg:flex">
        {/* Desktop Background - Right side */}
        <div
          className="pointer-events-none absolute right-0 top-1/2 z-0 h-full w-1/2 -translate-y-1/2 overflow-hidden opacity-75 transition-transform duration-700 ease-out group-hover:-translate-x-5 group-hover:scale-[1.035]"
          style={{
            maskImage: 'linear-gradient(to left, rgba(0,0,0,1) 12%, rgba(0,0,0,0.72) 72%, rgba(0,0,0,0) 100%)',
            WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,1) 12%, rgba(0,0,0,0.72) 72%, rgba(0,0,0,0) 100%)',
          }}
        >
          <div className="absolute right-[8%] top-1/2 h-[58%] w-[58%] -translate-y-1/2 rounded-full bg-[var(--accent-red)]/12 blur-3xl" />
          <Image
            src="/hero-tech-innovation.png"
            alt="Tech Innovation"
            fill
            className="hero-illustration-float object-contain object-right"
            priority
          />
        </div>

        {/* Shimmer Beam Animation */}
        <div
          className="absolute -left-1/2 -top-1/2 z-[1] h-[220%] w-[220%] pointer-events-none"
          style={{
            background:
              'linear-gradient(135deg, transparent 0%, transparent 43%, rgba(188, 1, 0, 0.05) 47%, rgba(188, 1, 0, 0.18) 50%, rgba(188, 1, 0, 0.05) 53%, transparent 57%, transparent 100%)',
            animation: 'shimmerBeam 5s infinite ease-in-out',
          }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 z-[2] bg-gradient-to-r from-white via-white/90 via-[52%] to-white/35 pointer-events-none" />

        {/* Desktop Content - Left side */}
        <div className="site-container relative z-10 w-full translate-y-10 xl:translate-y-12">
          <div className="max-w-3xl">
            {/* Headline */}
            <h1 className="ui-font mb-6 text-5xl font-extrabold leading-[1.1] text-gray-900 md:text-6xl lg:text-[64px]">
              Explore, Engage,
              <br />
              <span className="font-semibold italic text-[var(--accent-red)]">Elevate</span>
            </h1>

            {/* Description */}
            <p className="ui-font text-base sm:text-lg text-gray-600 mb-10 sm:mb-12 max-w-2xl leading-relaxed">
              {heroDescription}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start w-full sm:w-auto">
              <Link
                href={webinarHref}
                className="ui-font flex min-h-14 w-full items-center justify-center gap-2 rounded-lg bg-[var(--accent-red)] px-6 py-4 text-sm font-bold text-white shadow-sm transition-all duration-300 hover:brightness-110 hover:shadow-lg active:scale-[0.98] sm:w-auto sm:px-8 sm:text-base"
              >
                Join Webinar
                <ArrowRightIcon />
              </Link>
              <Link
                href={whitepaperHref}
                className="ui-font flex min-h-14 w-full items-center justify-center gap-2 rounded-lg border border-gray-900 bg-white/80 px-6 py-4 text-sm font-semibold text-gray-900 shadow-sm transition-all duration-300 hover:bg-gray-50 hover:shadow-md active:scale-[0.98] sm:w-auto sm:px-8 sm:text-base"
              >
                Download White Papers
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Shimmer animation keyframes */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: -100% -100%; }
          100% { background-position: 100% 100%; }
        }
        @keyframes shimmerBeam {
          0% { transform: translate3d(-38%, -38%, 0); opacity: 0; }
          14% { opacity: 0.65; }
          72% { opacity: 0.65; }
          100% { transform: translate3d(38%, 38%, 0); opacity: 0; }
        }
        @keyframes heroIllustrationFloat {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(-10px, -8px, 0) scale(1.015); }
        }
        .hero-illustration-float {
          animation: heroIllustrationFloat 9s ease-in-out infinite;
          will-change: transform;
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-illustration-float {
            animation: none;
          }
        }
      `}</style>
    </div>
  )
}
