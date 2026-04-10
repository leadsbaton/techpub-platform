export default function InsightsLoading() {
  return (
    <div className="bg-white pb-20">
      <section className="bg-[#b30000] py-12 md:py-14">
        <div className="site-container">
          <div className="mb-10 flex items-center gap-4">
            <div className="skeleton-block h-px flex-1" />
            <div className="skeleton-block h-12 w-80 rounded-full" />
            <div className="skeleton-block h-px flex-1" />
          </div>

          <div className="grid gap-6 lg:grid-cols-[0.46fr_0.54fr]">
            <div className="rounded-[4px] bg-black px-6 py-6">
              <div className="skeleton-block aspect-[1.1/0.98] rounded-[4px]" />
              <div className="mt-4 space-y-3">
                <div className="skeleton-block h-6 w-full rounded-full" />
                <div className="skeleton-block h-6 w-4/5 rounded-full" />
                <div className="skeleton-block h-4 w-24 rounded-full" />
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index}>
                  <div className="skeleton-block aspect-[1.26/0.7] rounded-[4px]" />
                  <div className="mt-4 space-y-3">
                    <div className="skeleton-block h-5 w-full rounded-full" />
                    <div className="skeleton-block h-5 w-5/6 rounded-full" />
                    <div className="skeleton-block h-4 w-20 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="site-container mt-14 space-y-8 md:mt-16">
        <div className="flex items-center gap-4">
          <div className="skeleton-block h-12 w-52 rounded-full" />
          <div className="skeleton-block h-px flex-1" />
          <div className="skeleton-block h-8 w-20 rounded-full" />
        </div>

        <div className="grid gap-9 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <section key={index} className="space-y-6">
              <div className="skeleton-block h-12 w-full rounded-[2px]" />
              <div className="skeleton-block aspect-[1.22/0.8]" />
              <div className="space-y-5">
                {Array.from({ length: 3 }).map((__, itemIndex) => (
                  <div key={itemIndex} className="flex gap-3">
                    <div className="skeleton-block h-[120px] w-[120px] shrink-0" />
                    <div className="flex-1 space-y-3 pt-1">
                      <div className="skeleton-block h-4 w-20 rounded-full" />
                      <div className="skeleton-block h-5 w-full rounded-full" />
                      <div className="skeleton-block h-5 w-4/5 rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>
    </div>
  )
}
