import axios from "axios";
import toast from "react-hot-toast";

// Create axios instance
const axiosInstance = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - Add auth token to requests
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("admin_token")
        : null;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor - Handle errors globally
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      if (typeof window !== "undefined") {
        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_user");

        // Only redirect if we're on an admin page
        if (
          window.location.pathname.startsWith("/admin") &&
          !window.location.pathname.includes("/login")
        ) {
          window.location.href = "/admin/login";
        }
      }
    }

    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      toast.error("Access denied - Admin privileges required");
    }

    // Handle network errors
    if (!error.response) {
      toast.error("Network error - Please check your connection");
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
