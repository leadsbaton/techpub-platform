'use client'

import Link from 'next/link'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <section className="site-container flex min-h-[60vh] items-center justify-center py-16">
      <div className="max-w-xl space-y-5 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--accent-red)]">Error</p>
        <h1 className="text-4xl font-semibold tracking-tight text-[color:var(--text-strong)] md:text-5xl">
          Something went wrong while loading this page.
        </h1>
        <p className="text-lg text-[color:var(--text-soft)]">
          Try again, or head back to the homepage if the problem continues.
        </p>
        {error?.digest ? (
          <p className="text-xs text-[color:var(--text-muted)]">Reference: {error.digest}</p>
        ) : null}
        <div className="flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="rounded-full bg-[var(--accent-red)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent-red-dark)]"
          >
            Try again
          </button>
          <Link
            href="/"
            className="rounded-full border border-[var(--border-subtle)] px-6 py-3 text-sm font-semibold text-[color:var(--text-strong)] transition hover:bg-[var(--surface-muted)]"
          >
            Go home
          </Link>
        </div>
      </div>
    </section>
  )
}
