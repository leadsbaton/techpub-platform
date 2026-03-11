import { notFound } from 'next/navigation'

import { Pagination } from '../../_components/Pagination'
import { PostCard } from '../../_components/PostCard'
import { getPosts, getTagBySlug } from '@/lib/api/cms'

export const dynamic = 'force-dynamic'

export default async function TagPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page?: string }>
}) {
  const { slug } = await params
  const { page: rawPage } = await searchParams
  const page = Number(rawPage || 1)

  const [tag, posts] = await Promise.all([
    getTagBySlug(slug),
    getPosts({ tag: slug, page, limit: 9 }),
  ])

  if (!tag) notFound()

  return (
    <section className="mx-auto max-w-7xl space-y-8 px-4 py-10 md:px-6">
      <div className="max-w-3xl space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Tag</p>
        <h1 className="text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">#{tag.name}</h1>
        {tag.description ? <p className="text-lg leading-8 text-slate-600">{tag.description}</p> : null}
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {posts.docs.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
      <Pagination basePath={`/tags/${tag.slug}`} currentPage={posts.page} totalPages={posts.totalPages} />
    </section>
  )
}
