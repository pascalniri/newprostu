import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axios";

interface Stats {
  pendingSubmissions: number;
  approvedContent: number;
  submissionsByType: {
    questions: number;
    resources: number;
  };
  contentByUniversity: {
    [key: string]: number;
  };
}

export function useAdminStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get("/admin/stats");

      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load statistics");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    stats,
    isLoading,
    error,
    refetch: fetchStats,
  };
}
