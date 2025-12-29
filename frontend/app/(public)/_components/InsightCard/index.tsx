import Link from "next/link";
import Image from "next/image";
import type { Insight } from "@/lib/types/insights";
import { formatDateShort, getImageUrl } from "@/lib/utils/formatting";

interface InsightCardProps {
  insight: Insight;
  variant?: "default" | "large" | "small";
  showCategory?: boolean;
}

export function InsightCard({
  insight,
  variant = "default",
  showCategory = true,
}: InsightCardProps) {
  const imageUrl = getImageUrl(insight.featuredImage);
  const category =
    typeof insight.category === "string"
      ? insight.category
      : insight.category?.name || "Uncategorized";
  const categorySlug =
    typeof insight.category === "string"
      ? insight.category
      : insight.category?.slug || "";

  const isLarge = variant === "large";
  const isSmall = variant === "small";

  return (
    <Link
      href={`/insights/${insight.slug}`}
      className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow"
    >
      <figure className={isLarge ? "h-64" : isSmall ? "h-32" : "h-48"}>
        <Image
          src={imageUrl}
          alt={insight.title}
          width={800}
          height={600}
          className="w-full h-full object-cover"
          unoptimized={imageUrl.includes("localhost")}
        />
        {showCategory && category && (
          <div className="absolute bottom-4 left-4">
            <div className="badge badge-primary badge-lg">
              {category.toUpperCase()}
            </div>
          </div>
        )}
      </figure>
      <div className="card-body">
        <h2
          className={`card-title ${
            isSmall ? "text-sm" : isLarge ? "text-2xl" : "text-xl"
          }`}
        >
          {insight.title}
        </h2>
        {!isSmall && (
          <p className="text-base-content/70 line-clamp-2">{insight.excerpt}</p>
        )}
        <div className="card-actions justify-between items-center mt-4">
          <span className="text-sm text-base-content/60">
            {formatDateShort(insight.publishedAt)}
          </span>
          <button className="btn btn-primary btn-sm">Read More</button>
        </div>
      </div>
    </Link>
  );
}
