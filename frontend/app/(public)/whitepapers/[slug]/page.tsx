import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { JsonLd } from "../../_components/JsonLd";
import { RankedSidebar } from "../../_components/RankedSidebar";
import { RichTextRenderer } from "../../_components/RichTextRenderer";
import { SafeImage } from "../../_components/SafeImage";
import { ReadingProgressBar } from "../../_components/ReadingProgressBar";
import { getContentTypes, getPostBySlug, getPosts } from "@/lib/api/cms";
import { buildPostMetadata } from "@/lib/utils/metadata";
import { buildArticleJsonLd } from "@/lib/utils/jsonLd";
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
    <>
      <JsonLd data={buildArticleJsonLd(post, `/whitepapers/${post.slug}`)} />
      <ReadingProgressBar />
      <div className='relative left-1/2 w-screen -translate-x-1/2 bg-white'>
      <article className='site-container py-8 sm:py-10'>
        <section className='grid grid-cols-1 gap-10 xl:grid-cols-[minmax(0,1fr)_320px]'>
          {/* Title at top; below it a two-column row — cover image + download button
              in a 1/4 column, body copy in the 3/4 column beside it. Deliberately a
              grid rather than a float: a float lets the last paragraph curl back
              underneath the image once the text outruns it, which is exactly what
              this layout must not do. Mobile stacks: title -> image -> button ->
              content -> CTA. */}
          <div className='ui-font min-w-0'>
            {post.hideTitleOnDetail ? null : (
              <h1 className='text-[26px] font-medium leading-[1.2] text-[#111] sm:text-[32px]'>
                {post.title}
              </h1>
            )}

            <div className={`grid grid-cols-1 gap-6 sm:grid-cols-4 sm:items-start sm:gap-8 ${post.hideTitleOnDetail ? 'mt-0 sm:mt-0' : 'mt-5 sm:mt-6'}`}>
              <div className='mx-auto w-full max-w-[240px] sm:mx-0 sm:max-w-none'>
                <div className='relative aspect-[3/4] w-full overflow-hidden border border-[var(--border-subtle)] bg-white'>
                  <SafeImage
                    src={getImageUrl(post.featuredImage)}
                    alt={post.title}
                    fill
                    sizes='(max-width: 640px) 240px, 25vw'
                    className='object-cover'
                  />
                </div>
                <Link
                  href={`/whitepapers/${post.slug}/access`}
                  className='mt-4 flex w-full items-center justify-center bg-[var(--accent-red)] px-4 py-3 text-center text-[15px] font-semibold uppercase tracking-[0.02em] text-white transition hover:bg-[var(--accent-red-dark)]'
                >
                  {actionLabel}
                </Link>
              </div>

              {post.content ? (
                <div className='prose max-w-none break-words sm:col-span-3'>
                  <RichTextRenderer content={post.content} />
                </div>
              ) : null}
            </div>

            <div className='mt-8 flex justify-center'>
              <Link
                href={`/whitepapers/${post.slug}/access`}
                className='inline-flex text-[18px] font-semibold uppercase tracking-[0.02em] text-[var(--accent-red)] transition hover:underline'
              >
                {actionLabel}
              </Link>
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
    </>
  );
}
