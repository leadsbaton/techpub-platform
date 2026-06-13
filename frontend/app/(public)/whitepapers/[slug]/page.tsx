import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { RankedSidebar } from "../../_components/RankedSidebar";
import { RichTextRenderer } from "../../_components/RichTextRenderer";
import { getContentTypes, getPostBySlug, getPosts } from "@/lib/api/cms";
import { buildPostMetadata } from "@/lib/utils/metadata";
import { getImageUrl } from "@/lib/utils/formatting";

type Params = Promise<{ slug: string }>;

async function getWhitepaper(slug: string) {
  return getPostBySlug(slug, "whitepaper");
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getWhitepaper(slug);

  if (!post) {
    return { title: "White Paper" };
  }

  return buildPostMetadata(post, `/whitepapers/${post.slug}`);
}

export default async function WhitepaperDetailPage({
  params,
}: {
  params: Params;
}) {
  const { slug } = await params;
  const [post, webinars, contentTypes] = await Promise.all([
    getWhitepaper(slug),
    getPosts({ type: "webinar", limit: 6 }),
    getContentTypes(12),
  ]);

  if (!post) {
    notFound();
  }

  const actionLabel =
    post.leadCapture?.deliveryMode === "download"
      ? "Download PDF"
      : post.leadCapture?.deliveryMode === "read"
        ? "Read Now"
        : "Open Resource";

  return (
    <div className='relative left-1/2 w-screen -translate-x-1/2 bg-white'>
      <article className='site-container py-8 sm:py-10'>
        <section className='grid grid-cols-1 gap-10 xl:grid-cols-[minmax(0,1fr)_320px]'>
          {/* Mobile order (via `order-*`): title -> cover image -> body text ->
              download button. Desktop restores the cover+button left column and
              title+text right column through explicit grid placement. */}
          <div className='ui-font grid min-w-0 grid-cols-1 gap-x-9 gap-y-5 sm:grid-cols-[190px_minmax(0,1fr)]'>
            <h1 className='order-1 text-[26px] font-medium leading-[1.2] text-[#111] sm:order-none sm:col-start-2 sm:row-start-1 sm:text-[32px]'>
              {post.title}
            </h1>

            <div className='order-2 mx-auto w-full max-w-[240px] sm:order-none sm:col-start-1 sm:row-start-1 sm:mx-0 sm:max-w-none'>
              <div className='relative aspect-[3/4] w-full overflow-hidden border border-[var(--border-subtle)] bg-white'>
                <Image
                  src={getImageUrl(post.featuredImage)}
                  alt={post.title}
                  fill
                  sizes='(max-width: 640px) 240px, 190px'
                  className='object-cover'
                />
              </div>
              <Link
                href={`/whitepapers/${post.slug}/access`}
                className='ui-font mt-4 flex w-full items-center justify-center bg-[var(--accent-red)] px-6 py-2.5 text-center text-[15px] font-semibold uppercase tracking-[0.02em] text-white transition hover:bg-[var(--accent-red-dark)]'
              >
                {actionLabel}
              </Link>
            </div>

            <div className='order-3 min-w-0 space-y-4 sm:order-none sm:col-start-2 sm:row-start-2'>
              {post.excerpt ? (
                <p className='text-[16px] leading-[1.7] text-[#2d2d2d]'>
                  {post.excerpt}
                </p>
              ) : null}
              {post.content ? (
                <div className='prose max-w-none break-words pt-2'>
                  <RichTextRenderer content={post.content} />
                </div>
              ) : null}

              <div className='flex justify-center pt-2'>
                <Link
                  href={`/whitepapers/${post.slug}/access`}
                  className='ui-font inline-flex text-[18px] font-semibold uppercase tracking-[0.02em] text-[var(--accent-red)] transition hover:underline'
                >
                  {actionLabel}
                </Link>
              </div>
            </div>

          
          </div>

          <div className='space-y-6 xl:sticky xl:top-28 xl:self-start'>
            <RankedSidebar
              title='Webinars'
              accent='Upcoming'
              items={webinars.docs}
              contentTypes={contentTypes}
            />
          </div>
        </section>
      </article>
    </div>
  );
}
