"use client";

import React, { useEffect, useState } from "react";
import { Loader2, CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { quizMasterService } from "@/services/quiz-master.service";
import type { ProcessingJob } from "@/types/question";

interface ProcessingStatusProps {
  jobId: string;
  courseId: string;
  onCompleted?: () => void;
}

export function ProcessingStatus({
  jobId,
  courseId,
  onCompleted,
}: ProcessingStatusProps) {
  const [job, setJob] = useState<ProcessingJob | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const poll = async () => {
      try {
        const data = await quizMasterService.getProcessingStatus(courseId);
        setJob(data);

        if (data.status === "completed") {
          onCompleted?.();
        } else if (data.status === "failed") {
          setError(data.error || "Document processing failed");
        } else {
          timer = setTimeout(poll, 2500);
        }
      } catch (err: unknown) {
        setError("Failed to fetch extraction progress");
      }
    };

    poll();

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [jobId, onCompleted]);

  if (error) {
    return (
      <div className="p-8 rounded-[32px] border border-red-200 bg-red-50/70 text-red-950 text-center shadow-xs">
        <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h4 className="text-base font-bold text-red-950">Document Parsing Failed</h4>
        <p className="text-xs text-red-800 mt-1">{error}</p>
      </div>
    );
  }

  if (job?.status === "completed") {
    return (
      <div className="p-8 rounded-[32px] border border-green-200 bg-green-50/60 text-green-950 text-center shadow-xs space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-green-100 text-green-700 flex items-center justify-center mx-auto mb-2">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h4 className="text-base font-bold text-green-950">Extraction Completed Successfully</h4>
        <p className="text-xs text-green-800 font-medium max-w-md mx-auto">
          {job.questions_extracted !== undefined
            ? `Extracted ${job.questions_extracted} questions from your document.`
            : "Questions extracted and indexed into the course question bank."}
        </p>

        <div className="pt-2 flex justify-center">
          <Link
            href={`/qm/courses/${courseId}/review`}
            className="inline-flex items-center gap-2 px-6 py-3 text-xs font-bold rounded-full bg-gray-950 text-white hover:bg-gray-800 transition-all shadow-xs"
          >
            <span>Review Extracted Questions</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-10 rounded-[32px] border border-gray-100 bg-white text-center shadow-xs space-y-4">
      <Loader2 className="w-10 h-10 text-purple-600 animate-spin mx-auto" />
      <h4 className="text-lg font-extrabold text-gray-950">
        Processing Past Questions Document
      </h4>
      <p className="text-xs text-gray-400 font-medium max-w-sm mx-auto leading-relaxed">
        Parsing text, identifying questions, options, answer keys, and confidence levels. This may take a moment...
      </p>
      <div className="pt-2 flex justify-center">
        <span className="text-xs font-mono font-bold px-4 py-1.5 rounded-full bg-purple-50 text-purple-700 uppercase tracking-wider">
          Status: {job?.status || "Starting..."}
        </span>
      </div>
    </div>
  );
}
