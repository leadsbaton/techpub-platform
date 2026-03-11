import { notFound } from 'next/navigation'

import { Pagination } from '../_components/Pagination'
import { PostCard } from '../_components/PostCard'
import { getPosts } from '@/lib/api/cms'

export const dynamic = 'force-dynamic'

export default async function InsightsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedSearchParams = await searchParams
  const page = Number(resolvedSearchParams.page || 1)
  const query = typeof resolvedSearchParams.q === 'string' ? resolvedSearchParams.q : undefined

  const data = await getPosts({
    type: 'insight',
    page,
    limit: 9,
    query,
  }).catch(() => null)

  if (!data) notFound()

  return (
    <section className="mx-auto max-w-7xl space-y-8 px-4 py-10 md:px-6">
      <div className="max-w-3xl space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Insights</p>
        <h1 className="text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
          Editorial stories, blog articles, and campaign-led thought leadership.
        </h1>
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {data.docs.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
      <Pagination basePath="/insights" currentPage={data.page} totalPages={data.totalPages} query={{ q: query }} />
    </section>
  )
}
