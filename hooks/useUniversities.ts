import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import axiosInstance from "@/lib/axios";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const universitySchema = yup.object({
  name: yup.string().required("University name is required"),
  abbreviation: yup.string().required("Abbreviation is required"),
  color_primary: yup
    .string()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .matches(/^#[0-9A-F]{6}$/i, "Must be a valid hex color (e.g., #FF5733)")
    .nullable()
    .defined(),
  color_secondary: yup
    .string()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .matches(/^#[0-9A-F]{6}$/i, "Must be a valid hex color (e.g., #33FF57)")
    .nullable()
    .defined(),
  latitude: yup
    .number()
    .min(-90, "Latitude must be between -90 and 90")
    .max(90, "Latitude must be between -90 and 90")
    .nullable()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .defined(),
  longitude: yup
    .number()
    .min(-180, "Longitude must be between -180 and 180")
    .max(180, "Longitude must be between -180 and 180")
    .nullable()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .defined(),
  is_active: yup.boolean().required(),
});

interface University {
  id: string;
  name: string;
  abbreviation: string;
  color_primary: string;
  color_secondary: string;
  latitude: number | null;
  longitude: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type UniversityFormData = yup.InferType<typeof universitySchema>;

export function useUniversities() {
  const [universities, setUniversities] = useState<University[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
  } = useForm<UniversityFormData>({
    resolver: yupResolver(universitySchema),
    defaultValues: {
      name: "",
      abbreviation: "",
      color_primary: "",
      color_secondary: "",
      latitude: undefined,
      longitude: undefined,
      is_active: true,
    },
  });

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

  const createUniversity = async (data: UniversityFormData) => {
    try {
      const response = await axiosInstance.post("/universities", data);
       toast.success(response.data.message || "University created successfully")
       reset();
       return { success: true, data: response.data.data };
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create university")
      return { success: false, error: error.response?.data?.message || "Failed to create university" };
    }
  };

  const updateUniversity = async (
    id: string,
    data: Partial<UniversityFormData>,
  ) => {
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
    register,
    handleSubmit,
    errors,
    setValue,
    watch,
    reset,
    isSubmitting,
  };
}
