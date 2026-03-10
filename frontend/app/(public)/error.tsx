'use client'

import Link from 'next/link'

export default function ErrorPage() {
  return (
    <section className="site-container flex min-h-[60vh] items-center justify-center py-16">
      <div className="max-w-xl space-y-5 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--accent-red)]">Error</p>
        <h1 className="text-4xl font-semibold tracking-tight text-[color:var(--text-strong)] md:text-5xl">
          Something went wrong while loading this page.
        </h1>
        <p className="text-lg text-[color:var(--text-soft)]">
          Try refreshing the page or go back to the homepage.
        </p>
        <div className="flex justify-center">
          <Link href="/" className="rounded-full bg-[var(--accent-red)] px-6 py-3 text-sm font-semibold text-white">
            Go home
          </Link>
        </div>
      </div>
    </section>
  )
}
