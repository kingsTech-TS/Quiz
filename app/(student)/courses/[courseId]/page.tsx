"use client";

import React, { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCourse } from "@/hooks/use-courses";
import { PageHeader } from "@/components/shared/PageHeader";
import { ErrorState } from "@/components/shared/ErrorState";
import { Skeleton } from "@/components/shared/LoadingSkeleton";
import { Clock, HelpCircle, ShieldCheck, Play, ArrowLeft } from "lucide-react";

export default function StudentCourseDetailPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = use(params);
  const router = useRouter();
  const { data: course, isLoading, error, refetch } = useCourse(courseId);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-8 w-1/2 rounded-xl" />
        <Skeleton className="h-4 w-1/3 rounded-lg" />
        <div className="bg-white border border-gray-100 rounded-[32px] p-8 space-y-4">
          <Skeleton className="h-6 w-1/4 rounded-lg" />
          <Skeleton className="h-4 w-full rounded-lg" />
          <Skeleton className="h-4 w-full rounded-lg" />
          <Skeleton className="h-10 w-40 rounded-full" />
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <ErrorState
        title="Course Not Found"
        message="The requested academic assessment could not be retrieved from the repository."
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <PageHeader
        title={course.title}
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Courses", href: "/courses" },
          { label: course.gst_code },
        ]}
      />

      <div className="bg-white border border-gray-100 rounded-[32px] p-6 sm:p-10 shadow-xs space-y-8">
        <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-gray-500 pb-6 border-b border-gray-100">
          <span className="px-3.5 py-1.5 rounded-full bg-purple-50 text-purple-700 font-extrabold text-xs tracking-wider uppercase">
            {course.gst_code}
          </span>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-gray-400" />
            <span>
              Duration: <strong className="text-gray-900 font-bold">{course.duration_minutes} minutes</strong>
            </span>
          </div>
          {course.question_count !== undefined && (
            <div className="flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-gray-400" />
              <span>
                Questions: <strong className="text-gray-900 font-bold">{course.question_count} items</strong>
              </span>
            </div>
          )}
        </div>

        <div>
          <h3 className="text-base font-bold text-gray-950 mb-2">Description & Syllabus Scope</h3>
          <p className="text-sm text-gray-500 font-normal leading-relaxed whitespace-pre-wrap">
            {course.description || "Comprehensive past questions examination based on approved university syllabus."}
          </p>
        </div>

        {/* Academic Exam Instructions */}
        <div className="rounded-2xl border border-gray-100 bg-gray-50/70 p-6 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-purple-600" />
            <span>Assessment Protocol & Instructions</span>
          </h4>
          <ul className="text-xs text-gray-500 space-y-2 list-disc list-inside leading-relaxed font-medium">
            <li>The test timer commences immediately once you initiate the session.</li>
            <li>All questions are randomized; answers are submitted directly to the grading server.</li>
            <li>If the timer expires, all answered questions will automatically submit.</li>
            <li>Do not refresh or close your browser tab during active assessment.</li>
          </ul>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            href="/courses"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-950 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Course Catalog</span>
          </Link>

          <button
            type="button"
            onClick={() => router.push(`/quiz/${course.id}`)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-gray-950 hover:bg-gray-800 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Commence Timed Test</span>
          </button>
        </div>
      </div>
    </div>
  );
}
