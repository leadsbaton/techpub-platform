type PostLike = {
  slug?: string | null
  type?: 'insight' | 'whitepaper' | 'webinar' | 'case-study' | string | null
}

export function resolvePostPath(post: PostLike): string | null {
  if (!post.slug || !post.type) {
    return null
  }

  const typeSegment = post.type === 'case-study' ? 'case-studies' : `${post.type}s`
  return `/${typeSegment}/${post.slug}`
}
