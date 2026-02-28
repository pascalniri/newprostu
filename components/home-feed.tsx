import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ApprovedContent, University } from "@/types/database";

interface HomeFeedProps {
  posts: ApprovedContent[];
  isLoading: boolean;
  universities?: University[];
}

export default function HomeFeed({
  posts,
  isLoading,
  universities = [],
}: HomeFeedProps) {
  return (
    <div className="flex-1 w-full bg-white dark:bg-gray-900 border border-[#E5E7EB] dark:border-gray-800 rounded-sm">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-6 py-5 border-b border-[#E5E7EB] dark:border-gray-800">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 font-sans tracking-tight">
          Top Questions
        </h1>
        <Link
          href="/ask-share"
          className="mt-3 sm:mt-0 bg-blue-500 hover:bg-blue-600 font-semibold text-white px-3 py-2 rounded-[5px] text-[13px] shadow-sm transition-colors"
        >
          Ask Question
        </Link>
      </div>

      {/* Filter Tabs & Count */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 py-4 border-b border-[#E5E7EB] dark:border-gray-800 space-y-3 sm:space-y-0">
        <div className="text-[15px] font-medium text-gray-800 dark:text-gray-200">
          {posts?.length || 0} questions
        </div>

        <div className="flex border border-[#E5E7EB] dark:border-gray-700 rounded-[5px] overflow-hidden self-end sm:self-auto">
          <button className="px-3 py-1.5 text-[13px] bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-medium hover:bg-gray-200 dark:hover:bg-gray-700 border-r border-[#E5E7EB] dark:border-gray-700 transition">
            Interesting
          </button>
          <button className="px-3 py-1.5 text-[13px] font-medium text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 border-r border-[#E5E7EB] dark:border-gray-700 transition">
            Bountied{" "}
            <span className="bg-blue-100 text-blue-700 px-1.5 rounded-sm ml-1 text-[11px]">
              0
            </span>
          </button>
          <button className="px-3 py-1.5 text-[13px] font-medium text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 border-r border-[#E5E7EB] dark:border-gray-700 transition">
            Hot
          </button>
          <button className="hidden sm:inline-block px-3 py-1.5 text-[13px] font-medium text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 border-r border-[#E5E7EB] dark:border-gray-700 transition">
            Week
          </button>
          <button className="hidden sm:inline-block px-3 py-1.5 text-[13px] font-medium text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
            Month
          </button>
        </div>
      </div>

      {/* 
        List of Questions 
      */}
      <div className="flex flex-col">
        {isLoading ? (
          <div className="py-20 flex justify-center text-gray-500">
            <span className="flex items-center gap-2">
              <svg
                className="animate-spin h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Loading questions...
            </span>
          </div>
        ) : !posts || posts.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              No questions found
            </p>
          </div>
        ) : (
          posts.map((sub) => {
            // Find university for avatar displaying (mock capability)
            const uni = universities.find(
              (u) => u.id === sub.university || u.name === sub.university,
            );

            return (
              <div
                key={sub.id}
                className="flex flex-col sm:flex-row p-4 border-b border-[#E5E7EB] dark:border-gray-800 gap-4"
              >
                {/* Stats Container - Takes up left side */}
                <div className="flex sm:flex-col shrink-0 sm:w-28 items-center sm:items-end gap-3 sm:gap-2 text-[13px] text-gray-600 dark:text-gray-400 sm:pr-2">
                  <div className="flex items-center gap-1.5 text-gray-900 dark:text-gray-300">
                    <span className="font-semibold">{sub.votes || 0}</span>{" "}
                    votes
                  </div>

                  {/* Safely displaying answers block */}
                  <div className="flex items-center gap-1.5 text-green-700 dark:text-green-500 font-medium px-2 py-1 rounded border border-green-600/30">
                    <span>{sub.answers_count || 0}</span> answers
                  </div>

                  <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-600">
                    <span>{sub.view_count || 0}</span> views
                  </div>
                </div>

                {/* Content Container - Takes up rest of space */}
                <div className="flex flex-col flex-1 min-w-0">
                  <Link href={`/questions/${sub.id}`}>
                    <h3 className="text-[17px] text-blue-600 dark:text-blue-400 hover:text-blue-500 font-normal leading-snug cursor-pointer mb-1.5 break-words pr-4">
                      {sub.title}
                    </h3>
                  </Link>

                  <p className="text-[13px] text-gray-700 dark:text-gray-300 line-clamp-2 md:line-clamp-3 mb-3 leading-relaxed break-words">
                    {sub.details}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-3 mt-auto">
                    {/* Tags Section */}
                    <div className="flex flex-wrap gap-1.5">
                      {sub.tags &&
                        Array.isArray(sub.tags) &&
                        sub.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-1.5 py-1 bg-[#E1ECF4] text-[#39739D] dark:bg-blue-900/40 dark:text-blue-300 text-[12px] rounded hover:bg-[#D0E3F1] dark:hover:bg-blue-800/60 cursor-pointer transition-colors"
                          >
                            {tag}
                          </span>
                        ))}
                      {/* Secondary labels treated as tags */}
                      {sub.post_type && (
                        <span className="px-1.5 py-1 bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 text-[12px] rounded border border-gray-200 dark:border-gray-700">
                          {sub.post_type}
                        </span>
                      )}
                    </div>

                    {/* Meta User Info Section - exactly like Stack Overflow user cards */}
                    <div className="flex flex-col shrink-0 items-end ml-auto text-[12px]">
                      <span className="text-gray-500 dark:text-gray-400 mb-1">
                        asked{" "}
                        {sub.approved_at || sub.created_at
                          ? formatDistanceToNow(
                              new Date(sub.approved_at || sub.created_at),
                              {
                                addSuffix: true,
                              },
                            )
                          : ""}
                      </span>
                      <div className="flex items-center gap-2">
                        {/* Avatar Mock */}
                        <div className="w-8 h-8 rounded bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400 font-bold overflow-hidden border border-orange-200 dark:border-orange-800 shadow-sm">
                          {uni?.logo_url ? (
                            <img
                              src={uni.logo_url}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            (sub.author_name
                              ? sub.author_name.charAt(0)
                              : "U"
                            ).toUpperCase()
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-blue-600 dark:text-blue-400 cursor-pointer hover:text-blue-500">
                            {sub.author_name || "Anonymous User"}
                          </span>
                          <span className="font-semibold text-gray-600 dark:text-gray-400 flex items-center gap-1">
                            {/* University / School Name */}
                            {sub.university ||
                              sub.author_school ||
                              "General Student"}
                            {sub.grade_level && (
                              <span className="text-amber-600 text-[10px] bg-amber-50 dark:bg-amber-900/20 px-1 rounded-sm border border-amber-200 dark:border-amber-800/50">
                                {sub.grade_level}
                              </span>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer / Pagination Placeholder */}
      <div className="p-6"></div>
    </div>
  );
}
