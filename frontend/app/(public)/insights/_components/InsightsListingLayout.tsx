import Image from "next/image";
import Link from "next/link";

import type { Post } from "@/lib/types/cms";
import { formatDate, getCategoryName, getImageUrl } from "@/lib/utils/formatting";

// Hardcoded Mock Data for White Papers
const MOCK_WHITE_PAPERS = [
  {
    id: 1,
    title: "Devices Big and Small Can Learn What We Need Them to Learn",
  },
  {
    id: 2,
    title: "Devices Big and Small Can Learn What We Need Them to Learn",
  },
  {
    id: 3,
    title: "Devices Big and Small Can Learn What We Need Them to Learn",
  },
  {
    id: 4,
    title: "Devices Big and Small Can Learn What We Need Them to Learn",
  },
  {
    id: 5,
    title: "Devices Big and Small Can Learn What We Need Them to Learn",
  },
  {
    id: 6,
    title: "Devices Big and Small Can Learn What We Need Them to Learn",
  },
];

export function InsightsListingLayout({ insights }: { insights: Post[] }) {
  // Helper to match the specific category colors in your image
  const getCategoryTextColor = (category: string) => {
    const name = category?.toLowerCase() || "";
    if (name.includes("tech")) return "text-[#3b59ff]"; // Vivid Blue
    if (name.includes("market")) return "text-[#00a624]"; // Vivid Green
    if (name.includes("finance")) return "text-[#ff0000]"; // Vivid Red
    return "text-gray-600";
  };

  return (
    <main className="bg-white py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Page Header with Horizontal Line */}
        <div className="flex items-center gap-6 mb-16">
          <h1 className="text-4xl font-bold text-black tracking-tight">
            Insights
          </h1>
          <div className="flex-1 h-px bg-[#e5e5e5]"></div>
        </div>

        <div className="flex flex-col lg:flex-row gap-16">
          {/* LEFT COLUMN: Insights Feed */}
          <div className="lg:w-[65%]">
            <div className="flex flex-col">
              {insights.map((insight) => {
                const categoryName = getCategoryName(insight.primaryCategory);

                return (
                  <div key={insight.id} className="group">
                    <div className="flex justify-between items-start gap-8 py-10 first:pt-0">
                      <div className="flex-1">
                        <span
                          className={`text-[13px] font-bold uppercase tracking-[0.1em] ${getCategoryTextColor(
                            categoryName
                          )}`}
                        >
                          {categoryName}
                        </span>
                        <Link href={`/insights/${insight.slug}`}>
                          <h2 className="text-[22px] font-bold text-black leading-tight mt-2 mb-3 group-hover:underline decoration-1">
                            {insight.title}
                          </h2>
                        </Link>
                        <p className="text-[15px] text-[#a0a0a0] font-medium">
                          {formatDate(insight.publishedAt)}
                        </p>
                      </div>

                      {/* Insight Image */}
                      <div className="relative w-40 h-32 md:w-48 md:h-36 shrink-0 overflow-hidden shadow-sm">
                        <Image
                          src={getImageUrl(insight.featuredImage)}
                          alt={insight.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                    {/* Divider line between items */}
                    <div className="h-px bg-[#f0f0f0] w-full"></div>
                  </div>
                );
              })}
            </div>

            {/* Load More Button */}
            <div className="mt-16 flex justify-center">
              <button className="bg-[#ff0000] text-white px-12 py-3 rounded-xl font-bold text-[15px] shadow-lg hover:bg-red-700 transition-all">
                Load More
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: Sidebar */}
          <div className="lg:w-[35%]">
            <div className="border border-[#ff7a7a] rounded-[24px] p-8 sticky top-10">
              <h3 className="text-xl font-bold text-black mb-4">
                <span className="text-[#ff0000] border-b-2 border-[#ff0000] pb-0.5">
                  Most
                </span>{" "}
                Downloaded <span className="font-bold">White Papers</span>
              </h3>

              <div className="flex flex-col mt-4">
                {MOCK_WHITE_PAPERS.map((paper, idx) => (
                  <div
                    key={paper.id}
                    className="flex items-start gap-4 py-5 border-b border-[#f0f0f0] last:border-0"
                  >
                    <span className="text-[#ff0000] font-bold text-xl leading-none pt-1">
                      {idx + 1}.
                    </span>
                    <p className="text-[14px] text-[#666666] font-semibold leading-[1.4] hover:text-black cursor-pointer transition-colors">
                      {paper.title}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
