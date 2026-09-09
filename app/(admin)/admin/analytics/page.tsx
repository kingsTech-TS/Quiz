"use client";

import React from "react";
import { useAdminAnalytics } from "@/hooks/use-admin";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { StatCard } from "@/components/dashboard/StatCard";
import { StatCardSkeleton } from "@/components/shared/LoadingSkeleton";
import { ErrorState } from "@/components/shared/ErrorState";
import {
  Users,
  ShieldCheck,
  BookOpen,
  CheckCircle2,
  FileQuestion,
  GraduationCap,
  Layers,
} from "lucide-react";

export default function AdminAnalyticsPage() {
  const { data: analytics, isLoading, error, refetch } = useAdminAnalytics();

  return (
    <div className="space-y-8">
      <PageHeader
        title="Institutional System Analytics"
        description="Live aggregate metrics across the university General Studies assessment infrastructure."
        breadcrumbs={[
          { label: "Dashboard", href: "/admin/dashboard" },
          { label: "System Analytics" },
        ]}
      />

      {isLoading ? (
        <StatsGrid columns={3}>
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </StatsGrid>
      ) : error ? (
        <ErrorState
          title="Could not load analytics"
          message="Server error fetching institutional metrics."
          onRetry={() => refetch()}
        />
      ) : !analytics ? null : (
        <>
          <StatsGrid columns={3}>
            <StatCard
              label="Registered Students"
              value={analytics.total_users}
              icon={Users}
              subtext="Undergraduate candidate accounts"
            />
            <StatCard
              label="Quiz Masters"
              value={analytics.total_quiz_masters}
              icon={ShieldCheck}
              subtext="Instructors with authoring access"
            />
            <StatCard
              label="Total Questions"
              value={analytics.total_questions}
              icon={FileQuestion}
              subtext="In the institutional repository"
            />
            <StatCard
              label="Total Courses"
              value={analytics.total_courses}
              icon={Layers}
              subtext="All configured examination sets"
            />
            <StatCard
              label="Published Courses"
              value={analytics.published_courses}
              icon={BookOpen}
              subtext="Active examination sets"
            />
            <StatCard
              label="Total Attempt Submissions"
              value={analytics.total_attempts}
              icon={CheckCircle2}
              subtext="Submitted exam sessions"
            />
          </StatsGrid>

          {/* Institutional Compliance Card */}
          <div className="p-8 rounded-[28px] bg-white border border-gray-100 shadow-xs space-y-4">
            <div className="flex items-center gap-3 text-gray-950 font-extrabold text-base">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shadow-2xs">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span>General Studies Assessment Standards</span>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 font-normal leading-relaxed">
              All question items in published courses undergo mandatory confidence
              filtering and instructor verification. No answer keys are exposed to the
              client during active examination sessions, and all scoring calculations are
              performed server-side.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
