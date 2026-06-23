'use client'

import { useLivePreview } from '@payloadcms/live-preview-react'

import { RichTextRenderer } from '@/app/(public)/_components/RichTextRenderer'
import { SafeImage } from '@/app/(public)/_components/SafeImage'
import { API_URL } from '@/lib/api/config'
import type { Post } from '@/lib/types/cms'
import {
  getImageUrl,
  getMediaDimensions,
  getWebinarPersonGroups,
} from '@/lib/utils/formatting'

// Placeholder rich text shown until the editor adds content. Exercises the
// heading / bold / list renderers so formatting is visible in the preview.
const PLACEHOLDER_CONTENT = {
  root: {
    children: [
      { type: 'heading', tag: 'h2', children: [{ type: 'text', text: 'Section heading' }] },
      {
        type: 'paragraph',
        children: [
          { type: 'text', text: 'Your content appears here as you write it. ' },
          { type: 'text', text: 'Bold', format: 1 },
          { type: 'text', text: ', headings, lists and images all render exactly like the live site.' },
        ],
      },
      {
        type: 'list',
        tag: 'ul',
        children: [
          { type: 'listitem', children: [{ type: 'text', text: 'First key takeaway' }] },
          { type: 'listitem', children: [{ type: 'text', text: 'Second key takeaway' }] },
        ],
      },
    ],
  },
}

function hasContent(content: unknown): boolean {
  const children = (content as { root?: { children?: unknown[] } } | null | undefined)?.root?.children
  return Array.isArray(children) && children.length > 0
}

function withDefaults(data: Partial<Post> | undefined, fallbackType: Post['type']): Post {
  const type = ((data?.type as Post['type']) || fallbackType) as Post['type']
  return {
    ...(data as Post),
    id: data?.id || 'preview',
    type,
    title: data?.title || 'Your headline will appear here',
    slug: data?.slug || 'preview',
    content: hasContent(data?.content) ? data?.content : (PLACEHOLDER_CONTENT as Post['content']),
  } as Post
}

function InsightLayout({ post }: { post: Post }) {
  return (
    <article className="site-container py-10">
      <div className="min-w-0">
        <div className="relative aspect-[3.7/1] overflow-hidden rounded-[8px]">
          <SafeImage src={getImageUrl(post.featuredImage)} alt={post.title} fill sizes="(max-width: 1024px) 100vw, 900px" className="object-cover" />
        </div>
        {post.hideTitleOnDetail ? null : (
          <div className="mx-auto max-w-4xl px-4 pt-7 text-center">
            <h1 className="headline-font text-[1.4rem] font-extrabold leading-[1.3] text-[color:var(--text-strong)] md:text-[1.6rem]">
              {post.title}
            </h1>
          </div>
        )}
        <div className={`mx-auto ${post.hideTitleOnDetail ? 'mt-7' : 'mt-6'} max-w-4xl space-y-5 text-[0.98rem] leading-[1.75] text-[color:var(--text-soft)]`}>
          <div className="prose max-w-none">
            <RichTextRenderer content={post.content} />
          </div>
        </div>
      </div>
    </article>
  )
}

function WhitepaperLayout({ post }: { post: Post }) {
  const actionLabel =
    post.leadCapture?.deliveryMode === 'download'
      ? 'Download PDF'
      : post.leadCapture?.deliveryMode === 'read'
        ? 'Read Now'
        : 'Open Resource'

  return (
    <div className="bg-white">
      <article className="site-container py-8 sm:py-10">
        <div className="ui-font min-w-0">
          {post.hideTitleOnDetail ? null : (
            <h1 className="text-[26px] font-medium leading-[1.2] text-[#111] sm:text-[32px]">{post.title}</h1>
          )}

          <div className={`mx-auto w-full max-w-[240px] sm:float-left sm:mx-0 sm:mr-8 sm:mb-5 sm:w-[230px] ${post.hideTitleOnDetail ? 'mt-0 sm:mt-0' : 'mt-5 sm:mt-6'}`}>
            <div className="relative aspect-[3/4] w-full overflow-hidden border border-[var(--border-subtle)] bg-white">
              <SafeImage src={getImageUrl(post.featuredImage)} alt={post.title} fill sizes="(max-width: 640px) 240px, 230px" className="object-cover" />
            </div>
            <div className="mt-4 flex w-full items-center justify-center bg-[var(--accent-red)] px-6 py-3 text-center text-[15px] font-semibold uppercase tracking-[0.02em] text-white">
              {actionLabel}
            </div>
          </div>

          {post.content ? (
            <div className="prose mt-5 max-w-none break-words sm:mt-6">
              <RichTextRenderer content={post.content} />
            </div>
          ) : null}

          <div className="clear-both" />
          <div className="mt-8 flex justify-center">
            <span className="inline-flex text-[18px] font-semibold uppercase tracking-[0.02em] text-[var(--accent-red)]">{actionLabel}</span>
          </div>
        </div>
      </article>
    </div>
  )
}

