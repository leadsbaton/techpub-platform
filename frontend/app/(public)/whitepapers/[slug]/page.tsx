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
          {/* Header: cover image + (title / description / download), vertically
              centered beside the image so a short intro doesn't leave an empty
              column. The full article body renders at full width below. */}
          <div className='ui-font min-w-0 space-y-7'>
            <div className='grid grid-cols-1 gap-x-9 gap-y-5 sm:grid-cols-[220px_minmax(0,1fr)] sm:items-center'>
              <div className='mx-auto w-full max-w-[240px] sm:mx-0 sm:max-w-none'>
                <div className='relative aspect-[3/4] w-full overflow-hidden border border-[var(--border-subtle)] bg-white'>
                  <Image
                    src={getImageUrl(post.featuredImage)}
                    alt={post.title}
                    fill
                    sizes='(max-width: 640px) 240px, 220px'
                    className='object-cover'
                  />
                </div>
              </div>

              <div className='min-w-0 space-y-4'>
                <h1 className='text-[26px] font-medium leading-[1.2] text-[#111] sm:text-[32px]'>
                  {post.title}
                </h1>
                <Link
                  href={`/whitepapers/${post.slug}/access`}
                  className='flex w-full items-center justify-center bg-[var(--accent-red)] px-8 py-3 text-center text-[15px] font-semibold uppercase tracking-[0.02em] text-white transition hover:bg-[var(--accent-red-dark)] sm:inline-flex sm:w-auto'
                >
                  {actionLabel}
                </Link>
              </div>
            </div>

            {post.content ? (
              <div className='prose max-w-none break-words'>
                <RichTextRenderer content={post.content} />
              </div>
            ) : null}
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
