'use client'

export default function WhitepaperDetailError({
  reset,
}: {
  reset: () => void
}) {
  return (
    <section className="site-container py-10">
      <div className="rounded-[32px] border border-[var(--accent-red)] bg-white p-8 text-center shadow-[var(--shadow-soft)]">
        <h2 className="text-3xl font-semibold text-[color:var(--text-strong)]">
          Failed to load this white paper
        </h2>
        <p className="mt-3 text-sm leading-6 text-[color:var(--text-soft)]">
          Please try again. If the white paper still does not open, check the CMS delivery settings and publish status.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 rounded-full bg-[var(--accent-red)] px-5 py-3 text-sm font-semibold text-white"
        >
          Try Again
        </button>
      </div>
    </section>
  )
}
