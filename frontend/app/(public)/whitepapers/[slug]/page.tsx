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
        <section className='grid gap-10 xl:grid-cols-[minmax(0,1fr)_320px]'>
          <div className='flex flex-col gap-8 sm:flex-row sm:items-start sm:gap-9'>
            {/* Downloadable content — cover + its download button, kept together
                on the left so it's clear what the button delivers. */}
            <div className='mx-auto w-full max-w-[200px] shrink-0 sm:mx-0 sm:w-[190px]'>
              <div className='relative aspect-[3/4] w-full overflow-hidden border border-[var(--border-subtle)] bg-white'>
                <Image
                  src={getImageUrl(post.featuredImage)}
                  alt={post.title}
                  fill
                  sizes='200px'
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

            {/* Main content — middle */}
            <div className='ui-font min-w-0 flex-1 space-y-4'>
              <h1 className='text-[26px] font-medium leading-[1.2] text-[#111] sm:text-[32px]'>
                {post.title}
              </h1>
              {post.excerpt ? (
                <p className='text-[16px] leading-[1.7] text-[#2d2d2d]'>
                  {post.excerpt}
                </p>
              ) : null}
              {post.content ? (
                <div className='prose max-w-none pt-2'>
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
