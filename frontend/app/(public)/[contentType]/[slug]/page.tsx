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

  const relatedFeed = await getPosts({ type: config.key, limit: 7 })

  return (
    <ContentDetailView
      post={post}
      contentTypes={contentTypes}
      railItems={relatedFeed.docs}
    />
  )
}
