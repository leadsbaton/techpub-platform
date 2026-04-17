import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { RankedSidebar } from '../../_components/RankedSidebar'
import { RichTextRenderer } from '../../_components/RichTextRenderer'
import { WhitepaperLeadForm } from '../_components/WhitepaperLeadForm'
import { getContentTypes, getPostBySlug, getPosts } from '@/lib/api/cms'
import {
  formatDate,
  getAuthorNames,
  getCategoryName,
  getImageUrl,
  getMediaUrl,
} from '@/lib/utils/formatting'

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

  return {
    title: post.seo?.metaTitle || post.title,
    description: post.seo?.metaDescription || post.excerpt,
  }
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

  const fallbackUrl =
    post.leadCapture?.deliveryUrl || post.externalUrl || getMediaUrl(post.downloadAsset) || null
  const directLabel =
    post.leadCapture?.deliveryMode === 'read'
      ? 'Read now'
      : post.leadCapture?.deliveryMode === 'redirect'
        ? 'Continue'
        : 'Download now'

  return (
    <article className="site-container space-y-8 py-8 sm:py-10">
      <section className="grid gap-8 xl:grid-cols-[280px_minmax(0,1fr)_320px]">
        <div className="space-y-5 xl:sticky xl:top-28 xl:self-start">
          <div className="overflow-hidden rounded-[28px] border border-[var(--border-subtle)] bg-white shadow-[var(--shadow-soft)]">
            <div className="relative aspect-[4/5] bg-[var(--surface-muted)]">
              <Image src={getImageUrl(post.featuredImage)} alt={post.title} fill className="object-cover" />
            </div>
            <div className="space-y-3 p-5">
              <span className="inline-flex rounded-full bg-[var(--surface)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--accent-red)]">
                {getCategoryName(post.primaryCategory)}
              </span>
              <div className="text-sm leading-6 text-[color:var(--text-soft)]">
                Published {formatDate(post.publishedAt)}
              </div>
              <div className="text-sm leading-6 text-[color:var(--text-soft)]">
                By {getAuthorNames(post.authors)}
              </div>
              {post.leadCapture?.enabled === false && fallbackUrl ? (
                <a
                  href={fallbackUrl}
                  target={post.leadCapture?.openDeliveryInNewTab === false ? undefined : '_blank'}
                  rel="noreferrer"
                  className="inline-flex w-full items-center justify-center rounded-full bg-[var(--accent-red)] px-5 py-3 text-sm font-semibold text-white"
                >
                  {directLabel}
                </a>
              ) : null}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <Link
              href="/whitepapers"
              className="text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--accent-red)]"
            >
              White Papers
            </Link>
            <h1 className="text-4xl font-semibold tracking-tight text-[color:var(--text-strong)] sm:text-5xl">
              {post.title}
            </h1>
            <p className="text-lg leading-8 text-[color:var(--text-soft)]">{post.excerpt}</p>
          </div>

          {post.leadCapture?.enabled !== false ? <WhitepaperLeadForm post={post} /> : null}

          <section className="rounded-[32px] bg-white p-6 shadow-[var(--shadow-soft)] md:p-8">
            <div className="prose max-w-none">
              <RichTextRenderer content={post.content} />
            </div>
          </section>
        </div>

        <div className="space-y-6 xl:sticky xl:top-28 xl:self-start">
          {webinars.docs.length ? (
            <RankedSidebar
              title="Webinars"
              accent="Upcoming"
              items={webinars.docs}
              contentTypes={contentTypes}
            />
          ) : null}
        </div>
      </section>
    </article>
  )
}
