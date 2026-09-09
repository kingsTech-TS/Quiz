"use client";

import React, { use, useState, useMemo } from "react";
import Link from "next/link";
import { useCourseAttempts, useQuizMasterCourse } from "@/hooks/use-courses";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { StatCard } from "@/components/dashboard/StatCard";
import { TableSkeleton, StatCardSkeleton } from "@/components/shared/LoadingSkeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import {
  Users,
  Award,
  Clock,
  Search,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  FileText,
  Filter,
} from "lucide-react";
import { formatDuration, formatDate } from "@/lib/utils";

export default function CourseAttemptsPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = use(params);
  const { data: course, isLoading: courseLoading } = useQuizMasterCourse(courseId);
  const {
    data: attempts,
    isLoading: attemptsLoading,
    error: attemptsError,
  } = useCourseAttempts(courseId);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterAttempt, setFilterAttempt] = useState<"all" | "first" | "retakes">("all");

  const filteredAttempts = useMemo(() => {
    if (!attempts) return [];
    return attempts.filter((attempt) => {
      const matchesSearch =
        searchQuery.trim() === "" ||
        attempt.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        attempt.matric_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        attempt.department?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFilter =
        filterAttempt === "all" ||
        (filterAttempt === "first" && attempt.is_first_attempt) ||
        (filterAttempt === "retakes" && !attempt.is_first_attempt);

      return matchesSearch && matchesFilter;
    });
  }, [attempts, searchQuery, filterAttempt]);

  // Compute summary stats
  const stats = useMemo(() => {
    if (!attempts || attempts.length === 0) {
      return { totalSubmissions: 0, uniqueStudents: 0, avgPercentage: 0, avgTimeTaken: 0 };
    }
    const totalSubmissions = attempts.length;
    const uniqueStudentIds = new Set(attempts.map((a) => a.user_id));
    const avgPercentage = Math.round(
      attempts.reduce((sum, a) => sum + (a.percentage || 0), 0) / totalSubmissions,
    );
    const avgTimeTaken = Math.round(
      attempts.reduce((sum, a) => sum + (a.time_taken_seconds || 0), 0) / totalSubmissions,
    );
    return {
      totalSubmissions,
      uniqueStudents: uniqueStudentIds.size,
      avgPercentage,
      avgTimeTaken,
    };
  }, [attempts]);

  const isLoading = courseLoading || attemptsLoading;

  return (
    <div className="space-y-8">
      <PageHeader
        title={course ? `${course.gst_code}: Student Attempts` : "Student Attempts"}
        description={
          course
            ? `Review individual student submissions, right/wrong question breakdowns, and completion metrics for ${course.title}.`
            : "Review individual student submissions and test metrics."
        }
        breadcrumbs={[
          { label: "Dashboard", href: "/qm/dashboard" },
          { label: "Courses", href: "/qm/courses" },
          { label: course?.gst_code || "Course", href: `/qm/courses/${courseId}` },
          { label: "Attempts" },
        ]}
        action={
          <Link
            href={`/qm/courses/${courseId}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-all shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Course</span>
          </Link>
        }
      />

      {/* Summary KPI Cards */}
      {isLoading ? (
        <StatsGrid columns={4}>
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </StatsGrid>
      ) : attemptsError ? (
        <ErrorState
          title="Could not load attempts"
          message="An error occurred while fetching student attempts for this course."
        />
      ) : (
        <StatsGrid columns={4}>
          <StatCard
            label="Total Attempts"
            value={stats.totalSubmissions}
            icon={FileText}
            subtext="All exam submissions"
          />
          <StatCard
            label="Unique Students"
            value={stats.uniqueStudents}
            icon={Users}
            subtext="Distinct candidate profiles"
          />
          <StatCard
            label="Average Score"
            value={`${stats.avgPercentage}%`}
            icon={Award}
            subtext="Overall performance"
          />
          <StatCard
            label="Avg. Time Taken"
            value={formatDuration(stats.avgTimeTaken)}
            icon={Clock}
            subtext="Per completed attempt"
          />
        </StatsGrid>
      )}

      {/* Attempts Table Card */}
      <div className="bg-white border border-gray-100 rounded-[28px] shadow-xs overflow-hidden">
        {/* Header & Filter Controls */}
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-extrabold text-gray-950">Submissions Log</h3>
            <p className="text-xs text-gray-400 font-medium mt-0.5">
              Click any attempt to inspect question-by-question responses
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search student or matric..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-64 pl-10 pr-4 py-2 text-xs rounded-full border border-gray-200/80 bg-gray-50/50 text-gray-900 font-medium focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
              />
            </div>

            {/* Filter Pill Tabs */}
            <div className="flex items-center p-1 bg-gray-100/80 rounded-full text-xs font-semibold text-gray-600">
              <button
                type="button"
                onClick={() => setFilterAttempt("all")}
                className={`px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                  filterAttempt === "all"
                    ? "bg-white text-purple-700 shadow-2xs font-bold"
                    : "hover:text-gray-900"
                }`}
              >
                All ({attempts?.length ?? 0})
              </button>
              <button
                type="button"
                onClick={() => setFilterAttempt("first")}
                className={`px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                  filterAttempt === "first"
                    ? "bg-white text-purple-700 shadow-2xs font-bold"
                    : "hover:text-gray-900"
                }`}
              >
                1st Attempts
              </button>
              <button
                type="button"
                onClick={() => setFilterAttempt("retakes")}
                className={`px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                  filterAttempt === "retakes"
                    ? "bg-white text-purple-700 shadow-2xs font-bold"
                    : "hover:text-gray-900"
                }`}
              >
                Retakes
              </button>
            </div>
          </div>
        </div>

        {/* Table Content */}
        {isLoading ? (
          <TableSkeleton rows={6} cols={6} />
        ) : !attempts || attempts.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No Attempts Yet"
            description="No students have submitted an attempt for this course assessment yet."
          />
        ) : filteredAttempts.length === 0 ? (
          <EmptyState
            icon={Search}
            title="No Matching Submissions"
            description="Try changing your search keywords or filter options."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-gray-50/70 border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-4 px-6">#</th>
                  <th className="py-4 px-6">Student</th>
                  <th className="py-4 px-6">Attempt</th>
                  <th className="py-4 px-6">Score</th>
                  <th className="py-4 px-6">Answers Breakdown</th>
                  <th className="py-4 px-6">Time Taken</th>
                  <th className="py-4 px-6">Submitted</th>
                  <th className="py-4 px-6 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-900">
                {filteredAttempts.map((attempt, index) => (
                  <tr
                    key={attempt.id || index}
                    className="hover:bg-purple-50/30 transition-colors group cursor-pointer"
                  >
                    <td className="py-4 px-6 text-xs text-gray-400 font-mono">
                      {index + 1}
                    </td>

                    {/* Student Info */}
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="font-extrabold text-gray-950 text-sm">
                          {attempt.full_name}
                        </span>
                        <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-400 font-medium">
                          {attempt.matric_number && (
                            <span className="font-mono">{attempt.matric_number}</span>
                          )}
                          {attempt.level && (
                            <>
                              <span>•</span>
                              <span>{attempt.level}L</span>
                            </>
                          )}
                          {attempt.department && (
                            <>
                              <span>•</span>
                              <span className="truncate max-w-[140px]">
                                {attempt.department}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Attempt Badge */}
                    <td className="py-4 px-6">
                      {attempt.is_first_attempt ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                          1st Attempt
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200/60">
                          Attempt #{attempt.attempt_number}
                        </span>
                      )}
                    </td>

                    {/* Score & % */}
                    <td className="py-4 px-6">
                      <div className="flex items-baseline gap-2">
                        <span className="font-black text-sm text-gray-950">
                          {attempt.score}/{attempt.total}
                        </span>
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                            attempt.percentage >= 70
                              ? "bg-emerald-50 text-emerald-700"
                              : attempt.percentage >= 50
                              ? "bg-amber-50 text-amber-700"
                              : "bg-red-50 text-red-700"
                          }`}
                        >
                          {Math.round(attempt.percentage)}%
                        </span>
                      </div>
                    </td>

                    {/* Right / Wrong Counts */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3 text-xs font-semibold">
                        <span className="inline-flex items-center gap-1 text-emerald-600">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {attempt.correct}
                        </span>
                        <span className="inline-flex items-center gap-1 text-rose-600">
                          <XCircle className="w-3.5 h-3.5" />
                          {attempt.incorrect}
                        </span>
                        {attempt.unanswered > 0 && (
                          <span className="text-gray-400">
                            {attempt.unanswered} skipped
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Time Taken */}
                    <td className="py-4 px-6 font-mono text-xs text-gray-500 font-medium">
                      {formatDuration(attempt.time_taken_seconds)}
                    </td>

                    {/* Submitted At */}
                    <td className="py-4 px-6 text-xs text-gray-400 font-medium">
                      {attempt.submitted_at ? formatDate(attempt.submitted_at) : "—"}
                    </td>

                    {/* View Details Action */}
                    <td className="py-4 px-6 text-right">
                      <Link
                        href={`/qm/attempts/${attempt.id}`}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-purple-700 bg-purple-50 group-hover:bg-purple-600 group-hover:text-white rounded-full transition-all shadow-2xs cursor-pointer"
                      >
                        <span>Inspect</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
