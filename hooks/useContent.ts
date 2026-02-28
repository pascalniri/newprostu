import { useState, useEffect, useCallback } from "react";
import axiosInstance from "@/lib/axios";
import type { ApprovedContent, ContentFilters } from "@/types/database";

export function useContent(filters?: ContentFilters) {
  const [content, setContent] = useState<ApprovedContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchContent();
  }, [filters?.university, filters?.type, filters?.topic, filters?.search]);

  const fetchContent = async () => {
    try {
      setIsLoading(true);

      // Build query params
      const params = new URLSearchParams();
      if (filters?.university) params.append("university", filters.university);
      if (filters?.type) params.append("type", filters.type);
      if (filters?.topic) params.append("topic", filters.topic);
      if (filters?.search) params.append("search", filters.search);

      const response = await axiosInstance.get(`/content?${params.toString()}`);

      if (response.data.success) {
        setContent(response.data.content);
      } else {
        setError("Failed to load content");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load content");
    } finally {
      setIsLoading(false);
    }
  };

  const getSingleContent = useCallback(async (id: string, userId?: string) => {
    setIsLoading(true);
    try {
      const url = userId
        ? `/content/${id}?user_id=${userId}`
        : `/content/${id}`;
      const response = await axiosInstance.get(url);
      if (response.data.success) {
        return response.data.content as ApprovedContent;
      }
      return null;
    } catch (error) {
      console.error("Error fetching single content:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    content,
    isLoading,
    error,
    refetch: fetchContent,
    getSingleContent,
  };
}
