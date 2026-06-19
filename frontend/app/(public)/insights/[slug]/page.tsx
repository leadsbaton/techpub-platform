import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { RankedSidebar } from '../../_components/RankedSidebar'
import { RichTextRenderer } from '../../_components/RichTextRenderer'
import { SafeImage } from '../../_components/SafeImage'
import { getPostBySlug, getPosts } from '@/lib/api/cms'
import { getImageUrl } from '@/lib/utils/formatting'
import { buildPostMetadata } from '@/lib/utils/metadata'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug, 'insight')

  if (!post) {
    return { title: 'Insight' }
  }

  return buildPostMetadata(post, `/insights/${post.slug}`)
}

export default async function InsightDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPostBySlug(slug, 'insight')

  if (!post) {
    notFound()
  }

  const favoriteItems = (
    await getPosts({
      type: 'insight',
      limit: 6,
    })
  ).docs.filter((item) => item.id !== post.id)

  return (
    <article className="site-container py-10">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0">
          <div className="relative aspect-[3.7/1] overflow-hidden rounded-[8px]">
            <SafeImage
              src={getImageUrl(post.featuredImage)}
              alt={post.title}
              fill
              sizes="(max-width: 1024px) 100vw, 900px"
              className="object-cover"
            />
          </div>

          {post.hideTitleOnDetail ? null : (
            <div className="mx-auto max-w-4xl px-4 pt-7 text-center">
              <h1 className="headline-font text-[1.4rem] font-extrabold leading-[1.3] text-[color:var(--text-strong)] md:text-[1.6rem]">
                {post.title}
              </h1>
            </div>
          )}

          <div className={`${post.hideTitleOnDetail ? 'mt-7' : 'mt-6'} max-w-4xl space-y-5 text-[0.98rem] leading-[1.75] text-[color:var(--text-soft)]`}>
            <div className="prose max-w-none">
              <RichTextRenderer content={post.content} />
            </div>
          </div>
        </div>

        <div>
          <RankedSidebar accent="People's" title="Favorite" items={favoriteItems} />
        </div>
      </div>
    </article>
  )
}
