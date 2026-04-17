export default function WhitepaperDetailLoading() {
  return (
    <section className="site-container py-10">
      <div className="grid gap-8 xl:grid-cols-[280px_minmax(0,1fr)_320px]">
        <div className="skeleton-block min-h-[420px] rounded-[28px]" />
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="skeleton-block h-4 w-28 rounded-full" />
            <div className="skeleton-block h-12 w-full rounded-[20px]" />
            <div className="skeleton-block h-12 w-4/5 rounded-[20px]" />
            <div className="skeleton-block h-20 rounded-[20px]" />
          </div>
          <div className="skeleton-block min-h-[360px] rounded-[28px]" />
          <div className="skeleton-block min-h-[320px] rounded-[28px]" />
        </div>
        <div className="skeleton-block min-h-[320px] rounded-[28px]" />
      </div>
    </section>
  )
}
