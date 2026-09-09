"use client";

import React, { use } from "react";
import Link from "next/link";
import { useQuizResult } from "@/hooks/use-quiz";
import { PageHeader } from "@/components/shared/PageHeader";
import { ErrorState } from "@/components/shared/ErrorState";
import { Skeleton } from "@/components/shared/LoadingSkeleton";
import {
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowLeft,
  RotateCcw,
  BookOpen,
} from "lucide-react";
import { formatDuration, formatDate } from "@/lib/utils";

export default function StudentSingleResultPage({
  params,
}: {
  params: Promise<{ attemptId: string }>;
}) {
  const { attemptId } = use(params);
  const { data: result, isLoading, error, refetch } = useQuizResult(attemptId);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-8 w-1/3 rounded-xl" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
        </div>
        <Skeleton className="h-64 rounded-3xl" />
      </div>
    );
  }

  if (error || !result) {
    return (
      <ErrorState
        title="Result Not Found"
        message="Unable to retrieve the specified examination result from server."
        onRetry={() => refetch()}
      />
    );
  }

  const percentage = Math.round(result.percentage);
  const isPass = percentage >= 50;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <PageHeader
        title={`Results: ${result.course_title || "Examination Review"}`}
        description={`Submitted on ${formatDate(result.submitted_at)}`}
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Past Results", href: "/results" },
          { label: "Result Details" },
        ]}
      />

      {/* Summary Score Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-100 rounded-[28px] p-6 shadow-xs text-center">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-3">
            <Award className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
            Final Score
          </span>
          <span
            className={`text-2xl sm:text-3xl font-black tracking-tight mt-1 block ${
              isPass ? "text-green-600" : "text-red-600"
            }`}
          >
            {percentage}%
          </span>
          <span className="text-[11px] text-gray-400 font-medium">
            {result.score} / {result.total_questions} points
          </span>
        </div>

        <div className="bg-white border border-gray-100 rounded-[28px] p-6 shadow-xs text-center">
          <div className="w-10 h-10 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
            Correct
          </span>
          <span className="text-2xl sm:text-3xl font-black tracking-tight text-gray-950 mt-1 block">
            {result.correct_count}
          </span>
          <span className="text-[11px] text-gray-400 font-medium">Questions correct</span>
        </div>

        <div className="bg-white border border-gray-100 rounded-[28px] p-6 shadow-xs text-center">
          <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-3">
            <XCircle className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
            Incorrect
          </span>
          <span className="text-2xl sm:text-3xl font-black tracking-tight text-gray-950 mt-1 block">
            {result.incorrect_count}
          </span>
          <span className="text-[11px] text-gray-400 font-medium">Questions missed</span>
        </div>

        <div className="bg-white border border-gray-100 rounded-[28px] p-6 shadow-xs text-center">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-3">
            <Clock className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
            Time Taken
          </span>
          <span className="text-2xl sm:text-3xl font-black tracking-tight text-gray-950 mt-1 block font-mono">
            {result.time_taken !== undefined
              ? formatDuration(result.time_taken)
              : "—"}
          </span>
          <span className="text-[11px] text-gray-400 font-medium">Assessment duration</span>
        </div>
      </div>

      {/* Navigation Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-gray-100 shadow-xs">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-gray-600 hover:text-gray-950 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>

        {result.course_id && (
          <Link
            href={`/quiz/${result.course_id}`}
            className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold rounded-full bg-gray-950 text-white hover:bg-gray-800 transition-all shadow-xs"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retake Practice Test</span>
          </Link>
        )}
      </div>

      {/* Question by Question Review */}
      {result.question_reviews && result.question_reviews.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-extrabold text-gray-950">Detailed Solution Analysis</h3>
          <p className="text-xs text-gray-400 -mt-2 font-medium">
            Review your answers alongside official solution keys and rationales.
          </p>

          <div className="space-y-4">
            {result.question_reviews.map((rev) => (
              <div
                key={rev.question_id}
                className="p-6 sm:p-7 rounded-[28px] border border-gray-100 bg-white transition-shadow shadow-xs space-y-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="text-xs font-black text-gray-400 uppercase tracking-wider">
                    Question {rev.question_number}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                      rev.is_correct
                        ? "bg-green-50 text-green-700"
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    {rev.is_correct ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" /> Correct
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3.5 h-3.5" /> Incorrect
                      </>
                    )}
                  </span>
                </div>

                <p className="text-sm font-bold text-gray-950 whitespace-pre-wrap leading-relaxed">
                  {rev.question_text}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                    <span className="text-[11px] font-semibold text-gray-400 block mb-1">
                      Your Selected Option:
                    </span>
                    <span className="font-bold text-gray-900">
                      {rev.selected_answer || "No response provided"}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-green-50/50 border border-green-100">
                    <span className="text-[11px] font-semibold text-green-700 block mb-1">
                      Correct Key:
                    </span>
                    <span className="font-bold text-green-900">
                      Option {rev.correct_answer}
                    </span>
                  </div>
                </div>

                {rev.explanation && (
                  <div className="p-4 rounded-2xl bg-purple-50/40 border border-purple-100 text-xs text-gray-600 flex items-start gap-2.5">
                    <BookOpen className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-gray-900 font-bold block mb-0.5">Syllabus Rationale:</strong>{" "}
                      <span className="leading-relaxed font-medium">{rev.explanation}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
