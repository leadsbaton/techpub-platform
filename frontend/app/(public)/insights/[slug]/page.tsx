import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getInsightBySlug, getInsights } from "@/lib/api/insights";
import { formatDate, getImageUrl } from "@/lib/utils/formatting";
import { InsightCard } from "../../_components/InsightCard";

export const revalidate = 60;

export async function generateStaticParams() {
  const data = await getInsights({ limit: 100 });
  return data.docs.map((insight) => ({
    slug: insight.slug,
  }));
}

export default async function InsightDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  try {
    const { slug } = await params;
    const insight = await getInsightBySlug(slug);

    if (!insight) {
      notFound();
    }

    // Get related insights (same category, excluding current)
    const categorySlug =
      typeof insight.category === "string"
        ? insight.category
        : insight.category?.slug || "";

    const relatedData = await getInsights({
      category: categorySlug,
      limit: 3,
    });
    const relatedInsights = relatedData.docs.filter((i) => i.id !== insight.id);

    const imageUrl = getImageUrl(insight.featuredImage);
    const category =
      typeof insight.category === "string"
        ? insight.category
        : insight.category?.name || "Uncategorized";

    return (
      <article className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="breadcrumbs text-sm mb-6">
          <ul>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/insights">Insights</Link>
            </li>
            <li>{insight.title}</li>
          </ul>
        </div>

        {/* Featured Image */}
        <div className="relative h-96 mb-8 rounded-lg overflow-hidden">
          <Image
            src={imageUrl}
            alt={insight.title}
            fill
            className="object-cover"
            unoptimized={imageUrl.includes("localhost")}
          />
          <div className="absolute bottom-4 left-4">
            <div className="badge badge-primary badge-lg">
              {category.toUpperCase()}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">{insight.title}</h1>

          <div className="flex items-center gap-4 mb-8 text-base-content/70">
            <span>{formatDate(insight.publishedAt)}</span>
            <span>•</span>
            <span>{category}</span>
          </div>

          <div className="prose prose-lg max-w-none mb-12">
            <p className="text-xl text-base-content/80 mb-8">
              {insight.excerpt}
            </p>

            {/* Rich text content - you'll need to render this properly based on your rich text format */}
            {insight.content && (
              <div className="rich-text-content">
                {/* This will need a rich text renderer based on your Payload editor */}
                <p>{JSON.stringify(insight.content)}</p>
              </div>
            )}
          </div>

          {/* Related Insights */}
          {relatedInsights.length > 0 && (
            <section className="mt-16">
              <h2 className="text-3xl font-bold mb-8">Related Insights</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedInsights.map((related) => (
                  <InsightCard key={related.id} insight={related} />
                ))}
              </div>
            </section>
          )}
        </div>
      </article>
    );
  } catch (error) {
    console.error("Error fetching insight:", error);
    notFound();
  }
}
