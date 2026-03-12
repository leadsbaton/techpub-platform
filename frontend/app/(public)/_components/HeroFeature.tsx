import Image from 'next/image'
import Link from 'next/link'

import type { Category, Post } from '@/lib/types/cms'
import { getPostHref } from '@/lib/utils/contentTypes'
import { getCategoryName, getImageUrl } from '@/lib/utils/formatting'

const heroCopyByCategory: Record<string, string> = {
  technology: 'Technology',
  finance: 'Finance',
  marketing: 'Marketing',
}

function getCategorySlug(category?: Post['primaryCategory']) {
  if (!category || typeof category === 'string') return undefined
  return category.slug
}

function getHeroImageFromCategory(categories: Category[], post: Post) {
  const categorySlug = getCategorySlug(post.primaryCategory)
  const match = categories.find((item) => item.slug === categorySlug)
  return match?.image || post.featuredImage
}

export function HeroFeature({
  post,
  categories,
}: {
  post: Post
  categories: Category[]
}) {
  const categoryName = getCategoryName(post.primaryCategory).toLowerCase()
  const heroTitle = heroCopyByCategory[categoryName] || getCategoryName(post.primaryCategory)
  const heroHref = getPostHref(post)
  const heroImage = getHeroImageFromCategory(categories, post)

  return (
    <section className="space-y-8">
      <Link href={heroHref} className="block overflow-hidden rounded-[28px]">
        <div className="relative aspect-[21/6] min-h-[240px]">
          <Image
            src={getImageUrl(heroImage)}
            alt={post.title}
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/10 to-transparent" />
          <div className="absolute inset-y-0 left-0 flex items-center p-8 md:p-12">
            <h1 className="max-w-4xl text-[clamp(3.5rem,9vw,6.75rem)] font-semibold uppercase tracking-tight text-white">
              {heroTitle}
            </h1>
          </div>
        </div>
      </Link>
    </section>
  )
}
