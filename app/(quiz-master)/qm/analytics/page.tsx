"use client";

import React, { useState } from "react";
import { useQuizMasterCourses, useCourseAnalytics, useCourseLeaderboard } from "@/hooks/use-courses";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { StatCard } from "@/components/dashboard/StatCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { StatCardSkeleton, TableSkeleton } from "@/components/shared/LoadingSkeleton";
import { ErrorState } from "@/components/shared/ErrorState";
import { BarChart3, Users, Award, Percent, Trophy } from "lucide-react";
import { formatDuration } from "@/lib/utils";

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

      {/* Course Selector */}
      {courses && courses.length > 0 && (
        <div className="bg-white border border-gray-100 rounded-[28px] p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <label
            htmlFor="course-select"
            className="text-xs font-bold uppercase tracking-wider text-gray-400"
          >
            Select Course Assessment:
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
      )}

      {coursesLoading || analyticsLoading ? (
        <StatsGrid columns={3}>
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
        <StatsGrid columns={3}>
          <StatCard
            label="Total Participants"
            value={analytics.total_participants}
            icon={Users}
            subtext="Enrolled student attempts"
          />
          <StatCard
            label="Average Score"
            value={`${Math.round(analytics.average_score)}%`}
            icon={Award}
            subtext="Across all test takers"
          />
          <StatCard
            label="Highest Score"
            value={`${Math.round(analytics.highest_score)}%`}
            icon={Percent}
            subtext="Top examination score"
          />
        </StatsGrid>
      )}

      {/* Student Leaderboard */}
      <div className="bg-white border border-gray-100 rounded-[28px] shadow-xs overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-white flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-2xs">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-gray-950">Top Student Performances</h3>
            <p className="text-xs text-gray-400 font-medium">Rankings and scores for this course</p>
          </div>
        </div>

        {leaderboardLoading ? (
          <TableSkeleton rows={5} cols={4} />
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
                    <td className="py-4 px-6 font-black text-purple-600">#{entry.rank || idx + 1}</td>
                    <td className="py-4 px-6 font-bold text-gray-950">
                      {entry.student_name}
                    </td>
                    <td className="py-4 px-6 font-mono text-gray-500 font-medium">
                      {entry.matric_number || "—"}
                    </td>
                    <td className="py-4 px-6 font-bold text-gray-950">{entry.score}</td>
                    <td className="py-4 px-6">
                      <span className="px-3 py-1 rounded-full bg-green-50 text-green-700 font-bold text-xs">
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
    </div>
  );
}
