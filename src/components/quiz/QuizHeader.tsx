"use client";

import React from "react";
import { QuizTimer } from "./QuizTimer";

interface QuizHeaderProps {
  courseTitle: string;
  gstCode: string;
  currentQuestion: number;
  totalQuestions: number;
  expiresAt: string;
  onExpire: () => void;
  onSubmitClick: () => void;
  isSubmitting?: boolean;
}

export function QuizHeader({
  courseTitle,
  gstCode,
  currentQuestion,
  totalQuestions,
  expiresAt,
  onExpire,
  onSubmitClick,
  isSubmitting,
}: QuizHeaderProps) {
  const progress = totalQuestions > 0 ? (currentQuestion / totalQuestions) * 100 : 0;

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-gray-200/60 sticky top-0 z-20 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-purple-50 text-purple-700 uppercase tracking-wider">
              {gstCode}
            </span>
            <h1 className="text-sm sm:text-base font-extrabold text-gray-950 truncate max-w-[200px] sm:max-w-md">
              {courseTitle}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <QuizTimer expiresAt={expiresAt} onExpire={onExpire} />
            <button
              type="button"
              onClick={onSubmitClick}
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-bold rounded-full bg-gray-950 text-white hover:bg-gray-800 transition-all disabled:opacity-50 cursor-pointer shadow-xs"
            >
              {isSubmitting ? "Submitting..." : "Submit Test"}
            </button>
          </div>
        </div>

        {/* Question Counter and Progress Bar */}
        <div className="mt-3">
          <div className="flex justify-between text-xs text-gray-400 font-semibold mb-1.5">
            <span>
              Question <strong className="text-gray-900 font-bold">{currentQuestion}</strong> of{" "}
              {totalQuestions}
            </span>
            <span className="font-bold text-purple-600">{Math.round(progress)}% Completed</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-purple-600 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
