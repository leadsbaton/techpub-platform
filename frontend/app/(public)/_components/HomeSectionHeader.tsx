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
          <h2 className="ui-font text-[clamp(1.35rem,2.2vw,2rem)] font-medium leading-none tracking-normal text-[#020202]">
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
          className="inline-flex shrink-0 items-center border-b border-[color:var(--text-strong)] text-[0.92rem] font-medium leading-none text-[color:var(--text-strong)] transition hover:border-[var(--accent-red)] hover:text-[var(--accent-red)]"
        >
          {actionLabel}
        </Link>
      ) : null}
    </div>
  )
}
