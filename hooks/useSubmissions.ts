import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import axiosInstance from "@/lib/axios";
import type { Submission } from "@/types/database";

export function useSubmissions() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get("/submissions");

      if (response.data.success) {
        setSubmissions(response.data.submissions);
      } else {
        setError("Failed to load submissions");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load submissions");
    } finally {
      setIsLoading(false);
    }
  };

  const approveSubmission = async (
    submissionId: string,
    university: string,
  ) => {
    const toastId = toast.loading("Approving submission...");

    try {
      const response = await axiosInstance.post("/approve", {
        submissionId,
        action: "approve",
        university,
      });

      if (response.data.success) {
        toast.success(response.data.message, { id: toastId });
        // Remove from list
        setSubmissions(submissions.filter((sub) => sub.id !== submissionId));
        return { success: true };
      } else {
        toast.error(response.data.message, { id: toastId });
        return { success: false };
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to approve submission";
      toast.error(errorMessage, { id: toastId });
      return { success: false, error: errorMessage };
    }
  };

  const rejectSubmission = async (submissionId: string) => {
    const toastId = toast.loading("Rejecting submission...");

    try {
      const response = await axiosInstance.post("/approve", {
        submissionId,
        action: "reject",
      });

      if (response.data.success) {
        toast.success(response.data.message, { id: toastId });
        // Remove from list
        setSubmissions(submissions.filter((sub) => sub.id !== submissionId));
        return { success: true };
      } else {
        toast.error(response.data.message, { id: toastId });
        return { success: false };
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to reject submission";
      toast.error(errorMessage, { id: toastId });
      return { success: false, error: errorMessage };
    }
  };

  return {
    submissions,
    isLoading,
    error,
    refetch: fetchSubmissions,
    approveSubmission,
    rejectSubmission,
  };
}
