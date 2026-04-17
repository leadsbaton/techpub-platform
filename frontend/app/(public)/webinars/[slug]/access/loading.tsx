export default function WebinarAccessLoading() {
  return (
    <section className="site-container py-10">
      <div className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <div className="skeleton-block h-12 w-3/4 rounded-full" />
          <div className="skeleton-block h-[360px] rounded-[20px]" />
        </div>
        <div className="skeleton-block min-h-[320px] rounded-[20px]" />
      </div>
    </section>
  )
}
