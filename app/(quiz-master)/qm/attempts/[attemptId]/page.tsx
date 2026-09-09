"use client";

import React, { use, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAttemptDetail } from "@/hooks/use-courses";
import { PageHeader } from "@/components/shared/PageHeader";
import { Skeleton } from "@/components/shared/LoadingSkeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Clock,
  Award,
  BookOpen,
  User,
  GraduationCap,
  Building,
  Layers,
  HelpCircle,
} from "lucide-react";
import { formatDuration, formatDate } from "@/lib/utils";

export default function AttemptDetailPage({
  params,
}: {
  params: Promise<{ attemptId: string }>;
}) {
  const { attemptId } = use(params);
  const router = useRouter();
  const { data: attempt, isLoading, error } = useAttemptDetail(attemptId);

  const [filterMode, setFilterMode] = useState<"all" | "correct" | "incorrect">("all");

  const filteredAnswers = useMemo(() => {
    if (!attempt?.answers) return [];
    return attempt.answers.filter((ans) => {
      if (filterMode === "correct") return ans.is_correct;
      if (filterMode === "incorrect") return !ans.is_correct;
      return true;
    });
  }, [attempt?.answers, filterMode]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-1/3 rounded-xl" />
        <Skeleton className="h-4 w-1/4 rounded-lg" />
        <div className="h-48 rounded-[28px] bg-white border border-gray-100 p-8">
          <Skeleton className="h-full w-full rounded-2xl" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-36 rounded-[28px]" />
          <Skeleton className="h-36 rounded-[28px]" />
        </div>
      </div>
    );
  }

  if (error || !attempt) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Attempt Inspection"
          description="View student answers and evaluation breakdown."
          breadcrumbs={[
            { label: "Dashboard", href: "/qm/dashboard" },
            { label: "Courses", href: "/qm/courses" },
            { label: "Attempt Inspection" },
          ]}
        />
        <ErrorState
          title="Could not load attempt details"
          message="The requested candidate attempt could not be retrieved. It may not exist or you may lack permission to view it."
        />
      </div>
    );
  }

  const {
    full_name,
    matric_number,
    faculty,
    department,
    level,
    course_title,
    course_id,
    score,
    total,
    correct,
    incorrect,
    percentage,
    time_taken_seconds,
    attempt_number,
    is_first_attempt,
    submitted_at,
    answers = [],
  } = attempt;

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <PageHeader
        title="Candidate Attempt Inspection"
        description={`Comprehensive question-by-question breakdown for ${full_name}'s submission.`}
        breadcrumbs={[
          { label: "Dashboard", href: "/qm/dashboard" },
          { label: "Courses", href: "/qm/courses" },
          {
            label: course_title || "Course Attempts",
            href: course_id ? `/qm/courses/${course_id}/attempts` : "/qm/courses",
          },
          { label: full_name },
        ]}
        action={
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-all shadow-2xs cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Go Back</span>
          </button>
        }
      />

      {/* Student Overview Banner */}
      <div className="bg-white border border-gray-100 rounded-[28px] p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Student Profile Info */}
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center font-black text-xl shadow-2xs shrink-0">
              {full_name.slice(0, 2).toUpperCase()}
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-xl font-extrabold text-gray-950">{full_name}</h2>
                {is_first_attempt ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                    1st Attempt
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200/60">
                    Retake #{attempt_number}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 font-medium">
                {matric_number && (
                  <span className="font-mono bg-gray-100/70 px-2 py-0.5 rounded-md text-gray-700">
                    {matric_number}
                  </span>
                )}
                {level && (
                  <span className="flex items-center gap-1 text-gray-600">
                    <GraduationCap className="w-3.5 h-3.5 text-gray-400" />
                    {level} Level
                  </span>
                )}
                {department && (
                  <span className="flex items-center gap-1 text-gray-600">
                    <Layers className="w-3.5 h-3.5 text-gray-400" />
                    {department}
                  </span>
                )}
                {faculty && (
                  <span className="flex items-center gap-1 text-gray-600">
                    <Building className="w-3.5 h-3.5 text-gray-400" />
                    {faculty}
                  </span>
                )}
              </div>

              {course_title && (
                <div className="flex items-center gap-1.5 text-xs text-purple-700 font-bold pt-1">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{course_title}</span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Score */}
            <div className="p-4 rounded-2xl bg-gray-50/70 border border-gray-100 flex flex-col justify-center">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                Score
              </span>
              <span className="text-xl font-black text-gray-950 mt-0.5">
                {score} <span className="text-xs text-gray-400 font-normal">/ {total}</span>
              </span>
            </div>

            {/* Percentage */}
            <div className="p-4 rounded-2xl bg-gray-50/70 border border-gray-100 flex flex-col justify-center">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                Accuracy
              </span>
              <span
                className={`text-xl font-black mt-0.5 ${
                  percentage >= 70
                    ? "text-emerald-600"
                    : percentage >= 50
                    ? "text-amber-600"
                    : "text-rose-600"
                }`}
              >
                {Math.round(percentage)}%
              </span>
            </div>

            {/* Time Taken */}
            <div className="p-4 rounded-2xl bg-gray-50/70 border border-gray-100 flex flex-col justify-center">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                Duration
              </span>
              <span className="text-sm font-black text-gray-900 mt-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-gray-400" />
                {formatDuration(time_taken_seconds)}
              </span>
            </div>

            {/* Submitted Date */}
            <div className="p-4 rounded-2xl bg-gray-50/70 border border-gray-100 flex flex-col justify-center">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                Submitted
              </span>
              <span className="text-xs font-semibold text-gray-700 mt-1 truncate">
                {submitted_at ? formatDate(submitted_at) : "—"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Questions Filter and Breakdown */}
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-extrabold text-gray-950">Question Analysis</h3>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-50 text-purple-700">
              {answers.length} Total Questions
            </span>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center p-1 bg-gray-100/80 rounded-full text-xs font-semibold text-gray-600 self-start">
            <button
              type="button"
              onClick={() => setFilterMode("all")}
              className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                filterMode === "all"
                  ? "bg-white text-purple-700 shadow-2xs font-bold"
                  : "hover:text-gray-900"
              }`}
            >
              All ({answers.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterMode("correct")}
              className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer flex items-center gap-1.5 ${
                filterMode === "correct"
                  ? "bg-white text-emerald-700 shadow-2xs font-bold"
                  : "hover:text-emerald-700"
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Correct ({correct})</span>
            </button>
            <button
              type="button"
              onClick={() => setFilterMode("incorrect")}
              className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer flex items-center gap-1.5 ${
                filterMode === "incorrect"
                  ? "bg-white text-rose-700 shadow-2xs font-bold"
                  : "hover:text-rose-700"
              }`}
            >
              <XCircle className="w-3.5 h-3.5 text-rose-600" />
              <span>Incorrect ({incorrect})</span>
            </button>
          </div>
        </div>

        {/* Answers List */}
        {filteredAnswers.length === 0 ? (
          <EmptyState
            icon={HelpCircle}
            title="No questions in this filter"
            description="There are no questions matching the selected filter mode."
          />
        ) : (
          <div className="space-y-4">
            {filteredAnswers.map((ans, idx) => {
              const options = ans.options || {};
              const optionKeys = Object.keys(options).sort();

              return (
                <div
                  key={ans.question_id || idx}
                  className={`rounded-[28px] bg-white border p-6 transition-all shadow-xs ${
                    ans.is_correct
                      ? "border-gray-100 hover:border-emerald-200"
                      : "border-rose-100 hover:border-rose-200 bg-rose-50/10"
                  }`}
                >
                  {/* Question Header */}
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="w-7 h-7 rounded-xl bg-purple-50 text-purple-700 font-black text-xs flex items-center justify-center">
                        {ans.question_number || idx + 1}
                      </span>
                      <span className="text-xs font-bold text-gray-400">
                        Question {ans.question_number || idx + 1}
                      </span>
                    </div>

                    {ans.is_correct ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Correct</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200/60">
                        <XCircle className="w-3.5 h-3.5 text-rose-600" />
                        <span>Incorrect</span>
                      </span>
                    )}
                  </div>

                  {/* Question Text */}
                  <p className="text-sm font-semibold text-gray-900 leading-relaxed mb-5">
                    {ans.question_text}
                  </p>

                  {/* Options List */}
                  {optionKeys.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {optionKeys.map((key) => {
                        const optionText = options[key];
                        const isStudentChoice =
                          ans.selected_answer?.trim().toUpperCase() === key.toUpperCase();
                        const isCorrectAnswer =
                          ans.correct_answer?.trim().toUpperCase() === key.toUpperCase();

                        let containerStyle =
                          "border-gray-100 bg-gray-50/40 text-gray-700";
                        let badge = null;

                        if (isCorrectAnswer && isStudentChoice) {
                          containerStyle =
                            "border-emerald-300 bg-emerald-50/70 text-emerald-950 font-bold";
                          badge = (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-white px-2 py-0.5 rounded-full border border-emerald-200 shadow-2xs">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              Student Answer (Correct)
                            </span>
                          );
                        } else if (isCorrectAnswer) {
                          containerStyle =
                            "border-emerald-300 bg-emerald-50/40 text-emerald-950 font-semibold";
                          badge = (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-white px-2 py-0.5 rounded-full border border-emerald-200 shadow-2xs">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              Correct Answer
                            </span>
                          );
                        } else if (isStudentChoice) {
                          containerStyle =
                            "border-rose-300 bg-rose-50/70 text-rose-950 font-semibold";
                          badge = (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-white px-2 py-0.5 rounded-full border border-rose-200 shadow-2xs">
                              <XCircle className="w-3 h-3 text-rose-600" />
                              Student Selected
                            </span>
                          );
                        }

                        return (
                          <div
                            key={key}
                            className={`p-3.5 rounded-2xl border flex items-start justify-between gap-3 text-xs transition-all ${containerStyle}`}
                          >
                            <div className="flex items-start gap-2.5">
                              <span className="w-5 h-5 rounded-lg bg-white/80 border border-gray-200 text-gray-900 font-black flex items-center justify-center shrink-0 text-[11px]">
                                {key}
                              </span>
                              <span className="leading-snug pt-0.5">{optionText}</span>
                            </div>
                            {badge && <div className="shrink-0">{badge}</div>}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* If options map is empty, fallback to simple selected vs correct comparison */}
                  {optionKeys.length === 0 && (
                    <div className="flex flex-wrap items-center gap-4 text-xs font-semibold p-4 rounded-2xl bg-gray-50 border border-gray-100">
                      <div>
                        <span className="text-gray-400">Student Answer: </span>
                        <span
                          className={`font-bold ${
                            ans.is_correct ? "text-emerald-700" : "text-rose-700"
                          }`}
                        >
                          {ans.selected_answer || "Unanswered"}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400">Correct Answer: </span>
                        <span className="font-bold text-emerald-700">
                          {ans.correct_answer || "N/A"}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
