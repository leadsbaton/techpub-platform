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
      <div className="flex items-center gap-5">
        <h2 className="headline-font shrink-0 text-[clamp(1.55rem,2.4vw,2.3rem)] font-extrabold text-[color:var(--text-strong)]">
          {title}
        </h2>
        <span className="double-rule" aria-hidden="true" />
        {href ? (
          <Link
            href={href}
            className="shrink-0 border-b border-[color:var(--text-strong)] text-[0.95rem] font-semibold leading-none text-[color:var(--text-strong)] transition hover:text-[color:var(--accent-red)]"
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
