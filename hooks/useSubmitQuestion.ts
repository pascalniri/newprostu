import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";
import axiosInstance from "@/lib/axios";
import { submissionSchema, SubmissionFormData } from "@/lib/validations";

export function useSubmitQuestion() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SubmissionFormData>({
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

  const onSubmit = async (data: SubmissionFormData) => {
    setIsSubmitting(true);
    const toastId = toast.loading("Submitting your question...");

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("postType", data.postType);
      formData.append("topic", data.topic);
      formData.append("school", data.school);
      formData.append("campus", data.campus);
      formData.append("gradeLevel", data.gradeLevel);
      formData.append("details", data.details);
      formData.append("yourName", data.yourName || "");
      formData.append("yourSchool", data.yourSchool || "");
      formData.append("tags", data.tags || "");

      if (data.linkUrl) {
        formData.append("linkUrl", data.linkUrl);
      }

      if (data.file) {
        formData.append("file", data.file);
      }

      const response = await axiosInstance.post("/submissions", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        toast.success(response.data.message, { id: toastId });
        form.reset();
        return { success: true, data: response.data };
      } else {
        toast.error(response.data.message || "Submission failed", {
          id: toastId,
        });
        return { success: false, error: response.data.message };
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "An error occurred. Please try again.";
      toast.error(errorMessage, { id: toastId });
      return { success: false, error: errorMessage };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isSubmitting,
  };
}
