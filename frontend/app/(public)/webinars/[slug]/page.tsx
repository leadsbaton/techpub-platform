import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { RankedSidebar } from '../../_components/RankedSidebar'
import { PostShareBar } from '../../_components/PostShareBar'
import { RichTextRenderer } from '../../_components/RichTextRenderer'
import { getContentTypes, getPostBySlug, getPosts } from '@/lib/api/cms'
import { getImageUrl, getMediaDimensions, getWebinarModerator, getWebinarSpeakers } from '@/lib/utils/formatting'
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

  const speakers = getWebinarSpeakers(post)
  const moderator = getWebinarModerator(post)
  const agenda = post.webinarRegistration?.agendaPoints || []
  const heroDims = getMediaDimensions(post.featuredImage)
  const secondaryDims = getMediaDimensions(post.webinarSecondaryBanner)

  return (
    <div className="relative left-1/2 w-screen -translate-x-1/2 bg-white">
      <article className="site-container py-8 sm:py-10">
        <section className="grid grid-cols-1 gap-10 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-w-0 space-y-8">
            {/* Top banner: clean image only (no title/timing overlay). Rendered
                at its natural dimensions so it isn't cropped. */}
            <div className="overflow-hidden rounded-[12px] bg-[#f4f4f2]">
              {heroDims ? (
                <Image
                  src={getImageUrl(post.featuredImage)}
                  alt={post.title}
                  width={heroDims.width}
                  height={heroDims.height}
                  sizes="(max-width: 1280px) 100vw, 900px"
                  priority
                  className="h-auto w-full"
                />
              ) : (
                <div className="relative aspect-[16/7] w-full" style={{ minHeight: '180px' }}>
                  <Image src={getImageUrl(post.featuredImage)} alt={post.title} fill priority sizes="(max-width: 1280px) 100vw, 900px" className="object-cover" />
                </div>
              )}
            </div>

            {/* Title + event timing, shown below the banner instead of over it. */}
            <div className="space-y-2 text-center">
              {post.webinarRegistration?.eventDateLabel ? (
                <p className="ui-font text-[12px] font-semibold uppercase tracking-[0.08em] text-[var(--accent-red)] sm:text-[15px]">
                  {post.webinarRegistration.eventDateLabel}
                </p>
              ) : null}
              <h1 className="ui-font text-[24px] font-medium leading-[1.2] text-[#111] sm:text-[40px]">
                {post.title}
              </h1>
            </div>

            {post.webinarSecondaryBanner ? (
              <div className="overflow-hidden rounded-[12px] bg-[#f4f4f2]">
                {secondaryDims ? (
                  <Image
                    src={getImageUrl(post.webinarSecondaryBanner)}
                    alt={post.webinarSecondaryBannerAlt || `${post.title} banner`}
                    width={secondaryDims.width}
                    height={secondaryDims.height}
                    sizes="(max-width: 1280px) 100vw, 900px"
                    className="h-auto w-full"
                  />
                ) : (
                  <div className="relative aspect-[16/7] w-full" style={{ minHeight: '180px' }}>
                    <Image
                      src={getImageUrl(post.webinarSecondaryBanner)}
                      alt={post.webinarSecondaryBannerAlt || `${post.title} banner`}
                      fill
                      sizes="(max-width: 1280px) 100vw, 900px"
                      className="object-cover"
                    />
                  </div>
                )}
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
              {post.webinarRegistration?.eventSummary ? (
                <p>{post.webinarRegistration.eventSummary}</p>
              ) : null}
              {post.content ? (
                <div className="prose max-w-none">
                  <RichTextRenderer content={post.content} />
                </div>
              ) : null}
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

            {(speakers.length || moderator) ? (
              <section className="grid gap-10 sm:grid-cols-[1fr_auto] sm:gap-8">
                {speakers.length ? (
                  <div>
                    <h2 className="ui-font mb-5 text-center text-[15px] font-bold uppercase tracking-[0.04em] text-[#5a5a8d] sm:text-left">
                      Speakers
                    </h2>
                    <div className="grid gap-7 sm:grid-cols-4 sm:gap-5">
                      {speakers.map((speaker) => (
                        <div key={speaker.id} className="ui-font mx-auto max-w-[260px] text-center">
                          <div className="relative mx-auto h-[92px] w-[92px] overflow-hidden rounded-full bg-[#ddd]">
                            {speaker.photo ? (
                              <Image src={getImageUrl(speaker.photo)} alt={speaker.name || 'Speaker'} fill sizes="92px" className="object-cover" />
                            ) : null}
                          </div>
                          <div className="mt-3 text-[14px] font-semibold text-[#111]">{speaker.name}</div>
                          {speaker.role ? <div className="mt-0.5 text-[12px] font-medium text-[#4d4d4d]">{speaker.role}</div> : null}
                          {speaker.secondaryLine ? (
                            <div className="mt-1 line-clamp-3 text-[12px] leading-[1.4] text-[#6a6a6a]">{speaker.secondaryLine}</div>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}

                {moderator ? (
                  <div>
                    <h2 className="ui-font mb-5 text-center text-[15px] font-bold uppercase tracking-[0.04em] text-[#8a8ab5] sm:text-left">
                      Moderator
                    </h2>
                    <div className="ui-font mx-auto max-w-[260px] text-center sm:w-[180px]">
                      <div className="relative mx-auto h-[92px] w-[92px] overflow-hidden rounded-full bg-[#ddd]">
                        {moderator.photo ? (
                          <Image src={getImageUrl(moderator.photo)} alt={moderator.name} fill sizes="92px" className="object-cover" />
                        ) : null}
                      </div>
                      <div className="mt-3 text-[14px] font-semibold text-[#111]">{moderator.name}</div>
                      {moderator.role ? <div className="mt-0.5 text-[12px] font-medium text-[#4d4d4d]">{moderator.role}</div> : null}
                      {moderator.secondaryLine ? (
                        <div className="mt-1 line-clamp-3 text-[12px] leading-[1.4] text-[#6a6a6a]">{moderator.secondaryLine}</div>
                      ) : null}
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
