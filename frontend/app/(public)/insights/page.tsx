import { notFound } from "next/navigation";
import {
  getInsights,
  getTrendingInsights,
  getTopPicksByCategory,
  getCategories,
  getInsightsByCategory,
} from "@/lib/api/insights";
import { InsightGrid } from "../_components/InsightGrid";
import { TrendingSection } from "../_components/TrendingSection";
import { TopPicksSection } from "../_components/TopPicksSection";
import { InsightsListingLayout } from "./_components/InsightsListingLayout";

export const revalidate = 60; // Revalidate every 60 seconds

export default async function InsightsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;

  const categoryParam =
    typeof resolvedSearchParams.category === "string"
      ? resolvedSearchParams.category
      : undefined;

  console.log("category", categoryParam);

  try {
    if (categoryParam) {
      const categoryData = await getInsightsByCategory(categoryParam, {
        limit: 10,
      });

      console.log("categoryData", categoryData);

      return (
        <InsightsListingLayout
          insights={categoryData.docs}
          currentCategory={categoryParam}
        />
      );
    }

    const trendingInsightsData = await getInsights({
      isTrending: true,
      limit: 5,
    });

    const categories = await getCategories();

    const topPicksPromises = categories.map(async (category) => {
      const categorySlug =
        typeof category === "string" ? category : category.slug;
      const insights = await getTopPicksByCategory(categorySlug, 5);
      return { category, insights };
    });

    const topPicksByCategory = await Promise.all(topPicksPromises);

    return (
      <div>
        {trendingInsightsData.docs.length > 0 && (
          <TrendingSection insights={trendingInsightsData.docs} />
        )}

        {topPicksByCategory.length > 0 && (
          <TopPicksSection insightsByCategory={topPicksByCategory} />
        )}
      </div>
    );
  } catch (error) {
    console.error("Error fetching insights:", error);
    notFound();
  }
}
