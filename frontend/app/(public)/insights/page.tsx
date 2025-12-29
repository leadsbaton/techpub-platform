import { notFound } from "next/navigation";
import {
  getInsights,
  getTrendingInsights,
  getTopPicksByCategory,
  getCategories,
} from "@/lib/api/insights";
import { InsightGrid } from "../_components/InsightGrid";
import { TrendingSection } from "../_components/TrendingSection";
import { TopPicksSection } from "../_components/TopPicksSection";

export const revalidate = 60; // Revalidate every 60 seconds

export default async function InsightsPage() {
  try {
    // Fetch trending insights for "JUST IN: INSIGHTS" section
    const trendingInsights = await getTrendingInsights(5);

    console.log("trendingInsights", trendingInsights);

    // Fetch categories
    const categories = await getCategories();

    // Fetch top picks for each category (Technology, Finance, Marketing)
    const topPicksPromises = categories.map(async (category) => {
      const categorySlug =
        typeof category === "string" ? category : category.slug;
      const insights = await getTopPicksByCategory(categorySlug, 5);
      return {
        category,
        insights,
      };
    });

    const topPicksByCategory = await Promise.all(topPicksPromises);

    // Fetch all insights for the listing section
    const data = await getInsights({ limit: 12 });

    return (
      <div>
        {/* Trending Section */}
        {trendingInsights.length > 0 && (
          <TrendingSection insights={trendingInsights} />
        )}

        {/* Top Picks Section */}
        {topPicksByCategory.length > 0 && (
          <TopPicksSection insightsByCategory={topPicksByCategory} />
        )}

        {/* All Insights Section */}
        {data.docs && data.docs.length > 0 && (
          <section className="container mx-auto px-4 py-16">
            <h2 className="text-4xl font-bold mb-8">All Insights</h2>
            <InsightGrid insights={data.docs} columns={3} />
          </section>
        )}
      </div>
    );
  } catch (error) {
    console.error("Error fetching insights:", error);
    notFound();
  }
}
