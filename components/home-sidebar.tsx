import Link from "next/link";
import { University } from "@/types/database";

interface HomeSidebarProps {
  universities: University[];
  isLoading: boolean;
}

export default function HomeSidebar({
  universities,
  isLoading,
}: HomeSidebarProps) {
  // Sort or prioritize active universities to act as "Collectives"
  const activeCollectives = universities.filter((u) => u.is_active).slice(0, 5);

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Collectives Widget (mimicking Stack Overflow's right sidebar) */}
      <div className="bg-white dark:bg-gray-900 border border-[#E5E7EB] dark:border-gray-800  rounded-md overflow-hidden">
        <div className="bg-[#F8F9F9] dark:bg-gray-800/50 px-4 py-3 border-b border-[#E5E7EB] dark:border-gray-800">
          <h2 className="text-[15px] font-bold text-gray-700 dark:text-gray-200">
            Collectives
          </h2>
        </div>

        <div className="p-4 flex flex-col gap-5">
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex gap-3 animate-pulse">
                  <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : activeCollectives.length === 0 ? (
            <p className="text-[13px] text-gray-500">
              No active collectives found.
            </p>
          ) : (
            activeCollectives.map((collective) => (
              <div key={collective.id} className="flex gap-3 items-start group">
                {/* Logo */}
                <div
                  className="w-8 h-8 shrink-0 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center overflow-hidden "
                  style={{
                    backgroundColor: !collective.logo_url
                      ? collective.color_primary || "#e5e7eb"
                      : undefined,
                    color: !collective.logo_url
                      ? collective.color_secondary || "#fff"
                      : undefined,
                  }}
                >
                  {collective.logo_url ? (
                    <img
                      src={collective.logo_url}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xs font-bold">
                      {collective.abbreviation?.substring(0, 2) ||
                        collective.name.substring(0, 2)}
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="flex flex-col flex-1 min-w-0">
                  <Link
                    href={`/university-feed/${collective.id}`}
                    className="text-[13px] font-semibold text-blue-600 dark:text-blue-400 group-hover:text-blue-500 truncate"
                  >
                    {collective.name}
                  </Link>
                  <span className="text-[12px] text-gray-500 dark:text-gray-400 mt-0.5">
                    {/* Mock member count since it's not in DB yet */}
                    {Math.floor(Math.random() * 500) + 50} Members
                  </span>
                </div>
              </div>
            ))
          )}

          <Link
            href="/universities"
            className="text-[13px] text-blue-600 dark:text-blue-400 hover:text-blue-500 mt-1 inline-block"
          >
            Explore all collectives
          </Link>
        </div>
      </div>

      {/* Trending Tags Widget (Mock) */}
      <div className="bg-white dark:bg-gray-900 border border-[#E5E7EB] dark:border-gray-800  rounded-md overflow-hidden">
        <div className="bg-[#F8F9F9] dark:bg-gray-800/50 px-4 py-3 border-b border-[#E5E7EB] dark:border-gray-800">
          <h2 className="text-[15px] font-bold text-gray-700 dark:text-gray-200">
            Trending Tags
          </h2>
        </div>
        <div className="p-4 flex flex-wrap gap-2">
          {[
            "admissions",
            "housing",
            "scholarships",
            "computer-science",
            "student-life",
            "international",
          ].map((tag) => (
            <span
              key={tag}
              className="px-1.5 py-1 bg-[#E1ECF4] text-[#39739D] dark:bg-blue-900/40 dark:text-blue-300 text-[12px] rounded hover:bg-[#D0E3F1] dark:hover:bg-blue-800/60 cursor-pointer transition-colors"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
