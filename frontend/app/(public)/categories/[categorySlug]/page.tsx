import { notFound } from 'next/navigation'

import { Pagination } from '../../_components/Pagination'
import { PostCard } from '../../_components/PostCard'
import { getCategoryBySlug, getPosts } from '@/lib/api/cms'

export const revalidate = 60

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ categorySlug: string }>
  searchParams: Promise<{ page?: string }>
}) {
  const { categorySlug } = await params
  const { page: rawPage } = await searchParams
  const page = Number(rawPage || 1)

  const [category, posts] = await Promise.all([
    getCategoryBySlug(categorySlug),
    getPosts({ category: categorySlug, page, limit: 9 }),
  ])

  if (!category) {
    notFound()
  }

  return (
    <section className="mx-auto max-w-7xl space-y-8 px-4 py-10 md:px-6">
      <div className="max-w-3xl space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Category</p>
        <h1 className="text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">{category.name}</h1>
        {category.description ? <p className="text-lg leading-8 text-slate-600">{category.description}</p> : null}
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {posts.docs.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
      <Pagination basePath={`/categories/${category.slug}`} currentPage={posts.page} totalPages={posts.totalPages} />
    </section>
  )
}
