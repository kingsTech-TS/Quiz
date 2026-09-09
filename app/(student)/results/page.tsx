"use client";

import React from "react";
import Link from "next/link";
import { useQuizHistory } from "@/hooks/use-quiz";
import { PageHeader } from "@/components/shared/PageHeader";
import { TableSkeleton } from "@/components/shared/LoadingSkeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { History, ChevronRight, Play } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function StudentResultsHistoryPage() {
  const { data: history, isLoading, error, refetch } = useQuizHistory();

  return (
    <div>
      <PageHeader
        title="Assessment History & Performance"
        description="Comprehensive historical records of all your submitted examination attempts."
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Past Results" },
        ]}
      />

      {isLoading ? (
        <TableSkeleton rows={6} cols={5} />
      ) : error ? (
        <ErrorState
          title="Could not load records"
          message="Server error while fetching your test history."
          onRetry={() => refetch()}
        />
      ) : !history || history.length === 0 ? (
        <EmptyState
          icon={History}
          title="No Examination Records Found"
          description="You have not completed any practice assessments yet. Start a course test to build your performance profile."
          action={
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 px-6 py-3 text-xs font-bold rounded-full bg-gray-950 text-white hover:bg-gray-800 transition-all shadow-xs"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Browse Approved Courses</span>
            </Link>
          }
        />
      ) : (
        <div className="bg-white border border-gray-100 rounded-[28px] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-gray-50/70 border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-4 px-6">Course Assessment</th>
                  <th className="py-4 px-6">Date Submitted</th>
                  <th className="py-4 px-6">Score</th>
                  <th className="py-4 px-6">Grade</th>
                  <th className="py-4 px-6 text-right">Review</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-900">
                {history.map((item) => {
                  const percentage = Math.round(item.percentage);
                  const isPass = percentage >= 50;

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50/60 transition-colors"
                    >
                      <td className="py-4 px-6 font-bold text-gray-950">
                        {item.course_title}
                      </td>
                      <td className="py-4 px-6 text-gray-500 font-medium">
                        {formatDate(item.submitted_at || item.started_at)}
                      </td>
                      <td className="py-4 px-6 font-bold text-gray-950">
                        {item.score}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                            isPass
                              ? "bg-green-50 text-green-700"
                              : "bg-red-50 text-red-700"
                          }`}
                        >
                          {percentage}%
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <Link
                          href={`/results/${item.id}`}
                          className="inline-flex items-center gap-1 text-xs font-bold text-purple-600 hover:text-purple-700 hover:underline"
                        >
                          <span>Detailed Review</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
