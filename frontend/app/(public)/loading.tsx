export default function Loading() {
  return (
    <div className="pb-20 pt-4 md:pt-8">
      <section className="site-container">
        <div className="overflow-hidden rounded-[28px] bg-[linear-gradient(180deg,var(--hero-purple)_0%,var(--hero-purple-dark)_100%)] px-4 py-6 md:px-8 md:py-8">
          <div className="grid gap-5 xl:grid-cols-[0.28fr_0.72fr]">
            <div className="flex flex-col gap-4">
              <div className="skeleton-block aspect-[1.18/0.72] rounded-[18px]" />
              <div className="grid grid-cols-[1.15fr_0.85fr_0.85fr] gap-3 px-1 py-2">
                <div className="skeleton-block h-28 rounded-[16px]" />
                <div className="skeleton-block h-28 rounded-[16px]" />
                <div className="skeleton-block h-28 rounded-[16px]" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="skeleton-block aspect-[1.7/0.92] rounded-[22px]" />
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="rounded-[16px] bg-white/8 p-2">
                    <div className="skeleton-block aspect-[1.04/1] rounded-[12px]" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="site-container mt-12 space-y-6 md:mt-14 md:space-y-7">
        <div className="flex items-center gap-4">
          <div className="skeleton-block h-10 w-64 rounded-full" />
          <div className="skeleton-block h-px flex-1" />
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="rounded-[20px] bg-white p-4 shadow-[var(--shadow-soft)]">
              <div className="skeleton-block h-[330px] rounded-[16px]" />
              <div className="space-y-3 pt-4">
                <div className="skeleton-block h-5 w-full rounded-full" />
                <div className="skeleton-block h-5 w-4/5 rounded-full" />
                <div className="flex items-center justify-between pt-3">
                  <div className="skeleton-block h-10 w-28 rounded-[12px]" />
                  <div className="space-y-2">
                    <div className="skeleton-block h-3 w-24 rounded-full" />
                    <div className="skeleton-block h-3 w-20 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="site-container mt-14 space-y-6 md:mt-16 md:space-y-7">
        <div className="flex items-center gap-4">
          <div className="skeleton-block h-10 w-72 rounded-full" />
          <div className="skeleton-block h-px flex-1" />
        </div>
        <div className="grid gap-5 lg:grid-cols-3">
          <div className="space-y-5">
            <div className="skeleton-block min-h-[320px] rounded-[18px]" />
            <div className="skeleton-block min-h-[320px] rounded-[18px]" />
          </div>
          <div className="space-y-5">
            <div className="skeleton-block min-h-[170px] rounded-[18px]" />
            <div className="skeleton-block min-h-[170px] rounded-[18px]" />
            <div className="skeleton-block min-h-[170px] rounded-[18px]" />
          </div>
          <div className="space-y-5">
            <div className="skeleton-block min-h-[320px] rounded-[18px]" />
          </div>
        </div>
      </section>

      <section className="site-container mt-14 space-y-6 md:mt-16 md:space-y-7">
        <div className="flex items-center gap-4">
          <div className="skeleton-block h-10 w-72 rounded-full" />
          <div className="skeleton-block h-px flex-1" />
        </div>
        <div className="grid gap-5 lg:grid-cols-[0.48fr_0.52fr]">
          <div className="space-y-5">
            <div className="skeleton-block min-h-[220px] rounded-[20px]" />
            <div className="skeleton-block min-h-[220px] rounded-[20px]" />
          </div>
          <div className="skeleton-block min-h-[260px] rounded-[20px] md:min-h-[520px]" />
        </div>
      </section>

      <section className="site-container mt-14 space-y-6 md:mt-16 md:space-y-7">
        <div className="flex items-center gap-4">
          <div className="skeleton-block h-10 w-72 rounded-full" />
          <div className="skeleton-block h-px flex-1" />
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="rounded-[20px] bg-white p-5 shadow-[var(--shadow-soft)]">
              <div className="skeleton-block aspect-[1.12/0.68] rounded-[14px]" />
              <div className="space-y-3 pt-5">
                <div className="skeleton-block h-5 w-full rounded-full" />
                <div className="skeleton-block h-5 w-4/5 rounded-full" />
                <div className="skeleton-block h-4 w-full rounded-full" />
                <div className="skeleton-block h-4 w-5/6 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
