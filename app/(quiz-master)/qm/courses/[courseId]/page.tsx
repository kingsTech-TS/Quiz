"use client";

import React, { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useQuizMasterCourse } from "@/hooks/use-courses";
import { useQuestions } from "@/hooks/use-quiz-master";
import { courseService } from "@/services/course.service";
import { quizMasterService } from "@/services/quiz-master.service";
import { getApiError } from "@/lib/api";
import { PageHeader } from "@/components/shared/PageHeader";
import { CourseStatusBadge } from "@/components/courses/CourseStatusBadge";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { ErrorState } from "@/components/shared/ErrorState";
import { Skeleton } from "@/components/shared/LoadingSkeleton";
import {
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  FileQuestion,
  Clock,
  Globe,
  Archive,
  ArrowRight,
  Trash2,
  CheckCheck,
  Users,
} from "lucide-react";

export default function QuizMasterCourseDetailPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = use(params);
  const router = useRouter();
  const { data: course, isLoading: courseLoading, error: courseError, refetch: refetchCourse } =
    useQuizMasterCourse(courseId);
  const { data: questions, isLoading: questionsLoading, refetch: refetchQuestions } =
    useQuestions(courseId);

  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const [showArchiveDialog, setShowArchiveDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showVerifyAllDialog, setShowVerifyAllDialog] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);

  if (courseLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-1/3 rounded-xl" />
        <Skeleton className="h-4 w-1/4 rounded-lg" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Skeleton className="h-28 rounded-[28px]" />
          <Skeleton className="h-28 rounded-[28px]" />
          <Skeleton className="h-28 rounded-[28px]" />
        </div>
      </div>
    );
  }

  if (courseError || !course) {
    return (
      <ErrorState
        title="Course Not Found"
        message="Unable to retrieve course details from the server."
        onRetry={() => refetchCourse()}
      />
    );
  }

  const questionList = questions || [];
  const needsReviewCount = questionList.filter((q) => q.needs_review).length;
  const verifiedCount = questionList.filter((q) => q.is_verified).length;
  const canPublish =
    questionList.length > 0 && needsReviewCount === 0 && course.status !== "published";

  const handlePublish = async () => {
    setIsActionLoading(true);
    try {
      await courseService.publishCourse(course.id);
      toast.success("Course published successfully! It is now live for students.");
      setShowPublishDialog(false);
      refetchCourse();
    } catch (err: unknown) {
      toast.error(getApiError(err));
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleArchive = async () => {
    setIsActionLoading(true);
    try {
      await courseService.archiveCourse(course.id);
      toast.success("Course archived successfully.");
      setShowArchiveDialog(false);
      refetchCourse();
    } catch {
      toast.error("Failed to archive course.");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsActionLoading(true);
    try {
      await courseService.deleteCourse(course.id);
      toast.success("Course deleted successfully.");
      setShowDeleteDialog(false);
      router.push("/qm/courses");
    } catch (err: unknown) {
      toast.error(getApiError(err));
    } finally {
      setIsActionLoading(false);
    }
  };

  const unverifiedCount = questionList.filter(
    (q) => !q.is_verified && !q.verified
  ).length;

  const handleVerifyAll = async () => {
    setIsActionLoading(true);
    try {
      const res = await quizMasterService.verifyAllQuestions(course.id);
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
          `All standard questions are verified. ${res.skipped_requires_review} question${
            res.skipped_requires_review === 1 ? "" : "s"
          } still require manual review in the Review Center.`
        );
      } else {
        toast.info("All questions in this course are already verified.");
      }
      setShowVerifyAllDialog(false);
      refetchQuestions();
      refetchCourse();
    } catch (err: unknown) {
      toast.error(getApiError(err));
    } finally {
      setIsActionLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title={course.title}
        description={`GST Assessment Configuration • ${course.duration_minutes} minutes`}
        breadcrumbs={[
          { label: "Dashboard", href: "/qm/dashboard" },
          { label: "Courses", href: "/qm/courses" },
          { label: course.gst_code },
        ]}
        action={
          <div className="flex items-center gap-3">
            {unverifiedCount > 0 && (
              <button
                type="button"
                onClick={() => setShowVerifyAllDialog(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold rounded-full border border-green-200 bg-white text-green-700 hover:bg-green-50 transition-all cursor-pointer shadow-2xs"
              >
                <CheckCheck className="w-4 h-4 text-green-600" />
                <span>Verify All ({unverifiedCount})</span>
              </button>
            )}

            {course.status !== "published" && (
              <button
                type="button"
                onClick={() => setShowPublishDialog(true)}
                disabled={!canPublish}
                className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold rounded-full bg-green-600 hover:bg-green-700 text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-xs"
              >
                <Globe className="w-4 h-4" />
                <span>Publish Course</span>
              </button>
            )}

            {course.status === "published" && (
              <button
                type="button"
                onClick={() => setShowArchiveDialog(true)}
                className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-all cursor-pointer shadow-2xs"
              >
                <Archive className="w-4 h-4 text-gray-400" />
                <span>Archive Course</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setShowDeleteDialog(true)}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold rounded-full border border-red-200 bg-white text-red-600 hover:bg-red-50 transition-all cursor-pointer shadow-2xs"
            >
              <Trash2 className="w-4 h-4 text-red-500" />
              <span>Delete Course</span>
            </button>
          </div>
        }
      />

      {/* Status Alert Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-[28px] bg-white border border-gray-100 shadow-xs">
        <div className="flex items-center gap-3.5">
          <span className="font-extrabold text-xs bg-purple-50 text-purple-700 px-3.5 py-1.5 rounded-full uppercase tracking-wider">
            {course.gst_code}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 font-medium">Current Status:</span>
            <CourseStatusBadge status={course.status} />
          </div>
        </div>

        <div className="text-xs text-gray-500 font-semibold flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-gray-400" />
          <span>{course.duration_minutes} mins test limit</span>
        </div>
      </div>

      {/* Review Warning if unverified questions exist */}
      {needsReviewCount > 0 && (
        <div className="p-6 rounded-[28px] bg-amber-50/80 border border-amber-200 text-amber-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-amber-950">
                {needsReviewCount} Questions Require Verification
              </h4>
              <p className="text-xs text-amber-800 mt-0.5 font-normal leading-relaxed">
                AI extraction flagged questions with low confidence or unclear answer
                keys. Publishing is blocked until these questions are reviewed.
              </p>
            </div>
          </div>
          <Link
            href={`/qm/courses/${course.id}/review`}
            className="px-6 py-2.5 rounded-full bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold shrink-0 transition-all shadow-xs text-center"
          >
            Review Now
          </Link>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white border border-gray-100 rounded-[28px] p-6 shadow-xs">
          <div className="flex items-center justify-between text-gray-400 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">
              Total Questions
            </span>
            <FileQuestion className="w-4 h-4 text-purple-600" />
          </div>
          <span className="text-3xl font-black text-gray-950">
            {questionList.length}
          </span>
          <p className="text-xs text-gray-400 font-medium mt-1">In question pool</p>
        </div>

        <div className="bg-white border border-gray-100 rounded-[28px] p-6 shadow-xs">
          <div className="flex items-center justify-between text-gray-400 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">
              Verified Items
            </span>
            <CheckCircle2 className="w-4 h-4 text-green-600" />
          </div>
          <span className="text-3xl font-black text-gray-950">{verifiedCount}</span>
          <p className="text-xs text-gray-400 font-medium mt-1">
            Confirmed by instructor
          </p>
        </div>

        <div className="bg-white border border-gray-100 rounded-[28px] p-6 shadow-xs">
          <div className="flex items-center justify-between text-gray-400 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">
              Needs Review
            </span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <span className="text-3xl font-black text-gray-950">
            {needsReviewCount}
          </span>
          <p className="text-xs text-gray-400 font-medium mt-1">
            Flagged for inspection
          </p>
        </div>
      </div>

      {/* Workflow Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Link
          href={`/qm/courses/${course.id}/upload`}
          className="p-6 rounded-[28px] bg-white border border-gray-100 hover:border-gray-200 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between group"
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4 group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <UploadCloud className="w-6 h-6" />
            </div>
            <h4 className="font-extrabold text-base text-gray-950">Upload Document</h4>
            <p className="text-xs text-gray-400 font-medium mt-1.5 leading-relaxed">
              Extract new questions from PDF, Word syllabus, or past papers.
            </p>
          </div>
          <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-purple-600">
            <span>Upload Files</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link
          href={`/qm/courses/${course.id}/questions`}
          className="p-6 rounded-[28px] bg-white border border-gray-100 hover:border-gray-200 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between group"
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4 group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <FileQuestion className="w-6 h-6" />
            </div>
            <h4 className="font-extrabold text-base text-gray-950">Question Bank</h4>
            <p className="text-xs text-gray-400 font-medium mt-1.5 leading-relaxed">
              Inspect, add, edit, or remove questions, options, and explanations.
            </p>
          </div>
          <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-purple-600">
            <span>Manage Questions</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link
          href={`/qm/courses/${course.id}/review`}
          className="p-6 rounded-[28px] bg-white border border-gray-100 hover:border-gray-200 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between group"
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4 group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="font-extrabold text-base text-gray-950">AI Verification</h4>
            <p className="text-xs text-gray-400 font-medium mt-1.5 leading-relaxed">
              Verify answer keys and resolve flagged confidence warnings.
            </p>
          </div>
          <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-purple-600">
            <span>Review & Verify</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link
          href={`/qm/courses/${course.id}/attempts`}
          className="p-6 rounded-[28px] bg-white border border-gray-100 hover:border-gray-200 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between group"
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4 group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <Users className="w-6 h-6" />
            </div>
            <h4 className="font-extrabold text-base text-gray-950">Student Attempts</h4>
            <p className="text-xs text-gray-400 font-medium mt-1.5 leading-relaxed">
              Inspect candidate submissions, scores, and answer sheets.
            </p>
          </div>
          <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-purple-600">
            <span>View Submissions</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </div>

      {/* Course Description */}
      <div className="bg-white border border-gray-100 rounded-[28px] p-6 sm:p-8 shadow-xs space-y-3">
        <h3 className="text-sm font-extrabold text-gray-950">Syllabus Overview</h3>
        <p className="text-xs text-gray-500 leading-relaxed whitespace-pre-wrap font-normal">
          {course.description || "No description provided."}
        </p>
      </div>

      {/* Publish Confirm Dialog */}
      <ConfirmDialog
        isOpen={showPublishDialog}
        title="Publish Course to Students?"
        description="Publishing will make this examination active and accessible to all students enrolled in this GST course code. Ensure questions have been reviewed and verified."
        confirmLabel="Yes, Publish Course"
        isLoading={isActionLoading}
        onConfirm={handlePublish}
        onClose={() => setShowPublishDialog(false)}
      />

      {/* Archive Confirm Dialog */}
      <ConfirmDialog
        isOpen={showArchiveDialog}
        title="Archive Course Assessment?"
        description="Archiving will remove this course from the active student examination list. Historical attempts and performance records will remain preserved."
        confirmLabel="Archive Course"
        variant="danger"
        isLoading={isActionLoading}
        onConfirm={handleArchive}
        onClose={() => setShowArchiveDialog(false)}
      />

      {/* Delete Confirm Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        title="Delete Course Assessment?"
        description="Are you sure you want to permanently delete this course? All questions, uploaded documents, and associated session records will be removed. This action cannot be undone."
        confirmLabel="Delete Course"
        variant="danger"
        isLoading={isActionLoading}
        onConfirm={handleDelete}
        onClose={() => setShowDeleteDialog(false)}
      />

      {/* Verify All Confirm Dialog */}
      <ConfirmDialog
        isOpen={showVerifyAllDialog}
        title="Verify All Questions in Assessment?"
        description={`Are you sure you want to verify all questions for "${course.title}"? Any questions with low confidence or unclear answer keys will remain flagged for your review in the AI Verification Center.`}
        confirmLabel="Verify All"
        variant="primary"
        isLoading={isActionLoading}
        onConfirm={handleVerifyAll}
        onClose={() => setShowVerifyAllDialog(false)}
      />
    </div>
  );
}
