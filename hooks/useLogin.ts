import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axiosInstance from "@/lib/axios";
import { loginSchema, LoginFormData } from "@/lib/validations";

export function useLogin() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    const toastId = toast.loading("Logging in...");

    try {
      const response = await axiosInstance.post("/auth/login", data);

      if (response.data.success) {
        // Store session data
        localStorage.setItem("admin_token", response.data.session.access_token);
        localStorage.setItem("admin_user", JSON.stringify(response.data.user));

        toast.success("Login successful!", { id: toastId });

        // Redirect to admin dashboard
        setTimeout(() => {
          router.push("/admin");
        }, 500);

        return { success: true, data: response.data };
      } else {
        toast.error(response.data.message || "Login failed", { id: toastId });
        return { success: false, error: response.data.message };
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Invalid credentials";
      toast.error(errorMessage, { id: toastId });
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    toast.success("Logged out successfully");
    router.push("/admin/login");
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isLoading,
    logout,
  };
}
