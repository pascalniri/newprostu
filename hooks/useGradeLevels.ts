import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import axiosInstance from "@/lib/axios";

interface GradeLevel {
  id: string;
  name: string;
  order_index?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export function useGradeLevels() {
  const [gradeLevels, setGradeLevels] = useState<GradeLevel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchGradeLevels();
  }, []);

  const fetchGradeLevels = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get("/admin/grade-levels");

      if (response.data.success) {
        setGradeLevels(response.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load grade levels");
    } finally {
      setIsLoading(false);
    }
  };

  const createGradeLevel = async (data: {
    name: string;
    order_index?: number;
  }) => {
    const toastId = toast.loading("Creating grade level...");

    try {
      const response = await axiosInstance.post("/admin/grade-levels", data);

      if (response.data.success) {
        toast.success("Grade level created successfully", { id: toastId });
        await fetchGradeLevels();
        return { success: true, data: response.data.data };
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to create grade level";
      toast.error(errorMessage, { id: toastId });
      return { success: false, error: errorMessage };
    }
  };

  const updateGradeLevel = async (id: string, data: Partial<GradeLevel>) => {
    const toastId = toast.loading("Updating grade level...");

    try {
      const response = await axiosInstance.put("/admin/grade-levels", {
        id,
        ...data,
      });

      if (response.data.success) {
        toast.success("Grade level updated successfully", { id: toastId });
        await fetchGradeLevels();
        return { success: true, data: response.data.data };
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to update grade level";
      toast.error(errorMessage, { id: toastId });
      return { success: false, error: errorMessage };
    }
  };

  const deleteGradeLevel = async (id: string) => {
    const toastId = toast.loading("Deleting grade level...");

    try {
      const response = await axiosInstance.delete(
        `/admin/grade-levels?id=${id}`,
      );

      if (response.data.success) {
        toast.success("Grade level deleted successfully", { id: toastId });
        await fetchGradeLevels();
        return { success: true };
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to delete grade level";
      toast.error(errorMessage, { id: toastId });
      return { success: false, error: errorMessage };
    }
  };

  return {
    gradeLevels,
    isLoading,
    error,
    refetch: fetchGradeLevels,
    createGradeLevel,
    updateGradeLevel,
    deleteGradeLevel,
  };
}
