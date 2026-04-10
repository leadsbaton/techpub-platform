export default function Loading() {
  return (
    <div className="pb-20 pt-6 md:pt-8">
      <section className="site-container">
        <div className="overflow-hidden rounded-[30px] bg-[linear-gradient(180deg,var(--hero-purple)_0%,var(--hero-purple-dark)_100%)] px-3 py-4 md:px-6 md:py-6">
          <div className="grid gap-5 xl:grid-cols-[0.28fr_0.72fr]">
            <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr] xl:grid-cols-1">
              <div className="rounded-[22px] bg-white/10 p-3">
                <div className="grid gap-4 sm:grid-cols-[0.9fr_1.1fr] xl:grid-cols-1">
                  <div className="skeleton-block aspect-[1/0.72] rounded-[16px] xl:aspect-[1/0.92]" />
                  <div className="space-y-3 py-2">
                    <div className="skeleton-block h-3 w-20 rounded-full" />
                    <div className="skeleton-block h-6 w-full rounded-full" />
                    <div className="skeleton-block h-6 w-4/5 rounded-full" />
                    <div className="grid grid-cols-3 gap-3 pt-4">
                      <div className="skeleton-block h-3 rounded-full" />
                      <div className="skeleton-block h-3 rounded-full" />
                      <div className="skeleton-block h-3 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 rounded-[22px] bg-white/6 px-4 py-4 sm:grid-cols-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="skeleton-block h-28 rounded-[18px]" />
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-[24px] bg-black/15 p-3 md:p-4">
                <div className="skeleton-block aspect-[1.62/0.96] rounded-[18px]" />
                <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="space-y-3 md:w-3/5">
                    <div className="skeleton-block h-3 w-32 rounded-full" />
                    <div className="skeleton-block h-7 w-full rounded-full" />
                    <div className="skeleton-block h-7 w-4/5 rounded-full" />
                  </div>
                  <div className="flex gap-3">
                    <div className="skeleton-block h-12 w-36 rounded-[14px]" />
                    <div className="skeleton-block h-12 w-44 rounded-[14px]" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="rounded-[16px] bg-white/10 p-2">
                    <div className="skeleton-block aspect-[1.05/1] rounded-[12px]" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {Array.from({ length: 4 }).map((_, sectionIndex) => (
        <section key={sectionIndex} className="site-container mt-16 space-y-6">
          <div className="flex items-center gap-4">
            <div className="skeleton-block h-10 w-64 rounded-full" />
            <div className="skeleton-block h-px flex-1" />
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {Array.from({ length: 3 }).map((__, cardIndex) => (
              <div
                key={cardIndex}
                className="rounded-[18px] bg-white p-3 shadow-[var(--shadow-soft)]"
              >
                <div className="skeleton-block aspect-[1/0.78] rounded-[12px]" />
                <div className="space-y-3 px-2 pb-2 pt-4">
                  <div className="skeleton-block h-4 w-20 rounded-full" />
                  <div className="skeleton-block h-5 w-full rounded-full" />
                  <div className="skeleton-block h-5 w-5/6 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
