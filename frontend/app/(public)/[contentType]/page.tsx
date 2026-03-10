import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Pagination } from '../_components/Pagination'
import { PostCard } from '../_components/PostCard'
import { RichTextRenderer } from '../_components/RichTextRenderer'
import { getPageBySlug, getPosts } from '@/lib/api/cms'
import { getImageUrl, resolveLinkHref } from '@/lib/utils/formatting'

const typeMap = {
  insights: 'insight',
  whitepapers: 'whitepaper',
  webinars: 'webinar',
  'case-studies': 'case-study',
} as const

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ contentType: string }>
  searchParams: Promise<{ page?: string; q?: string }>
}) {
  const { contentType } = await params
  const { page: rawPage, q } = await searchParams
  const page = Number(rawPage || 1)
  const mappedType = typeMap[contentType as keyof typeof typeMap]

  if (mappedType) {
    const data = await getPosts({ type: mappedType, page, limit: 9, query: q })

    return (
      <section className="mx-auto max-w-7xl space-y-8 px-4 py-10 md:px-6">
        <div className="max-w-3xl space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Content library</p>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
            {contentType.replace(/-/g, ' ')}
          </h1>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {data.docs.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
        <Pagination basePath={`/${contentType}`} currentPage={data.page} totalPages={data.totalPages} query={{ q }} />
      </section>
    )
  }

  const pageDoc = await getPageBySlug(contentType)
  if (!pageDoc) notFound()

  return (
    <article className="mx-auto max-w-6xl space-y-10 px-4 py-10 md:px-6">
      <section className="grid gap-8 rounded-[36px] bg-white md:grid-cols-[1fr_0.9fr]">
        <div className="space-y-5">
          {pageDoc.hero?.eyebrow ? (
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
              {pageDoc.hero.eyebrow}
            </p>
          ) : null}
          <h1 className="text-4xl font-semibold tracking-tight text-slate-950 md:text-6xl">
            {pageDoc.hero?.headline || pageDoc.title}
          </h1>
          {pageDoc.hero?.description || pageDoc.summary ? (
            <p className="text-lg leading-8 text-slate-600">
              {pageDoc.hero?.description || pageDoc.summary}
            </p>
          ) : null}
          <div className="flex flex-wrap gap-3">
            {pageDoc.hero?.primaryAction ? (
              <Link href={resolveLinkHref(pageDoc.hero.primaryAction)} className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white">
                {pageDoc.hero.primaryAction.label}
              </Link>
            ) : null}
            {pageDoc.hero?.secondaryAction ? (
              <Link href={resolveLinkHref(pageDoc.hero.secondaryAction)} className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-800">
                {pageDoc.hero.secondaryAction.label}
              </Link>
            ) : null}
          </div>
        </div>
        {pageDoc.hero?.image ? (
          <div className="relative min-h-[320px] overflow-hidden rounded-[32px]">
            <Image src={getImageUrl(pageDoc.hero.image)} alt={pageDoc.title} fill className="object-cover" />
          </div>
        ) : null}
      </section>

      <RichTextRenderer content={pageDoc.content} />

      {pageDoc.featuredPosts?.length ? (
        <section className="space-y-6">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-950">Featured content</h2>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {pageDoc.featuredPosts
              .filter((item): item is Exclude<typeof item, string> => Boolean(item && typeof item !== 'string'))
              .map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
          </div>
        </section>
      ) : null}
    </article>
  )
}
