import Image from 'next/image'
import Link from 'next/link'

import type { Category } from '@/lib/types/cms'
import { getImageUrl } from '@/lib/utils/formatting'

const copyBySlug: Record<string, string> = {
  marketing: 'Explore strategies, stories, and playbooks powering high-impact campaigns and brands.',
  finance: 'Understand the numbers, risks, and opportunities driving smarter financial decisions.',
  technology: 'Dive into cutting-edge trends, tools, and insights shaping the future of digital innovation.',
}

export function HomeCategoryPanel({ categories }: { categories: Category[] }) {
  if (!categories.length) return null

  const primary = categories.slice(0, 2)
  const featured = categories[2]

  return (
    <section className="site-container mt-16 space-y-6">
      <div className="space-y-1">
        <p className="text-[0.9rem] font-semibold text-[color:var(--text-muted)]">Discover by Category</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {primary.map((category) => (
          <Link key={category.id} href={`/categories/${category.slug}`} className="group overflow-hidden rounded-[20px] bg-white shadow-[var(--shadow-soft)]">
            <div className="relative aspect-[1.2/0.78]">
              <Image
                src={getImageUrl(category.image)}
                alt={category.name}
                fill
                className="object-cover transition duration-300 group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                <h3 className="text-[1.35rem] font-semibold">{category.name}</h3>
                <p className="mt-2 max-w-sm text-sm leading-6 text-white/85">
                  {copyBySlug[category.slug] || category.description || 'Explore the latest editorial coverage in this category.'}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {featured ? (
        <Link href={`/categories/${featured.slug}`} className="group block overflow-hidden rounded-[22px] shadow-[var(--shadow-soft)]">
          <div className="relative aspect-[2.8/1] min-h-[220px]">
            <Image
              src={getImageUrl(featured.image)}
              alt={featured.name}
              fill
              className="object-cover transition duration-300 group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/30 to-transparent" />
            <div className="absolute inset-y-0 left-0 flex max-w-lg items-center p-6 text-white md:p-8">
              <div>
                <p className="text-sm uppercase tracking-[0.18em] text-white/75">{featured.name}</p>
                <h3 className="mt-3 text-[clamp(1.8rem,3vw,3rem)] font-semibold leading-tight">
                  {copyBySlug[featured.slug] || featured.description || 'Explore a focused stream of high-signal category coverage.'}
                </h3>
              </div>
            </div>
          </div>
        </Link>
      ) : null}
    </section>
  )
}
