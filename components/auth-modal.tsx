"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  loginSchema,
  registerSchema,
  LoginFormData,
  RegisterFormData,
} from "@/lib/validations";
import axiosInstance from "@/lib/axios";
import toast from "react-hot-toast";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AuthModal({ open, onOpenChange, onSuccess }: AuthModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  const {
    register: registerLogin,
    handleSubmit: handleSubmitLogin,
    formState: { errors: loginErrors },
    reset: resetLogin,
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const {
    register: registerSignup,
    handleSubmit: handleSubmitSignup,
    formState: { errors: signupErrors },
    reset: resetSignup,
  } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema),
    defaultValues: { firstName: "", lastName: "", email: "", password: "" },
  });

  const handleAuthSuccess = (response: any, toastId: string) => {
    // Store session data using the existing keys so we don't break frontend state
    localStorage.setItem("admin_token", response.data.session.access_token);
    localStorage.setItem("admin_user", JSON.stringify(response.data.user));

    toast.success(
      `Successfully ${activeTab === "login" ? "logged in" : "registered"}!`,
      { id: toastId },
    );
    onOpenChange(false);

    // Reset forms
    resetLogin();
    resetSignup();

    if (onSuccess) {
      onSuccess();
    } else {
      window.location.reload();
    }
  };

  const onLogin = async (data: LoginFormData) => {
    setIsLoading(true);
    const toastId = toast.loading("Logging in...");

    try {
      const response = await axiosInstance.post("/auth/user/login", data);
      if (response.data.success) {
        handleAuthSuccess(response, toastId);
      } else {
        toast.error(response.data.message || "Login failed", { id: toastId });
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Invalid credentials";
      toast.error(errorMessage, { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  const onRegister = async (data: RegisterFormData) => {
    setIsLoading(true);
    const toastId = toast.loading("Creating account...");

    try {
      const response = await axiosInstance.post("/auth/user/register", data);
      if (response.data.success) {
        handleAuthSuccess(response, toastId);
      } else {
        toast.error(response.data.message || "Registration failed", {
          id: toastId,
        });
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Error creating account";
      toast.error(errorMessage, { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  // Reset state when modal closes/opens
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      resetLogin();
      resetSignup();
      setActiveTab("login");
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-gray-800 border-none p-0 overflow-hidden">
        <div className="p-6 pb-2">
          <DialogTitle className="text-2xl font-bold text-center mb-2 text-gray-900 dark:text-white">
            Authentication Required
          </DialogTitle>
          <p className="text-center text-gray-500 text-sm">
            Please log in or create an account to continue.
          </p>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={(val) => setActiveTab(val as "login" | "register")}
          className="w-full"
        >
          <div className="px-6">
            <TabsList className="grid w-full grid-cols-2 mb-4 bg-gray-100 dark:bg-gray-900">
              <TabsTrigger
                value="login"
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800"
              >
                Sign In
              </TabsTrigger>
              <TabsTrigger
                value="register"
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="px-6 pb-6">
            <TabsContent value="login" className="mt-0 outline-none">
              <form onSubmit={handleSubmitLogin(onLogin)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="user@example.com"
                    {...registerLogin("email")}
                    disabled={isLoading}
                    className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                  />
                  {loginErrors.email && (
                    <p className="text-xs text-red-600">
                      {loginErrors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    {...registerLogin("password")}
                    disabled={isLoading}
                    className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                  />
                  {loginErrors.password && (
                    <p className="text-xs text-red-600">
                      {loginErrors.password.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium mt-2"
                  disabled={isLoading}
                >
                  {isLoading ? "Authenticating..." : "Sign In"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register" className="mt-0 outline-none">
              <form
                onSubmit={handleSubmitSignup(onRegister)}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      placeholder="John"
                      {...registerSignup("firstName")}
                      disabled={isLoading}
                      className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                    />
                    {signupErrors.firstName && (
                      <p className="text-xs text-red-600">
                        {signupErrors.firstName.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      placeholder="Doe"
                      {...registerSignup("lastName")}
                      disabled={isLoading}
                      className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                    />
                    {signupErrors.lastName && (
                      <p className="text-xs text-red-600">
                        {signupErrors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-email">Email</Label>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="user@example.com"
                    {...registerSignup("email")}
                    disabled={isLoading}
                    className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                  />
                  {signupErrors.email && (
                    <p className="text-xs text-red-600">
                      {signupErrors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-password">Password</Label>
                  <Input
                    id="register-password"
                    type="password"
                    placeholder="••••••••"
                    {...registerSignup("password")}
                    disabled={isLoading}
                    className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                  />
                  {signupErrors.password && (
                    <p className="text-xs text-red-600">
                      {signupErrors.password.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium mt-2"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>
              </form>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
