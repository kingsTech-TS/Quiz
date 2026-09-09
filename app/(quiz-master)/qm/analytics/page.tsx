"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  useQuizMasterCourses,
  useCourseAnalytics,
  useCourseLeaderboard,
  useTopStudents,
} from "@/hooks/use-courses";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { StatCard } from "@/components/dashboard/StatCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { StatCardSkeleton, TableSkeleton } from "@/components/shared/LoadingSkeleton";
import { ErrorState } from "@/components/shared/ErrorState";
import {
  BarChart3,
  Users,
  Award,
  Percent,
  Trophy,
  FileText,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { formatDuration, formatDate } from "@/lib/utils";

export default function QuizMasterAnalyticsPage() {
  const { data: courses, isLoading: coursesLoading } = useQuizMasterCourses();
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");

  const activeCourseId = selectedCourseId || (courses && courses[0]?.id) || "";

  const {
    data: analytics,
    isLoading: analyticsLoading,
    error: analyticsError,
  } = useCourseAnalytics(activeCourseId);

  const {
    data: leaderboard,
    isLoading: leaderboardLoading,
  } = useCourseLeaderboard(activeCourseId);

  const {
    data: topStudents,
    isLoading: topStudentsLoading,
  } = useTopStudents(10);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Assessment Analytics & Leaderboard"
        description="Monitor student engagement, average pass rates, and exam score distributions."
        breadcrumbs={[
          { label: "Dashboard", href: "/qm/dashboard" },
          { label: "Analytics" },
        ]}
      />

      {/* Course Selector & Quick Submissions Link */}
      {courses && courses.length > 0 && (
        <div className="bg-white border border-gray-100 rounded-[28px] p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto">
            <label
              htmlFor="course-select"
              className="text-xs font-bold uppercase tracking-wider text-gray-400 shrink-0"
            >
              Select Assessment:
            </label>
            <select
              id="course-select"
              value={activeCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="px-4 py-3 text-sm rounded-2xl border border-gray-200/80 bg-gray-50/50 text-gray-900 font-semibold focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all sm:w-80 cursor-pointer"
            >
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.gst_code}: {c.title}
                </option>
              ))}
            </select>
          </div>

          {activeCourseId && (
            <Link
              href={`/qm/courses/${activeCourseId}/attempts`}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-600 hover:text-white rounded-full transition-all shadow-2xs self-start sm:self-auto cursor-pointer group"
            >
              <FileText className="w-4 h-4 text-purple-600 group-hover:text-white" />
              <span>Inspect Student Attempts</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          )}
        </div>
      )}

      {coursesLoading || analyticsLoading ? (
        <StatsGrid columns={4}>
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </StatsGrid>
      ) : analyticsError ? (
        <ErrorState
          title="Could not load analytics"
          message="Analytics data for this course could not be retrieved from the server."
        />
      ) : !analytics ? (
        <EmptyState
          icon={BarChart3}
          title="No Analytics Available"
          description="Select a course or wait for students to complete submissions."
        />
      ) : (
        <StatsGrid columns={4}>
          <StatCard
            label="Total Participants"
            value={analytics.total_participants}
            icon={Users}
            subtext={`${analytics.total_attempts ?? 0} total attempts`}
          />
          <StatCard
            label="Average Score"
            value={`${analytics.average_score}%`}
            icon={Award}
            subtext="Mean pass rate across takers"
          />
          <StatCard
            label="Highest Score"
            value={`${analytics.highest_score}`}
            icon={Percent}
            subtext={`Out of ${analytics.total_questions ?? "?"} questions`}
          />
          <StatCard
            label="Lowest Score"
            value={`${analytics.lowest_score ?? 0}`}
            icon={BarChart3}
            subtext={`Out of ${analytics.total_questions ?? "?"} questions`}
          />
        </StatsGrid>
      )}

      {/* Course Specific Student Leaderboard */}
      <div className="bg-white border border-gray-100 rounded-[28px] shadow-xs overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-white flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-2xs">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-gray-950">Course Rankings</h3>
              <p className="text-xs text-gray-400 font-medium">
                Top student performances for this selected assessment
              </p>
            </div>
          </div>

          {activeCourseId && (
            <Link
              href={`/qm/courses/${activeCourseId}/attempts`}
              className="text-xs font-bold text-purple-600 hover:text-purple-700 hover:underline hidden sm:inline-flex items-center gap-1"
            >
              <span>View all attempts</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {leaderboardLoading ? (
          <TableSkeleton rows={5} cols={5} />
        ) : !leaderboard || leaderboard.length === 0 ? (
          <EmptyState
            icon={Trophy}
            title="No Submissions Recorded"
            description="Once students begin taking this assessment, top scores will rank here."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-gray-50/70 border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-4 px-6">Rank</th>
                  <th className="py-4 px-6">Student Name</th>
                  <th className="py-4 px-6">Matric No.</th>
                  <th className="py-4 px-6">Score</th>
                  <th className="py-4 px-6">Percentage</th>
                  <th className="py-4 px-6">Time Taken</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-900">
                {leaderboard.map((entry, idx) => (
                  <tr key={entry.rank || idx} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-4 px-6 font-black text-purple-600">
                      #{entry.rank || idx + 1}
                    </td>
                    <td className="py-4 px-6 font-bold text-gray-950">
                      {entry.student_name}
                    </td>
                    <td className="py-4 px-6 font-mono text-gray-500 font-medium">
                      {entry.matric_number || "—"}
                    </td>
                    <td className="py-4 px-6 font-bold text-gray-950">{entry.score}</td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-3 py-1 rounded-full font-bold text-xs ${
                          entry.percentage >= 70
                            ? "bg-emerald-50 text-emerald-700"
                            : entry.percentage >= 50
                            ? "bg-amber-50 text-amber-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {Math.round(entry.percentage)}%
                      </span>
                    </td>
                    <td className="py-4 px-6 font-mono text-gray-400 text-xs font-medium">
                      {entry.time_taken !== undefined ? formatDuration(entry.time_taken) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Feature 2: Overall Top-10 Students Leaderboard across ALL assessments (First attempts only) */}
      <div className="bg-white border border-gray-100 rounded-[28px] shadow-xs overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-white flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shadow-2xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-gray-950">
                Overall Top 10 Students (Cross-Assessment)
              </h3>
              <p className="text-xs text-gray-400 font-medium">
                Highest ranked candidate performances across all courses (1st attempts only)
              </p>
            </div>
          </div>
        </div>

        {topStudentsLoading ? (
          <TableSkeleton rows={5} cols={5} />
        ) : !topStudents || topStudents.length === 0 ? (
          <EmptyState
            icon={Sparkles}
            title="No Overall Rankings Yet"
            description="Overall leaderboard will populate as students complete their first attempts."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-gray-50/70 border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-4 px-6">Overall Rank</th>
                  <th className="py-4 px-6">Candidate Name</th>
                  <th className="py-4 px-6">Matric No.</th>
                  <th className="py-4 px-6">Score</th>
                  <th className="py-4 px-6">Percentage</th>
                  <th className="py-4 px-6">Date Submitted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-900">
                {topStudents.map((entry, idx) => (
                  <tr key={entry.rank || idx} className="hover:bg-purple-50/20 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-7 h-7 rounded-xl font-black text-xs flex items-center justify-center ${
                            idx === 0
                              ? "bg-amber-100 text-amber-800 shadow-2xs"
                              : idx === 1
                              ? "bg-slate-200 text-slate-800"
                              : idx === 2
                              ? "bg-orange-100 text-orange-800"
                              : "bg-purple-50 text-purple-700"
                          }`}
                        >
                          {entry.rank || idx + 1}
                        </span>
                        {idx === 0 && <span className="text-xs">👑</span>}
                      </div>
                    </td>
                    <td className="py-4 px-6 font-bold text-gray-950">
                      {entry.student_name}
                    </td>
                    <td className="py-4 px-6 font-mono text-gray-500 font-medium">
                      {entry.matric_number || "—"}
                    </td>
                    <td className="py-4 px-6 font-bold text-gray-950">{entry.score}</td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-3 py-1 rounded-full font-bold text-xs ${
                          entry.percentage >= 70
                            ? "bg-emerald-50 text-emerald-700"
                            : entry.percentage >= 50
                            ? "bg-amber-50 text-amber-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {Math.round(entry.percentage)}%
                      </span>
                    </td>
                    <td className="py-4 px-6 text-xs text-gray-400 font-medium">
                      {entry.submitted_at ? formatDate(entry.submitted_at) : "—"}
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
