"use client";

import React from "react";
import { useAdminQuizMasters } from "@/hooks/use-admin";
import { PageHeader } from "@/components/shared/PageHeader";
import { QuizMasterTable } from "@/components/admin/QuizMasterTable";
import { TableSkeleton } from "@/components/shared/LoadingSkeleton";
import { ErrorState } from "@/components/shared/ErrorState";

export default function AdminQuizMastersPage() {
  const { data: quizMasters, isLoading, error, refetch } = useAdminQuizMasters();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Quiz Masters & Instructors Roster"
        description="View authorized instructors, course bank production, and active published papers."
        breadcrumbs={[
          { label: "Dashboard", href: "/admin/dashboard" },
          { label: "Quiz Masters" },
        ]}
      />

      {isLoading ? (
        <TableSkeleton rows={6} cols={5} />
      ) : error ? (
        <ErrorState
          title="Could not load quiz masters"
          message="Server error while retrieving instructor records."
          onRetry={() => refetch()}
        />
      ) : (
        <QuizMasterTable quizMasters={quizMasters || []} isLoading={isLoading} />
      )}
    </div>
  );
}
