import Link from 'next/link'

import type { ContentType, Post } from '@/lib/types/cms'
import { getPostHref } from '@/lib/utils/contentTypes'

export function RankedSidebar({
  title,
  accent,
  items,
  contentTypes = [],
}: {
  title: string
  accent: string
  items: Post[]
  contentTypes?: ContentType[]
}) {
  return (
    <aside className="rounded-[14px] border border-[var(--accent-red)] bg-white p-6">
      <h3 className="headline-font border-b border-[var(--border-subtle)] pb-3 text-[1.2rem] font-extrabold text-[color:var(--text-strong)]">
        <span className="text-[color:var(--accent-red)]">{accent}</span> {title}
      </h3>

      <div>
        {items.slice(0, 6).map((item, index) => (
          <Link
            key={`${item.id}-${item.slug}-${index}`}
            href={getPostHref(item, contentTypes)}
            className="grid grid-cols-[24px_1fr] gap-3 border-b border-[var(--border-subtle)] py-4 last:border-b-0"
          >
            <span className="text-[1.05rem] font-extrabold leading-[1.45] text-[color:var(--accent-red)]">
              {index + 1}.
            </span>
            <span className="text-[0.95rem] font-medium leading-[1.45] text-[color:var(--text-muted)] transition hover:text-[color:var(--text-strong)]">
              {item.title}
            </span>
          </Link>
        ))}
      </div>
    </aside>
  )
}
