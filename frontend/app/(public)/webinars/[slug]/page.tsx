import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { RankedSidebar } from '../../_components/RankedSidebar'
import { RichTextRenderer } from '../../_components/RichTextRenderer'
import { SafeImage } from '../../_components/SafeImage'
import { ReadingProgressBar } from '../../_components/ReadingProgressBar'
import { getContentTypes, getPostBySlug, getPosts } from '@/lib/api/cms'
import { getImageUrl, getMediaDimensions, getWebinarPersonGroups, isUpcomingWebinar } from '@/lib/utils/formatting'
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

  const peopleGroups = getWebinarPersonGroups(post)
  const heroDims = getMediaDimensions(post.featuredImage)
  const secondaryDims = getMediaDimensions(post.webinarSecondaryBanner)
  const canRegister = post.webinarRegistration?.enabled !== false && isUpcomingWebinar(post)

  return (
    <>
      <ReadingProgressBar />
      <div className="relative left-1/2 w-screen -translate-x-1/2 bg-white">
      <article className="site-container py-8 sm:py-10">
        <section className="grid grid-cols-1 gap-10 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-w-0 space-y-8">
            {post.hideTitleOnDetail ? null : (
              <h1 className="ui-font text-[24px] font-medium leading-[1.2] text-[#111] sm:text-[34px]">
                {post.title}
              </h1>
            )}

            {/* Top banner: clean image at its natural dimensions (no overlay). */}
            <div>
              {heroDims ? (
                <SafeImage
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
                  <SafeImage src={getImageUrl(post.featuredImage)} alt={post.title} fill priority sizes="(max-width: 1280px) 100vw, 900px" className="object-cover" />
                </div>
              )}
            </div>

            {post.webinarSecondaryBanner ? (
              <div>
                {secondaryDims ? (
                  <SafeImage
                    src={getImageUrl(post.webinarSecondaryBanner)}
                    alt={post.webinarSecondaryBannerAlt || `${post.title} banner`}
                    width={secondaryDims.width}
                    height={secondaryDims.height}
                    sizes="(max-width: 1280px) 100vw, 900px"
                    className="h-auto w-full"
                  />
                ) : (
                  <div className="relative aspect-[16/7] w-full" style={{ minHeight: '180px' }}>
                    <SafeImage
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

            {canRegister ? (
              <div className="flex justify-center">
                <Link href={`/webinars/${post.slug}/access`} className="ui-font rounded-[10px] bg-[#FC0203] px-8 py-3 text-[20px] font-medium text-white">
                  {post.webinarRegistration?.ctaLabel || 'Register now'}
                </Link>
              </div>
            ) : null}


            {/* Sections mode: enabled by useContentSections flag OR if sections data already exists */}
            {(post.useContentSections || (post.webinarSections?.length ?? 0) > 0) ? (
              <div className="space-y-0">
                {(post.webinarSections ?? []).map((section, i) => {
                  const sectionPeopleGroups = getWebinarPersonGroups({ webinarPeople: section.people ?? [] } as Parameters<typeof getWebinarPersonGroups>[0])
                  return (
                    <div key={section.id ?? i}>
                      {i > 0 && <hr className="my-8 border-t border-[#d1d5db]" />}
                      {section.content ? (
                        <div className="ui-font prose max-w-none text-[16px] leading-[145%] text-[#2d2d2d]">
                          <RichTextRenderer content={section.content} registerHref={canRegister ? `/webinars/${post.slug}/access` : undefined} />
                        </div>
                      ) : null}
                      {sectionPeopleGroups.length ? (
                        <div className="mt-8 flex flex-col items-center gap-10 md:flex-row md:items-start md:justify-center md:gap-12">
                          {sectionPeopleGroups.flatMap((group) =>
                            group.people.map((person, idx) => (
                              <div key={`s${i}-${group.role}-${person.id}-${idx}`} className="ui-font w-[180px] text-center">
                                <h3 className={`mb-6 text-[15px] font-bold uppercase tracking-[0.06em] ${group.role === 'moderator' ? 'text-[var(--accent-red)]' : 'text-[#7f1d1d]'} ${idx === 0 ? '' : 'hidden md:invisible md:block'}`}>
                                  {idx === 0 ? group.label : ' '}
                                </h3>
                                <div className="relative mx-auto h-[112px] w-[112px] overflow-hidden rounded-full bg-[#ddd] shadow-[0_8px_20px_rgba(0,0,0,0.1)] md:h-[128px] md:w-[128px]">
                                  {person.photo ? <SafeImage src={getImageUrl(person.photo)} alt={person.name || group.label} fill sizes="128px" className="object-cover" /> : null}
                                </div>
                                <div className="mt-3 text-[15px] font-semibold text-[#111]">{person.name}</div>
                                {person.role ? <div className="mt-1 text-[13px] leading-[1.45] text-[#6a6a6a]">{person.role}</div> : null}
                                {person.secondaryLine ? <div className="text-[13px] leading-[1.45] text-[#6a6a6a]">{person.secondaryLine}</div> : null}
                              </div>
                            ))
                          )}
                        </div>
                      ) : null}
                    </div>
                  )
                })}
              </div>
            ) : (
              /* Legacy: single content block + top-level people (existing posts) */
              <>
                {post.content ? (
                  <div className="ui-font prose max-w-none text-[16px] leading-[145%] text-[#2d2d2d]">
                    <RichTextRenderer content={post.content} registerHref={canRegister ? `/webinars/${post.slug}/access` : undefined} />
                  </div>
                ) : null}
                {peopleGroups.length ? (
                  <section className="mt-2">
                    <div className="flex flex-col items-center gap-10 md:flex-row md:items-start md:justify-center md:gap-12">
                      {peopleGroups.flatMap((group) =>
                        group.people.map((person, index) => (
                          <div key={`${group.role}-${person.id}-${index}`} className="ui-font w-[180px] text-center">
                            <h3 className={`mb-6 text-[15px] font-bold uppercase tracking-[0.06em] ${group.role === 'moderator' ? 'text-[var(--accent-red)]' : 'text-[#7f1d1d]'} ${index === 0 ? '' : 'hidden md:invisible md:block'}`}>
                              {index === 0 ? group.label : ' '}
                            </h3>
                            <div className="relative mx-auto h-[112px] w-[112px] overflow-hidden rounded-full bg-[#ddd] shadow-[0_8px_20px_rgba(0,0,0,0.1)] md:h-[128px] md:w-[128px]">
                              {person.photo ? <SafeImage src={getImageUrl(person.photo)} alt={person.name || group.label} fill sizes="128px" className="object-cover" /> : null}
                            </div>
                            <div className="mt-3 text-[15px] font-semibold text-[#111]">{person.name}</div>
                            {person.role ? <div className="mt-1 text-[13px] leading-[1.45] text-[#6a6a6a]">{person.role}</div> : null}
                            {person.secondaryLine ? <div className="text-[13px] leading-[1.45] text-[#6a6a6a]">{person.secondaryLine}</div> : null}
                          </div>
                        ))
                      )}
                    </div>
                  </section>
                ) : null}
              </>
            )}
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
    </>
  )
}
