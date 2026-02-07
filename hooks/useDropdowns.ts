import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axios";

interface DropdownData {
  topics: any[];
  schools: any[];
  campuses: any[];
  gradeLevels: any[];
  universities: any[];
}

export function useDropdowns() {
  const [data, setData] = useState<DropdownData>({
    topics: [],
    schools: [],
    campuses: [],
    gradeLevels: [],
    universities: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDropdowns();
  }, []);

  const fetchDropdowns = async () => {
    try {
      setIsLoading(true);

      // Fetch all dropdowns in parallel from separate endpoints
      const [
        topicsRes,
        schoolsRes,
        campusesRes,
        gradeLevelsRes,
        universitiesRes,
      ] = await Promise.all([
        axiosInstance.get("/topics"),
        axiosInstance.get("/schools"),
        axiosInstance.get("/campuses"),
        axiosInstance.get("/grade-levels"),
        axiosInstance.get("/dropdowns"), // Keep for universities until separate endpoint is created
      ]);

      // Check if all requests succeeded
      if (
        topicsRes.data.success &&
        schoolsRes.data.success &&
        campusesRes.data.success &&
        gradeLevelsRes.data.success &&
        universitiesRes.data.success
      ) {
        setData({
          topics: topicsRes.data.data,
          schools: schoolsRes.data.data,
          campuses: campusesRes.data.data,
          gradeLevels: gradeLevelsRes.data.data,
          universities: universitiesRes.data.data.universities || [],
        });
      } else {
        setError("Failed to load dropdown data");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load dropdown data");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    ...data,
    isLoading,
    error,
    refetch: fetchDropdowns,
  };
}
