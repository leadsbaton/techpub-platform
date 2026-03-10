import Link from 'next/link'

import type { Post } from '@/lib/types/cms'

export function RankedSidebar({
  title,
  accent,
  items,
}: {
  title: string
  accent: string
  items: Post[]
}) {
  return (
    <aside className="rounded-[28px] border border-[var(--accent-red)] bg-[var(--surface)] p-6">
      <div className="mb-4 section-heading">
        <h3 className="text-[2rem] font-semibold tracking-tight text-[color:var(--text-strong)]">
          <span className="text-[color:var(--accent-red)]">{accent}</span> {title}
        </h3>
      </div>

      <div className="space-y-1">
        {items.map((item, index) => {
          const href = `/${item.type}s/${item.slug}`.replace('/case-studys/', '/case-studies/')

          return (
            <Link
              key={`${item.id}-${item.slug}-${index}`}
              href={href}
              className="grid grid-cols-[26px_1fr] gap-4 border-b border-[var(--border-subtle)] py-5 last:border-b-0"
            >
              <span className="text-[2rem] font-semibold leading-none text-[color:var(--accent-red)]">
                {index + 1}.
              </span>
              <span className="text-lg font-semibold leading-7 text-[color:var(--text-muted)] transition hover:text-[color:var(--text-strong)]">
                {item.title}
              </span>
            </Link>
          )
        })}
      </div>
    </aside>
  )
}
