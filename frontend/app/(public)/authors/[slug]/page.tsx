import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { Pagination } from '../../_components/Pagination'
import { PostCard } from '../../_components/PostCard'
import { getAuthorBySlug, getPosts } from '@/lib/api/cms'

export const dynamic = 'force-dynamic'

// Without this every author page inherited the site-wide default title, making
// them indistinguishable to Google rather than each ranking for its own name.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const author = await getAuthorBySlug(slug)

  if (!author) return { title: 'Author' }

  return {
    title: author.name,
    description: author.bio || `Articles, white papers, and webinars from ${author.name}.`,
    alternates: { canonical: `/authors/${author.slug}` },
  }
}

export default async function AuthorPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page?: string }>
}) {
  const { slug } = await params
  const { page: rawPage } = await searchParams
  const page = Number(rawPage || 1)

  const [author, posts] = await Promise.all([
    getAuthorBySlug(slug),
    getPosts({ author: slug, page, limit: 9 }),
  ])

  if (!author) notFound()

  return (
    <section className="mx-auto max-w-7xl space-y-8 px-4 py-10 md:px-6">
      <div className="max-w-3xl space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Author</p>
        <h1 className="text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">{author.name}</h1>
        {author.role ? <p className="text-lg text-slate-500">{author.role}</p> : null}
        {author.bio ? <p className="text-lg leading-8 text-slate-600">{author.bio}</p> : null}
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {posts.docs.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
      <Pagination basePath={`/authors/${author.slug}`} currentPage={posts.page} totalPages={posts.totalPages} />
    </section>
  )
}
