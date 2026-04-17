import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { RankedSidebar } from '../../../_components/RankedSidebar'
import { WhitepaperLeadForm } from '../../_components/WhitepaperLeadForm'
import { getContentTypes, getPostBySlug, getPosts } from '@/lib/api/cms'
import { formatDate, getAuthorNames, getCategoryName, getImageUrl } from '@/lib/utils/formatting'

type Params = Promise<{ slug: string }>

async function getWhitepaper(slug: string) {
  return getPostBySlug(slug, 'whitepaper')
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params
  const post = await getWhitepaper(slug)

  if (!post) {
    return { title: 'White Paper Access' }
  }

  return {
    title: `${post.title} | Access`,
    description: post.excerpt,
  }
}

export default async function WhitepaperAccessPage({ params }: { params: Params }) {
  const { slug } = await params
  const [post, favoriteWhitepapers, contentTypes] = await Promise.all([
    getWhitepaper(slug),
    getPosts({ type: 'whitepaper', limit: 7 }),
    getContentTypes(12),
  ])

  if (!post) {
    notFound()
  }

  return (
    <article className="site-container space-y-8 py-8 sm:py-10">
      <section className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-8">
          <div className="space-y-4">
            <Link
              href={`/whitepapers/${post.slug}`}
              className="ui-font text-sm font-medium uppercase tracking-[0.18em] text-[var(--accent-red)]"
            >
              White Papers
            </Link>
            <h1 className="ui-font text-[32px] font-medium leading-[1.2] text-[#020202] sm:text-[42px]">
              {post.title}
            </h1>
          </div>

          <div className="grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)]">
            <div className="space-y-4">
              <div className="relative aspect-[4/5] overflow-hidden bg-[var(--surface-muted)]">
                <Image src={getImageUrl(post.featuredImage)} alt={post.title} fill className="object-cover" />
              </div>
              <div className="ui-font space-y-2 text-sm text-[#666]">
                <div>By {getAuthorNames(post.authors)}</div>
                <div>{formatDate(post.publishedAt)}</div>
                <div>{getCategoryName(post.primaryCategory)}</div>
              </div>
            </div>

            <WhitepaperLeadForm post={post} />
          </div>
        </div>

        <div className="space-y-6 xl:sticky xl:top-28 xl:self-start">
          <RankedSidebar
            title="Favorite"
            accent="People's"
            items={favoriteWhitepapers.docs.filter((item) => item.id !== post.id).slice(0, 6)}
            contentTypes={contentTypes}
          />
        </div>
      </section>
    </article>
  )
}
