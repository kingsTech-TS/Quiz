import React from "react";
import Link from "next/link";
import { History, ChevronRight } from "lucide-react";
import type { AttemptHistoryItem } from "@/types/quiz";
import { formatDate, formatDuration } from "@/lib/utils";

interface RecentAttemptsProps {
  attempts: AttemptHistoryItem[];
  isLoading?: boolean;
}

export function RecentAttempts({
  attempts,
  isLoading,
}: RecentAttemptsProps) {
  if (isLoading) {
    return (
      <div className="bg-white border border-gray-100 rounded-[28px] p-6 space-y-3 shadow-2xs">
        <div className="h-5 w-40 bg-gray-100 animate-pulse rounded-lg" />
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-12 bg-gray-50 animate-pulse rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!attempts || attempts.length === 0) {
    return (
      <div className="bg-white border border-gray-100 rounded-[28px] p-6 text-center shadow-2xs">
        <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-3">
          <History className="w-5 h-5" />
        </div>
        <h4 className="text-sm font-bold text-gray-950">No Attempts Yet</h4>
        <p className="text-xs text-gray-400 font-medium mt-1">
          Take your first practice quiz to see your score analysis here.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-100 rounded-[28px] p-6 shadow-2xs">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-gray-950 tracking-tight">Recent Assessments</h3>
        <Link
          href="/results"
          className="text-xs font-bold text-purple-600 hover:text-purple-700 hover:underline inline-flex items-center gap-1"
        >
          View all
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="divide-y divide-gray-100">
        {attempts.slice(0, 5).map((attempt, idx) => (
          <div
            key={`${attempt.id || attempt.course_id}-${attempt.submitted_at || idx}`}
            className="py-3 flex items-center justify-between gap-3 text-sm"
          >
            <div className="min-w-0">
              <p className="font-bold text-gray-950 truncate text-xs sm:text-sm">
                {attempt.course_title}
              </p>
              <div className="flex items-center gap-2 text-[11px] text-gray-400 font-medium mt-0.5">
                <span>{formatDate(attempt.submitted_at || attempt.started_at)}</span>
                {attempt.time_taken !== undefined && (
                  <>
                    <span>•</span>
                    <span>{formatDuration(attempt.time_taken)}</span>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="text-right">
                <span className="font-extrabold text-gray-950 text-xs sm:text-sm">
                  {Math.round(attempt.percentage)}%
                </span>
                <span className="block text-[10px] text-gray-400 font-medium">
                  {attempt.score} / {attempt.total_questions}
                </span>
              </div>
              <Link
                href={`/results/${attempt.id}`}
                className="p-1.5 text-gray-400 hover:text-purple-600 rounded-xl hover:bg-purple-50 transition-colors"
                title="View Result"
              >
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
