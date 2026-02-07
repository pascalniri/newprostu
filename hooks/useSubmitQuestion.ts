import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";
import axiosInstance from "@/lib/axios";
import { submissionSchema, SubmissionFormData } from "@/lib/validations";

// Re-export schema and type for convenience
export { submissionSchema };
export type { SubmissionFormData };

interface SubmissionResult {
  success: boolean;
  data?: any;
  error?: string;
  code?: string;
}

export default function useSubmitQuestion() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const {
    register,
    handleSubmit,
    reset,
    formState,
    setValue,
    watch,
    control,
    getValues,
    trigger,
  } = useForm<SubmissionFormData>({
    resolver: yupResolver(submissionSchema),
    defaultValues: {
      title: "",
      postType: "Question",
      topic: "",
      school: "",
      campus: "",
      gradeLevel: "",
      details: "",
      yourName: undefined,
      yourSchool: undefined,
      tags: undefined,
      linkUrl: null,
      file: null,
    },
  });

  const onSubmit = async (
    data: SubmissionFormData,
  ): Promise<SubmissionResult> => {
    setIsSubmitting(true);
    setUploadProgress(0);
    const toastId = toast.loading("Submitting your question...");

    try {
      // Create FormData for file upload
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        const value = data[key as keyof SubmissionFormData];
        if (value !== null && value !== undefined) {
          formData.append(key, value as string | Blob);
        }
      });

      const response = await axiosInstance.post("/submissions", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            setUploadProgress(
              Math.round((progressEvent.loaded * 100) / progressEvent.total),
            );
          }
        },
      });

      if (response.data.success) {
        toast.success(response.data.message, { id: toastId });
        reset();
        setUploadProgress(0);
        return { success: true, data: response.data };
      }

      toast.error(response.data.message || "Submission failed", {
        id: toastId,
      });
      return { success: false, error: response.data.message };
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again.",
        { id: toastId },
      );
      return { success: false, error: error.response?.data?.message };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    // React Hook Form methods
    register,
    handleSubmit,
    reset,
    formState,
    setValue,
    watch,
    control,
    getValues,
    trigger,
    // Submission handler
    onSubmit: handleSubmit(onSubmit),
    // Loading states
    isSubmitting,
    uploadProgress,
  };
}
