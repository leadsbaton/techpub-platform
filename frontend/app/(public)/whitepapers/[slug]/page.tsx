import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { RankedSidebar } from '../../_components/RankedSidebar'
import { PostShareBar } from '../../_components/PostShareBar'
import { RichTextRenderer } from '../../_components/RichTextRenderer'
import { getContentTypes, getPostBySlug, getPosts } from '@/lib/api/cms'
import { buildPostMetadata } from '@/lib/utils/metadata'
import { getImageUrl } from '@/lib/utils/formatting'

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

  const actionLabel =
    post.leadCapture?.deliveryMode === 'download'
      ? 'Download PDF'
      : post.leadCapture?.deliveryMode === 'read'
        ? 'Read Now'
        : 'Open Resource'

  return (
    <div className="relative left-1/2 w-screen -translate-x-1/2 bg-white">
      <article className="site-container py-8 sm:py-10">
        <section className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-8">
            <h1 className="ui-font block text-[30px] font-medium leading-[1.15] text-[#111] md:hidden">
              {post.title}
            </h1>

            <div className="flex flex-col gap-10 md:flex-row md:items-start">
              <div className="w-full md:w-[24%]">
                <div className="flex flex-col items-center">
                  <div className="relative h-40 w-full max-w-[170px] overflow-hidden border border-gray-300 bg-white">
                    <Image src={getImageUrl(post.featuredImage)} alt={post.title} fill className="object-contain" />
                  </div>
                  <Link
                    href={`/whitepapers/${post.slug}/access`}
                    className="ui-font mt-4 inline-flex w-full max-w-[170px] items-center justify-center bg-[#e11d2e] px-6 py-2 text-center text-[15px] font-semibold uppercase text-white transition hover:bg-[#c61c2b]"
                  >
                    {actionLabel}
                  </Link>
                </div>
              </div>

              <div className="ui-font w-full space-y-4 md:w-[76%]">
                <h1 className="hidden text-[32px] font-medium leading-[1.2] text-[#111] md:block">
                  {post.title}
                </h1>
                <p className="text-[16px] leading-[1.7] text-[#2d2d2d]">
                  {post.excerpt}
                </p>
                <PostShareBar post={post} />
              </div>
            </div>

            <div className="text-center">
              <Link
                href={`/whitepapers/${post.slug}/access`}
                className="ui-font inline-flex text-[18px] font-semibold text-[#e11d2e] transition hover:underline"
              >
                {actionLabel}
              </Link>
            </div>

            {post.content ? (
              <div className="prose max-w-none pt-2">
                <RichTextRenderer content={post.content} />
              </div>
            ) : null}
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
