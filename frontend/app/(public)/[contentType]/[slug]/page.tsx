import { notFound } from 'next/navigation'

import { ContentDetailView } from '../../_components/ContentDetailView'
import { getContentTypes, getPostBySlug, getPosts } from '@/lib/api/cms'
import { getContentTypeConfigByRoute } from '@/lib/utils/contentTypes'

export default async function Page({
  params,
}: {
  params: Promise<{ contentType: string; slug: string }>
}) {
  const { contentType, slug } = await params
  const contentTypes = await getContentTypes(12)
  const config = getContentTypeConfigByRoute(contentType, contentTypes)

  if (!config) {
    notFound()
  }

  const post = await getPostBySlug(slug, config.key)
  if (!post) {
    notFound()
  }

  const explicitRelated =
    post.relatedPosts
      ?.filter((item): item is Exclude<typeof item, string> => Boolean(item && typeof item !== 'string'))
      ?.filter((item) => item.id !== post.id) ?? []

  const primaryCategorySlug =
    post.primaryCategory && typeof post.primaryCategory !== 'string'
      ? post.primaryCategory.slug
      : undefined

  const relatedFeed = explicitRelated.length
    ? explicitRelated
    : (
        await getPosts({
          type: config.key,
          category: primaryCategorySlug,
          limit: 7,
        })
      ).docs

  const fallbackFeed =
    relatedFeed.length > 1
      ? relatedFeed
      : (await getPosts({ type: config.key, limit: 7 })).docs

  return (
    <ContentDetailView
      post={post}
      contentTypes={contentTypes}
      railItems={fallbackFeed}
    />
  )
}
