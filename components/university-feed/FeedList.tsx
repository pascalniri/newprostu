"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import { Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { ApprovedContent } from "@/types/database";

interface FeedListProps {
  universityName: string; // The API filters by name, not ID
}

export default function FeedList({ universityName }: FeedListProps) {
  const [posts, setPosts] = useState<ApprovedContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"All" | "Question" | "Resource">("All");

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get(
          `/content?university=${encodeURIComponent(universityName)}`,
        );
        if (response.data.success) {
          setPosts(response.data.content);
        }
      } catch (error) {
        console.error("Failed to fetch posts", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (universityName) {
      fetchPosts();
    }
  }, [universityName]);

  const filteredPosts = posts.filter(
    (post) => filter === "All" || post.post_type === filter,
  );

  return (
    <div className="flex-1 w-full bg-white dark:bg-gray-900 border border-[#E5E7EB] dark:border-gray-800 rounded-sm">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-6 py-5 border-b border-[#E5E7EB] dark:border-gray-800">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 font-sans tracking-tight">
          University Feed
        </h1>
        <Link
          href="/ask-share"
          className="mt-3 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-[13px] shadow-sm transition-colors"
        >
          Ask Question
        </Link>
      </div>

      {/* Filters (Stack Overflow Style Tabs) */}
      <div className="px-6 py-3 border-b border-[#E5E7EB] dark:border-gray-800 flex justify-between items-center text-[13px]">
        <span className="text-gray-600 dark:text-gray-400 font-medium">
          {isLoading ? "Loading..." : `${filteredPosts.length} questions`}
        </span>
        <div className="flex border border-gray-300 dark:border-gray-700 rounded overflow-hidden">
          <button
            className={`px-3 py-1.5 transition-colors ${filter === "All" ? "bg-gray-100 dark:bg-gray-800 font-medium text-gray-900 dark:text-gray-100" : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 border-r border-gray-300 dark:border-gray-700"}`}
            onClick={() => setFilter("All")}
          >
            All
          </button>
          <button
            className={`px-3 py-1.5 transition-colors ${filter === "Question" ? "bg-gray-100 dark:bg-gray-800 font-medium text-gray-900 dark:text-gray-100" : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 border-r border-gray-300 dark:border-gray-700"}`}
            onClick={() => setFilter("Question")}
          >
            Questions
          </button>
          <button
            className={`px-3 py-1.5 transition-colors ${filter === "Resource" ? "bg-gray-100 dark:bg-gray-800 font-medium text-gray-900 dark:text-gray-100" : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"}`}
            onClick={() => setFilter("Resource")}
          >
            Resources
          </button>
        </div>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="flex justify-center flex-col items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400 mb-4" />
          <p className="text-gray-500 text-sm">Loading feed...</p>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="text-center py-20 px-4">
          <p className="text-gray-500 dark:text-gray-400 text-[15px]">
            No posts found for this university yet. Check back later or start a
            discussion!
          </p>
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-[#E5E7EB] dark:divide-gray-800">
          {filteredPosts.map((post) => {
            // Stats integration
            const votes = 0; // TODO: Fetch from votes aggregation
            const answers = 0; // TODO: Fetch from comments aggregation
            const views = post.view_count || 0;
            const isAnswered = answers > 0;

            let tags: string[] = [];
            if (post.topic) tags.push(post.topic);
            if (post.post_type) tags.push(post.post_type);

            return (
              <div
                key={post.id}
                className="flex flex-col sm:flex-row gap-4 p-4 border-l-4 border-transparent hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
              >
                {/* Stats Container (Left side on desktop, top on mobile) */}
                <div className="flex sm:flex-col shrink-0 sm:w-28 items-center sm:items-end gap-3 sm:gap-2 text-[13px] text-gray-600 dark:text-gray-400 sm:pr-2">
                  <div className="flex items-center gap-1.5 text-gray-900 dark:text-gray-300">
                    <span className="font-semibold">{post.votes || 0}</span>{" "}
                    votes
                  </div>

                  {/* Safely displaying answers block */}
                  <div className="flex items-center gap-1.5 text-green-700 dark:text-green-500 font-medium px-2 py-1 rounded border border-green-600/30">
                    <span>{post.answers_count || 0}</span> answers
                  </div>

                  <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-600">
                    <span>{post.view_count || 0}</span> views
                  </div>
                </div>

                {/* Content Container - Takes up rest of space */}
                <div className="flex flex-col flex-1 min-w-0">
                  <Link href={`/questions/${post.id}`}>
                    <h3 className="text-[17px] text-blue-600 dark:text-blue-400 hover:text-blue-500 font-normal leading-snug cursor-pointer mb-1.5 break-words pr-4">
                      {post.title}
                    </h3>
                  </Link>

                  <p className="text-[13px] text-gray-700 dark:text-gray-300 line-clamp-2 md:line-clamp-3 mb-3 leading-relaxed break-words">
                    {post.details}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-y-2 gap-x-4 mt-auto">
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-1.5 py-1 bg-[#E1ECF4] text-[#39739D] dark:bg-blue-900/40 dark:text-blue-300 text-[12px] rounded border-transparent hover:bg-[#D0E3F1] dark:hover:bg-blue-800/60 cursor-pointer transition-colors"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Author Meta */}
                    <div className="flex items-center gap-1.5 text-[12px] text-gray-500 ml-auto flex-wrap justify-end">
                      <img
                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${post.author_name || "Anonymous"}`}
                        alt=""
                        className="w-4 h-4 rounded shadow-sm"
                      />
                      <span className="text-blue-600 dark:text-blue-400 cursor-pointer">
                        {post.author_name || "Anonymous User"}
                      </span>
                      <span className="font-semibold text-gray-700 dark:text-gray-300 ml-1">
                        {Math.floor(Math.random() * 500) + 1}
                      </span>
                      <span className="ml-1">
                        asked{" "}
                        {formatDistanceToNow(
                          new Date(post.approved_at || post.created_at),
                          { addSuffix: true },
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
