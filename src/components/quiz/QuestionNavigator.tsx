"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface QuestionNavigatorProps {
  totalQuestions: number;
  currentQuestion: number;
  answeredQuestions: Record<number, string>; // questionNumber -> selectedKey
  onSelectQuestion: (num: number) => void;
  className?: string;
}

export function QuestionNavigator({
  totalQuestions,
  currentQuestion,
  answeredQuestions,
  onSelectQuestion,
  className,
}: QuestionNavigatorProps) {
  const questions = Array.from({ length: totalQuestions }, (_, i) => i + 1);

  const answeredCount = Object.keys(answeredQuestions).length;

  return (
    <div
      className={cn(
        "bg-white border border-gray-100 rounded-[28px] p-6 shadow-xs",
        className
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-extrabold text-gray-950">Question Navigator</h3>
        <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded-full">
          {answeredCount}/{totalQuestions}
        </span>
      </div>

      <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-5 gap-2">
        {questions.map((num) => {
          const isCurrent = num === currentQuestion;
          const isAnswered = answeredQuestions[num] !== undefined;

          return (
            <button
              key={num}
              type="button"
              onClick={() => onSelectQuestion(num)}
              className={cn(
                "h-10 w-full rounded-xl text-xs font-bold flex items-center justify-center transition-all cursor-pointer",
                isCurrent
                  ? "bg-gray-950 text-white shadow-sm ring-2 ring-purple-600 ring-offset-2"
                  : isAnswered
                  ? "bg-purple-50 text-purple-700 border border-purple-100/80 hover:bg-purple-600 hover:text-white"
                  : "bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-900 border border-transparent"
              )}
              aria-label={`Jump to Question ${num}`}
            >
              {num}
            </button>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100 flex flex-wrap gap-4 text-xs font-medium text-gray-500">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-gray-950" />
          <span>Current</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-purple-600" />
          <span>Answered</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-gray-200" />
          <span>Unanswered</span>
        </div>
      </div>
    </div>
  );
}
