import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import axiosInstance from "@/lib/axios";

interface University {
  id: string;
  name: string;
  abbreviation: string;
  color_primary: string;
  color_secondary: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export function useUniversities() {
  const [universities, setUniversities] = useState<University[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUniversities();
  }, []);

  const fetchUniversities = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get("/universities");

      if (response.data.success) {
        setUniversities(response.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load universities");
    } finally {
      setIsLoading(false);
    }
  };

  const createUniversity = async (data: { name: string; abbreviation: string; color_primary: string; color_secondary: string; is_active: boolean; }) => {
    const toastId = toast.loading("Creating university...");

    try {
      const response = await axiosInstance.post("/universities", data);

      if (response.data.success) {
        toast.success("University created successfully", { id: toastId });
        await fetchUniversities();
        return { success: true, data: response.data.data };
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to create university";
      toast.error(errorMessage, { id: toastId });
      return { success: false, error: errorMessage };
    }
  };

  const updateUniversity = async (id: string, data: Partial<University>) => {
    const toastId = toast.loading("Updating university...");

    try {
      const response = await axiosInstance.put("/universities", {
        id,
        ...data,
      });

      if (response.data.success) {
        toast.success("University updated successfully", { id: toastId });
        await fetchUniversities();
        return { success: true, data: response.data.data };
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to update university";
      toast.error(errorMessage, { id: toastId });
      return { success: false, error: errorMessage };
    }
  };

  const deleteUniversity = async (id: string) => {
    const toastId = toast.loading("Deleting university...");

    try {
      const response = await axiosInstance.delete(`/universities?id=${id}`);

      if (response.data.success) {
        toast.success("University deleted successfully", { id: toastId });
        await fetchUniversities();
        return { success: true };
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to delete university";
      toast.error(errorMessage, { id: toastId });
      return { success: false, error: errorMessage };
    }
  };

  return {
    universities,
    isLoading,
    error,
    refetch: fetchUniversities,
    createUniversity,
    updateUniversity,
    deleteUniversity,
  };
}