function WebinarLayout({ post }: { post: Post }) {
  const peopleGroups = getWebinarPersonGroups(post)
  const heroDims = getMediaDimensions(post.featuredImage)

  return (
    <div className="bg-white">
      <article className="site-container py-8 sm:py-10">
        <div className="min-w-0 space-y-8">
          {post.hideTitleOnDetail ? null : (
            <h1 className="ui-font text-[24px] font-medium leading-[1.2] text-[#111] sm:text-[34px]">{post.title}</h1>
          )}

          <div className="overflow-hidden rounded-[12px] bg-[#f4f4f2]">
            {heroDims ? (
              <SafeImage src={getImageUrl(post.featuredImage)} alt={post.title} width={heroDims.width} height={heroDims.height} sizes="(max-width: 1280px) 100vw, 900px" className="h-auto w-full" />
            ) : (
              <div className="relative aspect-[16/7] w-full" style={{ minHeight: '180px' }}>
                <SafeImage src={getImageUrl(post.featuredImage)} alt={post.title} fill sizes="(max-width: 1280px) 100vw, 900px" className="object-cover" />
              </div>
            )}
          </div>

          <div className="flex justify-center">
            <span className="ui-font rounded-[10px] bg-[#FC0203] px-8 py-3 text-[20px] font-medium text-white">
              {post.webinarRegistration?.ctaLabel || 'Register now'}
            </span>
          </div>

          {post.content ? (
            <div className="ui-font prose max-w-none text-[16px] leading-[145%] text-[#2d2d2d]">
              <RichTextRenderer content={post.content} registerHref={`/webinars/${post.slug}/access`} />
            </div>
          ) : null}

          {peopleGroups.length ? (
            <section className="mt-2">
              <div className="grid gap-10 md:grid-cols-3 md:items-start">
                {peopleGroups.map((group) => (
                  <div key={group.role} className="ui-font text-center">
                    <h3 className={`mb-6 text-[15px] font-bold uppercase tracking-[0.06em] ${group.role === 'moderator' ? 'text-[var(--accent-red)]' : 'text-[#7f1d1d]'}`}>
                      {group.label}
                    </h3>
                    <div className="flex flex-col items-center gap-8">
                      {group.people.map((person) => (
                        <div key={person.id} className="w-[180px] text-center">
                          <div className="relative mx-auto h-[112px] w-[112px] overflow-hidden rounded-full bg-[#ddd] shadow-[0_8px_20px_rgba(0,0,0,0.1)] md:h-[128px] md:w-[128px]">
                            {person.photo ? <SafeImage src={getImageUrl(person.photo)} alt={person.name || group.label} fill sizes="128px" className="object-cover" /> : null}
                          </div>
                          <div className="mt-3 text-[15px] font-semibold text-[#111]">{person.name}</div>
                          {person.role ? <div className="mt-1 text-[13px] leading-[1.45] text-[#6a6a6a]">{person.role}</div> : null}
                          {person.secondaryLine ? <div className="text-[13px] leading-[1.45] text-[#6a6a6a]">{person.secondaryLine}</div> : null}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </article>
    </div>
  )
}

export function PostPreviewClient({
  initialPost,
  fallbackType,
}: {
  initialPost: Post
  fallbackType: Post['type']
}) {
  // Real-time field data streamed from the Payload admin via postMessage.
  const { data } = useLivePreview<Partial<Post>>({
    initialData: initialPost,
    serverURL: API_URL,
    depth: 2,
  })

  const post = withDefaults(data, fallbackType)

  if (post.type === 'webinar') return <WebinarLayout post={post} />
  if (post.type === 'whitepaper') return <WhitepaperLayout post={post} />
  return <InsightLayout post={post} />
}
