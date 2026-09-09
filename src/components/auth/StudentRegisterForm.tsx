"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { authService } from "@/services/auth.service";
import { getApiError } from "@/lib/api";
import { STUDENT_LEVELS } from "@/lib/constants";

const studentRegisterSchema = z
  .object({
    full_name: z.string().min(1, "Full name is required"),
    matric_number: z
      .string()
      .regex(/^\d{9}$/, "Matriculation number must be exactly 9 digits"),
    level: z.string().min(1, "Academic level is required"),
    faculty: z.string().min(1, "Faculty is required"),
    department: z.string().min(1, "Department is required"),
    phone: z.string().min(1, "Phone number is required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirm_password: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

type StudentRegisterValues = z.infer<typeof studentRegisterSchema>;

export function StudentRegisterForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StudentRegisterValues>({
    resolver: zodResolver(studentRegisterSchema),
    defaultValues: {
      full_name: "",
      matric_number: "",
      level: STUDENT_LEVELS[0],
      faculty: "",
      department: "",
      phone: "",
      password: "",
      confirm_password: "",
    },
  });

  const onSubmit = async (values: StudentRegisterValues) => {
    setIsLoading(true);
    try {
      await authService.registerUser({
        ...values,
        phone_number: values.phone,
      });
      toast.success("Account registered successfully. Please sign in.");
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
          Full Name
        </label>
        <input
          id="full_name"
          type="text"
          disabled={isLoading}
          placeholder="e.g. Chukwuemeka Adebayo"
          {...register("full_name")}
          className="w-full px-3.5 py-2.5 text-sm rounded-2xl border border-gray-200 bg-gray-50/50 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-100 outline-hidden transition-all"
        />
        {errors.full_name && (
          <p className="mt-1.5 text-xs text-red-600 font-medium">
            {errors.full_name.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="matric_number"
            className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5"
          >
            Matric Number (9 digits)
          </label>
          <input
            id="matric_number"
            type="text"
            maxLength={9}
            disabled={isLoading}
            placeholder="210102001"
            {...register("matric_number")}
            className="w-full px-3.5 py-2.5 text-sm rounded-2xl border border-gray-200 bg-gray-50/50 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-100 outline-hidden transition-all"
          />
          {errors.matric_number && (
            <p className="mt-1.5 text-xs text-red-600 font-medium">
              {errors.matric_number.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="level"
            className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5"
          >
            Level
          </label>
          <select
            id="level"
            disabled={isLoading}
            {...register("level")}
            className="w-full px-3.5 py-2.5 text-sm rounded-2xl border border-gray-200 bg-gray-50/50 text-gray-900 focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-100 outline-hidden transition-all"
          >
            {STUDENT_LEVELS.map((lvl) => (
              <option key={lvl} value={lvl}>
                {lvl}
              </option>
            ))}
          </select>
          {errors.level && (
            <p className="mt-1.5 text-xs text-red-600 font-medium">
              {errors.level.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="faculty"
            className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5"
          >
            Faculty
          </label>
          <input
            id="faculty"
            type="text"
            disabled={isLoading}
            placeholder="e.g. Science"
            {...register("faculty")}
            className="w-full px-3.5 py-2.5 text-sm rounded-2xl border border-gray-200 bg-gray-50/50 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-100 outline-hidden transition-all"
          />
          {errors.faculty && (
            <p className="mt-1.5 text-xs text-red-600 font-medium">
              {errors.faculty.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="department"
            className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5"
          >
            Department
          </label>
          <input
            id="department"
            type="text"
            disabled={isLoading}
            placeholder="e.g. Computer Science"
            {...register("department")}
            className="w-full px-3.5 py-2.5 text-sm rounded-2xl border border-gray-200 bg-gray-50/50 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-100 outline-hidden transition-all"
          />
          {errors.department && (
            <p className="mt-1.5 text-xs text-red-600 font-medium">
              {errors.department.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="phone"
          className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5"
        >
          Phone Number
        </label>
        <input
          id="phone"
          type="tel"
          disabled={isLoading}
          placeholder="08012345678"
          {...register("phone")}
          className="w-full px-3.5 py-2.5 text-sm rounded-2xl border border-gray-200 bg-gray-50/50 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-100 outline-hidden transition-all"
        />
        {errors.phone && (
          <p className="mt-1.5 text-xs text-red-600 font-medium">
            {errors.phone.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="password"
            className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            disabled={isLoading}
            placeholder="Min. 8 characters"
            {...register("password")}
            className="w-full px-3.5 py-2.5 text-sm rounded-2xl border border-gray-200 bg-gray-50/50 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-100 outline-hidden transition-all"
          />
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
          <input
            id="confirm_password"
            type="password"
            disabled={isLoading}
            placeholder="Re-enter password"
            {...register("confirm_password")}
            className="w-full px-3.5 py-2.5 text-sm rounded-2xl border border-gray-200 bg-gray-50/50 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-100 outline-hidden transition-all"
          />
          {errors.confirm_password && (
            <p className="mt-1.5 text-xs text-red-600 font-medium">
              {errors.confirm_password.message}
            </p>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full mt-3 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-gray-950 hover:bg-gray-800 text-white text-sm font-bold shadow-xs transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Creating account...</span>
          </>
        ) : (
          <span>Complete Student Registration</span>
        )}
      </button>
    </form>
  );
}
