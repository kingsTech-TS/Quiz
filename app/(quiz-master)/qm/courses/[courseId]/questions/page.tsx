"use client";

import React, { use, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { useQuizMasterCourse } from "@/hooks/use-courses";
import { useQuestions } from "@/hooks/use-quiz-master";
import { quizMasterService } from "@/services/quiz-master.service";
import { PageHeader } from "@/components/shared/PageHeader";
import { QuestionList } from "@/components/questions/QuestionList";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { ErrorState } from "@/components/shared/ErrorState";
import { CardSkeleton } from "@/components/shared/LoadingSkeleton";
import { UploadCloud, CheckCheck, Loader2 } from "lucide-react";
import { getApiError } from "@/lib/api";
import type { UpdateQuestionRequest } from "@/types/question";

export default function QuizMasterQuestionsPage({
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

  const [showVerifyAllDialog, setShowVerifyAllDialog] = useState(false);
  const [isVerifyingAll, setIsVerifyingAll] = useState(false);

  const unverifiedCount = (questions || []).filter(
    (q) => !q.is_verified && !q.verified
  ).length;

  const handleUpdate = async (id: string, data: UpdateQuestionRequest) => {
    try {
      await quizMasterService.updateQuestion(id, data);
      toast.success("Question updated successfully");
      refetch();
    } catch {
      toast.error("Failed to save question edits");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await quizMasterService.deleteQuestion(id);
      toast.success("Question deleted from bank");
      refetch();
    } catch {
      toast.error("Failed to delete question");
    }
  };

  const handleVerify = async (id: string) => {
    try {
      await quizMasterService.verifyQuestion(id);
      toast.success("Question marked verified");
      refetch();
    } catch {
      toast.error("Failed to verify question");
    }
  };

  const handleVerifyAll = async () => {
    setIsVerifyingAll(true);
    try {
      const res = await quizMasterService.verifyAllQuestions(courseId);
      if (res.newly_verified > 0) {
        toast.success(
          `Verified ${res.newly_verified} question${
            res.newly_verified === 1 ? "" : "s"
          } successfully!${
            res.skipped_requires_review > 0
              ? ` Note: ${res.skipped_requires_review} question${
                  res.skipped_requires_review === 1 ? "" : "s"
                } still require manual review.`
              : ""
          }`
        );
      } else if (res.skipped_requires_review > 0) {
        toast.info(
          `All standard questions are already verified. ${res.skipped_requires_review} question${
            res.skipped_requires_review === 1 ? "" : "s"
          } still require manual review in the Review Center.`
        );
      } else {
        toast.info("All questions in this bank are already verified.");
      }
      setShowVerifyAllDialog(false);
      refetch();
    } catch (err: unknown) {
      toast.error(getApiError(err));
    } finally {
      setIsVerifyingAll(false);
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Question Bank: ${course?.title || "Course Questions"}`}
        description={`Manage, edit, verify, or remove questions for ${course?.gst_code || "this course"}.`}
        breadcrumbs={[
          { label: "Dashboard", href: "/qm/dashboard" },
          { label: "Courses", href: "/qm/courses" },
          { label: course?.gst_code || "Course", href: `/qm/courses/${courseId}` },
          { label: "Questions Bank" },
        ]}
        action={
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            {unverifiedCount > 0 && (
              <button
                type="button"
                onClick={() => setShowVerifyAllDialog(true)}
                disabled={isVerifyingAll}
                className="inline-flex items-center gap-2 px-5 py-2.5 sm:py-3 text-xs font-bold rounded-full bg-green-600 hover:bg-green-700 text-white transition-all shadow-xs cursor-pointer disabled:opacity-50 whitespace-nowrap"
              >
                {isVerifyingAll ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCheck className="w-4 h-4" />
                )}
                <span>Verify All ({unverifiedCount})</span>
              </button>
            )}
            <Link
              href={`/qm/courses/${courseId}/upload`}
              className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 text-xs font-bold rounded-full bg-gray-950 text-white hover:bg-gray-800 transition-all shadow-xs whitespace-nowrap"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload Document</span>
            </Link>
          </div>
        }
      />

      {questionsLoading || courseLoading ? (
        <div className="space-y-4">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : error ? (
        <ErrorState
          title="Could not load questions"
          message="Server error while fetching questions for this course."
          onRetry={() => refetch()}
        />
      ) : (
        <QuestionList
          questions={questions || []}
          onUpdateQuestion={handleUpdate}
          onDeleteQuestion={handleDelete}
          onVerifyQuestion={handleVerify}
          onVerifyAll={() => setShowVerifyAllDialog(true)}
          isVerifyingAll={isVerifyingAll}
        />
      )}

      {/* Verify All Confirm Dialog */}
      <ConfirmDialog
        isOpen={showVerifyAllDialog}
        title="Verify All Questions in Bank?"
        description={`This will automatically verify all unverified questions for "${course?.title || "this course"}". Any questions flagged with low confidence or missing answers will be preserved for your manual review in the Review Center.`}
        confirmLabel="Verify All"
        variant="primary"
        isLoading={isVerifyingAll}
        onConfirm={handleVerifyAll}
        onClose={() => setShowVerifyAllDialog(false)}
      />
    </div>
  );
}
