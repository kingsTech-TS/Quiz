"use client";

import React from "react";
import Link from "next/link";
import {
  BookOpen,
  CheckCircle,
  AlertTriangle,
  FileQuestion,
  Plus,
  ArrowRight,
  UploadCloud,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useQuizMasterCourses } from "@/hooks/use-courses";
import { WelcomeHeader } from "@/components/dashboard/WelcomeHeader";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { StatCard } from "@/components/dashboard/StatCard";
import { CourseStatusBadge } from "@/components/courses/CourseStatusBadge";
import { StatCardSkeleton, CardSkeleton } from "@/components/shared/LoadingSkeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";

export default function QuizMasterDashboardPage() {
  const { user } = useAuth();
  const { data: courses, isLoading, error, refetch } = useQuizMasterCourses();

  const totalCourses = courses?.length || 0;
  const publishedCount = courses?.filter((c) => c.status === "published").length || 0;
  const reviewCount = courses?.filter((c) => c.status === "review" || c.status === "draft").length || 0;
  const totalQuestions =
    courses?.reduce((acc, c) => acc + (c.question_count || 0), 0) || 0;

  return (
    <div className="space-y-6">
      <WelcomeHeader
        user={user}
        subtitle="Manage your past question papers, upload syllabi documents, verify AI-extracted keys, and publish exams."
        action={
          <Link
            href="/qm/courses/create"
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold rounded-2xl bg-gray-950 text-white hover:bg-gray-800 transition-all shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Course</span>
          </Link>
        }
      />

      {isLoading ? (
        <StatsGrid columns={4}>
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </StatsGrid>
      ) : (
        <StatsGrid columns={4}>
          <StatCard
            label="Total Courses"
            value={totalCourses}
            icon={BookOpen}
            subtext="Assigned courses"
          />
          <StatCard
            label="Published"
            value={publishedCount}
            icon={CheckCircle}
            subtext="Available to students"
          />
          <StatCard
            label="Draft / Review"
            value={reviewCount}
            icon={AlertTriangle}
            subtext="Awaiting verification"
          />
          <StatCard
            label="Questions Bank"
            value={totalQuestions}
            icon={FileQuestion}
            subtext="Total items indexed"
          />
        </StatsGrid>
      )}

      {/* Courses Overview */}
      <div className="bg-white border border-gray-100 rounded-[28px] p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-gray-950 tracking-tight">Assigned Course Banks</h2>
            <p className="text-xs text-gray-400 font-medium mt-0.5">
              Review and publish past question sets for student assessment
            </p>
          </div>
          <Link
            href="/qm/courses"
            className="text-xs font-bold text-purple-600 hover:text-purple-700 hover:underline"
          >
            View all courses
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : error ? (
          <ErrorState
            title="Failed to load instructor courses"
            message="Error communicating with the course repository."
            onRetry={() => refetch()}
          />
        ) : !courses || courses.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="No Course Banks Created"
            description="You have not created any course past question banks yet. Start by adding a new course."
            action={
              <Link
                href="/qm/courses/create"
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-2xl bg-gray-950 text-white hover:bg-gray-800"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Your First Course</span>
              </Link>
            }
          />
        ) : (
          <div className="divide-y divide-gray-100">
            {courses.slice(0, 5).map((course) => (
              <div
                key={course.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs bg-purple-50 text-purple-700 px-3 py-1 rounded-full uppercase tracking-wide">
                      {course.gst_code}
                    </span>
                    <CourseStatusBadge status={course.status} />
                  </div>
                  <h3 className="font-bold text-sm text-gray-950">{course.title}</h3>
                  <div className="flex items-center gap-3 text-xs text-gray-400 font-medium">
                    <span>{course.duration_minutes} mins</span>
                    <span>•</span>
                    <span>{course.question_count || 0} questions</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/qm/courses/${course.id}/upload`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>Upload Doc</span>
                  </Link>

                  <Link
                    href={`/qm/courses/${course.id}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-gray-950 text-white hover:bg-gray-800 transition-colors"
                  >
                    <span>Manage</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
