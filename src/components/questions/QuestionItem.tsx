"use client";

import React, { useState } from "react";
import { Edit2, Trash2, CheckCircle2, AlertCircle } from "lucide-react";
import type { Question } from "@/types/question";
import { ReviewBadge } from "./ReviewBadge";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";

interface QuestionItemProps {
  question: Question;
  onEdit: (question: Question) => void;
  onDelete: (id: string) => Promise<void>;
  onVerify: (id: string) => Promise<void>;
}

export function QuestionItem({
  question,
  onEdit,
  onDelete,
  onVerify,
}: QuestionItemProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(question.id);
      setShowDeleteConfirm(false);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleVerify = async () => {
    setIsVerifying(true);
    try {
      await onVerify(question.id);
    } finally {
      setIsVerifying(false);
    }
  };

  const optionKeys = Object.keys(question.options || {}).sort();

  return (
    <div className="bg-white border border-gray-100 rounded-[28px] p-6 shadow-xs transition-all hover:shadow-sm space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="font-extrabold text-sm text-gray-950">
            Q{question.question_number}.
          </span>
          <ReviewBadge
            needsReview={question.needs_review}
            isVerified={question.is_verified}
            reviewReason={question.review_reason}
          />
          {question.confidence !== undefined && (
            <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              Confidence: {Math.round(question.confidence * 100)}%
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {!question.is_verified && (
            <button
              type="button"
              onClick={handleVerify}
              disabled={isVerifying}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-full bg-green-50 text-green-700 hover:bg-green-100 transition-colors cursor-pointer"
              title="Mark question verified"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{isVerifying ? "Verifying..." : "Verify"}</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => onEdit(question)}
            className="p-2 text-gray-400 hover:text-purple-600 rounded-xl hover:bg-purple-50 transition-colors cursor-pointer"
            title="Edit Question"
          >
            <Edit2 className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="p-2 text-gray-400 hover:text-red-600 rounded-xl hover:bg-red-50 transition-colors cursor-pointer"
            title="Delete Question"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <p className="text-sm text-gray-950 font-bold leading-relaxed whitespace-pre-wrap">
        {question.question_text}
      </p>

      {/* Options list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {optionKeys.map((key) => {
          const isCorrect =
            question.correct_answer === key ||
            question.correct_answer_text === question.options[key];
          return (
            <div
              key={key}
              className={`flex items-start gap-2.5 p-3.5 rounded-2xl text-xs transition-all ${
                isCorrect
                  ? "bg-green-50/70 border border-green-200 text-green-950 font-semibold"
                  : "bg-gray-50 border border-gray-100 text-gray-600"
              }`}
            >
              <span
                className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 font-extrabold text-xs ${
                  isCorrect
                    ? "bg-green-600 text-white"
                    : "bg-white text-gray-500 border border-gray-200 shadow-2xs"
                }`}
              >
                {key}
              </span>
              <span className="flex-1 mt-1 font-medium">{question.options[key]}</span>
            </div>
          );
        })}
      </div>

      {question.explanation && (
        <div className="text-xs bg-purple-50/40 p-4 rounded-2xl border border-purple-100/60 text-gray-600 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
          <div>
            <strong className="text-gray-950 font-bold">Explanation:</strong>{" "}
            <span className="font-medium leading-relaxed">{question.explanation}</span>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title={`Delete Question ${question.question_number}?`}
        description="Are you sure you want to permanently delete this question from the course pool? This action cannot be undone."
        confirmLabel="Delete Question"
        variant="danger"
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onClose={() => setShowDeleteConfirm(false)}
      />
    </div>
  );
}
