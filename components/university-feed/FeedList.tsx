"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

import { ApprovedContent } from "@/types/database";
import PostItem from "./PostItem";

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
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex items-center gap-2 mb-4">
        <Button
          variant={filter === "All" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("All")}
        >
          All
        </Button>
        <Button
          variant={filter === "Question" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("Question")}
        >
          Questions
        </Button>
        <Button
          variant={filter === "Resource" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("Resource")}
        >
          Resources
        </Button>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400">
            No posts found for this university yet.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <PostItem key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
