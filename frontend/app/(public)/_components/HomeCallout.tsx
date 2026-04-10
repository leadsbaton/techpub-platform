export function HomeCallout() {
  return (
    <section className="site-container mt-16">
      <div className="grid gap-6 rounded-[24px] bg-white p-6 shadow-[var(--shadow-soft)] md:grid-cols-[0.9fr_1.1fr] md:p-8">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--accent-red)]">
            This brilliant bit
          </p>
          <h3 className="text-[2rem] font-semibold leading-tight text-[color:var(--text-strong)]">
            Call out a feature, benefit, or value of your site or product.
          </h3>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-[18px] bg-[var(--surface-muted)] p-5">
            <p className="text-sm leading-7 text-[color:var(--text-soft)]">
              Cards are a great way to organize content in a collection: products, case studies, services, and more.
            </p>
          </div>
          <div className="rounded-[18px] bg-[var(--surface-muted)] p-5">
            <p className="text-sm leading-7 text-[color:var(--text-soft)]">
              Add more cards to this little stack to build out a grid of whatever size and shape you need.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
