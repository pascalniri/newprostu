import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import axiosInstance from "@/lib/axios";

interface Campus {
  id: string;
  name: string;
  location?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export function useCampuses() {
  const [campuses, setCampuses] = useState<Campus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCampuses();
  }, []);

  const fetchCampuses = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get("/admin/campuses");

      if (response.data.success) {
        setCampuses(response.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load campuses");
    } finally {
      setIsLoading(false);
    }
  };

  const createCampus = async (data: { name: string; location?: string }) => {
    const toastId = toast.loading("Creating campus...");

    try {
      const response = await axiosInstance.post("/admin/campuses", data);

      if (response.data.success) {
        toast.success("Campus created successfully", { id: toastId });
        await fetchCampuses();
        return { success: true, data: response.data.data };
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to create campus";
      toast.error(errorMessage, { id: toastId });
      return { success: false, error: errorMessage };
    }
  };

  const updateCampus = async (id: string, data: Partial<Campus>) => {
    const toastId = toast.loading("Updating campus...");

    try {
      const response = await axiosInstance.put("/admin/campuses", {
        id,
        ...data,
      });

      if (response.data.success) {
        toast.success("Campus updated successfully", { id: toastId });
        await fetchCampuses();
        return { success: true, data: response.data.data };
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to update campus";
      toast.error(errorMessage, { id: toastId });
      return { success: false, error: errorMessage };
    }
  };

  const deleteCampus = async (id: string) => {
    const toastId = toast.loading("Deleting campus...");

    try {
      const response = await axiosInstance.delete(`/admin/campuses?id=${id}`);

      if (response.data.success) {
        toast.success("Campus deleted successfully", { id: toastId });
        await fetchCampuses();
        return { success: true };
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to delete campus";
      toast.error(errorMessage, { id: toastId });
      return { success: false, error: errorMessage };
    }
  };

  return {
    campuses,
    isLoading,
    error,
    refetch: fetchCampuses,
    createCampus,
    updateCampus,
    deleteCampus,
  };
}
