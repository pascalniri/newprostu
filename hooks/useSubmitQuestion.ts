import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";
import axiosInstance from "@/lib/axios";
import * as yup from "yup";

export interface SubmissionFormData {
  title: string;
  postType: "Question" | "Resource";
  topic: string;
  school: string;
  university: string;
  campus: string;
  gradeLevel: string;
  details: string;
  yourName?: string;
  yourSchool?: string;
  tags?: string;
  linkUrl?: string;
  files?: File[];
}

const submissionSchema = yup.object({
  title: yup.string().required("Title is required"),
  postType: yup.string().required("Post type is required"),
  topic: yup.string().required("Topic is required"),
  school: yup.string().required("School is required"),
  university: yup.string().required("University is required"),
  campus: yup.string().required("Campus is required"),
  gradeLevel: yup.string().required("Grade level is required"),
  details: yup.string().required("Details are required"),
  yourName: yup.string().optional(),
  yourSchool: yup.string().optional(),
  tags: yup.string().optional(),
  linkUrl: yup.string().optional(),
  files: yup.mixed().optional(),
});

export default function useSubmitQuestion() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    watch,
    control,
    getValues,
    trigger,
  } = useForm<SubmissionFormData>({
    resolver: yupResolver(submissionSchema) as any,
    defaultValues: {
      title: "",
      postType: "Question",
      topic: "",
      school: "",
      university: "",
      campus: "",
      gradeLevel: "",
      details: "",
      yourName: undefined,
      tags: undefined,
      linkUrl: undefined,
      files: [],
    },
    mode: "onBlur",
  });

  const onSubmit: (data: SubmissionFormData) => Promise<void> = async (
    data,
  ) => {
    setIsSubmitting(true);
    try {
      // Create FormData object for file upload
      const formData = new FormData();

      // Append all text fields
      formData.append("title", data.title);
      formData.append("postType", data.postType);
      formData.append("topic", data.topic);
      formData.append("school", data.school);
      formData.append("university", data.university);
      formData.append("campus", data.campus);
      formData.append("gradeLevel", data.gradeLevel);
      formData.append("details", data.details);

      // Append optional fields if they exist
      if (data.yourName) formData.append("yourName", data.yourName);
      if (data.yourSchool) formData.append("yourSchool", data.yourSchool);
      if (data.tags) formData.append("tags", data.tags);
      if (data.linkUrl) formData.append("linkUrl", data.linkUrl);

      // Append files if they exist
      if (data.files && data.files.length > 0) {
        Array.from(data.files).forEach((file) => {
          formData.append("files", file);
        });
      }

      const response = await axiosInstance.post("/submissions", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total,
            );
            setUploadProgress(percentCompleted);
          }
        },
      });

      toast.success(response.data.message);
      reset();
      setUploadProgress(0);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Submission failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    register,
    reset,
    setValue,
    watch,
    control,
    getValues,
    trigger,
    handleSubmit: handleSubmit(onSubmit),
    isSubmitting,
    uploadProgress,
    errors,
  };
}
