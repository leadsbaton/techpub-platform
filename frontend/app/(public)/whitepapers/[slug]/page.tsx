import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { RankedSidebar } from '../../_components/RankedSidebar'
import { PostShareBar } from '../../_components/PostShareBar'
import { getContentTypes, getPostBySlug, getPosts } from '@/lib/api/cms'
import { buildPostMetadata } from '@/lib/utils/metadata'
import { formatDate, getAuthorNames, getImageUrl } from '@/lib/utils/formatting'

type Params = Promise<{ slug: string }>

async function getWhitepaper(slug: string) {
  return getPostBySlug(slug, 'whitepaper')
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params
  const post = await getWhitepaper(slug)

  if (!post) {
    return { title: 'White Paper' }
  }

  return buildPostMetadata(post, `/whitepapers/${post.slug}`)
}

export default async function WhitepaperDetailPage({ params }: { params: Params }) {
  const { slug } = await params
  const [post, webinars, contentTypes] = await Promise.all([
    getWhitepaper(slug),
    getPosts({ type: 'webinar', limit: 6 }),
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
            <h1 className="ui-font text-[28px] font-medium leading-[1.25] text-[#020202] sm:text-[42px]">
              {post.title}
            </h1>

            <div className="grid gap-8 lg:grid-cols-[90px_minmax(0,1fr)]">
              <div className="relative h-[130px] w-[90px] overflow-hidden">
                <Image src={getImageUrl(post.featuredImage)} alt={post.title} fill className="object-cover" />
              </div>

              <div className="ui-font space-y-4">
                <p className="max-w-[640px] text-[14px] leading-[145%] tracking-[-0.005em] text-[#2d2d2d] sm:text-[18px]">
                  {post.excerpt}
                </p>
                <div className="text-[14px] text-[#808080] sm:text-[16px]">
                  By {getAuthorNames(post.authors)} {formatDate(post.publishedAt)}
                </div>
                <PostShareBar post={post} />
                <Link
                  href={`/whitepapers/${post.slug}/access`}
                  className="inline-flex text-[26px] font-medium uppercase leading-none text-[#FC5A0A]"
                >
                  Read Now
                </Link>
              </div>
            </div>
          </div>

          <div className="space-y-6 xl:sticky xl:top-28 xl:self-start">
            <RankedSidebar
              title="Webinars"
              accent="Upcoming"
              items={webinars.docs}
              contentTypes={contentTypes}
            />
          </div>
        </section>
      </article>
    </div>
  )
}
