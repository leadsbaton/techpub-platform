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
          <h2 className="text-[clamp(1.5rem,2.4vw,2.25rem)] font-semibold tracking-tight text-[color:var(--text-strong)]">
            {title}
          </h2>
        </div>
        {subtitle ? <p className="mt-3 text-[0.98rem] text-[color:var(--text-muted)]">{subtitle}</p> : null}
      </div>
      {href ? (
        <Link href={href} className="shrink-0 text-[0.95rem] font-semibold text-[color:var(--text-strong)] underline-offset-4 hover:underline">
          {actionLabel}
        </Link>
      ) : null}
    </div>
  )
}
