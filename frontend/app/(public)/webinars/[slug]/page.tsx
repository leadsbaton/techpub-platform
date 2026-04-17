import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { RankedSidebar } from '../../_components/RankedSidebar'
import { PostShareBar } from '../../_components/PostShareBar'
import { RichTextRenderer } from '../../_components/RichTextRenderer'
import { getContentTypes, getPostBySlug, getPosts } from '@/lib/api/cms'
import { getImageUrl } from '@/lib/utils/formatting'
import { buildPostMetadata } from '@/lib/utils/metadata'

type Params = Promise<{ slug: string }>

async function getWebinar(slug: string) {
  return getPostBySlug(slug, 'webinar')
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params
  const post = await getWebinar(slug)
  if (!post) return { title: 'Webinar' }
  return buildPostMetadata(post, `/webinars/${post.slug}`)
}

export default async function WebinarDetailPage({ params }: { params: Params }) {
  const { slug } = await params
  const [post, related, contentTypes] = await Promise.all([
    getWebinar(slug),
    getPosts({ type: 'webinar', limit: 7 }),
    getContentTypes(12),
  ])

  if (!post) notFound()

  const speakers = post.webinarRegistration?.speakers || []
  const agenda = post.webinarRegistration?.agendaPoints || []

  return (
    <div className="relative left-1/2 w-screen -translate-x-1/2 bg-white">
      <article className="site-container py-8 sm:py-10">
        <section className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-8">
            <div className="relative overflow-hidden">
              <div className="relative h-[180px] sm:h-[250px]">
                <Image src={getImageUrl(post.featuredImage)} alt={post.title} fill className="object-cover" />
                <div className="absolute inset-0 bg-black/20" />
                {post.webinarRegistration?.eventDateLabel ? (
                  <div className="ui-font absolute inset-x-0 top-0 bg-black/25 px-4 py-2 text-center text-[10px] uppercase text-white sm:text-[16px]">
                    {post.webinarRegistration.eventDateLabel}
                  </div>
                ) : null}
                <div className="ui-font absolute inset-x-0 bottom-0 p-4 text-center text-white sm:p-8">
                  <h1 className="text-[24px] font-medium leading-[1.15] sm:text-[48px]">{post.title}</h1>
                </div>
              </div>
            </div>

            {post.webinarSecondaryBanner ? (
              <div className="relative overflow-hidden">
                <div className="relative h-[180px] sm:h-[250px]">
                  <Image
                    src={getImageUrl(post.webinarSecondaryBanner)}
                    alt={post.webinarSecondaryBannerAlt || `${post.title} banner`}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            ) : null}

            <div className="flex justify-center">
              <Link href={`/webinars/${post.slug}/access`} className="ui-font rounded-[10px] bg-[#FC0203] px-8 py-3 text-[20px] font-medium text-white">
                {post.webinarRegistration?.ctaLabel || 'Register now'}
              </Link>
            </div>

            <div className="flex justify-center">
              <PostShareBar post={post} />
            </div>

            <div className="ui-font space-y-5 text-[16px] leading-[145%] text-[#2d2d2d]">
              <p>{post.webinarRegistration?.eventSummary || post.excerpt}</p>
              {post.content ? (
                <div className="prose max-w-none">
                  <RichTextRenderer content={post.content} />
                </div>
              ) : (
                <p>{post.excerpt}</p>
              )}
              {agenda.length ? (
                <div className="space-y-2">
                  <p className="font-medium text-[#111]">Join this webinar roundtable webinar to learn:</p>
                  <ul className="list-disc pl-6">
                    {agenda.map((item, index) => (
                      <li key={`${post.id}-agenda-${index}`}>{item.point}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>

            {(speakers.length || post.webinarRegistration?.moderatorName) ? (
              <section className="grid gap-8 sm:grid-cols-[1fr_auto]">
                {speakers.length ? (
                  <div>
                    <h2 className="ui-font mb-4 text-[16px] font-bold uppercase text-[#5a5a8d]">Speakers</h2>
                    <div className="grid gap-5 sm:grid-cols-4">
                      {speakers.map((speaker, index) => (
                        <div key={`${post.id}-speaker-${index}`} className="ui-font text-center">
                          <div className="mx-auto relative h-[82px] w-[82px] overflow-hidden rounded-full bg-[#ddd]">
                            {speaker.photo ? (
                              <Image src={getImageUrl(speaker.photo)} alt={speaker.name || 'Speaker'} fill className="object-cover" />
                            ) : null}
                          </div>
                          <div className="mt-2 text-[12px] font-medium text-[#111]">{speaker.name}</div>
                          <div className="text-[10px] leading-[1.2] text-[#4d4d4d]">{speaker.role}</div>
                          <div className="text-[10px] leading-[1.2] text-[#4d4d4d]">{speaker.company}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}

                {post.webinarRegistration?.moderatorName ? (
                  <div>
                    <h2 className="ui-font mb-4 text-[16px] font-bold uppercase text-[#8a8ab5]">Moderator</h2>
                    <div className="ui-font text-center">
                      <div className="mx-auto relative h-[82px] w-[82px] overflow-hidden rounded-full bg-[#ddd]">
                        {post.webinarRegistration?.moderatorPhoto ? (
                          <Image src={getImageUrl(post.webinarRegistration.moderatorPhoto)} alt={post.webinarRegistration.moderatorName} fill className="object-cover" />
                        ) : null}
                      </div>
                      <div className="mt-2 text-[12px] font-medium text-[#111]">{post.webinarRegistration.moderatorName}</div>
                      <div className="text-[10px] leading-[1.2] text-[#4d4d4d]">{post.webinarRegistration.moderatorRole}</div>
                      <div className="text-[10px] leading-[1.2] text-[#4d4d4d]">{post.webinarRegistration.moderatorCompany}</div>
                    </div>
                  </div>
                ) : null}
              </section>
            ) : null}
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
