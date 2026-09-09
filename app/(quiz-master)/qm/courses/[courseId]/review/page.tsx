"use client";

import React, { use } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { useQuizMasterCourse } from "@/hooks/use-courses";
import { useQuestions } from "@/hooks/use-quiz-master";
import { quizMasterService } from "@/services/quiz-master.service";
import { PageHeader } from "@/components/shared/PageHeader";
import { QuestionList } from "@/components/questions/QuestionList";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { CardSkeleton } from "@/components/shared/LoadingSkeleton";
import { CheckCircle2, Globe, AlertTriangle } from "lucide-react";
import type { UpdateQuestionRequest } from "@/types/question";

export default function QuizMasterReviewPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = use(params);
  const { data: course, isLoading: courseLoading } = useQuizMasterCourse(courseId);
  const {
    data: questions,
    isLoading: questionsLoading,
    error,
    refetch,
  } = useQuestions(courseId);

  const handleUpdate = async (id: string, data: UpdateQuestionRequest) => {
    try {
      await quizMasterService.updateQuestion(id, data);
      toast.success("Question updated successfully");
      refetch();
    } catch {
      toast.error("Failed to update question");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await quizMasterService.deleteQuestion(id);
      toast.success("Question deleted");
      refetch();
    } catch {
      toast.error("Failed to delete question");
    }
  };

  const handleVerify = async (id: string) => {
    try {
      await quizMasterService.verifyQuestion(id);
      toast.success("Question verified");
      refetch();
    } catch {
      toast.error("Failed to verify question");
    }
  };

  const needsReviewQuestions = (questions || []).filter((q) => q.needs_review);

  return (
    <div className="space-y-8">
      <PageHeader
        title={`AI Extraction Review: ${course?.title || "Course Review"}`}
        description="Verify AI-extracted past questions, resolve flagged confidence items, and authorize answer keys."
        breadcrumbs={[
          { label: "Dashboard", href: "/qm/dashboard" },
          { label: "Courses", href: "/qm/courses" },
          { label: course?.gst_code || "Course", href: `/qm/courses/${courseId}` },
          { label: "Review Center" },
        ]}
        action={
          <Link
            href={`/qm/courses/${courseId}`}
            className="inline-flex items-center gap-2 px-6 py-3 text-xs font-bold rounded-full bg-gray-950 text-white hover:bg-gray-800 transition-all shadow-xs"
          >
            <Globe className="w-4 h-4" />
            <span>Course Management</span>
          </Link>
        }
      />

      {questionsLoading || courseLoading ? (
        <div className="space-y-4">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : error ? (
        <ErrorState
          title="Could not load review questions"
          message="Server communication error."
          onRetry={() => refetch()}
        />
      ) : needsReviewQuestions.length === 0 ? (
        <EmptyState
          icon={CheckCircle2}
          title="All Questions Verified"
          description="There are currently no questions flagged for review. Your question bank meets the verification criteria for publication."
          action={
            <Link
              href={`/qm/courses/${courseId}`}
              className="inline-flex items-center gap-2 px-6 py-3 text-xs font-bold rounded-full bg-green-600 text-white hover:bg-green-700 transition-all shadow-xs"
            >
              <Globe className="w-4 h-4" />
              <span>Return to Publish Course</span>
            </Link>
          }
        />
      ) : (
        <div className="space-y-6">
          <div className="p-6 rounded-[28px] bg-amber-50/80 border border-amber-200 text-amber-950 flex items-center gap-3.5 shadow-2xs">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <p className="text-xs sm:text-sm font-medium">
              <strong className="font-bold text-amber-950">{needsReviewQuestions.length} questions</strong> require your
              academic verification before this past questions paper can be made live to students.
            </p>
          </div>

          <QuestionList
            questions={needsReviewQuestions}
            onUpdateQuestion={handleUpdate}
            onDeleteQuestion={handleDelete}
            onVerifyQuestion={handleVerify}
          />
        </div>
      )}
    </div>
  );
}
