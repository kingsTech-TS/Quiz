"use client";

import React from "react";
import Link from "next/link";
import {
  Users,
  ShieldCheck,
  BookOpen,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useAdminAnalytics } from "@/hooks/use-admin";
import { WelcomeHeader } from "@/components/dashboard/WelcomeHeader";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { StatCard } from "@/components/dashboard/StatCard";
import { ExportButton } from "@/components/admin/ExportButton";
import { StatCardSkeleton } from "@/components/shared/LoadingSkeleton";
import { ErrorState } from "@/components/shared/ErrorState";

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const { data: analytics, isLoading, error, refetch } = useAdminAnalytics();

  return (
    <div className="space-y-6">
      <WelcomeHeader
        user={user}
        subtitle="System administrative control, student enrollment verification, instructor management, and institutional records export."
        action={<ExportButton />}
      />

      {isLoading ? (
        <StatsGrid columns={4}>
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </StatsGrid>
      ) : error ? (
        <ErrorState
          title="Could not load system analytics"
          message="Server communication error fetching administrator statistics."
          onRetry={() => refetch()}
        />
      ) : !analytics ? null : (
        <>
          <StatsGrid columns={4}>
            <StatCard
              label="Registered Students"
              value={analytics.total_users}
              icon={Users}
              subtext="Enrolled student accounts"
            />
            <StatCard
              label="Quiz Masters"
              value={analytics.total_quiz_masters}
              icon={ShieldCheck}
              subtext="Instructors & Coordinators"
            />
            <StatCard
              label="Published Courses"
              value={`${analytics.published_courses} / ${analytics.total_courses}`}
              icon={BookOpen}
              subtext="Active assessment sets"
            />
            <StatCard
              label="Total Submissions"
              value={analytics.total_attempts}
              icon={CheckCircle2}
              subtext="Completed exam attempts"
            />
          </StatsGrid>

          {/* Quick Admin Modules */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <Link
              href="/admin/users"
              className="p-6 rounded-[28px] bg-white border border-gray-100 hover:border-purple-200 hover:bg-purple-50/30 transition-all group shadow-2xs"
            >
              <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-base text-gray-950 tracking-tight">Student Records Directory</h3>
              <p className="text-xs text-gray-400 font-medium mt-1.5 leading-relaxed">
                Filter students by matriculation number, faculty, academic level, and registered General Studies.
              </p>
              <span className="inline-block mt-4 text-xs font-bold text-purple-600 group-hover:underline">
                Manage Students →
              </span>
            </Link>

            <Link
              href="/admin/quiz-masters"
              className="p-6 rounded-[28px] bg-white border border-gray-100 hover:border-purple-200 hover:bg-purple-50/30 transition-all group shadow-2xs"
            >
              <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-base text-gray-950 tracking-tight">Quiz Masters Roster</h3>
              <p className="text-xs text-gray-400 font-medium mt-1.5 leading-relaxed">
                Audit instructor accounts, track course question bank generation, and monitor publication approvals.
              </p>
              <span className="inline-block mt-4 text-xs font-bold text-purple-600 group-hover:underline">
                View Instructors →
              </span>
            </Link>

            <Link
              href="/admin/analytics"
              className="p-6 rounded-[28px] bg-white border border-gray-100 hover:border-purple-200 hover:bg-purple-50/30 transition-all group shadow-2xs"
            >
              <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-base text-gray-950 tracking-tight">Institutional Analytics</h3>
              <p className="text-xs text-gray-400 font-medium mt-1.5 leading-relaxed">
                System-wide question counts, examination metrics, and platform readiness status.
              </p>
              <span className="inline-block mt-4 text-xs font-bold text-purple-600 group-hover:underline">
                View Metrics →
              </span>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
