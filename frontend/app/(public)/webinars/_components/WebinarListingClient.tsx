'use client'

import { useEffect, useState, useTransition } from 'react'

import { WebinarCard } from './WebinarCard'
import type { PayloadListResponse, Post } from '@/lib/types/cms'

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === 'production'
    ? 'https://techpub-platform.onrender.com'
    : 'http://localhost:5000')

function buildFeedUrl(page: number, category?: string, query?: string) {
  const params = new URLSearchParams()
  params.set('depth', '3')
  params.set('sort', '-publishedAt')
  params.set('limit', '6')
  params.set('page', String(page))
  params.set('where[status][equals]', 'published')
  params.set('where[type][equals]', 'webinar')

  if (category) {
    params.set('where[primaryCategory.slug][equals]', category)
  }

  if (query) {
    params.set('where[or][0][title][like]', query)
    params.set('where[or][1][excerpt][like]', query)
  }

  return `${API_URL}/api/posts?${params.toString()}`
}

export function WebinarListingClient({
  initialPosts,
  initialPage,
  initialHasNextPage,
  selectedCategory,
  query,
}: {
  initialPosts: Post[]
  initialPage: number
  initialHasNextPage: boolean
  selectedCategory?: string
  query?: string
}) {
  const [posts, setPosts] = useState(initialPosts)
  const [page, setPage] = useState(initialPage)
  const [hasNextPage, setHasNextPage] = useState(initialHasNextPage)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    setPosts(initialPosts)
    setPage(initialPage)
    setHasNextPage(initialHasNextPage)
    setError(null)
  }, [initialHasNextPage, initialPage, initialPosts])

  function loadMore() {
    startTransition(() => {
      void (async () => {
        setError(null)
        try {
          const response = await fetch(buildFeedUrl(page + 1, selectedCategory, query), {
            cache: 'no-store',
          })
          if (!response.ok) {
            throw new Error('Unable to load more webinars right now.')
          }
          const data = (await response.json()) as PayloadListResponse<Post>
          setPosts((current) => [...current, ...data.docs])
          setPage(data.page)
          setHasNextPage(data.hasNextPage)
        } catch {
          setError('Unable to load more webinars right now.')
        }
      })()
    })
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-x-8 gap-y-10 md:grid-cols-2">
        {posts.map((post) => (
          <WebinarCard key={post.id} post={post} />
        ))}
      </div>
      <div className="flex flex-col items-center gap-3">
        {error ? <p className="text-sm text-[var(--accent-red)]">{error}</p> : null}
        {hasNextPage ? (
          <button
            type="button"
            onClick={loadMore}
            disabled={isPending}
            className="ui-font rounded-[8px] bg-[#FC0203] px-8 py-3 text-[20px] font-medium text-white disabled:opacity-70"
          >
            {isPending ? 'Loading...' : 'Load More'}
          </button>
        ) : null}
      </div>
    </div>
  )
}
