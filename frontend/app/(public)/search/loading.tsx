export default function SearchLoading() {
  return (
    <section className="site-container space-y-8 py-10">
      <div className="skeleton-block h-12 w-48 rounded-full" />
      <div className="skeleton-block h-56 rounded-[24px]" />
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="overflow-hidden rounded-[20px] border border-[var(--border-subtle)] bg-white">
            <div className="skeleton-block h-[210px]" />
            <div className="space-y-3 p-5">
              <div className="skeleton-block h-4 w-24 rounded-full" />
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
