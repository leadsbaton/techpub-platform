import type { Insight, Category, PayloadResponse } from "@/lib/types/insights";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// Helper function to build query strings for Payload
function buildQuery(params: Record<string, any>): string {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (key === "where" && typeof value === "object") {
        // Payload expects where clauses as JSON strings
        query.append(key, JSON.stringify(value));
      } else {
        query.append(key, String(value));
      }
    }
  });
  return query.toString();
}

// Fetch all insights
export async function getInsights(options?: {
  limit?: number;
  page?: number;
  category?: string;
  isTrending?: boolean;
  isTopPick?: boolean;
}): Promise<PayloadResponse<Insight>> {
  const where: Record<string, any> = {};

  if (options?.category) {
    where.category = {
      slug: { equals: options.category },
    };
  }

  if (options?.isTrending !== undefined) {
    where.isTrending = { equals: options.isTrending };
  }

  if (options?.isTopPick !== undefined) {
    where.isTopPick = { equals: options.isTopPick };
  }

  const params: Record<string, any> = {
    limit: options?.limit || 10,
    page: options?.page || 1,
    sort: "-publishedAt", // Sort by published date descending
  };

  if (Object.keys(where).length > 0) {
    params.where = where;
  }

  const query = buildQuery(params);

  console.log("query", query);
  const res = await fetch(`${API_URL}/api/insights?${query}`, {
    next: { revalidate: 60 }, // Revalidate every 60 seconds
  });

  if (!res.ok) {
    throw new Error("Failed to fetch insights");
  }

  return res.json();
}

// Fetch a single insight by slug
export async function getInsightBySlug(slug: string): Promise<Insight | null> {
  const where = { slug: { equals: slug } };
  const query = buildQuery({ where, limit: 1 });

  const res = await fetch(`${API_URL}/api/insights?${query}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch insight");
  }

  const data: PayloadResponse<Insight> = await res.json();
  return data.docs[0] || null;
}

// Fetch trending insights (for "JUST IN: INSIGHTS" section)
export async function getTrendingInsights(
  limit: number = 5
): Promise<Insight[]> {
  const data = await getInsights({ isTrending: true, limit });
  return data.docs;
}

// Fetch top picks by category (for "Top Picks" section)
export async function getTopPicksByCategory(
  categorySlug: string,
  limit: number = 5
): Promise<Insight[]> {
  const data = await getInsights({
    category: categorySlug,
    isTopPick: true,
    limit,
  });
  return data.docs;
}

// Fetch all categories
export async function getCategories(): Promise<Category[]> {
  const res = await fetch(`${API_URL}/api/categories?limit=100`, {
    next: { revalidate: 3600 }, // Cache for 1 hour
  });

  if (!res.ok) {
    throw new Error("Failed to fetch categories");
  }

  const data: PayloadResponse<Category> = await res.json();
  return data.docs;
}

// Fetch insights by category
export async function getInsightsByCategory(
  categorySlug: string,
  options?: { limit?: number; page?: number }
): Promise<PayloadResponse<Insight>> {
  return getInsights({
    category: categorySlug,
    limit: options?.limit,
    page: options?.page,
  });
}
