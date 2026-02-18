"use client";

import { useState } from "react";
import { Skeleton } from "./ui/skeleton";
import Link from "next/link";
import { Search, MapPin, ChevronRight, ChevronLeft } from "lucide-react";
import { University } from "@/types/database";

export default function SelectYourUniversity({
  submissions,
  isLoading,
  universities,
  page,
  setPage,
  totalPages,
  totalCount,
}: {
  submissions: any[];
  isLoading: boolean;
  universities: University[];
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
  totalCount: number;
}) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUniversities = universities.filter(
    (university) =>
      university.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      university.abbreviation.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="w-full bg-white dark:bg-gray-900 rounded-[5px] border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white tracking-tight">
          Select Your University
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
          Find your campus community to access resources and discussions
        </p>
      </div>

      {/* Content */}
      <div className="p-6">
        {isLoading ? (
          <div className="space-y-6">
            <Skeleton className="h-11 w-full rounded-lg" />
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-4 p-4 border rounded-[5px]"
                >
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-3 w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Search */}
            <div className="relative group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="text"
                placeholder="Search universities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-[5px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm placeholder:text-gray-400"
              />
            </div>

            {/* List */}
            {filteredUniversities.length > 0 ? (
              <>
                <div className="flex flex-col space-y-3">
                  {filteredUniversities.filter((university) => university.is_active).map((university) => (
                    <Link
                      href={`/university-feed/${university.id}`}
                      key={university.id}
                      className="group flex items-center p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-[5px] hover:border-blue-500/30 hover:shadow-md hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-all duration-200"
                    >
                      {/* Logo / Avatar */}
                      <div
                        className="w-12 h-12 flex-shrink-0 rounded-full flex items-center justify-center text-xs font-bold shadow-sm ring-2 ring-gray-100 dark:ring-gray-800 group-hover:ring-blue-100 dark:group-hover:ring-blue-900/30 transition-all mr-4 overflow-hidden bg-gray-50 dark:bg-gray-800"
                        style={{
                          backgroundColor: !university.logo_url
                            ? university.color_primary || "#e5e7eb"
                            : undefined,
                          color: !university.logo_url
                            ? university.color_secondary || "#ffffff"
                            : undefined,
                        }}
                      >
                        {university.logo_url ? (
                          <img
                            src={university.logo_url}
                            alt={`${university.name} logo`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          university.abbreviation?.substring(0, 2) ||
                          university.name.substring(0, 2)
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {university.name}
                        </h3>
                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
                          {university.latitude && university.longitude && (
                            <div className="flex items-center gap-1">
                              <MapPin size={12} />
                              <span>Map Available</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <span
                              className={`w-2 h-2 rounded-full ${university.is_active ? "bg-green-500" : "bg-gray-300"}`}
                            ></span>
                            <span>
                              {university.is_active ? "Active" : "Inactive"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Arrow */}
                      <ChevronRight size={14} className="text-gray-300 dark:text-gray-600 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                    </Link>
                  ))}
                </div>

                {/* Footer / Pagination */}
                <div className="flex flex-col sm:flex-row justify-between items-center border-t border-gray-100 dark:border-gray-800 pt-4 gap-4">
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Showing {filteredUniversities.length} of {totalCount}{" "}
                    universities
                  </div>

                  {/* Pagination Controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPage(Math.max(1, page - 1))}
                      disabled={page === 1}
                      className="p-2 rounded-[5px] border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      aria-label="Previous page"
                    >
                      <ChevronLeft size={14} className="text-gray-600 dark:text-gray-300" />
                    </button>
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300 px-2">
                      Page {page} of {totalPages}
                    </span>
                    <button
                      onClick={() => setPage(Math.min(totalPages, page + 1))}
                      disabled={page === totalPages}
                      className="p-2 rounded-[5px] border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      aria-label="Next page"
                    >
                      <ChevronRight size={14} className="text-gray-600 dark:text-gray-300" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center bg-gray-50/50 dark:bg-gray-800/50 rounded-[5px] border border-dashed border-gray-200 dark:border-gray-700">
                <Search className="h-10 w-10 text-gray-300 dark:text-gray-600 mb-3" />
                <p className="text-xs font-medium text-gray-900 dark:text-white">
                  No universities found
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  We couldn't find any matches for "{searchQuery}"
                </p>
                <button
                  onClick={() => setSearchQuery("")}
                  className="mt-4 px-4 py-2 text-xs font-medium text-blue-600 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                >
                  Clear search filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
