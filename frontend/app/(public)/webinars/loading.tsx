export default function WebinarsLoading() {
  return (
    <section className="site-container space-y-8 py-10">
      <div className="skeleton-block h-[220px] rounded-[12px]" />
      <div className="grid gap-8 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="space-y-3">
            <div className="skeleton-block h-[170px]" />
            <div className="skeleton-block h-4 w-24 rounded-full" />
            <div className="skeleton-block h-6 w-full rounded-full" />
            <div className="skeleton-block h-6 w-4/5 rounded-full" />
          </div>
        ))}
      </div>
    </section>
  )
}
