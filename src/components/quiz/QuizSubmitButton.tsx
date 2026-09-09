"use client";

import React, { useState } from "react";
import { Send, Loader2 } from "lucide-react";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";

interface QuizSubmitButtonProps {
  unansweredCount: number;
  totalQuestions: number;
  isSubmitting: boolean;
  onSubmit: () => void;
  className?: string;
}

export function QuizSubmitButton({
  unansweredCount,
  totalQuestions,
  isSubmitting,
  onSubmit,
  className,
}: QuizSubmitButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <>
      <button
        type="button"
        disabled={isSubmitting}
        onClick={() => setShowConfirm(true)}
        className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gray-950 hover:bg-gray-800 text-white text-xs font-bold shadow-xs transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer ${
          className || ""
        }`}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Submitting Assessment...</span>
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            <span>Finalize & Submit Test</span>
          </>
        )}
      </button>

      <ConfirmDialog
        isOpen={showConfirm}
        title="Submit Quiz Assessment?"
        description={
          unansweredCount > 0
            ? `You still have ${unansweredCount} unanswered out of ${totalQuestions} questions. Unanswered questions will be scored as 0. Are you sure you want to finalize and submit?`
            : `You have answered all ${totalQuestions} questions. Are you ready to submit your assessment and calculate your final score?`
        }
        confirmLabel="Yes, Submit Now"
        cancelLabel="Review Answers"
        variant={unansweredCount > 0 ? "danger" : "primary"}
        isLoading={isSubmitting}
        onConfirm={() => {
          setShowConfirm(false);
          onSubmit();
        }}
        onClose={() => setShowConfirm(false)}
      />
    </>
  );
}
