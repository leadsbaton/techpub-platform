import Link from 'next/link'

/**
 * Root 404 fallback. Routes under the (public) group render their own
 * not-found inside the site chrome; this one catches any URL that never
 * reaches a route segment (and so renders only inside the root layout).
 */
export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--page-bg)] px-6 py-16">
      <div className="max-w-xl space-y-5 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--accent-red)]">404</p>
        <h1 className="text-4xl font-semibold tracking-tight text-[color:var(--text-strong)] md:text-5xl">
          The page could not be found.
        </h1>
        <p className="text-lg text-[color:var(--text-soft)]">
          The content may have moved, been unpublished, or the link may be incorrect.
        </p>
        <div className="flex justify-center">
          <Link href="/" className="rounded-full bg-[var(--accent-red)] px-6 py-3 text-sm font-semibold text-white">
            Back to home
          </Link>
        </div>
      </div>
    </main>
  )
}
