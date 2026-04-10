import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { RichTextRenderer } from '../../_components/RichTextRenderer'
import { getPostBySlug, getPosts } from '@/lib/api/cms'
import { getPostHref } from '@/lib/utils/contentTypes'
import { getImageUrl } from '@/lib/utils/formatting'

function FavoriteRail({ items }: { items: Awaited<ReturnType<typeof getPosts>>['docs'] }) {
  return (
    <aside className="rounded-[18px] border border-[var(--accent-red)] bg-white p-5">
      <h2 className="headline-font border-b border-[var(--border-subtle)] pb-3 text-[1.15rem] font-extrabold text-[color:var(--text-strong)]">
        <span className="text-[var(--accent-red)]">People&apos;s</span> Favorite
      </h2>
      <div className="mt-2">
        {items.slice(0, 6).map((item, index) => (
          <Link
            key={item.id}
            href={getPostHref(item)}
            className="flex gap-4 border-b border-[var(--border-subtle)] py-4 last:border-b-0"
          >
            <span className="text-[1.35rem] font-extrabold text-[var(--accent-red)]">
              {index + 1}.
            </span>
            <span className="text-[0.98rem] font-medium leading-6 text-[color:var(--text-soft)]">
              {item.title}
            </span>
          </Link>
        ))}
      </div>
    </aside>
  )
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
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div>
          <div className="relative aspect-[2.35/0.75] overflow-hidden rounded-[4px]">
            <Image
              src={getImageUrl(post.featuredImage)}
              alt={post.title}
              fill
              className="object-cover"
            />
          </div>

          <div className="mx-auto max-w-4xl px-4 pt-8 text-center">
            <h1 className="headline-font text-[1.6rem] font-extrabold leading-[1.25] text-[color:var(--text-strong)] md:text-[2rem]">
              {post.title}
            </h1>
          </div>

          <div className="mt-8 max-w-4xl space-y-6 text-[1.05rem] leading-8 text-[color:var(--text-soft)]">
            {post.excerpt ? <p>{post.excerpt}</p> : null}
            <div className="prose max-w-none">
              <RichTextRenderer content={post.content} />
            </div>
          </div>
        </div>

        <div className="lg:pt-6">
          <FavoriteRail items={favoriteItems} />
        </div>
      </div>
    </article>
  )
}
