import Link from 'next/link'

export function HomeRuledHeader({
  title,
  subtitle,
  href,
  actionLabel = 'View All',
  className = '',
}: {
  title: string
  subtitle?: string
  href?: string
  actionLabel?: string
  className?: string
}) {
  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <div className="flex min-w-0 items-center gap-3 sm:gap-5">
        <h2 className="ui-font min-w-0 max-w-[11ch] text-balance text-[clamp(1.2rem,5.4vw,2rem)] font-medium leading-none text-[#020202] sm:max-w-none sm:shrink-0 sm:text-[32px]">
          {title}
        </h2>
        <span className="double-rule" aria-hidden="true" />
        {href ? (
          <Link
            href={href}
            className="shrink-0 border-b border-[color:var(--text-strong)] text-[0.82rem] font-medium leading-none text-[color:var(--text-strong)] transition hover:border-[var(--accent-red)] hover:text-[color:var(--accent-red)] sm:text-[0.95rem]"
          >
            {actionLabel}
          </Link>
        ) : null}
      </div>
      {subtitle ? (
        <p className="max-w-2xl text-[0.98rem] leading-7 text-[color:var(--text-muted)]">
          {subtitle}
        </p>
      ) : null}
    </div>
  )
}
