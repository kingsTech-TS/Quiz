"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, Mail, User, Lock } from "lucide-react";
import { authService } from "@/services/auth.service";
import { getApiError } from "@/lib/api";

const quizMasterRegisterSchema = z
  .object({
    full_name: z.string().min(1, "Full name is required"),
    email: z.string().email("Valid institutional email is required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirm_password: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

type QuizMasterRegisterValues = z.infer<typeof quizMasterRegisterSchema>;

export function QuizMasterRegisterForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<QuizMasterRegisterValues>({
    resolver: zodResolver(quizMasterRegisterSchema),
    defaultValues: {
      full_name: "",
      email: "",
      password: "",
      confirm_password: "",
    },
  });

  const onSubmit = async (values: QuizMasterRegisterValues) => {
    setIsLoading(true);
    try {
      await authService.registerQuizMaster(values);
      toast.success(
        "Quiz Master account created successfully. Please sign in."
      );
      router.push("/login");
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
          htmlFor="full_name"
          className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5"
        >
          Full Name / Title
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
            <User className="w-4 h-4" />
          </div>
          <input
            id="full_name"
            type="text"
            disabled={isLoading}
            placeholder="Dr. Jane Doe"
            {...register("full_name")}
            className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-2xl border border-gray-200 bg-gray-50/50 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-100 outline-hidden transition-all"
          />
        </div>
        {errors.full_name && (
          <p className="mt-1.5 text-xs text-red-600 font-medium">
            {errors.full_name.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5"
        >
          Institutional Email
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
            <Mail className="w-4 h-4" />
          </div>
          <input
            id="email"
            type="email"
            disabled={isLoading}
            placeholder="instructor@university.edu"
            {...register("email")}
            className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-2xl border border-gray-200 bg-gray-50/50 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-100 outline-hidden transition-all"
          />
        </div>
        {errors.email && (
          <p className="mt-1.5 text-xs text-red-600 font-medium">
            {errors.email.message}
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
            disabled={isLoading}
            placeholder="Min. 8 characters"
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

      <div>
        <label
          htmlFor="confirm_password"
          className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5"
        >
          Confirm Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
            <Lock className="w-4 h-4" />
          </div>
          <input
            id="confirm_password"
            type="password"
            disabled={isLoading}
            placeholder="Re-enter password"
            {...register("confirm_password")}
            className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-2xl border border-gray-200 bg-gray-50/50 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-100 outline-hidden transition-all"
          />
        </div>
        {errors.confirm_password && (
          <p className="mt-1.5 text-xs text-red-600 font-medium">
            {errors.confirm_password.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full mt-3 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-gray-950 hover:bg-gray-800 text-white text-sm font-bold shadow-xs transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Registering Quiz Master...</span>
          </>
        ) : (
          <span>Create Instructor Account</span>
        )}
      </button>
    </form>
  );
}
