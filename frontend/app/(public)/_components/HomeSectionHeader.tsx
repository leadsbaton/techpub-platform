import Link from 'next/link'

export function HomeSectionHeader({
  title,
  href,
  actionLabel = 'View all',
}: {
  title: string
  href?: string
  actionLabel?: string
}) {
  return (
    <div className="section-heading">
      <h2 className="text-[clamp(2rem,2.8vw,3rem)] font-semibold tracking-tight text-[color:var(--text-strong)]">
        {title}
      </h2>
      {href ? (
        <Link href={href} className="shrink-0 text-lg font-medium text-[color:var(--text-strong)] underline-offset-4 hover:underline">
          {actionLabel}
        </Link>
      ) : null}
    </div>
  )
}
