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

  // First insight is the large featured one
  const featuredInsight = insights[0];
  const otherInsights = insights.slice(1, 5); // Next 4 insights

  const featuredImageUrl = getImageUrl(featuredInsight.featuredImage);
  const featuredCategory =
    typeof featuredInsight.category === "string"
      ? featuredInsight.category
      : featuredInsight.category?.name || "";

  return (
    <section className="bg-base-200 py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">
          <span className="border-b-4 border-primary pb-2">
            JUST IN: INSIGHTS
          </span>
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Large Featured Insight */}
          <div className="lg:col-span-2">
            <Link
              href={`/insights/${featuredInsight.slug}`}
              className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow h-full"
            >
              <figure className="h-96 relative">
                <Image
                  src={featuredImageUrl}
                  alt={featuredInsight.title}
                  fill
                  className="object-cover"
                  unoptimized={featuredImageUrl.includes("localhost")}
                />
                <div className="absolute bottom-4 left-4">
                  <div className="badge badge-primary badge-lg">
                    {featuredCategory.toUpperCase()}
                  </div>
                </div>
              </figure>
              <div className="card-body">
                <h3 className="card-title text-2xl">{featuredInsight.title}</h3>
                <p className="text-base-content/70 line-clamp-2">
                  {featuredInsight.excerpt}
                </p>
                <div className="card-actions justify-between items-center mt-4">
                  <span className="text-sm text-base-content/60">
                    {formatDateShort(featuredInsight.publishedAt)}
                  </span>
                  <button className="btn btn-primary">Read More</button>
                </div>
              </div>
            </Link>
          </div>

          {/* Smaller Insights Grid */}
          <div className="grid grid-cols-2 gap-4">
            {otherInsights.map((insight) => {
              const imageUrl = getImageUrl(insight.featuredImage);
              const category =
                typeof insight.category === "string"
                  ? insight.category
                  : insight.category?.name || "";

              return (
                <Link
                  key={insight.id}
                  href={`/insights/${insight.slug}`}
                  className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow"
                >
                  <figure className="h-32 relative">
                    <Image
                      src={imageUrl}
                      alt={insight.title}
                      fill
                      className="object-cover"
                      unoptimized={imageUrl.includes("localhost")}
                    />
                    <div className="absolute bottom-2 left-2">
                      <div className="badge badge-sm badge-primary">
                        {category.toUpperCase()}
                      </div>
                    </div>
                  </figure>
                  <div className="card-body p-4">
                    <h4 className="card-title text-sm line-clamp-2">
                      {insight.title}
                    </h4>
                    <span className="text-xs text-base-content/60">
                      {formatDateShort(insight.publishedAt)}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
