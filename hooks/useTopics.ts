import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import axiosInstance from "@/lib/axios";

interface Topic {
  id: string;
  name: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export function useTopics() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get("/admin/topics");

      if (response.data.success) {
        setTopics(response.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load topics");
    } finally {
      setIsLoading(false);
    }
  };

  const createTopic = async (data: { name: string; description?: string }) => {
    const toastId = toast.loading("Creating topic...");

    try {
      const response = await axiosInstance.post("/admin/topics", data);

      if (response.data.success) {
        toast.success("Topic created successfully", { id: toastId });
        await fetchTopics();
        return { success: true, data: response.data.data };
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to create topic";
      toast.error(errorMessage, { id: toastId });
      return { success: false, error: errorMessage };
    }
  };

  const updateTopic = async (id: string, data: Partial<Topic>) => {
    const toastId = toast.loading("Updating topic...");

    try {
      const response = await axiosInstance.put("/admin/topics", {
        id,
        ...data,
      });

      if (response.data.success) {
        toast.success("Topic updated successfully", { id: toastId });
        await fetchTopics();
        return { success: true, data: response.data.data };
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to update topic";
      toast.error(errorMessage, { id: toastId });
      return { success: false, error: errorMessage };
    }
  };

  const deleteTopic = async (id: string) => {
    const toastId = toast.loading("Deleting topic...");

    try {
      const response = await axiosInstance.delete(`/admin/topics?id=${id}`);

      if (response.data.success) {
        toast.success("Topic deleted successfully", { id: toastId });
        await fetchTopics();
        return { success: true };
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to delete topic";
      toast.error(errorMessage, { id: toastId });
      return { success: false, error: errorMessage };
    }
  };

  return {
    topics,
    isLoading,
    error,
    refetch: fetchTopics,
    createTopic,
    updateTopic,
    deleteTopic,
  };
}
