import type { Metadata } from 'next'

import type { Post } from '@/lib/types/cms'
import { SITE_URL } from '@/lib/site'
import { getMediaUrl } from '@/lib/utils/formatting'

export function buildPostMetadata(post: Post, pathname: string): Metadata {
  const title = post.seo?.metaTitle || post.title
  const description = post.seo?.metaDescription || post.excerpt
  const canonical = post.seo?.canonicalUrl || `${SITE_URL}${pathname}`
  const shareImage = getMediaUrl(post.seo?.metaImage || post.featuredImage) || undefined

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'article',
      images: shareImage ? [{ url: shareImage }] : undefined,
    },
    twitter: {
      card: shareImage ? 'summary_large_image' : 'summary',
      title,
      description,
      images: shareImage ? [shareImage] : undefined,
    },
    robots: {
      index: !post.seo?.noIndex,
      follow: !post.seo?.noIndex,
    },
  }
}
