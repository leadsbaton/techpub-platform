import { ContentDetailView } from '@/app/(public)/_components/ContentDetailView'
import { getContentTypes, getPreviewPostBySlug } from '@/lib/api/cms'
import type { Post } from '@/lib/types/cms'

export const dynamic = 'force-dynamic'

const typeMap: Record<string, Post['type']> = {
  insight: 'insight',
  whitepaper: 'whitepaper',
  webinar: 'webinar',
}

// Placeholder rich-text shown until the editor adds real content. Exercises the
// heading / paragraph / bold / list renderers so the preview matches the site.
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
          { type: 'listitem', children: [{ type: 'text', text: 'Third key takeaway' }] },
        ],
      },
    ],
  },
}

// Build a synthetic Post from the live form fields so the preview renders the real
// frontend layout (with defaults) before the post has ever been saved.
function buildDraftPost(
  type: Post['type'],
  fields: { title?: string; excerpt?: string; slug?: string; status?: string },
): Post {
  return {
    id: 'preview',
    type,
    title: fields.title || 'Your headline will appear here',
    slug: fields.slug || 'preview',
    status: (fields.status as Post['status']) || 'draft',
    excerpt: fields.excerpt || '',
    // null featuredImage -> getImageUrl() renders the branded placeholder image.
    featuredImage: null,
    content: PLACEHOLDER_CONTENT,
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

  // Default to an insight-style preview until a type is chosen.
  const resolvedType: Post['type'] = (type && typeMap[type]) || 'insight'
  const contentTypes = await getContentTypes(12)

  // Use the saved post once it exists (real images/relationships); otherwise show
  // a live draft built from the fields being typed.
  const saved = slug ? await getPreviewPostBySlug(slug, resolvedType, token) : null
  const post = saved ?? buildDraftPost(resolvedType, { title, excerpt, slug, status })

  return <ContentDetailView post={post} contentTypes={contentTypes} railItems={[]} />
}
