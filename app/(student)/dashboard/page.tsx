"use client";

import React from "react";
import Link from "next/link";
import {
  BookOpen,
  Award,
  CheckCircle,
  FileCheck2,
  ChevronRight,
  Bookmark,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useCourses } from "@/hooks/use-courses";
import { useQuizHistory } from "@/hooks/use-quiz";
import { WelcomeHeader } from "@/components/dashboard/WelcomeHeader";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { StatCard } from "@/components/dashboard/StatCard";
import { RecentAttempts } from "@/components/dashboard/RecentAttempts";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { StatCardSkeleton, CardSkeleton } from "@/components/shared/LoadingSkeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";

const COURSE_AVATAR_BG = [
  "bg-[#D1FAE5] text-[#059669]", // Emerald
  "bg-[#EDE9FE] text-[#7C3AED]", // Purple
  "bg-[#FEF3C7] text-[#D97706]", // Amber
  "bg-[#FEE2E2] text-[#DC2626]", // Rose
  "bg-[#DBEAFE] text-[#2563EB]", // Blue
];

export default function StudentDashboardPage() {
  const { user } = useAuth();
  const { data: courses, isLoading: coursesLoading, error: coursesError, refetch: refetchCourses } = useCourses();
  const { data: history, isLoading: historyLoading } = useQuizHistory();

  const totalAttempts = history?.length || 0;
  const averageScore =
    totalAttempts > 0
      ? Math.round(
          history!.reduce((acc, curr) => acc + curr.percentage, 0) /
            totalAttempts
        )
      : 0;

  const enrolledGstCount = user?.gst_courses?.length || 0;
  const availableCoursesCount = courses?.length || 0;

  return (
    <div className="space-y-8">
      {/* Overview & Hero Section */}
      <WelcomeHeader user={user} />

      {/* Statistics Grid */}
      {coursesLoading || historyLoading ? (
        <StatsGrid columns={4}>
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </StatsGrid>
      ) : (
        <StatsGrid columns={4}>
          <StatCard
            label="Enrolled GSTs"
            value={enrolledGstCount}
            icon={BookOpen}
            subtext={
              user?.gst_courses && user.gst_courses.length > 0
                ? user.gst_courses.join(", ")
                : "None selected"
            }
          />
          <StatCard
            label="Available Courses"
            value={availableCoursesCount}
            icon={FileCheck2}
            subtext="Approved past exam sets"
          />
          <StatCard
            label="Total Attempts"
            value={totalAttempts}
            icon={CheckCircle}
            subtext="Completed assessments"
          />
          <StatCard
            label="Average Score"
            value={totalAttempts > 0 ? `${averageScore}%` : "—"}
            icon={Award}
            subtext={
              totalAttempts > 0
                ? "Across all submissions"
                : "Take a test to calculate"
            }
          />
        </StatsGrid>
      )}

      {/* Featured Courses Section matching reference layout */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-gray-950 tracking-tight">
            Featured Courses
          </h2>
          <Link
            href="/courses"
            className="text-xs font-bold text-purple-600 hover:text-purple-700 hover:underline inline-flex items-center gap-1"
          >
            <span>View all</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {coursesLoading ? (
          <div className="space-y-3">
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : coursesError ? (
          <ErrorState
            title="Unable to load courses"
            message="Failed to fetch your enrolled course list from the server."
            onRetry={() => refetchCourses()}
          />
        ) : !courses || courses.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="No courses available yet"
            description="Courses matching your selected GSTs are currently being compiled or reviewed by faculty."
            action={
              <Link
                href="/onboarding"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-2xl bg-gray-950 text-white hover:bg-gray-800"
              >
                Manage Registered GSTs
              </Link>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            {/* Table Header */}
            <div className="min-w-[640px] grid grid-cols-12 px-4 py-2 text-xs font-bold text-gray-400 select-none">
              <span className="col-span-5">Course name</span>
              <span className="col-span-2 text-center">Start</span>
              <span className="col-span-2 text-center">Rate</span>
              <span className="col-span-2 text-center">Type</span>
              <span className="col-span-1 text-right">Save</span>
            </div>

            {/* Courses Rows */}
            <div className="min-w-[640px] space-y-2">
              {courses.map((course, idx) => {
                const avatarBg =
                  COURSE_AVATAR_BG[idx % COURSE_AVATAR_BG.length];
                const mockDate = `Feb ${12 + (idx * 2)}`;
                const mockRate = (4.8 - (idx * 0.1)).toFixed(1);

                return (
                  <div
                    key={course.id}
                    className="grid grid-cols-12 items-center px-4 py-3.5 rounded-2xl hover:bg-gray-50/70 transition-colors group"
                  >
                    {/* Course Name & Thumbnail */}
                    <div className="col-span-5 flex items-center gap-3.5 min-w-0">
                      <div
                        className={`w-11 h-11 rounded-2xl ${avatarBg} flex items-center justify-center font-black text-sm shrink-0 shadow-2xs group-hover:scale-105 transition-transform`}
                      >
                        {course.gst_code.slice(0, 3)}
                      </div>
                      <div className="min-w-0">
                        <Link
                          href={`/courses/${course.id}`}
                          className="font-bold text-gray-950 hover:text-purple-600 transition-colors block truncate text-sm"
                        >
                          {course.title}
                        </Link>
                        <p className="text-xs text-gray-400 font-medium truncate mt-0.5">
                          {course.description || "University Faculty Curriculum"}
                        </p>
                      </div>
                    </div>

                    {/* Start Date */}
                    <div className="col-span-2 text-center text-xs font-bold text-gray-900">
                      {mockDate}
                    </div>

                    {/* Rating */}
                    <div className="col-span-2 text-center text-xs font-extrabold text-purple-600">
                      {mockRate}
                    </div>

                    {/* Type Badge */}
                    <div className="col-span-2 text-center">
                      <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 uppercase tracking-wide">
                        {course.gst_code || "UI DESIGN"}
                      </span>
                    </div>

                    {/* Save Bookmark */}
                    <div className="col-span-1 text-right">
                      <button
                        type="button"
                        className="p-1.5 text-gray-300 hover:text-purple-600 transition-colors rounded-lg cursor-pointer"
                        aria-label="Save course"
                      >
                        <Bookmark className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Secondary Bottom Grid: Recent Attempts & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
        <RecentAttempts attempts={history || []} isLoading={historyLoading} />
        <QuickActions />
      </div>
    </div>
  );
}
