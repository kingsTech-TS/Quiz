"use client";

import React from "react";
import type { PublicQuestion } from "@/types/question";
import { cn } from "@/lib/utils";

interface QuestionCardProps {
  question: PublicQuestion;
  selectedAnswer?: string;
  onSelectAnswer: (key: string) => void;
  disabled?: boolean;
}

export function QuestionCard({
  question,
  selectedAnswer,
  onSelectAnswer,
  disabled = false,
}: QuestionCardProps) {
  // Sort options keys (A, B, C, D...)
  const optionKeys = Object.keys(question.options || {}).sort();

  return (
    <div className="bg-white border border-gray-100 rounded-[32px] p-6 sm:p-8 shadow-xs">
      <div className="mb-5">
        <span className="text-xs font-black text-purple-600 uppercase tracking-wider block mb-1">
          Question {question.question_number}
        </span>
        <h2 className="text-base sm:text-lg font-bold text-gray-950 leading-relaxed whitespace-pre-wrap">
          {question.question_text}
        </h2>
      </div>

      <div className="mt-6 space-y-3" role="radiogroup" aria-label="Answer options">
        {optionKeys.map((key) => {
          const isSelected = selectedAnswer === key;
          const text = question.options[key];

          return (
            <label
              key={key}
              className={cn(
                "flex items-start gap-3.5 p-4 sm:p-5 rounded-2xl border text-xs sm:text-sm transition-all cursor-pointer select-none",
                isSelected
                  ? "border-purple-600 bg-purple-50/40 text-gray-950 font-semibold ring-1 ring-purple-600 shadow-2xs"
                  : "border-gray-100 bg-white text-gray-700 hover:bg-gray-50/80 hover:border-gray-200",
                disabled && "opacity-60 cursor-not-allowed"
              )}
            >
              <input
                type="radio"
                name={`question-${question.id}`}
                value={key}
                checked={isSelected}
                disabled={disabled}
                onChange={() => onSelectAnswer(key)}
                className="mt-0.5 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 cursor-pointer"
              />
              <div className="flex-1">
                <span className="font-extrabold mr-2 text-purple-600">{key}.</span>
                <span>{text}</span>
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}
