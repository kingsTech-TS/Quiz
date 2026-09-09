"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, Plus } from "lucide-react";
import { courseService } from "@/services/course.service";
import { getApiError } from "@/lib/api";
import { GST_COURSES, QUERY_KEYS } from "@/lib/constants";

const createCourseSchema = z.object({
  title: z.string().min(1, "Course title is required"),
  description: z.string().min(1, "Course description is required"),
  gst_code: z.string().min(1, "Please select a GST course"),
  duration_minutes: z
    .number()
    .int("Must be an integer")
    .positive("Duration must be greater than 0 minutes"),
});

type CreateCourseValues = z.infer<typeof createCourseSchema>;

export function CreateCourseForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateCourseValues>({
    resolver: zodResolver(createCourseSchema),
    defaultValues: {
      title: "",
      description: "",
      gst_code: GST_COURSES[0].code,
      duration_minutes: 30,
    },
  });

  const onSubmit = async (values: CreateCourseValues) => {
    setIsLoading(true);
    try {
      const course = await courseService.createCourse({
        title: values.title,
        description: values.description,
        gst_code: values.gst_code,
        duration_minutes: Number(values.duration_minutes),
      });

      // Invalidate the courses list cache so the real server-assigned ID is
      // used immediately — prevents stale placeholder IDs causing 404s on upload.
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.qmCourses });

      toast.success("Course created successfully");
      router.push(`/qm/courses/${course.id}`);
    } catch (err: unknown) {
      toast.error(getApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white border border-gray-100 rounded-[32px] p-8 sm:p-10 shadow-xs max-w-2xl space-y-6"
      noValidate
    >
      <div>
        <label
          htmlFor="title"
          className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-2"
        >
          Course Title
        </label>
        <input
          id="title"
          type="text"
          disabled={isLoading}
          placeholder="e.g. GST 112: Philosophy and Human Existence (2023/2024 Exam)"
          {...register("title")}
          className="w-full px-4 py-3 text-sm rounded-2xl border border-gray-200/80 bg-gray-50/50 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
        />
        {errors.title && (
          <p className="mt-1.5 text-xs text-red-600 font-semibold">
            {errors.title.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label
            htmlFor="gst_code"
            className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-2"
          >
            GST Course Tag
          </label>
          <select
            id="gst_code"
            disabled={isLoading}
            {...register("gst_code")}
            className="w-full px-4 py-3 text-sm rounded-2xl border border-gray-200/80 bg-gray-50/50 text-gray-900 font-semibold focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all cursor-pointer"
          >
            {GST_COURSES.map((g) => (
              <option key={g.code} value={g.code}>
                {g.label}
              </option>
            ))}
          </select>
          {errors.gst_code && (
            <p className="mt-1.5 text-xs text-red-600 font-semibold">
              {errors.gst_code.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="duration_minutes"
            className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-2"
          >
            Test Duration (Minutes)
          </label>
          <input
            id="duration_minutes"
            type="number"
            disabled={isLoading}
            {...register("duration_minutes", { valueAsNumber: true })}
            className="w-full px-4 py-3 text-sm rounded-2xl border border-gray-200/80 bg-gray-50/50 text-gray-900 font-bold focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
          />
          {errors.duration_minutes && (
            <p className="mt-1.5 text-xs text-red-600 font-semibold">
              {errors.duration_minutes.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-2"
        >
          Description & Syllabus Scope
        </label>
        <textarea
          id="description"
          rows={4}
          disabled={isLoading}
          placeholder="Detailed syllabus scope, lecture modules, and past question year..."
          {...register("description")}
          className="w-full px-4 py-3 text-sm rounded-2xl border border-gray-200/80 bg-gray-50/50 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
        />
        {errors.description && (
          <p className="mt-1.5 text-xs text-red-600 font-semibold">
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="pt-4 border-t border-gray-100 flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-8 py-3.5 text-xs font-bold rounded-full bg-gray-950 hover:bg-gray-800 text-white shadow-xs transition-all disabled:opacity-60 cursor-pointer"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Creating Course...</span>
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              <span>Create Course & Proceed</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
