'use client'

export default function SearchError({ reset }: { reset: () => void }) {
  return (
    <section className="site-container py-10">
      <div className="rounded-[24px] border border-[var(--accent-red)] bg-white p-8 text-center">
        <h2 className="ui-font text-[32px] font-medium text-[#111]">Failed to load search</h2>
        <p className="mt-3 text-sm text-[#666]">
          Please try again. If the issue continues, check the content API and published search results.
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
