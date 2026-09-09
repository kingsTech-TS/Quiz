"use client";

import React, { use, useState } from "react";
import { useQuizMasterCourse } from "@/hooks/use-courses";
import { quizMasterService } from "@/services/quiz-master.service";
import { PageHeader } from "@/components/shared/PageHeader";
import { DocumentUploader } from "@/components/upload/DocumentUploader";
import { ProcessingStatus } from "@/components/upload/ProcessingStatus";
import { ErrorState } from "@/components/shared/ErrorState";
import { Skeleton } from "@/components/shared/LoadingSkeleton";
import { toast } from "sonner";
import { getApiError } from "@/lib/api";

export default function QuizMasterUploadPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = use(params);
  const { data: course, isLoading, error, refetch } = useQuizMasterCourse(courseId);

  const [isUploading, setIsUploading] = useState(false);
  const [activeJobId, setActiveJobId] = useState<string | null>(null);

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const job = await quizMasterService.uploadDocument(courseId, file);
      toast.success("Document uploaded successfully. Parsing questions...");
      setActiveJobId(job.id);
    } catch (err: unknown) {
      toast.error(getApiError(err));
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (error || !course) {
    return (
      <ErrorState
        title="Course Not Found"
        message="Unable to retrieve course details for file upload."
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <PageHeader
        title={`Upload Syllabus: ${course.title}`}
        description="Ingest past papers, exam questions, and answer keys via PDF or Word document."
        breadcrumbs={[
          { label: "Dashboard", href: "/qm/dashboard" },
          { label: "Courses", href: "/qm/courses" },
          { label: course.gst_code, href: `/qm/courses/${course.id}` },
          { label: "Upload Document" },
        ]}
      />

      {activeJobId ? (
        <ProcessingStatus
          jobId={activeJobId}
          courseId={course.id}
          onCompleted={() => {
            toast.success("Document extraction completed! You can now review the questions.");
          }}
        />
      ) : (
        <DocumentUploader
          onUpload={handleUpload}
          isUploading={isUploading}
        />
      )}
    </div>
  );
}
