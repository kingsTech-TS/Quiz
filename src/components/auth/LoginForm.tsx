"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Lock, Mail, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { getApiError } from "@/lib/api";

const loginSchema = z.object({
  identifier: z.string().min(1, "Identifier or email is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    try {
      const res = await login({
        identifier: values.identifier,
        password: values.password,
      });

      toast.success("Signed in successfully");

      const user = res.user;
      if (user.role === "admin") {
        router.push("/admin/dashboard");
      } else if (user.role === "quiz_master") {
        router.push("/qm/dashboard");
      } else {
        // Student role
        if (!user.gst_courses || user.gst_courses.length === 0) {
          router.push("/onboarding");
        } else {
          router.push("/dashboard");
        }
      }
    } catch (err: unknown) {
      toast.error(getApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div>
        <label
          htmlFor="identifier"
          className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5"
        >
          Email or Matric Number
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
            <Mail className="w-4 h-4" />
          </div>
          <input
            id="identifier"
            type="text"
            autoComplete="username"
            disabled={isLoading}
            placeholder="e.g. 210102001 or name@institution.edu"
            {...register("identifier")}
            className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-2xl border border-gray-200 bg-gray-50/50 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-100 outline-hidden transition-all"
          />
        </div>
        {errors.identifier && (
          <p className="mt-1.5 text-xs text-red-600 font-medium">
            {errors.identifier.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5"
        >
          Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
            <Lock className="w-4 h-4" />
          </div>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            disabled={isLoading}
            placeholder="••••••••"
            {...register("password")}
            className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-2xl border border-gray-200 bg-gray-50/50 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-100 outline-hidden transition-all"
          />
        </div>
        {errors.password && (
          <p className="mt-1.5 text-xs text-red-600 font-medium">
            {errors.password.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full mt-2 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-gray-950 hover:bg-gray-800 text-white text-sm font-bold shadow-xs transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Signing in...</span>
          </>
        ) : (
          <span>Sign In</span>
        )}
      </button>
    </form>
  );
}
