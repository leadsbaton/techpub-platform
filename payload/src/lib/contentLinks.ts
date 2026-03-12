type PostLike = {
  slug?: string | null
  type?: 'insight' | 'whitepaper' | 'webinar' | string | null
}

export function resolvePostPath(post: PostLike): string | null {
  if (!post.slug || !post.type) {
    return null
  }

  const typeSegment = `${post.type}s`
  return `/${typeSegment}/${post.slug}`
}
