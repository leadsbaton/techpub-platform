import Link from 'next/link'

import { FeaturedPost } from './_components/FeaturedPost'
import { NewsletterPanel } from './_components/NewsletterPanel'
import { PostCard } from './_components/PostCard'
import { getCategories, getPosts, getSiteSettings } from '@/lib/api/cms'

export const revalidate = 60

export default async function HomePage() {
  const [settings, featuredPosts, insights, whitepapers, webinars, categories] =
    await Promise.all([
      getSiteSettings(),
      getPosts({ featured: true, limit: 1 }),
      getPosts({ type: 'insight', limit: 6 }),
      getPosts({ type: 'whitepaper', limit: 3 }),
      getPosts({ type: 'webinar', limit: 3 }),
      getCategories(6),
    ])

  const heroPost = featuredPosts.docs[0] || insights.docs[0]

  return (
    <div className="space-y-16 pb-20">
      <section className="mx-auto max-w-7xl px-4 pt-10 md:px-6">
        <div className="mb-6 max-w-3xl space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
            {settings?.siteTagline || 'Editorial engine'}
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-950 md:text-6xl">
            {settings?.siteDescription || 'A modern publication stack for blogs, resources, webinars, and dynamic landing pages.'}
          </h1>
        </div>
        {heroPost ? <FeaturedPost post={heroPost} /> : null}
      </section>

      <section className="mx-auto max-w-7xl space-y-8 px-4 md:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Latest insights</p>
            <h2 className="text-3xl font-semibold tracking-tight text-slate-950">Fresh stories from the newsroom</h2>
          </div>
          <Link href="/insights" className="text-sm font-semibold text-slate-950">
            View all
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {insights.docs.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 md:grid-cols-2 md:px-6">
        <div className="space-y-6 rounded-[32px] bg-[#F4EFE6] p-6">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Whitepapers</p>
            <h2 className="text-3xl font-semibold tracking-tight text-slate-950">Lead generation assets and downloadable resources</h2>
          </div>
          <div className="space-y-4">
            {whitepapers.docs.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>

        <div className="space-y-6 rounded-[32px] bg-[#E7EEF8] p-6">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Webinars</p>
            <h2 className="text-3xl font-semibold tracking-tight text-slate-950">Events, recordings, and registration-led content</h2>
          </div>
          <div className="space-y-4">
            {webinars.docs.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl space-y-6 px-4 md:px-6">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Categories</p>
          <h2 className="text-3xl font-semibold tracking-tight text-slate-950">Organize editorial topics for scalable navigation</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {categories.map((category) => (
            <Link key={category.id} href={`/categories/${category.slug}`} className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_20px_40px_rgba(15,23,42,0.06)]">
              <div className="mb-4 h-3 w-20 rounded-full" style={{ backgroundColor: category.color || '#0f172a' }} />
              <h3 className="text-2xl font-semibold tracking-tight text-slate-950">{category.name}</h3>
              {category.description ? <p className="mt-3 text-sm leading-6 text-slate-600">{category.description}</p> : null}
            </Link>
          ))}
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <NewsletterPanel settings={settings} />
      </div>
    </div>
  )
}
