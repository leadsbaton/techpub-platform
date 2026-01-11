import Image from "next/image";
import Link from "next/link";
import type { Insight } from "@/lib/types/insights";
import { formatDateShort, getImageUrl } from "@/lib/utils/formatting";

interface TrendingSectionProps {
  insights: Insight[];
}

export function TrendingSection({ insights }: TrendingSectionProps) {
  if (!insights || insights.length === 0) {
    return null;
  }

  const featuredInsight = insights[0];
  const otherInsights = insights.slice(1, 5);

  const featuredImageUrl = getImageUrl(featuredInsight.featuredImage);

  // Helper to match badge colors from your image
  const getBadgeColor = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes("tech")) return "bg-blue-700";
    if (cat.includes("market")) return "bg-green-600";
    if (cat.includes("finance")) return "bg-red-600";
    return "bg-primary";
  };

  return (
    <section className="bg-linear-to-b from-[#b30000] to-black py-16 text-white">
      <div className="container mx-auto px-4">
        {/* Header with horizontal lines */}
        <div className="flex items-center justify-center gap-6 mb-12">
          {/* Left Side Double Lines */}
          <div className="flex-1 flex flex-col gap-1.5">
            <div className="h-px w-full bg-white/40"></div>
            <div className="h-px w-full bg-white/40"></div>
          </div>

          <h2 className="text-2xl md:text-4xl font-bold tracking-widest whitespace-nowrap uppercase">
            Just In: Insights
          </h2>

          {/* Right Side Double Lines */}
          <div className="flex-1 flex flex-col gap-1.5">
            <div className="h-px w-full bg-white/40"></div>
            <div className="h-px w-full bg-white/40"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Large Featured Insight (Left) */}
          <Link
            href={`/insights/${featuredInsight.slug}`}
            className="group flex flex-col"
          >
            <div className="relative aspect-16/10 overflow-hidden rounded-lg mb-6">
              <Image
                src={featuredImageUrl}
                alt={featuredInsight.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                unoptimized={featuredImageUrl.includes("localhost")}
              />
              <div className="absolute bottom-4 left-4">
                <span
                  className={`p-2 text-xs font-bold uppercase ${getBadgeColor(
                    typeof featuredInsight.category === "string"
                      ? featuredInsight.category
                      : featuredInsight.category?.name || ""
                  )}`}
                >
                  {typeof featuredInsight.category === "string"
                    ? featuredInsight.category
                    : featuredInsight.category?.name || ""}
                </span>
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-2 group-hover:underline decoration-1">
              {featuredInsight.title}
            </h3>
            <p className="text-white/80 text-sm mb-2 line-clamp-2">
              {featuredInsight.excerpt}
            </p>
            <span className="text-sm font-medium opacity-80">
              {formatDateShort(featuredInsight.publishedAt)}
            </span>
          </Link>

          {/* 2x2 Grid for Other Insights (Right) */}
          <div className="grid grid-cols-1 grid-rows-2 sm:grid-cols-2 gap-x-6 gap-y-10">
            {otherInsights.map((insight) => {
              const imageUrl = getImageUrl(insight.featuredImage);
              const categoryName =
                typeof insight.category === "string"
                  ? insight.category
                  : insight.category?.name || "";

              return (
                <Link
                  key={insight.id}
                  href={`/insights/${insight.slug}`}
                  className="group flex flex-col h-full"
                >
                  <div className="relative aspect-video overflow-hidden rounded-lg mb-4">
                    <Image
                      src={imageUrl}
                      alt={insight.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      unoptimized={imageUrl.includes("localhost")}
                    />
                    <div className="absolute bottom-3 left-3">
                      <span
                        className={`p-2 text-[10px] font-bold uppercase ${getBadgeColor(
                          categoryName
                        )}`}
                      >
                        {categoryName}
                      </span>
                    </div>
                  </div>
                  <h4 className="text-base font-bold mb-1 line-clamp-2 group-hover:underline decoration-1">
                    {insight.title}
                  </h4>
                  <span className="text-xs font-medium opacity-80 mt-auto">
                    {formatDateShort(insight.publishedAt)}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
