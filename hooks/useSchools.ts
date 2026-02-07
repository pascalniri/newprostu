import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import axiosInstance from "@/lib/axios";

interface School {
  id: string;
  name: string;
  abbreviation?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export function useSchools() {
  const [schools, setSchools] = useState<School[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get("/admin/schools");

      if (response.data.success) {
        setSchools(response.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load schools");
    } finally {
      setIsLoading(false);
    }
  };

  const createSchool = async (data: {
    name: string;
    abbreviation?: string;
  }) => {
    const toastId = toast.loading("Creating school...");

    try {
      const response = await axiosInstance.post("/admin/schools", data);

      if (response.data.success) {
        toast.success("School created successfully", { id: toastId });
        await fetchSchools();
        return { success: true, data: response.data.data };
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to create school";
      toast.error(errorMessage, { id: toastId });
      return { success: false, error: errorMessage };
    }
  };

  const updateSchool = async (id: string, data: Partial<School>) => {
    const toastId = toast.loading("Updating school...");

    try {
      const response = await axiosInstance.put("/admin/schools", {
        id,
        ...data,
      });

      if (response.data.success) {
        toast.success("School updated successfully", { id: toastId });
        await fetchSchools();
        return { success: true, data: response.data.data };
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to update school";
      toast.error(errorMessage, { id: toastId });
      return { success: false, error: errorMessage };
    }
  };

  const deleteSchool = async (id: string) => {
    const toastId = toast.loading("Deleting school...");

    try {
      const response = await axiosInstance.delete(`/admin/schools?id=${id}`);

      if (response.data.success) {
        toast.success("School deleted successfully", { id: toastId });
        await fetchSchools();
        return { success: true };
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to delete school";
      toast.error(errorMessage, { id: toastId });
      return { success: false, error: errorMessage };
    }
  };

  return {
    schools,
    isLoading,
    error,
    refetch: fetchSchools,
    createSchool,
    updateSchool,
    deleteSchool,
  };
}
