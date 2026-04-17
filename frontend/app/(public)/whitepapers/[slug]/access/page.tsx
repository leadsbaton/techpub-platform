import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { RankedSidebar } from '../../../_components/RankedSidebar'
import { WhitepaperLeadForm } from '../../_components/WhitepaperLeadForm'
import { getContentTypes, getPostBySlug, getPosts } from '@/lib/api/cms'

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
  const [post, favorites, contentTypes] = await Promise.all([
    getWhitepaper(slug),
    getPosts({ type: 'whitepaper', limit: 7 }),
    getContentTypes(12),
  ])

  if (!post) {
    notFound()
  }

  return (
    <div className="relative left-1/2 w-screen -translate-x-1/2 bg-white">
      <article className="site-container py-8 sm:py-10">
        <section className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-8">
            <div className="space-y-4">
              <Link
                href={`/whitepapers/${post.slug}`}
                className="ui-font text-sm font-medium uppercase tracking-[0.18em] text-[var(--accent-red)]"
              >
                White Papers
              </Link>
              <h1 className="ui-font text-[28px] font-medium leading-[1.25] text-[#020202] sm:text-[42px]">
                {post.title}
              </h1>
              <p className="ui-font text-[18px] font-medium text-[#020202]">
                Thank you for your interest in DBTA Downloads/Webinars!
              </p>
            </div>

            <div className="max-w-[640px]">
              <WhitepaperLeadForm post={post} variant="figma" />
            </div>
          </div>

          <div className="space-y-6 xl:sticky xl:top-28 xl:self-start">
            <RankedSidebar
              title="Favorite"
              accent="People's"
              items={favorites.docs.filter((item) => item.id !== post.id).slice(0, 6)}
              contentTypes={contentTypes}
            />
          </div>
        </section>
      </article>
    </div>
  )
}
