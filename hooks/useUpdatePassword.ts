import axiosInstance from "@/lib/axios";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as yup from "yup";

const updatePasswordSchema = yup.object({
  currentPassword: yup.string().required("Current password is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters long")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(/[\W_]/, "Password must contain at least one special character"),
  confirmPassword: yup
    .string()
    .min(8, "Confirm Password must be at least 8 characters long")
    .matches(
      /[A-Z]/,
      "Confirm Password must contain at least one uppercase letter",
    )
    .matches(
      /[a-z]/,
      "Confirm Password must contain at least one lowercase letter",
    )
    .matches(/[0-9]/, "Confirm Password must contain at least one number")
    .matches(
      /[\W_]/,
      "Confirm Password must contain at least one special character",
    ),
});

export default function useUpdatePassword() {
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(updatePasswordSchema),
  });
  const updatePassword = async (data: {
    password?: string;
    confirmPassword?: string;
    currentPassword?: string;
  }) => {
    setIsUpdatingPassword(true);
    setError(null);
    setSuccess(false);
    try {
      // Validate password against schema - handled by resolver
      const { password, confirmPassword, currentPassword } = data;

      const response = await axiosInstance.post("/auth/update-password", {
        password,
        confirmPassword,
        currentPassword,
      });
      toast.success(response.data.message);
      setSuccess(true);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to update password";
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return {
    isUpdatingPassword,
    error,
    success,
    updatePassword,
    register,
    handleSubmit,
    errors,
  };
}
