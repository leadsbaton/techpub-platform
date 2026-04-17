import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { RankedSidebar } from '../../../_components/RankedSidebar'
import { WebinarRegistrationForm } from '../../_components/WebinarRegistrationForm'
import { getContentTypes, getPostBySlug, getPosts } from '@/lib/api/cms'

type Params = Promise<{ slug: string }>

async function getWebinar(slug: string) {
  return getPostBySlug(slug, 'webinar')
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params
  const post = await getWebinar(slug)
  if (!post) return { title: 'Webinar Registration' }
  return {
    title: `${post.title} | Registration`,
    description: post.excerpt,
  }
}

export default async function WebinarAccessPage({ params }: { params: Params }) {
  const { slug } = await params
  const [post, related, contentTypes] = await Promise.all([
    getWebinar(slug),
    getPosts({ type: 'webinar', limit: 7 }),
    getContentTypes(12),
  ])

  if (!post) notFound()

  return (
    <div className="relative left-1/2 w-screen -translate-x-1/2 bg-white">
      <article className="site-container py-8 sm:py-10">
        <section className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-8">
            <div className="space-y-4">
              <Link href={`/webinars/${post.slug}`} className="ui-font text-sm font-medium uppercase tracking-[0.18em] text-[var(--accent-red)]">
                Webinars
              </Link>
              <h1 className="ui-font text-[28px] font-medium leading-[1.25] text-[#020202] sm:text-[42px]">
                {post.title}
              </h1>
              <p className="ui-font text-[18px] font-medium text-[#020202]">
                Thank you for your interest in DBTA Downloads/Webinars!
              </p>
              {post.webinarRegistration?.formDescription ? (
                <p className="ui-font max-w-[720px] text-[15px] leading-[1.6] text-[#4d4d4d]">
                  {post.webinarRegistration.formDescription}
                </p>
              ) : null}
            </div>
            <div className="max-w-[640px]">
              <WebinarRegistrationForm post={post} />
            </div>
          </div>
          <div className="space-y-6 xl:sticky xl:top-28 xl:self-start">
            <RankedSidebar
              title="Favorite"
              accent="People's"
              items={related.docs.filter((item) => item.id !== post.id).slice(0, 6)}
              contentTypes={contentTypes}
            />
          </div>
        </section>
      </article>
    </div>
  )
}
