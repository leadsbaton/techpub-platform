'use client'

export default function WebinarAccessError({ reset }: { reset: () => void }) {
  return (
    <section className="site-container py-10">
      <div className="rounded-[24px] border border-[var(--accent-red)] bg-white p-8 text-center">
        <h2 className="text-3xl font-semibold text-[#111]">Failed to load webinar registration</h2>
        <p className="mt-3 text-sm text-[#666]">Please try again. If it continues, check the webinar registration settings in Payload.</p>
        <button type="button" onClick={reset} className="mt-6 rounded-full bg-[var(--accent-red)] px-5 py-3 text-sm font-semibold text-white">
          Try Again
        </button>
      </div>
    </section>
  )
}
