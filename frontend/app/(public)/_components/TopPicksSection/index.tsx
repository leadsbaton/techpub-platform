import Link from "next/link";
import Image from "next/image";
import type { Insight, Category } from "@/lib/types/insights";
import { formatDateShort, getImageUrl } from "@/lib/utils/formatting";

interface TopPicksSectionProps {
  insightsByCategory: {
    category: Category | string;
    insights: Insight[];
  }[];
}

export function TopPicksSection({ insightsByCategory }: TopPicksSectionProps) {
  if (!insightsByCategory || insightsByCategory.length === 0) {
    return null;
  }

  // Helper for category specific colors
  const getCategoryTheme = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes("tech"))
      return { bg: "bg-[#001bb3]", border: "border-[#001bb3]" };
    if (n.includes("finance"))
      return { bg: "bg-[#ff0000]", border: "border-[#ff0000]" };
    if (n.includes("market"))
      return { bg: "bg-[#00a624]", border: "border-[#00a624]" };
    return { bg: "bg-gray-800", border: "border-gray-800" };
  };

  return (
    <section className="py-16 bg-white text-black">
      <div className="container mx-auto px-4">
        {/* Main Header with Double Lines */}
        <div className="flex items-center gap-4 mb-10">
          <h2 className="text-4xl font-bold whitespace-nowrap">Top Picks</h2>
          <div className="flex-1 flex flex-col gap-1 opacity-20">
            <div className="h-px w-full bg-black"></div>
            <div className="h-px w-full bg-black"></div>
          </div>
          <Link
            href="/insights"
            className="text-sm font-medium underline underline-offset-4 hover:text-gray-600"
          >
            View all
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {insightsByCategory.map(({ category, insights }) => {
            const categoryName =
              typeof category === "string" ? category : category?.name || "";
            const categorySlug =
              typeof category === "string" ? category : category?.slug || "";
            const theme = getCategoryTheme(categoryName);

            const featuredPost = insights[0];
            const listPosts = insights.slice(1, 4); // Next 3 posts

            return (
              <div key={categorySlug} className="flex flex-col">
                {/* Category Header with line */}
                <div className="flex items-end mb-6">
                  <div
                    className={`${theme.bg} text-white px-4 py-1.5 text-sm font-bold uppercase tracking-wider`}
                  >
                    {categoryName}
                  </div>
                  <div
                    className={`flex-1 h-px ${theme.bg} opacity-50 mb-px`}
                  ></div>
                </div>

                {/* Featured Post (Large with Overlay) */}
                {featuredPost && (
                  <Link
                    href={`/insights/${featuredPost.slug}`}
                    className="group relative aspect-4/3 overflow-hidden mb-6"
                  >
                    <Image
                      src={getImageUrl(featuredPost.featuredImage)}
                      alt={featuredPost.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Dark Gradient Overlay */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent"></div>
                    <div className="absolute bottom-0 p-4 text-white">
                      <p className="text-xs opacity-80 mb-1">
                        {formatDateShort(featuredPost.publishedAt)}
                      </p>
                      <h3 className="text-sm font-bold leading-snug line-clamp-2">
                        {featuredPost.title}
                      </h3>
                    </div>
                  </Link>
                )}

                {/* Smaller List Posts */}
                <div className="flex flex-col gap-6">
                  {listPosts.map((post) => (
                    <Link
                      key={post.id}
                      href={`/insights/${post.slug}`}
                      className="flex gap-4 group"
                    >
                      <div className="relative w-24 h-20 shrink-0 overflow-hidden">
                        <Image
                          src={getImageUrl(post.featuredImage)}
                          alt={post.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-col justify-center">
                        <p className="text-[11px] text-gray-400 mb-1">
                          {formatDateShort(post.publishedAt)}
                        </p>
                        <h4 className="text-sm font-bold leading-tight line-clamp-2 group-hover:text-gray-600">
                          {post.title}
                        </h4>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* View More at Bottom Right */}
                <div className="mt-8 text-right">
                  <Link
                    href={`/insights?category=${categorySlug}`}
                    className="text-xs font-semibold text-gray-500 underline underline-offset-4 hover:text-black"
                  >
                    View More
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
