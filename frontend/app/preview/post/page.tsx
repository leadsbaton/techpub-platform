import { getPreviewPostBySlug } from '@/lib/api/cms'
import type { Post } from '@/lib/types/cms'

import { PostPreviewClient } from './PostPreviewClient'

export const dynamic = 'force-dynamic'

const typeMap: Record<string, Post['type']> = {
  insight: 'insight',
  whitepaper: 'whitepaper',
  webinar: 'webinar',
}

// Minimal seed so the very first paint has the fields already typed; the client
// then takes over with real-time data from the admin (useLivePreview).
function buildDraftPost(
  type: Post['type'],
  fields: { title?: string; excerpt?: string; slug?: string; status?: string },
): Post {
  return {
    id: 'preview',
    type,
    title: fields.title || '',
    slug: fields.slug || 'preview',
    status: (fields.status as Post['status']) || 'draft',
    excerpt: fields.excerpt || '',
    featuredImage: null,
    content: null,
    publishedAt: '2026-01-01T00:00:00.000Z',
    readingTime: 5,
    authors: [],
    tags: [],
    primaryCategory: null,
  } as unknown as Post
}

export default async function PreviewPostPage({
  searchParams,
}: {
  searchParams: Promise<{
    slug?: string
    token?: string
    type?: string
    title?: string
    excerpt?: string
    status?: string
  }>
}) {
  const { slug, token, type, title, excerpt, status } = await searchParams

  const resolvedType: Post['type'] = (type && typeMap[type]) || 'insight'

  // On an existing post, seed with the saved doc (real images/relationships);
  // otherwise seed from the fields being typed.
  const saved = slug ? await getPreviewPostBySlug(slug, resolvedType, token) : null
  const initialPost = saved ?? buildDraftPost(resolvedType, { title, excerpt, slug, status })

  return <PostPreviewClient initialPost={initialPost} fallbackType={resolvedType} />
}
