export default function Loading() {
  return (
    <section className="site-container flex min-h-[55vh] flex-col items-center justify-center gap-8 py-16">
      <div className="space-y-4 text-center">
        <div className="mx-auto h-3 w-28 rounded-full bg-[color:var(--accent-red)]/15" />
        <div className="mx-auto h-10 w-64 rounded-full skeleton-block" />
        <div className="mx-auto h-4 w-80 max-w-full rounded-full skeleton-block" />
      </div>

      <div className="grid w-full max-w-6xl gap-6 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-[20px] border border-[var(--border-subtle)] bg-white"
          >
            <div className="skeleton-block aspect-[1.35/0.82] w-full" />
            <div className="space-y-3 p-5">
              <div className="skeleton-block h-3 w-24 rounded-full" />
              <div className="skeleton-block h-6 w-full rounded-full" />
              <div className="skeleton-block h-6 w-4/5 rounded-full" />
              <div className="skeleton-block h-4 w-2/3 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
