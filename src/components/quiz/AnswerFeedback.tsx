import React from "react";
import { CheckCircle2, XCircle, BookOpen } from "lucide-react";
import type { AnswerCheckResponse } from "@/types/question";
import { cn } from "@/lib/utils";

interface AnswerFeedbackProps {
  feedback: AnswerCheckResponse;
  className?: string;
}

export function AnswerFeedback({ feedback, className }: AnswerFeedbackProps) {
  const isCorrect = feedback.is_correct;

  return (
    <div
      className={cn(
        "rounded-2xl border p-5 mt-4 transition-all shadow-2xs",
        isCorrect
          ? "bg-green-50/60 border-green-200 text-green-950"
          : "bg-red-50/60 border-red-200 text-red-950",
        className
      )}
    >
      <div className="flex items-center gap-2 font-bold text-sm mb-2">
        {isCorrect ? (
          <>
            <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
            <span>Correct Answer</span>
          </>
        ) : (
          <>
            <XCircle className="w-5 h-5 text-red-600 shrink-0" />
            <span>
              Incorrect Answer
              {feedback.correct_answer && (
                <span className="font-medium text-xs ml-2 opacity-80">
                  (Correct: Option {feedback.correct_answer})
                </span>
              )}
            </span>
          </>
        )}
      </div>

      {feedback.correct_answer_text && (
        <p className="text-xs font-semibold mt-1">
          Answer: {feedback.correct_answer_text}
        </p>
      )}

      {feedback.explanation && (
        <div className="mt-3 pt-3 border-t border-black/5 flex items-start gap-2.5 text-xs">
          <BookOpen className="w-4 h-4 shrink-0 mt-0.5 text-purple-600" />
          <div className="flex-1">
            <span className="font-bold block mb-0.5 text-gray-900">Explanation:</span>
            <p className="leading-relaxed text-gray-600 font-medium">{feedback.explanation}</p>
          </div>
        </div>
      )}
    </div>
  );
}
