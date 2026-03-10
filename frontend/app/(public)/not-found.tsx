import Link from 'next/link'

export default function NotFound() {
  return (
    <section className="site-container flex min-h-[60vh] items-center justify-center py-16">
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
    </section>
  )
}
