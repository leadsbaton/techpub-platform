import Link from 'next/link'

export function HomeSectionHeader({
  title,
  subtitle,
  href,
  actionLabel = 'View all',
}: {
  title: string
  subtitle?: string
  href?: string
  actionLabel?: string
}) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div>
        <div className="section-heading">
          <h2 className="text-[clamp(1.4rem,2.4vw,2.2rem)] font-semibold tracking-tight text-[color:var(--text-strong)]">
            {title}
          </h2>
        </div>
        {subtitle ? (
          <p className="mt-3 max-w-2xl text-[0.98rem] leading-7 text-[color:var(--text-muted)]">
            {subtitle}
          </p>
        ) : null}
      </div>
      {href ? (
        <Link
          href={href}
          className="inline-flex shrink-0 items-center rounded-full border border-[var(--border-subtle)] bg-white px-4 py-2 text-[0.92rem] font-semibold text-[color:var(--text-strong)] transition hover:border-[var(--text-strong)]"
        >
          {actionLabel}
        </Link>
      ) : null}
    </div>
  )
}
