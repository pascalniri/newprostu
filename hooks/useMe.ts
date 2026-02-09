import axiosInstance from "@/lib/axios";
import { useEffect, useState } from "react";

export default function useMe() {
  const [user, setUser] = useState<any>(null);
  const [loadingMe, setLoadingMe] = useState(true);

  const getUser = async () => {
    setLoadingMe(true);

    try {
      const response = await axiosInstance.get("/auth/me");
      const data = response.data;
      setUser(data.user);
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      setLoadingMe(false);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return { user, loadingMe, getUser };
}
